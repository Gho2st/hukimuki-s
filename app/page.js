"use client";
import classes from "./page.module.css";
import { useState, useEffect } from "react";
import Adult from "@/components/Homepage/Adult";
import Image from "next/image";
import Homepage from "@/components/Homepage/Homepage";

export default function Home() {
  const [is18, setIs18] = useState(null);

  // Sprawdzenie, czy token jest w localStorage i czy jest nadal ważny
  useEffect(() => {
    const token = localStorage.getItem("isAdult");
    if (token) {
      const expirationDate = localStorage.getItem("expirationDate");
      if (expirationDate && new Date(expirationDate) > new Date()) {
        setIs18(true);
      } else {
        localStorage.removeItem("isAdult");
        localStorage.removeItem("expirationDate");
      }
    }
  }, []);

  const ageHandler = () => {
    setIs18(true);

    // Ustawienie tokena w localStorage z czasem wygaśnięcia na 30 minut
    const expirationDate = new Date(new Date().getTime() + 30 * 60 * 1000);
    localStorage.setItem("isAdult", "true");
    localStorage.setItem("expirationDate", expirationDate.toISOString());
  };

  const negativeAge = () => {
    console.log("Underage");
    setIs18(false);
    console.log(is18);
  };

  return (
    <main className={classes.main}>
      {is18 === null && (
        <Adult ageHandler={ageHandler} negativeAge={negativeAge} />
      )}
      {is18 === true && <Homepage />}
      {is18 === false && (
        <div className={classes.errorInfo}>
          <Image
            src={"/gifs/2.gif"}
            width={300}
            height={300}
            alt="ooops"
          ></Image>
          <h1>
            Niestety, zawartość naszej strony nie jest dedykowana dla Ciebie...
          </h1>
        </div>
      )}
    </main>
  );
}
