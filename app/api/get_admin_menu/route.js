import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const which = searchParams.get("which");

    if (!which) {
      return NextResponse.json([], { status: 400 });
    }

    const params = {
      Bucket: "hukimuki",
      Prefix: `${which}/`,
    };

    const command = new ListObjectsV2Command(params);
    const s3Data = await s3Client.send(command);

    if (!s3Data.Contents || s3Data.Contents.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    const imageUrls = s3Data.Contents.filter((item) => item.Size > 0) // Exclude the folder object
      .map(
        (item) => `https://hukimuki.s3.eu-central-1.amazonaws.com/${item.Key}`
      );

    console.log(imageUrls);

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json([], { status: 500 });
  }
}
