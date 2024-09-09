import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parsing the request body
    const { amount, reservationData } = await request.json();

    console.log("Testing database connection");

    // Assume 'reservationData' contains all the required fields
    const data = reservationData;

    // Converting values to boolean
    const isClub = data.isClub === "true" || data.isClub === true;
    const isCompany = data.isCompany === "true" || data.isCompany === true;

    console.log({ ...data, isClub, isCompany }); // Log transformed data

    // SQL query to insert data
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

    // Execute SQL query
    const result = await db.query(insertQuery, values);
    console.log("Query results:", result);

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    // Prepare email options
    const mailOptions = {
      from: "biosite.praca@gmail.com",
      to: `${data.email}, jestemfajny1244@gmail.com`,
      subject: "Rezerwacja Huki Muki",
      html: `
        <h2>Rezerwacja ${data.title} na ${data.time} w dniu ${data.date}</h2>
        <ul>
          <li>Imię i Nazwisko: ${data.name}</li>
          <li>Email: ${data.email}</li>
          <li>Numer Telefonu: ${data.phone}</li>
        </ul>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return successful response
    return NextResponse.json({
      message: "Rezerwaja gotowa, mail z potwierdzeniem przesłany pomyślnie.",
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
