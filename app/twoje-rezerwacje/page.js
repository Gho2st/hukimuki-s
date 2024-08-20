"use client";

import { useState } from "react";

export default function Reservations() {
  const [email, setEmail] = useState("");
  const [reservationData, setReservationData] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/get_reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const data = await response.json();
        setReservationData(data);
      } else {
        console.error("Error fetching reservations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Sprawdź swoje rezerwacje</h1>
      <form onSubmit={handleSubmit}>
        <label>Podaj maila</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <button type="submit">Sprawdź rezerwacje</button>
      </form>
      {reservationData && (
        <div>
          <h2>Twoje rezerwacje:</h2>
        </div>
      )}
    </>
  );
}
