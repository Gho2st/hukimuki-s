"use client";
import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import React, { useState } from "react";
import classes from "./page.module.css";
import ButtonOnClick from "@/components/UI/Buttons/ButtonOnClick";
import AdminMenu from "./AdminMenu";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      // Tu możesz zmienić hasło na inne
      setIsLoggedIn(true);
    } else {
      alert("Nieprawidłowe hasło");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword(""); // Czyszczenie hasła przy wylogowaniu
  };

  if (!isLoggedIn) {
    return (
      <div className={classes.container}>
        <div>
          <h1>Logowanie do Panelu Admina</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
          />
          <button onClick={handleLogin}>Zaloguj się</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container2}>
        <h1>Panel Admina</h1>
        <p>Witaj w panelu admina!</p>
        <ButtonOnClick onClick={handleLogout} text="Wyloguj się" />

        <AdminMenu />
      </div>

      <Footer />
    </>
  );
}