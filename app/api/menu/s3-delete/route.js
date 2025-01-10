import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Konfiguracja klienta S3
const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// Funkcja do usuwania pliku z S3
async function deleteFileFromS3(fileName, which) {
  const params = {
    Bucket: "hukimuki",
    Key: `menu/${which}/${fileName}`,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}

// Funkcja do pobierania pliku z S3
async function getFileFromS3(key) {
  const params = {
    Bucket: "hukimuki",
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const s3Data = await s3Client.send(command);

  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });

  const jsonData = await streamToString(s3Data.Body);
  return JSON.parse(jsonData);
}

// Funkcja do zapisywania pliku na S3
async function saveFileToS3(key, data) {
  const params = {
    Bucket: "hukimuki",
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file");
    const which = searchParams.get("which");

    if (!file || !which) {
      return NextResponse.json(
        { error: "File and 'which' are required." },
        { status: 400 }
      );
    }

    // Usunięcie pliku z S3
    await deleteFileFromS3(file, which);

    // Ścieżka do pliku order.json
    const orderJsonKey = `menu/${which}/order.json`;

    let orderJsonData;
    try {
      // Pobranie i aktualizacja pliku order.json
      orderJsonData = await getFileFromS3(orderJsonKey);

      // Usunięcie URL usuwanego pliku z tablicy
      orderJsonData = orderJsonData.filter((url) => !url.endsWith(file));

      // Zapisanie zaktualizowanego pliku order.json na S3
      await saveFileToS3(orderJsonKey, orderJsonData);
    } catch (error) {
      console.error("Error retrieving or updating order.json:", error);
      return NextResponse.json(
        { error: "Error updating order.json" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
