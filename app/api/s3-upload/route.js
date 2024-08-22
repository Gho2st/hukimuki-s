import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const s3Url = `https://rent-go.s3.eu-central-1.amazonaws.com/${which}/${fileName}`;
  return s3Url;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const which = formData.get("which"); // Retrieve the which from the form data

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFileToS3(buffer, file.name, which); // Pass the which to the upload function

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
