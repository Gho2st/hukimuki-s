import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function getOrCreateCustomer(reservationData) {
  const customers = await stripe.customers.list({ email: reservationData.email });

  if (customers.data.length > 0) {
    return customers.data[0];
  } else {
    return await stripe.customers.create({
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      address: {
        city: reservationData.city,
        country: reservationData.country,
        line1: reservationData.line1,
        line2: reservationData.line2,
        postal_code: reservationData.postal_code,
        state: reservationData.state,
      },
    });
  }
}

async function updateCustomer(customer, reservationData) {
  return await stripe.customers.update(customer.id, {
    name: reservationData.name,
    phone: "+48" + reservationData.phone,
    address: {
      city: reservationData.city,
      country: reservationData.country,
      line1: reservationData.line1,
      line2: reservationData.line2,
      postal_code: reservationData.postal_code,
      state: reservationData.state,
    },
  });
}

async function manageTaxId(customer, reservationData, isCompany) {
  if (!isCompany) {
    try {
      const taxIdList = await stripe.customers.listTaxIds(customer.id, { limit: 1 });
      if (taxIdList.data.length > 0) {
        await stripe.customers.deleteTaxId(customer.id, taxIdList.data[0].id);
      }
    } catch (error) {
      console.error("Error removing tax ID:", error);
    }
  } else {
    try {
      const taxIdList = await stripe.customers.listTaxIds(customer.id, { limit: 1 });
      if (taxIdList.data.length > 0) {
        await stripe.customers.deleteTaxId(customer.id, taxIdList.data[0].id);
      }
      if (reservationData.NIP) {
        await stripe.customers.createTaxId(customer.id, {
          type: "eu_vat",
          value: reservationData.NIP,
        });
      }
    } catch (error) {
      console.error("Error managing tax ID:", error);
    }
  }
}

async function createInvoice(customer, amount, itemDescription, reservationData) {
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

  const taxRate = await stripe.taxRates.create({
    display_name: "VAT",
    description: "VAT Polska",
    percentage: 23,
    jurisdiction: "PL",
    inclusive: true,
  });

  const invoiceItem = await stripe.invoiceItems.create({
    customer: customer.id,
    amount: amount,
    currency: "pln",
    description: itemDescription,
    invoice: invoice.id,
    tax_rates: [taxRate.id],
  });

  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoiceItem.invoice);

  return finalizedInvoice.hosted_invoice_url;
}

export async function POST(request) {
  try {
    const { amount, reservationData } = await request.json();
    const itemDescription = `${reservationData.title} ${reservationData.date} ${reservationData.time}`;
    const isCompany = reservationData.isCompany;

    let customer = await getOrCreateCustomer(reservationData);
    if (customer.id) {
      customer = await updateCustomer(customer, reservationData);
    }

    await manageTaxId(customer, reservationData, isCompany);
    
    const invoiceUrl = await createInvoice(customer, amount, itemDescription, reservationData);

    return NextResponse.json({ invoice_url: invoiceUrl });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
