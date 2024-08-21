// import { db } from "@vercel/postgres";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const client = await db.connect();

//     console.log("Udało się połączyć");

//     // Tworzenie tabeli, jeśli nie istnieje
//     await client.sql`
//       DELETE FROM reservations WHERE id = 4;
//     `;

//     return NextResponse.json({ message: "success" }, { status: 200 });
//   } catch (error) {
//     console.error("Błąd podczas łączenia z bazą danych:", error);
//     return NextResponse.json({ message: "connection failed" }, { status: 500 });
//   }
// }
