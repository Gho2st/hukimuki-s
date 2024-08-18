import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const origin = "http://localhost:3000/";
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: "price_1Pn1BoRwn5zu4BcqEy9b3McI",
          quantity: 1,
        },
      ],
      tax_id_collection: {
        enabled: true,
      },
      mode: "payment",
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
    });
    console.log("Session created:", session);

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Error creating session:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
