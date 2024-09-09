import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

async function uploadFileToS3(fileBuffer, fileName, contentType) {
  const params = {
    Bucket: "hukimuki",
    Key: `gallery/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType || "application/octet-stream", // Dynamically detect content type
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const s3Url = `https://hukimuki.s3.eu-central-1.amazonaws.com/gallery/${fileName}`;
  return s3Url;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        { error: "Files are required." },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadFileToS3(buffer, file.name, file.type);
      return url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
