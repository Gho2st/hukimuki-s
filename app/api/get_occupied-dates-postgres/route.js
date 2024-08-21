import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function POST(request) {
  const { title } = await request.json();

  console.log("Received title:", title);

  try {
    // Dostosowane zapytanie SQL do formatu 'YYYY-MM-DD' w PostgreSQL
    const selectQuery = `
      SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date
      FROM reservations 
      WHERE title = $1;
    `;

    const { rows: results } = await db.query(selectQuery, [title]);
    console.log("Query results:", results);

    const occupiedTimes = Array.isArray(results)
      ? results.map((row) => row.date) // Row.date powinno być już w formacie 'YYYY-MM-DD'
      : [];

    console.log("Occupied times array:", occupiedTimes);

    return NextResponse.json({ occupiedTimes });
  } catch (error) {
    console.error("Error fetching occupied Times:", error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
