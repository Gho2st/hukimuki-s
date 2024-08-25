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

async function uploadFileToS3(fileBuffer, fileName, which) {
  const params = {
    Bucket: "hukimuki",
    Key: `${which}/${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg", // Upewnij się, że ContentType pasuje do formatu pliku
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const s3Url = `https://hukimuki.s3.eu-central-1.amazonaws.com/${which}/${fileName}`;
  return s3Url;
}

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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files"); // Pobierz wszystkie pliki
    const which = formData.get("which");

    if (!files.length || !which) {
      return NextResponse.json(
        { error: "Files and 'which' are required." },
        { status: 400 }
      );
    }

    // Ścieżka do pliku order.json
    const orderJsonKey = `${which}/order.json`;

    let orderJsonData;
    try {
      orderJsonData = await getFileFromS3(orderJsonKey);
    } catch (error) {
      // Jeśli plik order.json nie istnieje, zainicjuj pustą tablicę
      orderJsonData = [];
    }

    const uploadedUrls = [];

    // Przesyłanie każdego pliku na S3
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadFileToS3(buffer, file.name, which);
      uploadedUrls.push(url);
      orderJsonData.push(url);
    }

    // Zapisz zaktualizowany plik order.json na S3
    await saveFileToS3(orderJsonKey, orderJsonData);

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
