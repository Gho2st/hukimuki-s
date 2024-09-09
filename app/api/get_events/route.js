import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { Readable } from "stream";

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
  const data = await s3Client.send(command);

  return data.Contents || [];
}

async function getObjectContent(key) {
  const params = {
    Bucket: "hukimuki",
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const data = await s3Client.send(command);

  // Convert Readable stream to string
  const chunks = [];
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stream.on("error", reject);
    });

  const body = await streamToString(data.Body);
  return body;
}

export async function GET(request) {
  console.log("api get");

  try {
    const folder = "events";

    if (!folder) {
      return NextResponse.json(
        { error: "'folder' query parameter is required." },
        { status: 400 }
      );
    }

    const objects = await listObjectsInFolder(folder);

    // Initialize variables to store metadata and other files
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
          // If it's an image, set content to null
          console.log(`Image found: ${key}`); // Debug log
          return {
            key,
            url,
            content: null,
          };
        } else if (key.endsWith(".txt")) {
          // If it's a text file, fetch content
          console.log(`Text file found: ${key}`); // Debug log
          const content = await getObjectContent(key);
          return {
            key,
            url,
            content,
          };
        } else if (key.endsWith(".json")) {
          // If it's a metadata JSON file, fetch content
          console.log(`Metadata file found: ${key}`); // Debug log
          const content = await getObjectContent(key);
          metadata = JSON.parse(content);
        }

        // Ignore other file types
        return null;
      })
    );

    return new NextResponse.json(
      { metadata },
      {
        headers: {
          "Cache-Control": "no-store",
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
