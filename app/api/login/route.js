// pages/api/login.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // Możesz użyć tokenów sesji, cookies lub innych metod do zarządzania autoryzacją
    return NextResponse.json({ message: "Pomyślne logowanie" });
  } else {
    return NextResponse.json(
      { message: "Nieprawidłowe hasło" },
      { status: 401 }
    );
  }
}
