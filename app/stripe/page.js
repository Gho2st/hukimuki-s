"use client";
import classes from "./page.module.css";
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
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const amount = 50;

export default function Home() {
  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.logo}>
          <h1>HukiMuki</h1>
        </div>
        <h2>CLUB - 5 osób</h2>
        <p>Poziom -1</p>
        <p>Rezerwacja na godzine 21:00 w dniu 10.08.2024</p>
        <h3>{amount} PLN</h3>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount), // grosze
            currency: "pln",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
      <Footer />
    </>
  );
}
