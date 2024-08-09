"use client";
import classes from "./Button2.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Button2(props) {
  return (
    <Link href={props.href} className={classes.container}>
      <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.8 }}>
      {props.text}
      </motion.div>
    </Link>
  );
}
