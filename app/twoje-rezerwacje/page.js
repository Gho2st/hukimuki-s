"use client";
import { useState } from "react";
import Header from "@/components/UI/Header/Header";
import Footer from "@/components/UI/Footer/Footer";
import classes from "./page.module.css";

export default function TwojeRezerwacje() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [isSubmitted, setIsSubmitted] = useState(false); // State to manage form submission

  const handleFetchPayments = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true); // Mark the form as submitted

    try {
      const response = await fetch(`/api/check?email=${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data.payments);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      setPayments([]); // Clear previous payments on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={classes.container}>
        <h1>Twoje Rezerwacje</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button onClick={handleFetchPayments} disabled={isLoading}>
          {isLoading ? "Loading..." : "Sprawdź"}
        </button>
        {error && <p>Error: {error}</p>}
        {isSubmitted && !isLoading && payments.length === 0 && !error && (
          <p>No payments found.</p>
        )}
        {payments.length > 0 && (
          <ul>
            {payments.map((payment) => (
              <li key={payment.id}>
                <p>ID: {payment.id}</p>
                <p>
                  Amount: {payment.amount / 100}{" "}
                  {payment.currency.toUpperCase()}
                </p>
                <p>Status: {payment.status}</p>
                <p>Created: {new Date(payment.created).toLocaleDateString()}</p>
                <p>
                  Receipt URL:{" "}
                  <a
                    href={payment.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Receipt
                  </a>
                </p>
                <p>
                  Billing Details: {JSON.stringify(payment.billing_details)}
                </p>
                <p>
                  Payment Method Details:{" "}
                  {JSON.stringify(payment.payment_method_details)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
