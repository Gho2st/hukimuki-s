import { useRef, useState, useEffect } from "react";
import Button from "../UI/Buttons/Button";
import Button2 from "../UI/Buttons/Button2";
import classes from "./Events.module.css";
import Image from "next/image";
import { useInView, motion } from "framer-motion";

const fetchData = async (setImageUrl, setTextContent, setDate) => {
  try {
    const timestamp = Date.parse(new Date().toString());

    // Dodaj unikalny parametr zapytania, np. timestamp
    const response = await fetch(`/api/events-aws/get_events/${timestamp}`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    // console.log("Fetched Data:", data);

    const date = data.metadata.date;
    const text = data.metadata.text;
    const image = data.metadata.files[0].fileUrl;

    // Formatowanie tekstu
    const formatText = (text) => {
      return text.replace(/\r\n\r\n/g, "<br /><br />");
    };

    if (image) {
      setImageUrl(image);
    }
    if (text) {
      setTextContent(formatText(text)); // Format the text before setting it
    }
    if (date) {
      setDate(date);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default function Events() {
  const [textContent, setTextContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(null);
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef, { once: true });

  useEffect(() => {
    fetchData(setImageUrl, setTextContent, setDate);
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
          transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
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
          initial={{ x: "900px", opacity: 0 }}
          animate={
            isSkillRefinView ? { x: 0, opacity: 1 } : { x: "900px", opacity: 0 }
          }
          transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
          className={classes.textContainer}
        >
          <div>
            {date && <p className={classes.date}>{date}</p>}
            <p
              className={classes.text}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
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
