"use client";

import { useState } from "react";
import classes from "./NewEvent.module.css";
import Link from "next/link";

export default function NewEvent() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const which = "events";
  const maxFileSize = 4.5 * 1024 * 1024; // 4.5 MB in bytes

  const handleFileChange = (event) => {
    const files = event.target.files;
    for (const file of files) {
      if (file.size > maxFileSize) {
        setError("Maksymalny rozmiar pliku to 4.5 MB.");
        return;
      }
    }
    setSelectedFiles(files);
    setError(null);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async () => {
    setIsAdding(true);
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Proszę wybierz zdjęcie.");
      setLoading(false);
      setIsAdding(false);
      return;
    }

    if (!text.trim()) {
      setError("Proszę dodaj jakiś opis.");
      setLoading(false);
      setIsAdding(false);
      return;
    }

    if (!date) {
      setError("Proszę wybierz jakąś datę.");
      setLoading(false);
      setIsAdding(false);
      return;
    }

    const formData = new FormData();

    if (selectedFiles) {
      for (const file of selectedFiles) {
        formData.append("files", file);
      }
    }

    formData.append("which", which);
    formData.append("text", text);
    formData.append("date", date);

    try {
      const response = await fetch("/api/events-aws/s3-upload-events", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files.");
      }

      const data = await response.json();
      console.log(data);

      setText("");
      setSelectedFiles(null);
      setDate("");
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(
        "Wystąpił błąd podczas przesyłania plików. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  return (
    <div className={classes.addingContainer}>
      <div>
        <h4>Dodaj nowe zdjęcie i opis do eventu :)</h4>
        <p>
          Najlepiej uzyj linku ponizej wykonaj grafike i dodaj zeby zachowac
          wymiary :)
        </p>
        <Link
          target="_blank"
          href="https://www.canva.com/design/DAGPPupeqNg/jjXh3IT-WuuYFlZI8vpLNA/edit?utm_content=DAGPPupeqNg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        >
          Kliknij mnie
        </Link>

        <input
          id="fileInput"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <label htmlFor="date">Wybierz datę:</label>
        <input id="date" type="date" value={date} onChange={handleDateChange} />
      </div>

      <div>
        <textarea id="text" value={text} onChange={handleTextChange} />
      </div>

      <button onClick={handleSubmit}>Dodaj!</button>

      {isAdding && <h5>Dodawanie zdjęć trwa...</h5>}
      {loading && <p className={classes.loading}>Wczytywanie...</p>}
      {error && <p className={classes.error}>Error: {error}</p>}
      {success && <p className={classes.success}>Pomyslnie przesłano dane</p>}
    </div>
  );
}
