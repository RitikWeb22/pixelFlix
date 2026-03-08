import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMovies } from "../hooks/useMovies";
import "../styles/home.scss";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

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

const Home = () => {
  const navigate = useNavigate();
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const { logout } = useAuth();
  const { allMovies, loading, error, fetchMovieDetails } = useMovies();
  const featuredMovies = allMovies.slice(0, 8);
  const moreToWatch = allMovies.slice(8, 12);
  const mediaMovies = allMovies.slice(12, 18);
  const heroMovie = allMovies[0];

  const handleMovieClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleNavbarNavigate = (target) => {
    if (target === "home") navigate("/");
    if (target === "movies") navigate("/movies");
    if (target === "my-list") navigate("/my-list");
    if (target === "watch-later") navigate("/watch-later");
  };

  const handlePlayTrailer = async () => {
    if (heroMovie?.id) {
      try {
        // Check if custom movie with trailer URL
        if (heroMovie.isCustom && heroMovie.customData?.trailer) {
          window.open(heroMovie.customData.trailer, "_blank");
          return;
        }

        const movieDetails = await fetchMovieDetails(heroMovie.id);
        const firstTrailer =
          movieDetails?.videos?.results?.find(
            (video) => video.type === "Trailer" && video.site === "YouTube",
          ) || movieDetails?.videos?.results?.[0];

        if (firstTrailer) {
          setTrailerKey(firstTrailer.key);
          setShowTrailerModal(true);
        } else {
          navigate(`/movie/${heroMovie.id}`);
        }
      } catch (error) {
        navigate(`/movie/${heroMovie.id}`);
      }
    }
  };

  const getBackdropUrl = (movie) => {
    if (!movie) return null;

    // Check if it's a custom movie with direct URL
    if (
      movie.isCustom &&
      movie.backdrop_path &&
      !movie.backdrop_path.startsWith("/")
    ) {
      return movie.backdrop_path;
    }

    if (movie.backdrop_path) {
      return `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`;
    }

    return null;
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
    setTrailerKey(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <main className="home-page">
      <div className="home-glow" aria-hidden="true" />

      <section
        className="hero"
        style={{
          backgroundImage: getBackdropUrl(heroMovie)
            ? `url(${getBackdropUrl(heroMovie)})`
            : "none",
        }}
      >
        <Navbar
          isAuthView={false}
          activeLink="home"
          onNavigate={handleNavbarNavigate}
          onLogout={handleLogout}
        />

        <div className="hero-overlay" />

        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-kicker">
              {heroMovie ? "TRENDING #1" : "PIXELFLIX ORIGINAL"}
            </p>
            <h1>{heroMovie?.title || heroMovie?.name || "The Last Signal"}</h1>
            <p>
              {heroMovie?.overview ||
                "A renegade astronaut decodes a message from a vanished colony and uncovers a conspiracy spread across time."}
            </p>

            <div className="hero-tags">
              {heroMovie?.vote_average && (
                <span>{Math.round(heroMovie.vote_average * 10)}% Match</span>
              )}
              {heroMovie?.genre_ids?.slice(0, 2).map((genreId) => {
                const genreNames = {
                  28: "Action",
                  12: "Adventure",
                  16: "Animation",
                  35: "Comedy",
                  80: "Crime",
                  99: "Documentary",
                  18: "Drama",
                  10751: "Family",
                  14: "Fantasy",
                  36: "History",
                  27: "Horror",
                  10402: "Music",
                  9648: "Mystery",
                  10749: "Romance",
                  878: "Sci-Fi",
                  10770: "TV Movie",
                  53: "Thriller",
                  10752: "War",
                  37: "Western",
                };
                return <span key={genreId}>{genreNames[genreId] || ""}</span>;
              })}
              {heroMovie?.adult === false && <span>U/A 16+</span>}
            </div>

            <div className="hero-actions">
              <button
                className="btn btn-lg home-btn-play"
                type="button"
                onClick={handlePlayTrailer}
                disabled={!heroMovie}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="play-icon"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
              <button
                className="btn btn-lg home-btn-info"
                type="button"
                onClick={() => heroMovie && handleMovieClick(heroMovie.id)}
                disabled={!heroMovie}
              >
                More Info
              </button>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Now streaming insights">
            <h3>Now Streaming</h3>
            <ul>
              <li>
                <strong>#1 Trending</strong>
                <span>
                  {heroMovie?.media_type === "tv" ? "TV Series" : "Movie"}
                </span>
              </li>
              {heroMovie?.vote_average && (
                <li>
                  <strong>Rating</strong>
                  <span>⭐ {heroMovie.vote_average.toFixed(1)}/10</span>
                </li>
              )}
              {heroMovie?.release_date && (
                <li>
                  <strong>Release</strong>
                  <span>{new Date(heroMovie.release_date).getFullYear()}</span>
                </li>
              )}
              {heroMovie?.first_air_date && (
                <li>
                  <strong>First Aired</strong>
                  <span>
                    {new Date(heroMovie.first_air_date).getFullYear()}
                  </span>
                </li>
              )}
              {heroMovie?.popularity && (
                <li>
                  <strong>Popularity</strong>
                  <span>{Math.round(heroMovie.popularity)}</span>
                </li>
              )}
            </ul>
          </aside>
        </div>

        <div className="hero-fade" />
      </section>

      <section className="home-sections">
        <div className="row-block">
          <div className="row-head">
            <div>
              <h2>Trending</h2>
              <p>Live data from your backend movie service</p>
            </div>
            <button
              className="row-more"
              type="button"
              onClick={() => navigate("/movies")}
            >
              See all
            </button>
          </div>

          {loading && <p>Loading trending movies...</p>}
          {error && !loading && <p>{error}</p>}

          {!loading && !error && (
            <div className="poster-row">
              {featuredMovies.map((movie, index) => (
                <article
                  className="poster-card"
                  key={movie.id || movie.title || index}
                  onClick={() => handleMovieClick(movie.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={getPosterUrl(movie)}
                    alt={movie.title || movie.name || "Movie poster"}
                    loading="lazy"
                  />
                  <div className="poster-meta">
                    <span>{movie.title || movie.name || "Untitled"}</span>
                    <small>#{index + 1} in Trending</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="row-block">
          <div className="row-head">
            <div>
              <h2>More to Watch</h2>
              <p>Live picks from the same backend trending feed</p>
            </div>
            <button
              className="row-more"
              type="button"
              onClick={() => navigate("/my-list")}
            >
              Explore
            </button>
          </div>

          {!loading && !error && (
            <div className="people-row">
              {moreToWatch.map((movie, index) => (
                <article className="person-card" key={movie.id || index}>
                  <img
                    src={getPosterUrl(movie)}
                    alt={movie.title || movie.name || "Movie poster"}
                    loading="lazy"
                  />
                  <h3>{movie.title || movie.name || "Untitled"}</h3>
                  <p>{movie.release_date || "Release date unavailable"}</p>
                  <button
                    className="btn btn-sm btn-outline"
                    type="button"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    Details
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="row-block">
          <div className="row-head">
            <div>
              <h2>Images / Media</h2>
              <p>Posters and backdrops fetched from live movie data</p>
            </div>
          </div>

          {!loading && !error && (
            <div className="media-grid">
              {mediaMovies.map((movie, index) => (
                <article
                  className="media-card"
                  key={movie.id || index}
                  onClick={() => handleMovieClick(movie.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={getPosterUrl(movie)}
                    alt={movie.title || movie.name || "Media still"}
                    loading="lazy"
                  />
                  <span>
                    {movie.title || movie.name || `Media ${index + 1}`}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && trailerKey && (
        <div className="trailer-modal" onClick={closeTrailerModal}>
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="trailer-close" onClick={closeTrailerModal}>
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
