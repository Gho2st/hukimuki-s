import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import classes from "./page.module.css";
import Reservation from "./Reservation";
import { Metadata } from "next";

export const metadata = {
  title: "Rezerwacje Loży Online - HukiMuki",
  description:
    "Zarezerwuj miejsce online w HukiMuki. Szybko i wygodnie zarezerwuj lożę i ciesz się niezapomnianą imprezą.",
  alternates: {
    canonical: "/rezerwacje",
  },
};

export default function Rezerwacje() {
  return (
    <>
      <Header />
      <div className={classes.container}>
        <h1>Rezerwacja miejsc online</h1>
        <p className={classes.text}>
          *kwota rezerwacji do wykorzystania w barze
          <br></br>
          **rezerwacja do opłacenia na miejscu
        </p>
        <Reservation />
      </div>
      <Footer />
    </>
  );
}
