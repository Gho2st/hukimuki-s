import classes from "./Photos.module.css";
import Image from "next/image";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
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
    </motion.div>
  );
}
