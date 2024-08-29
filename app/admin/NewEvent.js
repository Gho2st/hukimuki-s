"use client";

import { useState } from "react";
import classes from "./NewEvent.module.css";
import Link from "next/link";

export default function NewEvent() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [text, setText] = useState("");
  const [date, setDate] = useState(""); // Use an empty string for date initially
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const which = "events";

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files); // Store selected files
  };

  const handleTextChange = (event) => {
    setText(event.target.value); // Store text input
  };

  const handleDateChange = (event) => {
    setDate(event.target.value); // Store date input
  };

  const handleSubmit = async () => {
    setIsAdding(true);
    setLoading(true);
    setError(null);
    // Validation: Ensure all fields are filled
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Proszę wybierz zdjęcie.");
      return;
    }

    if (!text.trim()) {
      setError("Proszę dodaj jakiś opis.");
      return;
    }

    if (!date) {
      setError("Proszę wybierz jakąś datę.");
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
    formData.append("date", date); // Add date to FormData

    try {
      const response = await fetch("/api/s3-upload-events", {
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
      setDate(""); // Reset date
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      setError("Failed to upload files.");
    } finally {
      setLoading(false);
      setSuccess(true);
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
          onChange={handleFileChange} // Capture files
          multiple // Allow multiple file selection
        />
      </div>

      <div>
        <label htmlFor="date">Wybierz datę:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={handleDateChange} // Capture date
        />
      </div>

      <div>
        <textarea
          id="text"
          value={text}
          onChange={handleTextChange} // Capture text
        />
      </div>

      <button onClick={handleSubmit}>Dodaj!</button>

      {isAdding && <h5>Dodawanie zdjęć trwa...</h5>}
      {loading && <p className={classes.loading}>Wczytywanie...</p>}
      {error && <p className={classes.error}>Error: {error}</p>}
      {success && <p className={classes.success}>pomyslnie przeslano dane</p>}
    </div>
  );
}
