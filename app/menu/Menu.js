"use client";
import Header from "@/components/UI/Header/Header";
import classes from "./Menu.module.css";
import Footer from "@/components/UI/Footer/Footer";
import Image from "next/image";
import Which from "./Which";
import { useState, useEffect } from "react";
import Adult from "@/components/Homepage/Adult";

export default function Menu() {
  const [isCoctails, setIsCoctails] = useState(false);
  const [isBeers, setIsBeers] = useState(false);
  const [isShots, setIsShots] = useState(false);
  const [isSets, setIsSets] = useState(false);
  // const [isAlcohol, setIsAlcohol] = useState(false);
  // const [isPromo, setIsPromo] = useState(false);
  // const [isStudentsPromo, setIsStudentsPromo] = useState(false);
  // const [isNapoje, setIsNapoje] = useState(false);

  const [is18, setIs18] = useState(null);

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
    <>
      {is18 === null && (
        <Adult ageHandler={ageHandler} negativeAge={negativeAge} />
      )}
      {is18 === true && (
        <div>
          <Header />
          <div className={classes.menuContainer}>
            <div className={classes.logo}>
              <h1>
                <i>Huki Muki</i>
              </h1>
              <h2>Menu</h2>
              {/* <Image
                src={"/gifs/3.gif"}
                width={200}
                height={200}
                alt="stukajace sie butelki"
              /> */}
            </div>
            <div className={classes.buttons}>
              <button
                onClick={() => {
                  setIsCoctails(false);
                  setIsShots(false);
                  // setIsAlcohol(false);
                  setIsBeers(!isBeers);
                  setIsSets(false);
                  // setIsStudentsPromo(false);
                  // setIsPromo(false);
                  // setIsNapoje(false);
                }}
              >
                Piwa
              </button>

              <button
                onClick={() => {
                  setIsCoctails(!isCoctails);
                  setIsBeers(false);
                  // setIsAlcohol(false);
                  setIsSets(false);
                  setIsShots(false);
                  // setIsStudentsPromo(false);
                  // setIsPromo(false);
                }}
              >
                Koktajle
              </button>
              <button
                onClick={() => {
                  setIsShots(!isShots);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsSets(false);
                  // setIsAlcohol(false);
                  // setIsPromo(false);
                  // setIsStudentsPromo(false);
                  // setIsNapoje(false);
                }}
              >
                Shoty
              </button>
              {/* <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsAlcohol(!isAlcohol);
                  setIsPromo(false);
                  setIsNapoje(false);
                }}
              >
                Alkohole
              </button> */}
              <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsSets(!isSets);
                  // setIsAlcohol(false);
                  // setIsPromo(false);
                  // setIsNapoje(false);
                  // setIsStudentsPromo(false);
                }}
              >
                Zestawy
              </button>

              {/* <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  // setIsAlcohol(false);
                  setIsPromo(false);
                  setIsNapoje(!isNapoje);
                }}
              >
                Napoje
              </button> */}
              {/* <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  // setIsAlcohol(false);
                  setIsPromo(!isPromo);
                  setIsStudentsPromo(false);
                  setIsNapoje(false);
                  setIsSets(false);
                }}
              >
                Promocje
              </button> */}

              {/* <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  // setIsAlcohol(false);
                  setIsPromo(false);
                  setIsNapoje(false);
                  setIsStudentsPromo(!isStudentsPromo);
                  setIsSets(false);
                }}
              >
                Promocje Studenckie
              </button> */}
            </div>
            <div className={classes.menuImages}>
              {isCoctails && <Which which="coctails" />}
              {isBeers && <Which which="beers" />}
              {isShots && <Which which="shots" />}
              {/* {isAlcohol && <Which which="alcohol" />} */}
              {/* {isNapoje && <Which which="napoje" />} */}
              {/* {isPromo && <Which which="promo" />} */}
              {/* {isStudentsPromo && <Which which="students" />} */}
              {isSets && <Which which="sets" />}
            </div>
          </div>
          <Footer />
        </div>
      )}
      {is18 === false && (
        <div className={classes.errorInfo}>
          <Image src={"/gifs/2.gif"} width={300} height={300} alt="ooops" />
          <h1>
            Niestety, zawartość naszej strony nie jest dedykowana dla Ciebie...
          </h1>
        </div>
      )}
    </>
  );
}
