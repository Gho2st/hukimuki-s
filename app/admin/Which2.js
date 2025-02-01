import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import classes from "./Which2.module.css";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadError, setUploadError] = useState(null); // Stan dla błędów przesyłania
  const [uploadSuccess, setUploadSuccess] = useState(null); // Stan dla komunikatu o sukcesie
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB dla pojedynczego pliku
  const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024; // 4.5 MB dla całego zapytania
  const timestamp = Date.parse(new Date().toString());

  // Fetch images from the server
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/menu/get_specific_menu/${timestamp}?which=${which}`
      );
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
  }, [which]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    setUploadError(null);
    setUploadSuccess(null); // Reset successful upload message
    setIsAdding(true);
    const files = event.target.files;
    const formData = new FormData();

    let totalSize = 0;

    // Validate file sizes before upload
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

    formData.append("which", which); // Add "which" field

    try {
      const response = await fetch("/api/menu/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      await fetchImages(); // Refresh images after successful upload
      setUploadSuccess("Zdjęcia zostały pomyślnie dodane!"); // Success message for the admin
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Nie udało się przesłać zdjęć. Spróbuj ponownie.");
    } finally {
      setIsAdding(false);
    }
  };

  // Move image position
  const moveImage = async (index, direction) => {
    try {
      const newPosition = index + direction;
      if (newPosition >= 0 && newPosition < images.length) {
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(index, 1);
        updatedImages.splice(newPosition, 0, movedImage);

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

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        setImages(updatedImages);
      }
    } catch (error) {
      console.error("Error moving image:", error);
    }
  };

  // Remove image
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
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
          {isAdding && <h5>Dodawanie zdjęć trwa...</h5>}
          {uploadError && <p className={classes.error}>{uploadError}</p>}{" "}
          {/* Error Message */}
          {uploadSuccess && (
            <p className={classes.success}>{uploadSuccess}</p>
          )}{" "}
          {/* Success Message */}
        </div>
        <div className={classes.imageContainer}>
          {images.length > 0 ? (
            images.map((file, index) => (
              <div key={file} className={classes.imageWrapper}>
                <Image
                  src={file}
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
