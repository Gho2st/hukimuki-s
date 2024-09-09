import React, { useEffect, useState } from "react";
import convertToSubcurrency from "./convertToSubcurrency";

const Checkout = ({ amount, reservationData }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null); // State to store error

  console.log(reservationData);

  useEffect(() => {
    fetch("/api/add_reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertToSubcurrency(amount),
        reservationData: reservationData,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nie udało się potwierdzić rezerwacji");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Set the error
      });
  }, [amount, reservationData]); // Dependency array includes both amount and reservationData

  return (
    <div>
      <div role="status">
        {message && <span>{message}</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
    </div>
  );
};

export default Checkout;
