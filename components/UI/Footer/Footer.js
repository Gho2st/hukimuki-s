import classes from "./Footer.module.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { MdLocalPhone } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { GrContact } from "react-icons/gr";

export default function Footer() {
  return (
    <>
      <div className={classes.container}>
        <div>
          <h3>Social media</h3>
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
          <h3>Dane kontaktowe</h3>
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
            <Link href={"/kontakt"}>
              <li>
                <GrContact />
                Formularz kontaktowy
              </li>
            </Link>
          </ul>
        </div>
        <div>
          <h3>Informacje</h3>
          <ul>
            <a href="/info/Polityka-prywatnosci-HukiMuki.pdf" download>
              <li>Polityka prywatności</li>
            </a>
            <a href="/info/regulamin Huki Muki.docx" download>
              <li>Regulamin Pubu Huki Muki</li>
            </a>
            <a href="info/Regulamin szatni.docx" download>
              <li>Regulamin szatni</li>
            </a>
          </ul>
        </div>
      </div>
      <p className={classes.copyright}>&copy; 2025 HukiMuki</p>
    </>
  );
}
