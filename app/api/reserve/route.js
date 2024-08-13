import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  console.log("Testing database connection");

  try {
    // Parsowanie danych z ciała żądania
    const data = await request.json();
    console.log("Received data:", data);

    // Przekształcanie daty z formatu DD/MM/YYYY na YYYY-MM-DD
    const [day, month, year] = data.date.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    // Przygotowanie zapytania SQL do dodania danych
    const insertQuery = `
      INSERT INTO reservations (date, name, time, email, phone, title, isClub) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      formattedDate,
      data.name,
      data.time,
      data.email,
      data.phone,
      data.title,
      data.isClub,
    ];

    // Wykonanie zapytania
    const results = await query(insertQuery, values);
    console.log("Query results:", results);

    // Zwracanie pozytywnej odpowiedzi
    return NextResponse.json({
      message: "Data added successfully!",
      data: results,
    });
  } catch (error) {
    console.log("Error: ", error);

    // Zwracanie błędu w odpowiedzi
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
