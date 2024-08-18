import classes from "./Photos.module.css";
import Image from "next/image";
import { useRef } from "react";
import { FaInstagram } from "react-icons/fa";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
export default function Photos() {
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        isSkillRefinView
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.85 }
      }
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
    >
      <div className={classes.container} ref={skillRef}>
        <div className={classes.textContainer}>
          <h4>Galeria Klubu</h4>
          <p>
            Poczuj klimat imprez w Huki Muki Pub Club! To tylko przedsmak –
            więcej zdjęć znajdziesz na naszym Instagramie. Sprawdź, jak bawimy
            się co weekend!
          </p>
          <motion.div
            className={classes.instagram}
            whileHover={{ scale: 1.15 }}
            whileTap={{
              scale: 0.8,
            }}
          >
            <Link href={"https://www.instagram.com/hukimuki/"}>
              <FaInstagram />
            </Link>
          </motion.div>
        </div>
        <div className={classes.imagesContainer}>
          <Image
            src={"/photos/1.jpg"}
            width={500}
            height={300}
            layout="responsive"
          ></Image>

          <Image
            src={"/photos/3.jpg"}
            width={500}
            height={300}
            layout="responsive"
          ></Image>
          <Image
            src={"/photos/2.jpg"}
            width={500}
            height={300}
            layout="responsive"
          ></Image>
          <Image
            src={"/photos/4.jpg"}
            width={500}
            height={300}
            layout="responsive"
          ></Image>
        </div>
      </div>
    </motion.div>
  );
}
