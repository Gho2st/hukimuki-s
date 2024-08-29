import classes from "./Footer.module.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { MdLocalPhone } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className={classes.container}>
        <div>
          <h5>Social media</h5>
          <div className={classes.socials}>
            <Link
              href={"https://www.facebook.com/hukimukikrakow"}
              className={classes.facebook}
            >
              <FaFacebook />
            </Link>
            <Link
              href={"https://www.tiktok.com/@hukimukikrakow"}
              className={classes.tiktok}
            >
              <FaTiktok />
            </Link>

            <Link
              href={"https://www.instagram.com/hukimuki/"}
              className={classes.instagram}
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div>
          <h5>Dane kontaktowe</h5>
          <ul>
            <li>
              <CiLocationOn />
              Floriańska 26 - Kraków
            </li>
            <li>
              <Link href={"tel:+48509542802"}>
                <MdLocalPhone />
                509542802
              </Link>
            </li>
            <li>
              <CiMail />
              hukimukiflorianska@gmail.com
            </li>
          </ul>
        </div>
        <div>
          <h5>Informacje</h5>
          <ul>
            <a href="/info/Polityka-prywatnosci-HukiMuki.pdf" download>
              <li>Polityka prywatności</li>
            </a>
            <a href="/info/REGULAMIN HUKI MUKI.docx" download>
              <li>Regulamin Pubu Huki Muki</li>
            </a>
            <a href="info/Regulamin-hukimuki-1.pdf" download>
              <li>Regulamin sklepu</li>
            </a>
            <a href="info/Regulamin fanpage – Huki Muki.html">
              <li>Regulamin fanpage</li>
            </a>
          </ul>
        </div>
      </div>
      <h6 className={classes.copyright}>
        &copy; HukiMuki 2024 &
        <a href="https://www.domiweb.pl">
          <span> Domiweb. </span>
        </a>
        Wszelkie prawa zastrzeżone.
      </h6>
    </>
  );
}
