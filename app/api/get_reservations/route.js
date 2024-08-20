import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  const data = await request.json();
  console.log(data);
  try {
    // Dostosowane zapytanie SQL do formatu 'YYYY-MM-DD'
    const selectQuery = `
      SELECT *
      FROM reservations
      WHERE EMAIL = ?;
    `;

    const results = await query(selectQuery, [data.email]);
    console.log("Query results:", results);

    return NextResponse.json({ results });
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
