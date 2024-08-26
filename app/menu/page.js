"use client";
import Header from "@/components/UI/Header/Header";
import classes from "./page.module.css";
import Footer from "@/components/UI/Footer/Footer";
import Image from "next/image";
import Which from "./Which";
import { useState, useEffect } from "react";
import Adult from "@/components/Homepage/Adult";

export default function Menu() {
  const [isCoctails, setIsCoctails] = useState(false);
  const [isBeers, setIsBeers] = useState(false);
  const [isShots, setIsShots] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isSets, setIsSets] = useState(false);
  const [isPitchers, setIsPitchers] = useState(false);
  const [isStudentsPromo, setIsStudentsPromo] = useState(false);

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
              <Image
                src={"/gifs/3.gif"}
                width={200}
                height={200}
                alt="stukajace sie butelki"
              />
            </div>
            <div className={classes.buttons}>
              <button
                onClick={() => {
                  setIsCoctails(!isCoctails);
                  setIsBeers(false);
                  setIsPromo(false);
                  setIsPitchers(false);
                  setIsStudentsPromo(false);
                  setIsSets(false);
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
                  setIsStudentsPromo(false);
                  setIsSets(false);
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
                  setIsStudentsPromo(false);
                  setIsSets(false);
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
                  setIsStudentsPromo(false);
                  setIsSets(false);
                }}
              >
                Shoty
              </button>
              <button
                onClick={() => {
                  setIsStudentsPromo(!isStudentsPromo);
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsPitchers(false);
                  setIsPromo(false);
                  setIsSets(false);
                }}
              >
                Promocje Studenckie
              </button>
              <button
                onClick={() => {
                  setIsStudentsPromo(false);
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsPitchers(false);
                  setIsPromo(false);
                  setIsSets(!isSets);
                }}
              >
                Zestawy
              </button>
              {/* <button
                onClick={() => {
                  setIsShots(false);
                  setIsBeers(false);
                  setIsCoctails(false);
                  setIsPitchers(!isPitchers);
                  setIsPromo(false);
                }}
              >
                Dzbanki
              </button> */}
            </div>
            <div className={classes.menuImages}>
              {isCoctails && <Which which="coctails" />}
              {isBeers && <Which which="beers" />}
              {isShots && <Which which="shots" />}
              {/* {isPitchers && <Which which="pitchers" />} */}
              {isPromo && <Which which="promo" />}
              {isStudentsPromo && <Which which="students" />}
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
