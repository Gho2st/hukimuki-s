"use client";
import { useRef } from "react";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";
import classes from "./Events.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInView, motion } from "framer-motion";

export default function Events() {
  const [files, setFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(null);
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/get_events");
        const data = await response.json();
        console.log(data);
        const date = data.metadata.date;
        const text = data.metadata.text;
        const image = data.metadata.files[0].fileUrl;

        if (image) {
          setImageUrl(image);
        }
        if (text) {
          setTextContent(text);
        }
        if (date) {
          setDate(date);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={classes.container} ref={skillRef}>
      <h3>Nadchodzące Eventy</h3>
      <p className={classes.description}>
        Nie przegap tego, co przygotowaliśmy! Zobacz, jakie atrakcje czekają na
        Ciebie w najbliższym czasie.
      </p>
      <div className={classes.content}>
        <motion.div
          initial={{ x: "-900px", opacity: 0, rotate: 10 }}
          animate={
            isSkillRefinView
              ? { x: 0, opacity: 1, rotate: 0 }
              : { x: "-900px", opacity: 0, rotate: 10 }
          }
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className={classes.imageContainer}
        >
          <Image
            src={imageUrl || "/logo.png"}
            height={500}
            width={500}
            layout="responsive"
            alt="Event"
          />
        </motion.div>
        <motion.div
          initial={{ x: "900px", opacity: 0, rotate: 10 }}
          animate={
            isSkillRefinView
              ? { x: 0, opacity: 1, rotate: 0 }
              : { x: "900px", opacity: 0, rotate: 10 }
          }
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className={classes.textContainer}
        >
          <div>
            {date && <p className={classes.date}>{date}</p>}
            <p className={classes.text}>
              {textContent ||
                "W Huki Muki zawsze dzieje się coś wyjątkowego! Już w ten piątek zapraszamy na niezapomniany wieczór pełen muzyki, śmiechu i dobrej zabawy. Nasz pub to miejsce, gdzie każdy znajdzie coś dla siebie - od koncertów na żywo, przez wieczory z DJ-em, aż po tematyczne imprezy z wyjątkowymi promocjami."}
            </p>
            <p>
              Przygotuj się na niesamowite doznania i zarezerwuj stolik już
              dziś, bo u nas nigdy nie brakuje emocji. Dołącz do nas na kolejny
              niezapomniany wieczór!
            </p>
          </div>
          <div className={classes.buttonsContainer}>
            <Button text="Rezerwacje" href="/rezerwacje" />
            <Button2 text="Kontakt" href="/kontakt" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
