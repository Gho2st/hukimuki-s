import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const which = searchParams.get("which");

    if (!which) {
      return NextResponse.json(
        { message: "Missing directory parameter" },
        { status: 400 }
      );
    }

    const directoryPath = path.join(process.cwd(), `public/menu/${which}`);
    const orderFilePath = path.join(directoryPath, "order.json");
    let files = [];
    let orderedFiles = [];

    try {
      // Read all image files
      files = fs
        .readdirSync(directoryPath)
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

      // Check if order.json exists
      if (fs.existsSync(orderFilePath)) {
        const orderData = JSON.parse(fs.readFileSync(orderFilePath, "utf-8"));

        // Ensure only files that actually exist are in the ordered list
        orderedFiles = orderData.filter((file) => files.includes(file));

        // Include any new files that are not in order.json at the end
        const unorderedFiles = files.filter(
          (file) => !orderedFiles.includes(file)
        );
        orderedFiles = [...orderedFiles, ...unorderedFiles];
      } else {
        // If order.json does not exist, use default alphabetical order
        orderedFiles = files;
      }
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to read directory", error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(orderedFiles);
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
