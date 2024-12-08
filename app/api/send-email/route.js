import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Funkcja weryfikująca token reCAPTCHA
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY; // Secret Key reCAPTCHA
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success;
}

export async function POST(request) {
  try {
    const { text, fullName, email, phoneNumber, recaptchaToken } =
      await request.json();

    if (!email || !text || !phoneNumber || !fullName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Weryfikacja reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    console.log("Weryfikacja reCAPTCHA:", recaptchaValid); // Sprawdzamy wynik weryfikacji
    if (!recaptchaValid) {
      console.error("Nieudana weryfikacja reCAPTCHA"); // Dodaj logowanie
      return NextResponse.json(
        { message: "Weryfikacja reCAPTCHA nie powiodła się." },
        { status: 400 }
      );
    }

    // konfiguracja transporteru STMP
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
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #4CAF50; text-align: center;">Nowa wiadomość od klienta ze strony HukiMuki</h2>
          <p style="font-size: 16px; color: #555;">Otrzymałeś wiadomość od klienta:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Imię i Nazwisko:</strong> ${fullName}
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Wiadomość:</strong> ${text}
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a>
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Numer Telefonu:</strong> ${phoneNumber}
            </li>
          </ul>
          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
            <em>Wiadomość wygenerowana automatycznie przez formularz kontaktowy strony HukiMuki.</em>
          </p>
        </div>
      `,
    };


    // wysylka wiadomosci email
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
