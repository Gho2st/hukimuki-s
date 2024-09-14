import { NextRequest, NextResponse } from "next/server";
import { db } from "@vercel/postgres";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parsing the request body
    const { amount, reservationData } = await request.json();
    // const NIP = reservationData.NIP;
    // console.log("Testing database connection");

    const amountCalculated = amount / 100;

    // Assume 'reservationData' contains all the required fields
    const data = reservationData;

    // Converting values to boolean
    const isClub = data.isClub === "true" || data.isClub === true;
    const isCompany = data.isCompany === "true" || data.isCompany === true;

    // console.log({ ...data, isClub, isCompany }); // Log transformed data

    // // SQL query to insert data
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
      from: "hukimuki.rezerwacje@gmail.com",
      // to: `${data.email}, hukimukiflorianska@gmail.com`,
      to: "jestemfajny1244@gmail.com",
      subject: "Potwierdzenie Rezerwacji w Huki Muki",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <div style="text-align: center;">
        <h1 style="color: #2c974b; font-size: 24px;">Potwierdzenie Rezerwacji</h1>
        <p style="font-size: 18px; color: #555;">w Huki Muki</p>
      </div>
      <hr style="border: none; height: 1px; background-color: #ddd;">
      <div style="margin: 20px 0;">
        <h2 style="color: #333;">Rezerwacja: ${data.title}</h2>
        <p style="font-size: 16px; color: #555;">Kwota: <strong>${amountCalculated} zł</strong></p>
        <p style="font-size: 16px; color: #555;">Data i czas: <strong>${data.date} o godz. ${data.time}</strong></p>
      </div>
      <div style="background-color: #f7f7f7; padding: 10px 20px; border-radius: 8px;">
        <h3 style="color: #2c974b; font-size: 18px;">Dane Klienta:</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong> ${data.name}</strong></li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Numer Telefonu:</strong> ${data.phone}</li>
        </ul>
      </div>
      <br>
      <hr style="border: none; height: 1px; background-color: #ddd;">
      <footer style="font-size: 14px; color: #555; text-align: center;">
        <p style="margin-bottom: 10px;">Serdecznie dziękujemy za wybór Huki Muki. Czekamy na Państwa w dniu rezerwacji!</p>
        <p style="margin-bottom: 5px;">Huki Muki, Floriańska 26, Kraków</p>
        <p style="margin-bottom: 5px;">Telefon: +48 509 542 802</p>
        <p>Email: <a href="mailto:hukimukiflorianska@gmail.com" style="color: #007BFF;">hukimukiflorianska@gmail.com</a></p>
        <br>
        <img src="cid:logo" alt="Huki Muki Logo" style="width: 250px; height: auto; margin-top: 20px;" />
      </footer>
    </div>
  `,
      attachments: [
        {
          filename: "logo.png",
          path: "https://hukimuki.pl/logo.png", // ścieżka do logo
          cid: "logo", // cid musi się zgadzać z wartością w img src
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return successful response
    return NextResponse.json({
      message: "Rezerwacja gotowa, mail z potwierdzeniem przesłany pomyślnie.",
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
