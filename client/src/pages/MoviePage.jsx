import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovie() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/movies/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load movie.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-page" style={{ padding: "2rem" }}>
        Loading…
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-page" style={{ padding: "2rem" }}>
        <p style={{ color: "tomato" }}>{error || "Movie not found."}</p>
        <Link to="/" style={{ color: "cyan" }}>
          ← Back to home
        </Link>
      </div>
    );
  }

  // 🔍 Decide how to render the video (YouTube iframe vs normal <video>)
  const isYouTube =
    movie.video_url?.includes("youtube.com") ||
    movie.video_url?.includes("youtu.be");

  const videoSrc = movie.video_url;

  return (
    <div className="movie-page">
      <div className="video-wrapper">
        {isYouTube ? (
          <iframe
            src={videoSrc}
            className="video-player"
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video src={videoSrc} controls className="video-player">
            Sorry, your browser doesn&apos;t support video playback.
          </video>
        )}
      </div>

      <div className="movie-details-bar">
        <div className="movie-details-left">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="movie-page-thumb"
          />
          <div>
            <h1>{movie.title}</h1>
            <p className="movie-meta">
              {movie.genre && <span>{movie.genre} · </span>}
              {movie.year && <span>{movie.year}</span>}
            </p>
            {movie.description && (
              <p className="movie-description">{movie.description}</p>
            )}
          </div>
        </div>

        <div className="movie-details-actions">
          <Link to="/" style={{ color: "cyan" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
