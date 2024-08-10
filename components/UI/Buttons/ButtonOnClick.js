"use client";
import classes from "./ButtonOnClick.module.css";
import { motion } from "framer-motion";

export default function ButtonOnClick(props) {
  return (
    <button className={classes.container} onClick={props.onClick}>
      <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.8 }}>
        {props.text}
      </motion.div>
    </button>
  );
}
