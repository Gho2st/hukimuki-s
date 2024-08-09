"use client";
import Header from "@/components/UI/Header/Header";
import classes from "./page.module.css";
import Footer from "@/components/UI/Footer/Footer";
import Image from "next/image";
import Which from "./Which";
import { useState } from "react";

export default function Menu() {
  const [isCoctails, setIsCoctails] = useState(false);
  const [isBeers, setIsBeers] = useState(false);
  const [isShots, setIsShots] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isPitchers, setIsPitchers] = useState(false);

  return (
    <div>
      <Header />
      <div className={classes.menuContainer}>
        <div className={classes.logo}>
          <h1>Huki Muki</h1>
          <h2>Menu</h2>
          <Image src={"/gifs/3.gif"} width={200} height={200}></Image>
        </div>
        <div className={classes.buttons}>
          <button
            onClick={() => {
              setIsCoctails(!isCoctails);
              setIsBeers(false);
              setIsPromo(false);
              setIsPitchers(false);
            }}
          >
            Koktajle
          </button>
          <button
            onClick={() => {
              setIsCoctails(false);
              setIsPromo(false);
              setIsPitchers(false);
              setIsBeers(!isBeers);
            }}
          >
            Piwa
          </button>
          <button
            onClick={() => {
              setIsShots(false);
              setIsBeers(false);
              setIsCoctails(false);
              setIsPitchers(false);
              setIsPromo(!isPromo);
            }}
          >
            Promocje
          </button>
          <button
            onClick={() => {
              setIsShots(!isShots);
              setIsBeers(false);
              setIsCoctails(false);
              setIsPitchers(false);
              setIsPromo(false);
            }}
          >
            Shoty
          </button>
          <button
            onClick={() => {
              setIsShots(false);
              setIsBeers(false);
              setIsCoctails(false);
              setIsPitchers(!isPitchers);
              setIsPromo(false);
            }}
          >
            Dzbanki
          </button>
        </div>
        <div className={classes.menuImages}>
          {isCoctails && <Which which="coctails" />}
          {isBeers && <Which which="beers" />}
          {isShots && <Which which="shots" />}
          {isPitchers && <Which which="pitchers" />}
          {isPromo && <Which which="promo" />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
