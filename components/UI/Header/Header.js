"use client";
import Link from "next/link";
import classes from "./Header.module.css";
import { useRef, useEffect } from "react";

export default function Header() {
  const checkboxRef = useRef(null);

  useEffect(() => {
    const handleLinkClick = () => {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false;
      }
    };

    const links = document.querySelectorAll(`.${classes.navigation__link}`);
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    // Cleanup event listeners on unmount
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);
  return (
    <>
      <Link className={classes.logo} href={"/"}>
        <p>
          <i>HukiMuki</i>
        </p>
        <p>Club</p>
      </Link>

      <div className={classes.navigation}>
        <input
          ref={checkboxRef}
          type="checkbox"
          className={classes.navigation__checkbox}
          id="navi-toggle"
        ></input>
        <label htmlFor="navi-toggle" className={classes.navigation__button}>
          <span className={classes.navigation__icon}>&nbsp;</span>
        </label>
        <div className={classes.navigation__background}>&nbsp;</div>
        <nav className={classes.navigation__nav}>
          <ul className={classes.navigation__list}>
            <li className={classes.navigation__item}>
              <Link className={classes.navigation__link} href={"/"}>
                <span>01</span>
                Strona Główna
              </Link>
            </li>
            <li className={classes.navigation__item}>
              <Link className={classes.navigation__link} href={"/menu"}>
                <span>02</span>
                Menu
              </Link>
            </li>
            <li className={classes.navigation__item}>
              <Link className={classes.navigation__link} href={"/rezerwacje"}>
                <span>03</span>
                Rezerwacje
              </Link>
            </li>
            <li className={classes.navigation__item}>
              <Link className={classes.navigation__link} href={"/#kontakt"}>
                <span>04</span>
                Kontakt
              </Link>
            </li>
            <li className={classes.navigation__item}>
              <Link className={classes.navigation__link} href={"/twoje-rezerwacje"}>
                <span>05</span>
                Twoje Rezerwacje
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
