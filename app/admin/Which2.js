// Zmieniony komponent front-endowy obsługujący wiele plików
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import classes from "./Which2.module.css";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(which);
      const response = await fetch(
        `/api/menu/get_specific_menu?which=${which}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [which]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileUpload = async (event) => {
    setIsAdding(true);
    const files = event.target.files;
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("which", which);

    try {
      const response = await fetch("/api/menu/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      console.log(data);
      setIsAdding(false);
      await fetchImages(); // Odśwież listę zdjęć po dodaniu nowych
    } catch (error) {
      console.error(error);
    }
  };

  const moveImage = async (index, direction) => {
    try {
      const newPosition = index + direction;
      if (newPosition >= 0 && newPosition < images.length) {
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(index, 1);
        updatedImages.splice(newPosition, 0, movedImage);

        console.log("Moving image:", {
          index,
          direction,
          newPosition,
          updatedImages,
        });

        // Update the server with the new order
        const response = await fetch("/api/menu/update_image_order", {
          method: "POST",
          body: JSON.stringify({
            which,
            images: updatedImages,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Server response:", await response.json());

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        setImages(updatedImages);
      }
    } catch (error) {
      console.error("Error moving image:", error);
    }
  };

  const removeImage = async (imageToRemove) => {
    try {
      const fileName = imageToRemove.split("/").pop();

      const response = await fetch(
        `/api/menu/s3-delete?which=${which}&file=${fileName}`,
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
      <div className={classes.container}>
        <div className={classes.addingContainer}>
          <h4>Dodaj :)</h4>
          <p>
            proszę wziąć pod uwagę aby sprawdzić rozmiar zdjęć (dbać o
            optymalizację)
          </p>
          <p>
            pliki, które mozesz dodac to po prostu zdjecia/zrzuty ekranu jak
            jpg, png, jpeg
          </p>

          <input
            id="fileInput"
            type="file"
            multiple // Pozwala na wybór wielu plików
            accept=".jpg,.jpeg,.png" // Restricts file types to JPG, JPEG, and PNG
            onChange={handleFileUpload}
          />
          {isAdding && <h5>Dodawanie zdjęć trwa...</h5>}
        </div>
        <div className={classes.imageContainer}>
          {images.length > 0 ? (
            images.map((file, index) => (
              <div key={file} className={classes.imageWrapper}>
                <Image
                  src={file} // Use the full URL here
                  width={100}
                  height={100}
                  alt={`zdjęcie menu nr ${index}`}
                  layout="responsive"
                />
                <button onClick={() => removeImage(file)}>Usuń</button>
                <button
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                >
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
            <div>Nie znaleziono menu (puste)</div>
          )}
        </div>
      </div>
    </>
  );
}
