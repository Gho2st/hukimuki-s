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
    const { searchParams } = new URL(request.url);
    const which = searchParams.get("which");
    console.log(which)

    if (!which) {
      return NextResponse.json([], { status: 400 });
    }

    // Spróbuj pobrać plik order.json z hukimuki/menu/order.json
    const params = {
      Bucket: "hukimuki",
      Key: `menu/${encodeURIComponent(which)}/order.json`,
    };

    let imageUrls;

    try {
      const command = new GetObjectCommand(params);
      const s3Data = await s3Client.send(command);

      // Konwersja strumienia na string
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf-8"))
          );
        });

      const jsonData = await streamToString(s3Data.Body);
      imageUrls = JSON.parse(jsonData);
      console.log(imageUrls);
    } catch (error) {
      console.log("order.json not found, listing all images in folder.");

      // Pobierz wszystkie obrazy z folderu, jeśli order.json nie istnieje
      const listParams = {
        Bucket: "hukimuki",
        Prefix: `menu/${which}/`,
      };

      console.log(listParams);

      const listCommand = new ListObjectsV2Command(listParams);
      const listData = await s3Client.send(listCommand);

      // Sprawdź, czy `Contents` istnieje
      const contents = listData.Contents || [];
      console.log("Contents:", contents);

      imageUrls = contents
        .filter(
          (item) =>
            item.Size > 0 &&
            (item.Key.endsWith(".png") ||
              item.Key.endsWith(".jpg") ||
              item.Key.endsWith(".jpeg"))
        ) // Filtruj tylko obrazy
        .map(
          (item) =>
            `https://hukimuki.s3.eu-central-1.amazonaws.com/${encodeURIComponent(
              item.Key
            )}`
        );
    }

    console.log(imageUrls);
    return NextResponse.json(imageUrls);
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json([], { status: 500 });
  }
}
