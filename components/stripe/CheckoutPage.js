"use client";

import React, { useEffect, useState } from "react";
import convertToSubcurrency from "./convertToSubcurrency";
import Link from "next/link";

const CheckoutPage = ({ amount, reservationData }) => {
  const [invoice_url, setInvoiceUrl] = useState("");
  console.log(reservationData);

  useEffect(() => {
    fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertToSubcurrency(amount),
        reservationData: reservationData,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        console.log(data);
        setInvoiceUrl(data.invoice_url);
      });
  }, [amount]);

  return (
    <div>
      <div role="status">
        {!invoice_url && <span>Wczytywanie linku do płatności</span>}
        {invoice_url && <Link href={invoice_url}>Zapłać</Link>}
      </div>
    </div>
  );
};

export default CheckoutPage;
