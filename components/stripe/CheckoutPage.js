import React, { useEffect, useState } from "react";
import convertToSubcurrency from "./convertToSubcurrency";
import Link from "next/link";

const CheckoutPage = ({ amount, reservationData }) => {
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [error, setError] = useState(null); // Stan do przechowywania błędu

  console.log(reservationData);

  useEffect(() => {
    fetch("/api/invoices", {
      mode: "no-cors",
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
          throw new Error("Nie udało się utworzyć linku do płatności.");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setInvoiceUrl(data.invoice_url);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Ustawienie błędu
      });
  }, [amount, reservationData]); // Add reservationData to the dependency array

  return (
    <div>
      <div role="status">
        {!invoiceUrl && !error && (
          <span>Wczytywanie linku do płatności...</span>
        )}
        {invoiceUrl && <Link href={invoiceUrl}>Zapłać</Link>}
        {error && <span style={{ color: "red" }}>{error}</span>}{" "}
        {/* Wyświetlenie błędu */}
      </div>
    </div>
  );
};

export default CheckoutPage;
