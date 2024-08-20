"use client";
import classes from "./AdminMenu.module.css";
import { useState } from "react";
import Which2 from "./Which2";

export default function AdminMenu() {
  const [isCoctails, setIsCoctails] = useState(false);
  const [isBeers, setIsBeers] = useState(false);
  const [isShots, setIsShots] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isPitchers, setIsPitchers] = useState(false);
  return (
    <div className={classes.container}>
      <h3>Zarzadzaj menu</h3>
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
        {isCoctails && <Which2 which="coctails" />}
        {isBeers && <Which2 which="beers" />}
        {isShots && <Which2 which="shots" />}
        {isPitchers && <Which2 which="pitchers" />}
        {isPromo && <Which2 which="promo" />}
      </div>
    </div>
  );
}
