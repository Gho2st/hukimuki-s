"use client";
import classes from "./Payment.module.css";
import CheckoutPage from "@/components/stripe/CheckoutPage";
import convertToSubcurrency from "@/components/stripe/convertToSubcurrency";
import Footer from "@/components/UI/Footer/Footer";
import Header from "@/components/UI/Header/Header";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Payment({
  title,
  lvl,
  selectedDate,
  selectedTime,
  amount,
  name,
  email,
  phone,
}) {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.logo}>
          <h1>HukiMuki</h1>
        </div>
        <h2>{title}</h2>
        <p>{lvl}</p>
        <p>
          Rezerwacja na godzine {selectedTime} w dniu
          {selectedDate.toLocaleDateString()} dla {name} z adresem mailowym{" "}
          {email} i nr {phone}
        </p>
        <h3>{amount} PLN</h3>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount), // grosze
            currency: "pln",
          }}
        >
          <CheckoutPage
            amount={amount}
            name={name}
            email={email}
            phone={phone}
          />
        </Elements>
      </div>
    </>
  );
}
