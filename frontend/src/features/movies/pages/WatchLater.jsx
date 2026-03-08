import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import { getHistory } from "../api/history.api";
import { fetchMovieDetails, fetchCustomMovieById } from "../api/movie.api";
import "../styles/catalog.scss";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const getPosterUrl = (movie) => {
  // Check if it's a custom movie with direct URL
  if (
    movie.isCustom &&
    movie.poster_path &&
    !movie.poster_path.startsWith("/")
  ) {
    return movie.poster_path;
  }

  if (movie.poster_path) {
    return `${TMDB_IMAGE_BASE}${movie.poster_path}`;
  }

  if (movie.backdrop_path) {
    return `${TMDB_IMAGE_BASE}${movie.backdrop_path}`;
  }

  return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80";
};

const WatchLater = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const historyData = await getHistory(token);

        // Fetch movie details for each movieId in history
        const moviePromises = historyData.map(async (item) => {
          try {
            // Check if it's a custom movie (MongoDB ObjectId format - 24 hex chars)
            const isCustomMovie =
              typeof item.movieId === "string" && item.movieId.length === 24;

            let movieDetails;
            if (isCustomMovie) {
              movieDetails = await fetchCustomMovieById(item.movieId);
            } else {
              movieDetails = await fetchMovieDetails(item.movieId);
            }

            return {
              ...movieDetails,
              watchedAt: item.watchedAt,
            };
          } catch (err) {
            console.error(`Failed to fetch movie ${item.movieId}:`, err);
            return null;
          }
        });

        const movies = await Promise.all(moviePromises);
        setWatchLaterMovies(movies.filter((movie) => movie !== null));
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch watch later:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWatchLater();
    }
  }, [user]);

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
    <main className="catalog-page watch-later-page">
      <div className="catalog-glow" aria-hidden="true" />
      <Navbar
        isAuthView={false}
        activeLink="watch-later"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <section className="catalog-header">
        <p className="catalog-kicker">Your History</p>
        <h1>Watch Later</h1>
        <p>Movies you've marked to watch later.</p>
      </section>

      {loading ? (
        <section className="catalog-empty">
          <h2>Loading...</h2>
          <p>Fetching your watch later list.</p>
        </section>
      ) : error ? (
        <section className="catalog-empty">
          <h2>Error</h2>
          <p>{error}</p>
        </section>
      ) : watchLaterMovies.length === 0 ? (
        <section className="catalog-empty">
          <h2>Your watch later list is empty</h2>
          <p>Browse movies and add them to your watch later list.</p>
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
          {watchLaterMovies.map((movie) => (
            <article className="catalog-card" key={movie.id}>
              <img
                src={getPosterUrl(movie)}
                alt={movie.title || movie.name || "Movie poster"}
                loading="lazy"
                onClick={() => navigate(`/movie/${movie.id}`)}
              />

              <div className="catalog-meta">
                <h3>{movie.title || movie.name || "Untitled"}</h3>
                <p>
                  {movie.release_date || "Unknown release date"}
                  {movie.watchedAt && (
                    <span className="watch-date">
                      {" • Added "}
                      {new Date(movie.watchedAt).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              <div className="catalog-actions">
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  Open
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default WatchLater;
