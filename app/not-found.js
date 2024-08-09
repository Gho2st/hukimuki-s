import classes from "./not-found.module.css";
import { MdErrorOutline } from "react-icons/md";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className={classes.container}>
      <MdErrorOutline />
      <h1>404 - Strona nie znaleziona</h1>
      <p>
        PS: Często dzieje się tak przy literówce w adresie URL lub w przypadku
        gdy strona zmieniła adres na troszkę inny...
      </p>
      <Link className={classes.button} href="/">
        Przejdź do strony głównej
      </Link>
    </div>
  );
}
