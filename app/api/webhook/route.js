import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
// import { query } from "@/lib/db"; nieaktulane bo chce postgres
import { db } from "@vercel/postgres";

export async function POST(req) {
  console.log("hej tu api/webhook");
  console.log(process.env.STRIPE_WEBHOOK_SECRET);
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  console.log(signature);

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
      const isClub =
        data.isClub === "true" || data.isClub === true ? true : false;
      const isCompany =
        data.isCompany === "true" || data.isCompany === true ? true : false;

      console.log({ ...data, isClub, isCompany }); // Zapisz wynik do konsoli, aby sprawdzić

      // Przygotowanie zapytania SQL do dodania danych
      const insertQuery = `
        INSERT INTO reservations (date, name, time, email, phone, title, isclub, iscompany)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      const values = [
        data.date,
        data.name,
        data.time,
        data.email,
        data.phone,
        data.title,
        isClub,
        isCompany,
      ];

      // Wykonanie zapytania
      const result = await db.query(insertQuery, values);
      console.log("Query results:", result);

      // Zwracanie pozytywnej odpowiedzi
      return NextResponse.json({
        message: "Data added successfully!",
        data: result,
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
