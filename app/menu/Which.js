import { useEffect, useState } from "react";
import Image from "next/image";

export default function Coctails({ which }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(`/api/menu?which=${which}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images");
      }
    };

    fetchImages();
  }, [which]);

  return (
    <div>
      {images.map((file, index) => (
        <div key={file}>
          <Image
            src={`/menu/${which}/${file}`}
            width={100}
            height={100}
            alt=""
            layout="responsive"
          />
        </div>
      ))}
    </div>
  );
}
