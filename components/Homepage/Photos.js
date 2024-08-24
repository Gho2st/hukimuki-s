import classes from "./Photos.module.css";
import Image from "next/image";
import { useRef } from "react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
import SliderComponent from "../UI/Slider/Slider";

const images = [
  {
    src: "/photos-slider/1.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/2.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/3.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/4.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/5.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/6.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/7.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },

  {
    src: "/photos-slider/9.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/10.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/11.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/12.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/13.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },

  {
    src: "/photos-slider/15.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
  {
    src: "/photos-slider/17.jpg",
    alt: "zdjecie ze srodka Huki Muki",
  },
];

export default function Photos() {
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef);
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
      >
        <div className={classes.container} ref={skillRef}>
          <div className={classes.textContainer}>
            <h4>Galeria Klubu</h4>
            <p>
              Poczuj klimat imprez w Huki Muki Pub Club! To tylko przedsmak –
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
          <SliderComponent images={images} />
        </div>
      </motion.div>
    </>
  );
}
