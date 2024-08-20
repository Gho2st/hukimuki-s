import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./Which2.module.css";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/get_admin_menu?which=${which}`);
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

    fetchImages();
  }, [which]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("which", which);

    try {
      const response = await fetch(`/api/add_menu`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      // Dodaj nowo przesłane zdjęcie do listy
      setImages((prevImages) => [...prevImages, file.name]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Nie udało się przesłać zdjęcia.");
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

      // Usuń obraz z listy po jego usunięciu
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
      <input type="file" onChange={handleFileUpload} />
      {images.length > 0 ? (
        images.map((file, index) => (
          <div key={file} className={classes.imageWrapper}>
            <Image
              src={`/menu/${which}/${file}`}
              width={100}
              height={100}
              alt={`Cocktail ${index}`}
              layout="responsive"
            />
            <button onClick={() => removeImage(file)}>Usuń</button>
          </div>
        ))
      ) : (
        <div>No images found</div>
      )}
    </>
  );
}
