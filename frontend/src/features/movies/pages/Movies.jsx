import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMovies } from "../hooks/useMovies";
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

const Movies = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
  const { logout } = useAuth();
  const {
    allMovies,
    loading,
    loadingMore,
    hasMore,
    error,
    toggleMyList,
    isInMyList,
    loadMoreMovies,
  } = useMovies();

  const sortedMovies = useMemo(
    () =>
      [...allMovies]
        .filter((movie) => movie?.media_type !== "tv")
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)),
    [allMovies],
  );

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

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreMovies().catch(() => {
            // Error state is handled by redux state.
          });
        }
      },
      { threshold: 0.2, rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [loadMoreMovies]);

  return (
    <main className="catalog-page">
      <div className="catalog-glow" aria-hidden="true" />
      <Navbar
        isAuthView={false}
        activeLink="movies"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <section className="catalog-header">
        <p className="catalog-kicker">Curated For Tonight</p>
        <h1>Movies Collection</h1>
        <p>
          Fresh releases and high-rated titles from your live trending feed.
        </p>
      </section>

      {loading && <p className="catalog-state">Loading movies...</p>}
      {error && !loading && <p className="catalog-state error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="catalog-grid" aria-live="polite">
            {sortedMovies.map((movie) => (
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
                    {movie.release_date || "Unknown release"} • Rating{" "}
                    {movie.vote_average?.toFixed(1) || "N/A"}
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
                  <button
                    className="btn btn-sm btn-outline"
                    type="button"
                    onClick={() => toggleMyList(movie)}
                  >
                    {isInMyList(movie.id) ? "Remove" : "My List"}
                  </button>
                </div>
              </article>
            ))}
          </section>

          <div ref={loadMoreRef} style={{ height: "1px" }} aria-hidden="true" />

          {loadingMore && (
            <p className="catalog-state">Loading more movies...</p>
          )}
          {!hasMore && !loadingMore && (
            <p className="catalog-state">
              You have reached the end of the catalog.
            </p>
          )}
        </>
      )}

      {!loading && error && sortedMovies.length > 0 && (
        <p className="catalog-state error">{error}</p>
      )}

      {!loading && !error && sortedMovies.length === 0 && (
        <p className="catalog-state">No movies found.</p>
      )}
    </main>
  );
};

export default Movies;
