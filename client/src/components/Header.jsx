import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">mov<span>tv</span></div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
      </nav>
    </header>
  );
}
