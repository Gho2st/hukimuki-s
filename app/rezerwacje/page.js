import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import classes from "./page.module.css";
// import Reservation from "./Reservation"; // Komponent tymczasowo wyłączony
import { Metadata } from "next";

export const metadata = {
  title: "Rezerwacje Loży - HukiMuki",
  description:
    "Zarezerwuj miejsce w HukiMuki. Dokonaj rezerwacji telefonicznie lub przez Instagram i ciesz się niezapomnianą imprezą.",
  alternates: {
    canonical: "/rezerwacje",
  },
};

export default function Rezerwacje() {
  return (
    <>
      <Header />
      <div className={classes.container}>
        <h1>Rezerwacja miejsc</h1>

        {/* Sekcja wyboru metody rezerwacji */}
        <div className={classes.contactWrapper}>
          <div className={classes.contactCard}>
            <h2>Telefonicznie</h2>
            <p>Zadzwoń do nas i zarezerwuj lożę bezpośrednio.</p>
            {/* ZMIEŃ NUMER PONIŻEJ */}
            <a href="tel:+48509542802" className={classes.actionButton}>
              +48 509542802
            </a>
          </div>

          <div className={classes.contactCard}>
            <h2>Instagram</h2>
            <p>Napisz do nas wiadomość DM, aby ustalić szczegóły.</p>
            {/* ZMIEŃ LINK PONIŻEJ */}
            <a
              href="https://www.instagram.com/hukimuki/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${classes.actionButton} ${classes.instaButton}`}
            >
              @hukimuki
            </a>
          </div>
        </div>

        {/* <p className={classes.text}>
          *kwota rezerwacji do wykorzystania w barze
          <br />
          **rezerwacja do opłacenia na miejscu
        </p> */}

        {/* <Reservation /> */}
      </div>
      <Footer />
    </>
  );
}
