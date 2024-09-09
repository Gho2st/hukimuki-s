"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./AdminGallery.module.css";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Function to fetch images
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gallery/get-gallery`);
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    setIsAdding(true);
    const files = event.target.files;
    const formData = new FormData();

    for (const file of files) {
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
      setIsAdding(false);
      await fetchImages(); // Refresh image list after uploading new files
    } catch (error) {
      console.error(error);
      setIsAdding(false);
    }
  };

  // Remove image
  const removeImage = async (imageToRemove) => {
    try {
      const fileName = imageToRemove.split("/").pop(); // Extract file name

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
        <h4>Dodaj zdjecie</h4>
        <p>Pamiętaj tylko ze zdjecia beda dobrze wygladac tylko w tym samym rozmiarze</p>
        <input
          id="fileInput"
          type="file"
          multiple // Pozwala na wybór wielu plików
          accept=".jpg,.jpeg,.png" // Restricts file types to JPG, JPEG, and PNG
          onChange={handleFileUpload}
        />
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
                src={file.imageUrl} // Assuming full URL to the image
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
