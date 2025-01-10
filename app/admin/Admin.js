"use client";
import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import React, { useState } from "react";
import classes from "./Admin.module.css";
import ButtonOnClick from "@/components/UI/Buttons/ButtonOnClick";
import AdminMenu from "./AdminMenu";
import NewEvent from "./NewEvent";
import AdminGallery from "./AdminGallery";
import MenuList from "./MenuList";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMenu, setIsMenu] = useState(false);
  const [isGallery, setIsGallery] = useState(false);
  const [isEvents, setIsEvents] = useState(false);

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (response.ok) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError(result.message);
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
          {error && <p className={classes.error}>{error}</p>}
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
        <div className={classes.buttons}>
          <ButtonOnClick
            onClick={() => {
              setIsEvents(!isEvents);
              setIsGallery(false);
              setIsMenu(false);
            }}
            text="Eventy"
          />
          <ButtonOnClick
            onClick={() => {
              setIsMenu(!isMenu);
              setIsGallery(false);
              setIsEvents(false);
            }}
            text="Menu"
          />
          <ButtonOnClick
            onClick={() => {
              setIsGallery(!isGallery);
              setIsEvents(false);
              setIsMenu(false);
            }}
            text="Galeria"
          />
        </div>
        {isEvents && <NewEvent />}
        {/* {isMenu && <AdminMenu />} */}
        {isMenu && <MenuList />}
        {isGallery && <AdminGallery />}
      </div>
      <Footer />
    </>
  );
}
