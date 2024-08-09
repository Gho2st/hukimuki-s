"use client";
import classes from "./page.module.css";
import { useState } from "react";
import Adult from "@/components/Homepage/Adult";
import Image from "next/image";
import Homepage from "@/components/Homepage/Homepage";

export default function Home() {
  const [is18, setIs18] = useState(true);

  const ageHandler = () => {
    setIs18(true);
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
          <Image src={"/gifs/2.gif"} width={300} height={300}></Image>

          <h1>
            Niestety, zawartość naszej strony nie jest dedykowana dla Ciebie...
          </h1>
        </div>
      )}
    </main>
  );
}
