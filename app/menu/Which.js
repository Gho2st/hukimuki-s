import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import classes from "./Which.module.css";

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
          </div>
        ))
      ) : (
        <div>No images found</div>
      )}
    </>
  );
}
