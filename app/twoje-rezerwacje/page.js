"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./page.module.css";

export default function Reservations({ which }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("dominik.jojczyk@gmail.com");

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/get_reservations?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [email]);

  if (loading) return <p className={classes.loading}>Wczytywanie..</p>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <div>
      <h1>Twoje rezerwacje</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Wprowadź swój email"
      />
      <button onClick={fetchReservations}>Fetch Reservations</button>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>{reservation.details}</li>
          ))}
        </ul>
      ) : (
        <p>Brak rezerwacji</p>
      )}
    </div>
  );
}
