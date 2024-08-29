import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

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

async function deleteObjectsInFolder(folder) {
  const objects = await listObjectsInFolder(folder);

  if (objects.length === 0) return;

  const deleteParams = {
    Bucket: "hukimuki",
    Delete: {
      Objects: objects.map((obj) => ({ Key: obj.Key })),
    },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  await s3Client.send(deleteCommand);
}

async function uploadFileToS3(fileBuffer, fileName, which, contentType) {
  const params = {
    Bucket: "hukimuki",
    Key: `${which}/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const s3Url = `https://hukimuki.s3.eu-central-1.amazonaws.com/${which}/${fileName}`;
  return s3Url;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log("Form Data Entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const files = formData.getAll("files"); // Allow multiple files
    const which = formData.get("which");
    const text = formData.get("text");
    const date = formData.get("date"); // Handle the date field

    // console.log("Files:", files);
    // console.log("Which:", which);
    // console.log("Text:", text);
    // console.log("Date:", date);

    if (!files.length) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 }
      );
    }

    if (!which) {
      return NextResponse.json(
        { error: "'which' parameter is required." },
        { status: 400 }
      );
    }

    // Delete existing files in the folder before uploading new ones
    await deleteObjectsInFolder(which);

    // Upload files and text
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileName = file.name;
        const buffer = Buffer.from(await file.arrayBuffer());
        const contentType = file.type; // Use the file's MIME type

        // Upload file
        const fileUrl = await uploadFileToS3(
          buffer,
          fileName,
          which,
          contentType
        );
        return { fileName, fileUrl };
      })
    );

    if (text || date) {
      // Create metadata object
      const metadata = {
        text: text || "",
        date: date || "",
        files: uploadedFiles.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
        })),
      };

      const metadataBuffer = Buffer.from(JSON.stringify(metadata), "utf-8");
      const metadataFileName = `metadata_${Date.now()}.json`; // Unique name for the metadata file
      await uploadFileToS3(
        metadataBuffer,
        metadataFileName,
        which,
        "application/json"
      );
    }

    return NextResponse.json({ success: true, uploadedFiles });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
