import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  const { title } = await request.json();

  console.log("Received title:", title);

  try {
    // Dostosowane zapytanie SQL do formatu 'YYYY-MM-DD'
    const selectQuery = `
      SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date
      FROM reservations 
      WHERE TITLE = ?;
    `;

    const results = await query(selectQuery, [title]);
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
