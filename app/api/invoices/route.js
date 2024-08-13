import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount } = await request.json();

    console.log("szukam klientow wedlug maila");

    // Szukaj klientów według e-maila
    const customers = await stripe.customers.list({
      email: "domispys@gmail.com",
    });

    console.log(customers);

    if (customers.data.length === 0) {
      console.log("puste");
      console.log("jest puste wiec tworze klienta");
      //utworz klienta
      const customer = await stripe.customers.create({
        name: "Dominis Pys",
        email: "dominispys@gmail.com",
      });
      console.log("klient utworzony");
      console.log(customer);
      console.log("id customera to", customer.id);

      console.log("czas na kolejne kroki");

      console.log("teraz proba utworzenia fakturki");

      const invoice = await stripe.invoices.create({
        customer: customer.id,
      });
      console.log("utworzona fakturka");
      console.log(invoice);

      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,
        amount: "25000",
        currency: "pln",
        description: "Club Huki Muki rezerwacja na 17/05 5 osob",
        invoice: invoice.id,
      });

      console.log(invoiceItem);

      console.log("biore teraz nowa fakture z dodanym itemem i wyswietlam");

      console.log(invoiceItem.invoice);

      console.log("teraz finalizuje ta fakture");

      const invoiceFinalized = await stripe.invoices.finalizeInvoice(
        invoiceItem.invoice
      );

      console.log(invoiceFinalized);
    }
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount,
    //   currency: "usd",
    //   automatic_payment_methods: { enabled: true },
    // });

    // return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    return NextResponse.json("hej");
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
