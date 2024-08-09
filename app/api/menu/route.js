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
    let files = [];

    try {
      files = fs
        .readdirSync(directoryPath)
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to read directory", error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(files);
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
