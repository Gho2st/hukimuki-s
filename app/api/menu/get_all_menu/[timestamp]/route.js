import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export async function GET(request) {
  try {
    // Funkcja konwertująca stream na string
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    // 1. Pobieranie pliku order.json
    let orderList = [];
    try {
      const orderParams = {
        Bucket: "hukimuki",
        Key: `menu/order.json`,
      };

      const orderCommand = new GetObjectCommand(orderParams);
      const orderData = await s3Client.send(orderCommand);
      const orderJson = await streamToString(orderData.Body);

      orderList = JSON.parse(orderJson);
      console.log("Order from order.json:", orderList);
    } catch (error) {
      console.log("Failed to fetch order.json. Defaulting to unordered list.");
    }

    // 2. Pobieranie listy folderów z S3
    const listParams = {
      Bucket: "hukimuki",
      Prefix: `menu/`,
      Delimiter: "/",
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3Client.send(listCommand);

    // --- POPRAWKA TUTAJ ---
    // Dodano (listData.CommonPrefixes || []), aby uniknąć błędu 'undefined',
    // gdy S3 nie zwróci żadnych podfolderów.
    const folderNames = (listData.CommonPrefixes || [])
      .map((prefix) => prefix.Prefix.replace(`menu/`, "").replace("/", ""))
      .filter((name) => name);

    console.log("Unordered folder names:", folderNames);

    // 3. Sortowanie folderów na podstawie order.json
    const orderedSet = new Set(orderList);
    const orderedFolders = orderList.filter((folder) =>
      folderNames.includes(folder)
    );

    const unorderedFolders = folderNames
      .filter((folder) => !orderedSet.has(folder))
      .sort(); // Sortowanie reszty alfabetycznie

    const sortedFolders = [...orderedFolders, ...unorderedFolders];

    console.log("Sorted folder names:", sortedFolders);

    return NextResponse.json(sortedFolders);
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json([], { status: 500 });
  }
}
