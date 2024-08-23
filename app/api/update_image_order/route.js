import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
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

// Funkcja do zapisywania pliku order.json w S3
async function saveOrderToS3(which, images) {
  const params = {
    Bucket: "hukimuki",
    Key: `${which}/order.json`,
    Body: JSON.stringify(images, null, 2),
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

// Funkcja do tworzenia domyślnego pliku order.json w S3
async function createDefaultOrderInS3(which) {
  const params = {
    Bucket: "hukimuki",
    Key: `${which}/order.json`,
    Body: JSON.stringify([], null, 2), // Domyślna zawartość to pusty array
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

// Pomocnicza funkcja do przekształcania strumienia w ciąg znaków
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });

// Funkcja do odczytywania pliku order.json z S3
async function getOrderFromS3(which) {
  const params = {
    Bucket: "hukimuki",
    Key: `${which}/order.json`,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const bodyContents = await streamToString(data.Body);
    return JSON.parse(bodyContents);
  } catch (error) {
    if (error.name === "NoSuchKey") {
      // Plik nie istnieje, więc twórz domyślny plik
      await createDefaultOrderInS3(which);
      return []; // Zwróć pustą tablicę jako domyślną zawartość
    } else {
      throw error; // Rzuć inne błędy dalej
    }
  }
}

export async function POST(request) {
  try {
    const { which, images } = await request.json();
    console.log("Received data:", { which, images });

    if (!which || !images) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    // Zapisz nową kolejność obrazów do S3
    await saveOrderToS3(which, images);

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
