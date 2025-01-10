import {
  S3Client,
  PutObjectCommand,
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

export async function POST(request) {
  try {
    const updatedFolders = await request.json();

    const orderParams = {
      Bucket: "hukimuki",
      Key: "menu/order.json",
    };

    let orderData = [];
    try {
      // Sprawdzamy, czy plik order.json istnieje
      const orderCommand = new GetObjectCommand(orderParams);
      const s3OrderData = await s3Client.send(orderCommand);

      // Jeśli plik istnieje, konwertujemy strumień na string
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf-8"))
          );
        });

      const jsonData = await streamToString(s3OrderData.Body);
      orderData = JSON.parse(jsonData);
    } catch (error) {
      // Jeśli plik nie istnieje, tworzymy nowy z domyślnymi folderami
      console.log("Plik order.json nie istnieje, tworzymy nowy.");
      orderData = updatedFolders; // Ustawiamy listę folderów przekazaną w żądaniu
    }

    // Zapisujemy nową kolejność folderów do order.json
    const params = {
      Bucket: "hukimuki",
      Key: "menu/order.json",
      Body: JSON.stringify(updatedFolders),
      ContentType: "application/json",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
