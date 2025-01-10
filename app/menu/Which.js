import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import classes from "./Which.module.css";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timestamp = Date.parse(new Date().toString());

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(which);
      const response = await fetch(
        `/api/menu/get_specific_menu/${timestamp}?which=${which}`
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

  if (loading) return <p className={classes.loading}>Wczytywanie..</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <>
      <div>
        {images.length > 0 ? (
          <div className={classes.imagesContainer}>
            {/* Kontener dla wszystkich zdjęć */}
            {images.map((file, index) => (
              <div key={file} className={classes.imageWrapper}>
                <Image
                  src={file} // Użyj pełnego URL tutaj
                  width={100}
                  height={100}
                  alt={`Cocktail ${index}`}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={classes.empty}>Nie znaleziono menu.</div>
        )}
      </div>
    </>
  );
}
