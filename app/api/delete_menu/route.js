import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const which = searchParams.get("which");
    const file = searchParams.get("file");

    if (!which || !file) {
      return NextResponse.json(
        { message: "Missing directory or file parameter" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), `public/menu/${which}/${file}`);

    try {
      fs.unlinkSync(filePath); // Usuń plik z systemu
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to delete file", error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "File deleted successfully" });
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
