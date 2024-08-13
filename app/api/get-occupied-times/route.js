import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  const { date, title } = await request.json();

  console.log("Received date:", date);
  console.log("received title:", title);

  const localDate = new Date(date);
  const formattedDate = localDate.toISOString().slice(0, 10); // "YYYY-MM-DD"

  console.log("Formatted date:", formattedDate);

  try {
    const selectQuery = `
      SELECT TIME_FORMAT(time, '%H:%i') as time
      FROM reservations 
      WHERE DATE = ? AND TITLE = ?;
    `;

    const results = await query(selectQuery, [formattedDate, title]);
    console.log("Query results:", results);
    const occupiedTimes = Array.isArray(results)
      ? results.map((row) => row.time) // Mapuj każdą `time` wiersza do nowej tablicy
      : [];

    console.log("Occupied times array:", occupiedTimes);

    return NextResponse.json({ occupiedTimes });
  } catch (error) {
    console.error("Error fetching occupied times:", error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
