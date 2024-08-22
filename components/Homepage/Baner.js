import React, { useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";
import classes from "./Baner.module.css";

export default function Baner() {
  const text = "Huki Muki";

  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // // Ustawienie początkowej szerokości okna i nasłuchiwanie zmian
  // useEffect(() => {
  //   const updateWindowWidth = () => setWindowWidth(window.innerWidth);

  //   window.addEventListener("resize", updateWindowWidth);
  //   return () => window.removeEventListener("resize", updateWindowWidth);
  // }, []);

  // // Hook useScroll do śledzenia przewijania
  // const { scrollY } = useScroll();

  // // Always create all transforms, but only use the relevant one based on windowWidth
  // const scaleLarge = useTransform(scrollY, [0, 400], [1, 0.92]);
  // const yLarge = useTransform(scrollY, [0, 880], [0, 710]);

  // const scaleMedium = useTransform(scrollY, [0, 300], [1, 0.85]);
  // const yMedium = useTransform(scrollY, [0, 600], [0, 450]);

  // const scaleSmall = useTransform(scrollY, [0, 300], [1, 0.85]);
  // const ySmall = useTransform(scrollY, [0, 600], [0, 430]);

  // const scaleExtraSmall = useTransform(scrollY, [0, 200], [0.9, 0.9]);
  // const yExtraSmall = useTransform(scrollY, [0, 300], [0, 330]);

  // // Determine which transform to use based on windowWidth
  // const scale =
  //   windowWidth > 1640
  //     ? scaleLarge
  //     : windowWidth > 900
  //     ? scaleMedium
  //     : windowWidth > 395
  //     ? scaleSmall
  //     : scaleExtraSmall;

  // const y =
  //   windowWidth > 1640
  //     ? yLarge
  //     : windowWidth > 900
  //     ? yMedium
  //     : windowWidth > 380
  //     ? ySmall
  //     : yExtraSmall;

  return (
    <div className={classes.banerContainer}>
      <motion.div
        className={classes.headerContainer}
        // style={{ y, scale }} // Stylowanie z interpolowanymi wartościami
      >
        <p>Perfekcyjne życie nocne</p>
        <h1>
          Poczujcie atmosferę tutaj <br />
          {text.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                color: ["#00bf63"],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        <div className={classes.buttonsContainer}>
          <Button text="Rezerwacje" href="/rezerwacje" />
          <Button2 text="Menu" href="/menu" />
        </div>
      </motion.div>
    </div>
  );
}
