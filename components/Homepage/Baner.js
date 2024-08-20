"use client";

import classes from "./Baner.module.css";
import React, { useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";

export default function Baner() {
  const text = "HukiMuki.";

  const [windowWidth, setWindowWidth] = useState(1400);

  // Ustawienie początkowej szerokości okna i nasłuchiwanie zmian
  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);

    updateWindowWidth(); // Ustaw początkową wartość
    window.addEventListener("resize", updateWindowWidth);

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  // Hook useScroll do śledzenia przewijania
  const { scrollY } = useScroll();

  // Ustawienie wartości dla trzech rozmiarów ekranu
  let scale, y;

  if (windowWidth > 1640) {
    scale = useTransform(scrollY, [0, 400], [1, 0.92]);
    y = useTransform(scrollY, [0, 880], [0, 710]);
  } else if (windowWidth > 900) {
    scale = useTransform(scrollY, [0, 300], [1, 0.85]);
    y = useTransform(scrollY, [0, 600], [0, 510]);
  } else if (windowWidth > 380) {
    scale = useTransform(scrollY, [0, 300], [1, 0.85]);
    y = useTransform(scrollY, [0, 600], [0, 460]);
  } else {
    scale = useTransform(scrollY, [0, 200], [0.9, 0.9]);
    y = useTransform(scrollY, [0, 550], [0, 370]);
  }

  return (
    <>
      <div className={classes.banerContainer}>
        <motion.div
          className={classes.headerContainer}
          style={{ y, scale }} // Stylowanie z interpolowanymi wartościami
        >
          <p>Perfekcyjne życie nocne.</p>
          <h1>
            Poczujcie atmosferę tutaj. <br />
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
    </>
  );
}
