import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

async function createFolderInS3(folderName) {
  const params = {
    Bucket: "hukimuki",
    Key: `menu/${folderName}/`, // Pusty plik w folderze tworzy folder w S3
    Body: "", // Pusty plik
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const folderName = formData.get("which");

    console.log(folderName);

    if (!folderName) {
      return NextResponse.json(
        { error: "'which' (folder name) is required." },
        { status: 400 }
      );
    }

    // Tworzymy folder w S3
    await createFolderInS3(folderName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
