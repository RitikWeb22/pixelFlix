import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMovies } from "../hooks/useMovies";
import "../styles/catalog.scss";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const getPosterUrl = (movie) => {
  if (movie.poster_path) {
    return `${TMDB_IMAGE_BASE}${movie.poster_path}`;
  }

  if (movie.backdrop_path) {
    return `${TMDB_IMAGE_BASE}${movie.backdrop_path}`;
  }

  return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80";
};

const MyList = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { myList, toggleMyList } = useMovies();
  const movieOnlyList = myList.filter((item) => item?.media_type !== "tv");

  const handleNavigate = (target) => {
    if (target === "home") navigate("/");
    if (target === "movies") navigate("/movies");
    if (target === "my-list") navigate("/my-list");
    if (target === "watch-later") navigate("/watch-later");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <main className="catalog-page my-list-page">
      <div className="catalog-glow" aria-hidden="true" />
      <Navbar
        isAuthView={false}
        activeLink="my-list"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <section className="catalog-header">
        <p className="catalog-kicker">Saved Picks</p>
        <h1>My List</h1>
        <p>All your bookmarked titles in one cinematic shelf.</p>
      </section>

      {movieOnlyList.length === 0 ? (
        <section className="catalog-empty">
          <h2>Your list is empty</h2>
          <p>
            Open movies and tap "My List" to start building your watch queue.
          </p>
          <button
            className="btn btn-lg"
            type="button"
            onClick={() => navigate("/movies")}
          >
            Browse Movies
          </button>
        </section>
      ) : (
        <section className="catalog-grid" aria-live="polite">
          {movieOnlyList.map((movie) => (
            <article className="catalog-card" key={movie.id}>
              <img
                src={getPosterUrl(movie)}
                alt={movie.title || movie.name || "Movie poster"}
                loading="lazy"
                onClick={() => navigate(`/movie/${movie.id}`)}
              />

              <div className="catalog-meta">
                <h3>{movie.title || movie.name || "Untitled"}</h3>
                <p>{movie.release_date || "Unknown release date"}</p>
              </div>

              <div className="catalog-actions">
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  Open
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  type="button"
                  onClick={() => toggleMyList(movie)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyList;
