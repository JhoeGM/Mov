import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(location.search);
    const q = params.get("q");

    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        const url = q
          ? `${API_BASE}/api/movies?q=${encodeURIComponent(q)}`
          : `${API_BASE}/api/movies`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load movies.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [location.search]);

  return (
    <div className="home">
      <h2 className="section-title">Latest Releases</h2>

      {loading && <p style={{ padding: "0 2rem" }}>Loading…</p>}
      {error && (
        <p style={{ padding: "0 2rem", color: "tomato" }}>{error}</p>
      )}
      {!loading && !error && movies.length === 0 && (
        <p style={{ padding: "0 2rem" }}>No movies found.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
