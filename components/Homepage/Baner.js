import React, { useEffect, useState } from "react";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";
import classes from "./Baner.module.css";
import { useRef } from "react";

export default function Baner() {
  const text = "Huki Muki";
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef);

  return (
    <div className={classes.banerContainer} ref={skillRef}>
      <motion.div
        className={classes.headerContainer}
        initial={{ y: "-500px", opacity: 0 }}
        animate={
          isSkillRefinView ? { y: 0, opacity: 1 } : { y: "-500px", opacity: 0 }
        }
        transition={{ delay: 0.11, duration: 0.7, ease: "easeOut" }}
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
