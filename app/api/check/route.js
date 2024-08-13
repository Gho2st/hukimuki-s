import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicjalizacja Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Szukaj klientów według e-maila
    const customers = await stripe.customers.list({
      email: email,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    // Pobierz płatności związane z klientem
    const payments = await stripe.charges.list({
      customer: customer.id,
    });

    // Formatowanie danych płatności do odpowiedzi
    const formattedPayments = payments.data.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      created: new Date(payment.created * 1000).toISOString(), // Konwersja na format ISO
      status: payment.status,
      receipt_url: payment.receipt_url,
      billing_details: payment.billing_details,
      payment_method_details: payment.payment_method_details,
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
