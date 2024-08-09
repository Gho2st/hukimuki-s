import SubmitButton from "../Buttons/SubmitButton";
import classes from "./Contact.module.css";
import Image from "next/image";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
export default function Contact() {
  const skillRef = useRef();
  const isSkillRefinView = useInView(skillRef, { once: true });
  return (
    <motion.div
      id="kontakt"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        isSkillRefinView
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.85 }
      }
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      className={classes.container}
    >
      <h3 ref={skillRef}>Podejmij Kontakt!</h3>
      <div className={classes.textContainer}>
        <Image src={"/contact.gif"} width={180} height={150} />
        <p>
          Masz pytania dotyczące rezerwacji, menu, czy specjalnych wydarzeń?
          Wypełnij formularz poniżej, a nasz zespół z Hukimuki odpowie na Twoje
          zapytanie jak najszybciej. Czekamy na Twoje wiadomości!
        </p>
      </div>
      <div>
        <form className={classes.formContainer}>
          <div className={classes.inputs}>
            <input type="text" name="name" placeholder="Imię i nazwisko" />
            <input type="email" name="email" placeholder="Email" />
            <input type="tel" name="phone" placeholder="Numer telefonu" />
          </div>
          <textarea
            name="message"
            placeholder="Zapytaj o co potrzebujesz"
          ></textarea>
          <div className={classes.buttonContainer}>
            <SubmitButton text="Wyślij" />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
