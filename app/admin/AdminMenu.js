"use client";
import classes from "./AdminMenu.module.css";
import { useState } from "react";
import Which2 from "./Which2";

export default function AdminMenu() {
  const [isCoctails, setIsCoctails] = useState(false);
  const [isBeers, setIsBeers] = useState(false);
  const [isShots, setIsShots] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isAlcohol, setIsAlcohol] = useState(false);
  const [isStudentsPromo, setIsStudentsPromo] = useState(false);
  const [isSets, setIsSets] = useState(false);
  const [isNapoje, setIsNapoje] = useState(false);

  return (
    <div className={classes.container}>
      <h3>Zarządzaj menu</h3>
      <div className={classes.buttons}>
        <button
          onClick={() => {
            setIsCoctails(!isCoctails);
            setIsBeers(false);
            setIsPromo(false);
            setIsAlcohol(false);
            setIsStudentsPromo(false);
            setIsSets(false);
            setIsNapoje(false);
          }}
        >
          Koktajle
        </button>
        <button
          onClick={() => {
            setIsCoctails(false);
            setIsPromo(false);
            setIsAlcohol(false);
            setIsBeers(!isBeers);
            setIsStudentsPromo(false);
            setIsSets(false);
            setIsNapoje(false);
          }}
        >
          Piwa
        </button>
        <button
          onClick={() => {
            setIsShots(false);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(false);
            setIsPromo(!isPromo);
            setIsSets(false);
            setIsStudentsPromo(false);
            setIsNapoje(false);
          }}
        >
          Promocje
        </button>
        <button
          onClick={() => {
            setIsShots(!isShots);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(false);
            setIsPromo(false);
            setIsSets(false);
            setIsStudentsPromo(false);
            setIsNapoje(false);
          }}
        >
          Shoty
        </button>
        <button
          onClick={() => {
            setIsShots(false);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(false);
            setIsPromo(false);
            setIsSets(false);
            setIsStudentsPromo(!isStudentsPromo);
            setIsNapoje(false);
          }}
        >
          Promocje Studenckie
        </button>
        <button
          onClick={() => {
            setIsShots(false);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(false);
            setIsPromo(false);
            setIsStudentsPromo(false);
            setIsSets(!isSets);
            setIsNapoje(false);
          }}
        >
          Zestawy
        </button>
        <button
          onClick={() => {
            setIsShots(false);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(!isAlcohol);
            setIsPromo(false);
            setIsStudentsPromo(false);
            setIsNapoje(false);
          }}
        >
          Alkohole
        </button>
        <button
          onClick={() => {
            setIsShots(false);
            setIsBeers(false);
            setIsCoctails(false);
            setIsAlcohol(false);
            setIsPromo(false);
            setIsStudentsPromo(false);
            setIsNapoje(!isNapoje);
          }}
        >
          Napoje
        </button>
      </div>
      <div className={classes.menuImages}>
        {isCoctails && <Which2 which="coctails" />}
        {isBeers && <Which2 which="beers" />}
        {isShots && <Which2 which="shots" />}
        {isAlcohol && <Which2 which="alcohol" />}
        {isNapoje && <Which2 which="napoje" />}
        {isPromo && <Which2 which="promo" />}
        {isStudentsPromo && <Which2 which="students" />}
        {isSets && <Which2 which="sets" />}
      </div>
    </div>
  );
}
