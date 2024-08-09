"use client";
import classes from "./SubmitButton.module.css";
import { motion } from "framer-motion";

export default function SubmitButton(props) {
  return (
    <button className={classes.container} type="submit">
      <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.8 }}>
        {props.text}
      </motion.div>
    </button>
  );
}
