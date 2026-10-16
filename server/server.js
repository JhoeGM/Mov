import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Add development localhost origins and any CLIENT_URL(s) from environment.
// CLIENT_URL can be a single origin or a comma-separated list of origins.
// You can also set CLIENT_URL="*" for testing (not recommended for production).
const devOrigins = ["http://localhost:3000", "http://localhost:5173"];
const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...devOrigins, ...envOrigins];

// CORS options: allow requests with no origin (server-side tools) and any origin in allowedOrigins.
// If CLIENT_URL is "*", allow all origins (for quick testing only).
const corsOptions = {
  origin: (origin, callback) => {
    // No origin (curl, server-to-server) — allow
    if (!origin) return callback(null, true);

    // Allow-all testing mode
    if (allowedOrigins.includes("*")) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Not allowed
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("movtv API is running");
});

// GET all movies
app.get("/api/movies", async (req, res, next) => {
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
    next(err);
  }
});

// GET single movie
app.get("/api/movies/:id", async (req, res, next) => {
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
    next(err);
  }
});

// Global error handler (converts CORS errors and others into responses)
app.use((err, req, res, next) => {
  if (err) {
    console.error("Unhandled error:", err.message || err);

    // CORS error (thrown by our corsOptions callback)
    if (err.message && err.message.includes("Not allowed by CORS")) {
      return res.status(403).json({ error: "CORS error: origin not allowed" });
    }

    // Generic server error
    return res.status(500).json({ error: "Internal server error" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins.length ? allowedOrigins.join(", ") : "(none)");
});