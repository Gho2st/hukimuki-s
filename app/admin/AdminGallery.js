"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./AdminGallery.module.css";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadError, setUploadError] = useState(null); // Stan dla błędów przesyłania
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB dla pojedynczego pliku
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB dla całego zapytania
  const timestamp = Date.parse(new Date().toString());

  // Funkcja do pobierania obrazów
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gallery/get-gallery/${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  // Obsługa przesyłania plików
  const handleFileUpload = async (event) => {
    setUploadError(null); // Reset stanu błędu przed nowym przesyłaniem
    setIsAdding(true);
    const files = event.target.files;
    const formData = new FormData();

    // Walidacja rozmiaru plików po stronie klienta
    let totalSize = 0;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`Plik ${file.name} przekracza maksymalny rozmiar 10MB.`);
        setIsAdding(false);
        return;
      }
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        setUploadError(
          "Łączny rozmiar plików przekracza 10MB. Dodaj mniej plików lub skompresuj zdjęcia."
        );
        setIsAdding(false);
        return;
      }
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/gallery/gallery-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      console.log(data);
      await fetchImages(); // Odświeżenie listy zdjęć po przesłaniu nowych plików
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload images.");
    } finally {
      setIsAdding(false);
    }
  };

  // Usuwanie obrazu
  const removeImage = async (imageToRemove) => {
    try {
      const fileName = imageToRemove.split("/").pop(); // Pobierz nazwę pliku

      const response = await fetch(
        `/api/gallery/gallery-delete?file=${fileName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages(images.filter((image) => image.imageUrl !== imageToRemove));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Nie udało się usunąć zdjęcia.");
    }
  };

  if (loading) return <p className={classes.loading}>Wczytywanie...</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <>
      <h3 className={classes.header}>Edytuj Galerie</h3>

      <div className={classes.add}>
        <h4>Dodaj zdjęcie</h4>
        <p>
          Pamiętaj tylko, że zdjęcia będą dobrze wyglądać tylko w tym samym
          rozmiarze
        </p>
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={handleFileUpload}
        />
        {uploadError && <p className={classes.error}>{uploadError}</p>}
        {isAdding && <h5>Dodawanie zdjęć trwa...</h5>}
      </div>

      <div className={classes.galleryContainer}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : images.length > 0 ? (
          images.map((file, index) => (
            <div key={index} className={classes.imageWrapper}>
              <Image
                src={file.imageUrl}
                width={100}
                height={100}
                alt={`Image ${index}`}
              />
              <button onClick={() => removeImage(file.imageUrl)}>Usuń</button>
            </div>
          ))
        ) : (
          <div>Nie wczytano zdjęć</div>
        )}
      </div>
    </>
  );
}
