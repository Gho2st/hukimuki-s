import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { text, fullName, email, phoneNumber } = await request.json();

    if (!email || !text || !phoneNumber || !fullName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

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

    const mailOption = {
      from: "hukimuki.rezerwacje@gmail.com",
      to: "hukimukiflorianska@gmail.com",
      subject: "Email ze strony HukiMuki od klienta",
      html: `
        <h2>Wiadomosc od klienta ze strony HukiMuki</h2>
        <li> Imię i Nazwisko: ${fullName}</li>
        <li> Wiadomość: ${text}</li>
        <li> Email: ${email}</li>
        <li> Numer Telefonu:: ${phoneNumber}</li>   
        `,
    };

    await transporter.sendMail(mailOption);

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Send Email" },
      { status: 500 }
    );
  }
}
