"use client";

import classes from "./Baner.module.css";
import { useScroll, useTransform, motion } from "framer-motion";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";

export default function Baner() {
  const text = "HukiMuki.";

  // Hook useScroll do śledzenia przewijania
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 400], [1, 0.85]); // Skalowanie
  const y = useTransform(scrollY, [0, 550], [0, 580]); // Zmienia zakresy wartości według potrzeb

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
