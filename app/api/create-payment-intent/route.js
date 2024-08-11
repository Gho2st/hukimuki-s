import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, phone, email, name } = await request.json();
    const description = "payment from HukiMuki Website";
    if (!amount) {
      throw new Error("Amount is required");
    }

    // Create a customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      phone: phone,
    });

    // Create a payment intent with the customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "pln",
      automatic_payment_methods: { enabled: true },
      description: description || "No description provided", // Include description if available
      customer: customer.id, // Use the customer ID
    });

    // Return the client secret
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
