import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import classes from "./Which2.module.css";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get_admin_menu?which=${which}`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      console.log(data);
      setImages(data); // data should include ordered list of images
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [which]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // rest of the code remains the same

  const handleFileUpload = async (event, position) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("which", which);
    formData.append("position", position); // Send the intended position to the server

    try {
      const response = await fetch("/api/add_menu", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log(data);

      // Fetch the updated list of images with the new order
      await fetchImages(); // <-- odświeżenie listy zdjęć po dodaniu nowego
    } catch (error) {
      console.error(error);
    }
  };

  const moveImage = async (index, direction) => {
    const newPosition = index + direction;
    if (newPosition >= 0 && newPosition < images.length) {
      const updatedImages = [...images];
      const [movedImage] = updatedImages.splice(index, 1);
      updatedImages.splice(newPosition, 0, movedImage);

      // Update the server with the new order
      await fetch("/api/update_image_order", {
        method: "POST",
        body: JSON.stringify({
          which,
          images: updatedImages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setImages(updatedImages);
    }
  };

  const removeImage = async (imageToRemove) => {
    try {
      const response = await fetch(
        `/api/delete_menu?which=${which}&file=${imageToRemove}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages(images.filter((image) => image !== imageToRemove));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Nie udało się usunąć zdjęcia.");
    }
  };

  if (loading) return <p className={classes.loading}>Wczytywanie...</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <>
      <div>
        <h4>Dodaj fotke :)</h4>
        <input
          id="fileInput"
          type="file"
          onChange={(e) => handleFileUpload(e, images.length)}
        />
      </div>
      {images.length > 0 ? (
        images.map((file, index) => (
          <div key={file} className={classes.imageWrapper}>
            <Image
              src={file} // Use the full URL here
              width={100}
              height={100}
              alt={`Cocktail ${index}`}
              layout="responsive"
            />
            <button onClick={() => removeImage(file)}>Usuń</button>
            <button onClick={() => moveImage(index, -1)} disabled={index === 0}>
              Przesuń w górę
            </button>
            <button
              onClick={() => moveImage(index, 1)}
              disabled={index === images.length - 1}
            >
              Przesuń w dół
            </button>
          </div>
        ))
      ) : (
        <div>No images found</div>
      )}
    </>
  );
}
