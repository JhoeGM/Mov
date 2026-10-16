import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-thumb">
        <img src={movie.thumbnail_url} alt={movie.title} />
      </div>
      <div className="movie-title">{movie.title}</div>
    </Link>
  );
}
