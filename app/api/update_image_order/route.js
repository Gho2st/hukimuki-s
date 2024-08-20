import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { which, images } = await request.json();

    if (!which || !images) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    const directoryPath = path.join(process.cwd(), `public/menu/${which}`);
    const orderFilePath = path.join(directoryPath, "order.json");

    try {
      // Ensure all provided images exist in the directory
      const existingFiles = fs
        .readdirSync(directoryPath)
        .filter((file) => images.includes(file));

      // Write the new order to order.json
      fs.writeFileSync(
        orderFilePath,
        JSON.stringify(existingFiles, null, 2),
        "utf-8"
      );

      return NextResponse.json({ message: "Order updated successfully" });
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to update order", error: err.message },
        { status: 500 }
      );
    }
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
