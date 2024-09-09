"use client";
import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import React, { useState } from "react";
import classes from "./Admin.module.css";
import ButtonOnClick from "@/components/UI/Buttons/ButtonOnClick";
import AdminMenu from "./AdminMenu";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Ensure environment variables are properly loaded
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("Admin password environment variable is not set.");
      alert("System error: Admin password is not configured.");
      return;
    }

    if (password === adminPassword) {
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
          <h1>HukiMuki</h1>
          <h2>Logowanie do Panelu Admina</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
          />
        </div>
        <ButtonOnClick text="Wprowadź hasło" onClick={handleLogin} />
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
