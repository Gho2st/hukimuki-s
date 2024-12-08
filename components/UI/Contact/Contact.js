"use client";
import SubmitButton from "../Buttons/SubmitButton";
import { useState } from "react";
import classes from "./Contact.module.css";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

export default function Contact() {
  const [text, setText] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [errorFields, setErrorFields] = useState([]);
  const recaptchaRef = useRef(null); // Ref dla reCAPTCHA

  const sendMail = async (e) => {
    e.preventDefault();

    // Pobranie tokena reCAPTCHA
    const recaptchaToken = recaptchaRef.current.getValue();
    if (!recaptchaToken) {
      setFormError("Proszę zaznacz, że nie jestes robotem przed wysłaniem.");
      return;
    }

    const fieldsToCheck = {
      fullName,
      email,
      phoneNumber,
      text,
    };
    const emptyFields = Object.entries(fieldsToCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    setErrorFields(emptyFields);

    if (emptyFields.length > 0) {
      setFormError("Proszę uzupełnij wszystkie wymagane pola.");
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          text,
          fullName,
          email,
          phoneNumber,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        console.log("Form submitted succesfully");
        setFormSubmitted(true);
        setFormError(null);
        setEmail("");
        setFullName(fieldsToCheck.fullName);
        setText("");
        setPhoneNumber("");
        onFormSubmit();
        recaptchaRef.current.reset(); // Zresetuj CAPTCHA po wysłaniu
      } else {
        const errorData = await response.json();
        setFormError(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setFormError("Unexpected error occurred.");
    }
  };

  return (
    <>
      {!formSubmitted ? (
        <div className={classes.container}>
          <h1>Podejmij Kontakt!</h1>
          <div className={classes.textContainer}>
            <Image
              src={"/gifs/contact.gif"}
              width={180}
              height={150}
              alt="animacja wysylania listu"
            />
            <p>
              Masz pytania dotyczące rezerwacji, menu, czy specjalnych wydarzeń?
              Wypełnij formularz poniżej, a nasz zespół z Hukimuki odpowie na
              Twoje zapytanie jak najszybciej. Czekamy na Twoje wiadomości!
            </p>
            {formError && <p className={classes.errorMessage}>{formError}</p>}
          </div>
          <div>
            <form onSubmit={sendMail} className={classes.formContainer}>
              <div className={classes.inputs}>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  placeholder="Imię i nazwisko"
                  style={{
                    border: errorFields.includes("fullName")
                      ? "1px solid red"
                      : "0",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Adres e-mail"
                  style={{
                    border: errorFields.includes("email")
                      ? "1px solid red"
                      : "0",
                  }}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  placeholder="Numer telefonu"
                  style={{
                    border: errorFields.includes("phoneNumber")
                      ? "1px solid red"
                      : "0",
                  }}
                />
              </div>
              <textarea
                id="text"
                name="text"
                placeholder="Napisz swoją wiadomość!"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                style={{
                  border: errorFields.includes("text") ? "1px solid red" : "0",
                }}
              ></textarea>
              <ReCAPTCHA
                className={classes.recaptcha}
                ref={recaptchaRef}
                sitekey="6LetqpUqAAAAABRwX_slcBybtlkC7S4X4QZZEYUo" // Wstaw swój Site Key
              />
              <div className={classes.buttonContainer}>
                <SubmitButton text="Wyślij" />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className={classes.thanksMessageContainer}>
          <h4>Dziękujemy za wiadomość!</h4>
          <p>Nasz zespół skontaktuje się z Tobą najszybciej, jak to możliwe!</p>
          <Image
            src={"/gifs/5.gif"}
            width={240}
            height={260}
            alt="animacja wysylania listu"
          />
        </div>
      )}
    </>
  );
}
