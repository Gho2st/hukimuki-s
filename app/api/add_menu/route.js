import formidable from "formidable";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "public/tmp"); // Tymczasowy katalog na pliki
    form.keepExtensions = true; // Zachowanie rozszerzeń plików

    return new Promise((resolve, reject) => {
      form.parse(request, async (err, fields, files) => {
        if (err) {
          return resolve(
            NextResponse.json({ message: "Failed to upload file" }, { status: 500 })
          );
        }

        const which = fields.which;
        const file = files.file;

        if (!which || !file) {
          return resolve(
            NextResponse.json(
              { message: "Missing directory or file parameter" },
              { status: 400 }
            )
          );
        }

        const targetPath = path.join(process.cwd(), `public/menu/${which}`);
        const newFilePath = path.join(targetPath, file.newFilename);

        // Przenieś plik z katalogu tymczasowego do docelowego
        try {
          fs.renameSync(file.filepath, newFilePath);
        } catch (err) {
          return resolve(
            NextResponse.json(
              { message: "Failed to move file", error: err.message },
              { status: 500 }
            )
          );
        }

        return resolve(
          NextResponse.json({ message: "File uploaded successfully" })
        );
      });
    });
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
