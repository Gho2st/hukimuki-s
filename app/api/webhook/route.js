import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  console.log("hej tu api/webhook");
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("invalid signature", { status: 400 });
  }

  const session = event.data.object;
  //   console.log("session", session);

  //   if (event.type === "invoice.paid") {
  //     console.log("payment was successful for user");
  //     console.log(event);
  //   }
  if (event.type === "invoice.payment_succeeded") {
    console.log("payment was succesffull");
    console.log(event);
    console.log(event.data.object.metadata);

    const data = event.data.object.metadata;

    console.log("Testing database connection");

    console.log(data);

    try {
      // Zamiana wartości na boolean
      data.isClub = data.isClub === "true" || data.isClub === true ? 1 : 0;
      data.isCompany =
        data.isCompany === "true" || data.isCompany === true ? 1 : 0;

      console.log(data); // Zapisz wynik do konsoli, aby sprawdzić

      // Przygotowanie zapytania SQL do dodania danych
      const insertQuery = `
        INSERT INTO reservations (date, name, time, email, phone, title, isClub, isCompany) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.date,
        data.name,
        data.time,
        data.email,
        data.phone,
        data.title,
        data.isClub,
        data.isCompany,
      ];

      // Wykonanie zapytania
      const results = await query(insertQuery, values);
      console.log("Query results:", results);

      // Zwracanie pozytywnej odpowiedzi
      return NextResponse.json({
        message: "Data added successfully!",
        data: results,
      });
    } catch (error) {
      console.log("Error: ", error);

      // Zwracanie błędu w odpowiedzi
      return NextResponse.json(
        {
          message: "An error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }

  return new NextResponse("ok", { status: 200 });
}
