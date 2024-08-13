import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Załaduj zmienne środowiskowe z pliku .env

// Skonfiguruj połączenie do bazy danych
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306, // Domyślny port MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};
