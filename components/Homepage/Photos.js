import classes from "./Photos.module.css";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
import SliderComponent from "../UI/Slider/Slider";

export default function Photos() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef, { once: true });
  const timestamp = Date.parse(new Date().toString());

  // Function to fetch images
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
        throw new Error("Wystąpił błąd podczas wczytywania galerii");
      }
      const data = await response.json();
      console.log(data);
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={
          isSkillRefinView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className={classes.back}
      >
        <div className={classes.container} ref={skillRef}>
          <div className={classes.textContainer}>
            <h2>Galeria Klubu</h2>
            <p>
              Poczuj klimat imprez w Huki Muki Pub & Club! To tylko przedsmak –
              więcej zdjęć znajdziesz na naszym Instagramie. Sprawdź, jak bawimy
              się co weekend, i dołącz do nas, aby przeżyć niezapomniane chwile.
              Nasze wydarzenia to połączenie najlepszej muzyki, wyjątkowej
              atmosfery i wspaniałego towarzystwa. Nie przegap żadnej okazji,
              aby być częścią tego, co czyni Huki Muki miejscem, o którym
              wszyscy mówią. Zobacz, jak nasi goście tworzą wspomnienia, które
              zostają na zawsze!
            </p>

            <div
              className={classes.socialsIcons}
              whileHover={{ scale: 1.15 }}
              whileTap={{
                scale: 0.8,
              }}
            >
              <Link
                href={"https://www.facebook.com/hukimukikrakow"}
                className={classes.facebook}
              >
                <FaFacebook />
              </Link>
              <Link
                href={"https://www.tiktok.com/@hukimukikrakow"}
                className={classes.tiktok}
              >
                <FaTiktok />
              </Link>
              <Link
                className={classes.instagram}
                href={"https://www.instagram.com/hukimuki/"}
              >
                <FaInstagram />
              </Link>
            </div>
          </div>
          {loading && <p>Ładowanie obrazów...</p>}
          {error && <p className={classes.error}>{error}</p>}
          {!loading && !error && images.length > 0 && (
            <SliderComponent images={images} />
          )}
          {!loading && !error && images.length === 0 && (
            <p>Brak obrazów do wyświetlenia.</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
