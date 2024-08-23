import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    Key: `${which}/${fileName}`,
  };

  const command = new DeleteObjectCommand(params);
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

    await deleteFileFromS3(file, which);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
