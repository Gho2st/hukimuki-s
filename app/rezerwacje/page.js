import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import classes from "./page.module.css";
import Reservation from "./Reservation";
export default function Rezerwacje() {
  return (
    <>
      <Header />
      <div className={classes.container}>
        <h1>Rezerwacja loży online</h1>
        <p className={classes.text}>*kwota rezerwacji do wykorzystania w barze</p>
        <Reservation />
      </div>
      <Footer />
    </>
  );
}
