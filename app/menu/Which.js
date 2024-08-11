import { useEffect, useState } from "react";
import Image from "next/image";
import classes from './Which.module.css'

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menu?which=${which}`);
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

  if (loading) return <p className={classes.loading}>Wczytywanie..</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <div>
      {images.length > 0 ? (
        images.map((file, index) => (
          <div key={file}>
            <Image
              src={`/menu/${which}/${file}`}
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
    </div>
  );
}
