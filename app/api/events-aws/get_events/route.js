import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { Readable } from "stream";

// Logowanie zmiennych środowiskowych
console.log("AWS_ID: ", process.env.AWS_ID ? "OK" : "MISSING");
console.log("AWS_SECRET: ", process.env.AWS_SECRET ? "OK" : "MISSING");

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

async function listObjectsInFolder(folder) {
  const params = {
    Bucket: "hukimuki",
    Prefix: `${folder}/`,
  };

  const command = new ListObjectsCommand(params);
  try {
    const data = await s3Client.send(command);
    console.log("ListObjectsCommand success: ", data);
    return data.Contents || [];
  } catch (error) {
    console.error("Error in ListObjectsCommand: ", error);
    throw error;
  }
}

async function getObjectContent(key) {
  const params = {
    Bucket: "hukimuki",
    Key: key,
  };

  const command = new GetObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    console.log(`GetObjectCommand success for ${key}`);
    const chunks = [];
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        stream.on("error", reject);
      });

    const body = await streamToString(data.Body);
    return body;
  } catch (error) {
    console.error(`Error in GetObjectCommand for ${key}: `, error);
    throw error;
  }
}

export async function GET(request) {
  console.log("GET request initiated");

  try {
    const folder = "events";

    if (!folder) {
      console.error("Folder is undefined");
      return NextResponse.json(
        { error: "'folder' query parameter is required." },
        { status: 400 }
      );
    }

    const objects = await listObjectsInFolder(folder);

    let metadata = null;
    const files = await Promise.all(
      objects.map(async (obj) => {
        const key = obj.Key;
        const url = `https://hukimuki.s3.eu-central-1.amazonaws.com/${key}`;

        if (
          key.endsWith(".jpg") ||
          key.endsWith(".jpeg") ||
          key.endsWith(".png")
        ) {
          console.log(`Image found: ${key}`); // Logowanie obrazków
          return {
            key,
            url,
            content: null,
          };
        } else if (key.endsWith(".txt")) {
          console.log(`Text file found: ${key}`); // Logowanie plików tekstowych
          const content = await getObjectContent(key);
          return {
            key,
            url,
            content,
          };
        } else if (key.endsWith(".json")) {
          console.log(`Metadata file found: ${key}`); // Logowanie plików JSON (metadata)
          const content = await getObjectContent(key);
          metadata = JSON.parse(content);
        }

        return null;
      })
    );

    console.log("Files processed: ", files);
    console.log("Metadata fetched: ", metadata);

    return NextResponse.json(
      { metadata },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching data from S3:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
