import React from "react";

export default function PaymentSuccess({ searchParams }) {
  const { amount } = searchParams;

  return (
    <div>
      <h1>Thank you</h1>
      <h2>You successfully sent {amount}$</h2>
    </div>
  );
}
