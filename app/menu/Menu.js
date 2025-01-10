"use client";
import Header from "@/components/UI/Header/Header";
import classes from "./Menu.module.css";
import Footer from "@/components/UI/Footer/Footer";
import Image from "next/image";
import Which from "./Which";
import { useState, useEffect } from "react";
import Adult from "@/components/Homepage/Adult";

export default function Menu() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolder, setNewFolder] = useState(""); // Nowy folder do dodania
  const [loading, setLoading] = useState(false); // Śledzenie stanu ładowania
  const [error, setError] = useState(null); // Śledzenie błędów
  const [is18, setIs18] = useState(null);
  const timestamp = Date.parse(new Date().toString());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/menu/get_all_menu/${timestamp}`);
        if (!res.ok) throw new Error("Błąd podczas pobierania danych.");
        const data = await res.json();
        console.log(data);
        setFolders(data); // Przypisanie nazw folderów
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  useEffect(() => {
    const token = localStorage.getItem("isAdult");
    if (token) {
      const expirationDate = localStorage.getItem("expirationDate");
      if (expirationDate && new Date(expirationDate) > new Date()) {
        setIs18(true);
      } else {
        localStorage.removeItem("isAdult");
        localStorage.removeItem("expirationDate");
      }
    }
  }, []);

  const ageHandler = () => {
    setIs18(true);
    const expirationDate = new Date(new Date().getTime() + 30 * 60 * 1000);
    localStorage.setItem("isAdult", "true");
    localStorage.setItem("expirationDate", expirationDate.toISOString());
  };

  const negativeAge = () => {
    console.log("Underage");
    setIs18(false);
    console.log(is18);
  };

  return (
    <>
      {is18 === null && (
        <Adult ageHandler={ageHandler} negativeAge={negativeAge} />
      )}
      {is18 === true && (
        <div>
          <Header />
          <div className={classes.menuContainer}>
            <div className={classes.logo}>
              <h1>
                <i>Huki Muki</i>
              </h1>
              <h2>Menu</h2>
            </div>
            <div className={classes.buttons}>
              {folders.map((folder, index) => {
                return (
                  <button key={index} onClick={() => handleFolderClick(folder)}>
                    {folder.replace("menu/", "").replace("/", "")}
                  </button>
                );
              })}
            </div>
            <div className={classes.menuImages}>
              {selectedFolder && <Which which={selectedFolder} />}
            </div>
          </div>
          <Footer />
        </div>
      )}
      {is18 === false && (
        <div className={classes.errorInfo}>
          <Image src={"/gifs/2.gif"} width={300} height={300} alt="ooops" />
          <h1>
            Niestety, zawartość naszej strony nie jest dedykowana dla Ciebie...
          </h1>
        </div>
      )}
    </>
  );
}
