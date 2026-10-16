// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Websites allowed to call this API.
// CLIENT_URL will be your Vercel URL (set later in Render's environment variables).
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check (open the server's main URL to confirm it's running)
app.get("/", (req, res) => {
  res.send("movtv API is running");
});

// GET all movies
app.get("/api/movies", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, year, genre,
              thumbnail_url, video_url, created_at
       FROM movies
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching movies", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single movie
app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, description, year, genre,
              thumbnail_url, video_url, created_at
       FROM movies
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching movie", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});