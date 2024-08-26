import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Initialize the S3 client
const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export async function GET(request) {
  try {
    const listParams = {
      Bucket: "hukimuki",
      Prefix: `slider/`,
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3Client.send(listCommand);

    const imageUrls = listData.Contents.filter(
      (item) => item.Size > 0 && item.Key.endsWith(".jpg")
    ).map(
      (item) => `https://hukimuki.s3.eu-central-1.amazonaws.com/${item.Key}`
    );

    // Return the list of image URLs as JSON using NextResponse
    // console.log(imageUrls)
    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
