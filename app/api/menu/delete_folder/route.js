import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Konfiguracja klienta S3
const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// Funkcja do usuwania wszystkich plików w folderze
async function deleteFilesInFolder(folderName) {
  // Upewniamy się, że prefiks nie ma nadmiarowego ukośnika
  folderName = folderName.replace(/\/+$/, ""); // Usuwamy wszystkie nadmiarowe ukośniki na końcu

  let continuationToken = undefined;
  do {
    // Logujemy parametry przed wysłaniem zapytania
    console.log(
      `Wysyłanie zapytania z prefiksem: ${folderName}/, continuationToken: ${continuationToken}`
    );

    const params = {
      Bucket: "hukimuki",
      Prefix: `menu/${folderName}/`, // Prefiks wskazujący na folder (np. 'menu/coctails/')
      ContinuationToken: continuationToken, // Używamy tokenu kontynuacji, jeśli jest więcej niż 1000 obiektów
    };

    const listCommand = new ListObjectsV2Command(params);

    try {
      const data = await s3Client.send(listCommand);

      // Logujemy odpowiedź z S3
      console.log(`Odpowiedź z S3:`, data);

      if (!data.Contents || data.Contents.length === 0) {
        console.log(`Brak plików do usunięcia w folderze ${folderName}`);
        return;
      }

      console.log(`Pliki w folderze ${folderName}:`, data.Contents);

      // Iterujemy przez pliki w folderze i usuwamy je
      for (const object of data.Contents) {
        const deleteParams = {
          Bucket: "hukimuki",
          Key: object.Key,
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);

        console.log(`Usuwanie pliku: ${object.Key}`);
        await s3Client.send(deleteCommand);
        console.log(`Usunięto plik: ${object.Key}`);
      }

      // Sprawdzamy, czy jest token kontynuacji (dla więcej niż 1000 obiektów)
      continuationToken = data.NextContinuationToken;
      if (continuationToken) {
        console.log(`Token kontynuacji: ${continuationToken}`);
      }
    } catch (error) {
      console.error("Błąd podczas listowania obiektów:", error);
      throw error;
    }
  } while (continuationToken); // Powtarzamy dopóki mamy więcej stron danych
}

// Funkcja do obsługi żądania DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let folderName = searchParams.get("which");

    console.log(`Nazwa folderu do usunięcia: ${folderName}`);

    if (!folderName) {
      return NextResponse.json(
        { error: "'which' (folder name) is required." },
        { status: 400 }
      );
    }

    console.log(`Rozpoczynanie usuwania folderu: ${folderName}`);

    // Usuwamy folder i jego zawartość
    await deleteFilesInFolder(folderName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Błąd podczas usuwania folderu:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
