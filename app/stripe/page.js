"use client";
import CheckoutPage from "@/components/stripe/CheckoutPage";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const amount = 250; // Amount in dollars
  const searchParams = useSearchParams();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const validToken = "token"; // This should be dynamic in a real application

    if (token === validToken) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, [searchParams]);

  if (!isAllowed) {
    return <p>The payment page is no longer valid.</p>;
  }

  return (
    <main>
      <div>
        <h1>HukiMuki</h1>
        <h2>
          Potwierdz swoja rezerwacje :)
          <span> ${amount}</span>
        </h2>
      </div>
      {/* <CheckoutPage amount={amount} /> */}
    </main>
  );
}
