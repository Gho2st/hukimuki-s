import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, reservationData } = await request.json();

    console.log("szczegolowe dane o rezerwacji");
    console.log(reservationData);

    const itemDescription =
      reservationData.title +
      " " +
      reservationData.date +
      " " +
      reservationData.time;

    // czy to firma?
    const isCompany = reservationData.isCompany;

    // Szukaj klientów według e-maila
    const customers = await stripe.customers.list({
      email: reservationData.email,
    });

    const customerBeforeUptade = customers.data[0];

    // update danych customera zeby byly akutalne jak ktos sobie wpisze inny adres czy tam nazwe czy cokolwiek chce

    const customer = await stripe.customers.update(customerBeforeUptade.id, {
      name: reservationData.name,
      phone: "+48" + reservationData.phone,
      address: {
        city: reservationData.address,
      },
    });
    console.log(customer);

    // console.log("id klienta");
    // console.log(customers.data[0].id);

    // klient nie chce na firme wiec usuwam nip przypisany do niego zeby go nie bylo na fakturze
    if (isCompany === false) {
      const customerTaxId = await stripe.customers.listTaxIds(customer.id, {
        limit: 1,
      });

      console.log("customer tax id", customerTaxId);

      if (customerTaxId.data.length > 0) {
        const deleted = await stripe.customers.deleteTaxId(
          customer.id,
          customerTaxId.data[0].id
        );
      }
    }

    if (isCompany === true) {
      const customerTaxId = await stripe.customers.listTaxIds(customer.id, {
        limit: 1,
      });

      console.log("customer tax id", customerTaxId);

      const deleted = await stripe.customers.deleteTaxId(
        customer.id,
        customerTaxId.data[0].id
      );

      console.log(deleted);

      console.log("jest tax id (NIP wiec przypisuje do klienta)");
      const taxId = await stripe.customers.createTaxId(customer.id, {
        type: "eu_vat",
        value: reservationData.NIP,
      });
      console.log(taxId);
    }

    if (customers.data.length === 0) {
      console.log("nie ma takiego klienta");
      //utworz klienta bo nie ma takiego
      const customer = await stripe.customers.create({
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        address: {
          city: reservationData.address,
        },
      });

      if (isCompany === true) {
        console.log("jest tax id (NIP wiec przypisuje do klienta)");
        const taxId = await stripe.customers.createTaxId(customer.id, {
          type: "eu_vat",
          value: reservationData.NIP,
        });
        console.log(taxId);
      }
      //tworze fakture

      const invoice = await stripe.invoices.create({
        customer: customer.id,
        metadata: {
          name: reservationData.name,
          email: reservationData.email,
          phone: reservationData.phone,
          title: reservationData.title,
          isClub: reservationData.isClub,
          isCompany: reservationData.isCompany,
          date: reservationData.date,
          time: reservationData.time,
        },
      });
      // console.log("utworzona fakturka");
      // console.log(invoice);

      // tworze info o podatku
      const taxRate = await stripe.taxRates.create({
        display_name: "VAT",
        description: "VAT Polska",
        percentage: 23,
        jurisdiction: "PL",
        inclusive: true,
      });
      // console.log("utworzylem tax z 23%");
      // console.log(taxRate);

      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,
        amount: amount,
        currency: "pln",
        description: itemDescription,
        invoice: invoice.id,
        tax_rates: [taxRate.id],
      });

      // console.log(invoiceItem);
      // console.log("biore teraz nowa fakture z dodanym itemem i wyswietlam");
      // // console.log(invoiceItem.invoice);
      // console.log("teraz finalizuje ta fakture");

      const invoiceFinalized = await stripe.invoices.finalizeInvoice(
        invoiceItem.invoice
      );

      // console.log("sfinalizowana faktura");
      // console.log(invoiceFinalized);

      const invoice_link_to_pay = invoiceFinalized.hosted_invoice_url;

      // console.log(invoice_link_to_pay);

      return NextResponse.json({ invoice_url: invoice_link_to_pay });
    }

    // console.log("teraz proba utworzenia fakturki");
    //tworze fakture

    const invoiceBeforeUpdate = await stripe.invoices.create({
      customer: customer.id,
    });
    // console.log("utworzona fakturka");

    const invoice = await stripe.invoices.update(invoiceBeforeUpdate.id, {
      metadata: {
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        title: reservationData.title,
        isClub: reservationData.isClub,
        isCompany: reservationData.isCompany,
        date: reservationData.date,
        time: reservationData.time,
      },
    });

    // tworze info o podatku
    const taxRate = await stripe.taxRates.create({
      display_name: "VAT",
      description: "VAT Polska",
      percentage: 23,
      jurisdiction: "PL",
      inclusive: true,
    });
    // console.log("utworzylem tax z 23%");
    // console.log(taxRate);

    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      amount: amount,
      currency: "pln",
      description: itemDescription,
      invoice: invoice.id,
      tax_rates: [taxRate.id],
    });

    // console.log(invoiceItem);
    // console.log("biore teraz nowa fakture z dodanym itemem i wyswietlam");
    // // console.log(invoiceItem.invoice);
    // console.log("teraz finalizuje ta fakture");

    const invoiceFinalized = await stripe.invoices.finalizeInvoice(
      invoiceItem.invoice
    );

    // console.log("sfinalizowana faktura");
    // console.log(invoiceFinalized);

    const invoice_link_to_pay = invoiceFinalized.hosted_invoice_url;

    // console.log(invoice_link_to_pay);

    return NextResponse.json({ invoice_url: invoice_link_to_pay });

    // return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
