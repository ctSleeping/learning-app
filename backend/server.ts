import "dotenv/config";
import mysql from "mysql2/promise";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import express from "express";
import cors from "cors";

type LearningEntryData = {
  id: number;
  topic: string;
  date: string;
  learned: string;
  confidence: number;
  personalthoughts: string; // Flip 2 property
};

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});
const PORT = 3001;

const entries: LearningEntryData[] = [
  {
    id: 1,
    topic: "React Components",
    date: "2026-10-22",
    learned: "Components help us reuse UI code.",
    confidence: 3,
    personalthoughts: "very nice, yes",
  },
  {
    id: 2,
    topic: "React State",
    date: "2026-10-27",
    learned: "State lets the interface react to changes.",
    confidence: 2,
    personalthoughts: "rock solid, yes",
  },
  {
    id: 3,
    topic: "Backending",
    date: "2026-10-29",
    learned: "Basics of backend",
    confidence: 2,
    personalthoughts: "Seems complicated.",
  },
];

app.get("/api/entries", async (req, res) => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, topic, entry_date AS date, learned, confidence,
              COALESCE(personal_thoughts, '') AS personalthoughts
       FROM learning_entries
       ORDER BY id`
    );
    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Could not load entries" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

app.post("/api/entries", async (req, res) => {
  const { topic, date, learned, confidence, personalthoughts } = req.body;

  if (typeof topic !== "string" || !topic.trim() ||
      typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof learned !== "string" || !learned.trim() ||
      !Number.isInteger(confidence) || confidence < 1 || confidence > 5 ||
      typeof personalthoughts !== "string") {
    return res.status(400).json({ error: "Invalid learning entry" });
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO learning_entries
       (topic, entry_date, learned, confidence, personal_thoughts)
       VALUES (?, ?, ?, ?, ?)`,
      [topic.trim(), date, learned.trim(), confidence, personalthoughts.trim() || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Could not save entry:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Could not save entry" });
  }
});