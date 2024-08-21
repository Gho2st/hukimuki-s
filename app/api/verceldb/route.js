import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const client = await db.connect();

    console.log("Udało się połączyć");

    // Tworzenie tabeli, jeśli nie istnieje
    await client.sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        name VARCHAR(255) NOT NULL,
        time TIME NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        title VARCHAR(255),
        isClub BOOLEAN,
        isCompany BOOLEAN
      );
    `;

    // Wstawianie przykładowego rekordu
    await client.sql`
      INSERT INTO reservations (
        date, name, time, email, phone, title, isClub, isCompany
      ) VALUES (
        '2024-08-23', 
        'Dominik Jojczyk', 
        '21:30:00', 
        'dominik.jojczyk@gmail.com', 
        '576985894', 
        'CLUB - 8 osób', 
        true, 
        false
      );
    `;

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas łączenia z bazą danych:", error);
    return NextResponse.json({ message: "connection failed" }, { status: 500 });
  }
}
