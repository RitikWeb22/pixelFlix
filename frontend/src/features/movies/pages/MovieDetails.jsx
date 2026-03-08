import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMovies } from "../hooks/useMovies";
import { addToHistory } from "../api/history.api";
import "../styles/movieDetails.scss";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [addedToWatchLater, setAddedToWatchLater] = useState(false);
  const { logout } = useAuth();
  const {
    selectedMovie,
    detailsLoading,
    detailsError,
    fetchMovieDetails,
    clearSelectedMovie,
    toggleMyList,
    isInMyList,
  } = useMovies();

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }

    return () => {
      clearSelectedMovie();
    };
  }, [id, fetchMovieDetails, clearSelectedMovie]);

  const handleNavbarNavigate = (target) => {
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

  const handleAddToWatchLater = async () => {
    try {
      const token = localStorage.getItem("token");
      await addToHistory(id, token);
      setAddedToWatchLater(true);
      setTimeout(() => setAddedToWatchLater(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to add to watch later:", error);
    }
  };

  if (detailsLoading) {
    return (
      <main className="details-page">
        <Navbar
          isAuthView={false}
          activeLink="movies"
          onNavigate={handleNavbarNavigate}
          onLogout={handleLogout}
        />
        <div className="details-loading">
          <p>Loading movie details...</p>
        </div>
      </main>
    );
  }

  if (detailsError || !selectedMovie) {
    return (
      <main className="details-page">
        <Navbar
          isAuthView={false}
          activeLink="movies"
          onNavigate={handleNavbarNavigate}
          onLogout={handleLogout}
        />
        <div className="details-error">
          <p>{detailsError || "Movie not found"}</p>
          <button className="btn btn-lg" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // Check if this is a custom movie (from our database)
  const isCustomMovie = selectedMovie.isCustom || false;

  const backdropUrl = selectedMovie.backdrop_path
    ? isCustomMovie && !selectedMovie.backdrop_path.startsWith("/")
      ? selectedMovie.backdrop_path
      : `${TMDB_IMAGE_BASE}${selectedMovie.backdrop_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80";

  const posterUrl = selectedMovie.poster_path
    ? isCustomMovie && !selectedMovie.poster_path.startsWith("/")
      ? selectedMovie.poster_path
      : `${TMDB_POSTER_BASE}${selectedMovie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";

  const releaseYear = selectedMovie.release_date
    ? new Date(selectedMovie.release_date).getFullYear()
    : "N/A";
  const runtime = selectedMovie.runtime
    ? `${selectedMovie.runtime} min`
    : isCustomMovie
      ? "-"
      : "N/A";
  const rating = selectedMovie.vote_average
    ? selectedMovie.vote_average.toFixed(1)
    : isCustomMovie
      ? "New Release"
      : "N/A";

  const firstTrailer =
    selectedMovie?.videos?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
    ) || selectedMovie?.videos?.results?.[0];

  const customTrailer = isCustomMovie && selectedMovie.customData?.trailer;

  const handlePlayTrailer = () => {
    if (firstTrailer) {
      setShowTrailerModal(true);
    } else if (customTrailer) {
      // Open custom trailer URL in new tab
      window.open(customTrailer, "_blank");
    }
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
  };

  return (
    <main className="details-page">
      <Navbar
        isAuthView={false}
        activeLink="movies"
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
      />

      <section
        className="details-hero"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="details-overlay" />

        <div className="details-content">
          <div className="details-poster">
            <img
              src={posterUrl}
              alt={selectedMovie.title || selectedMovie.name}
            />
          </div>

          <div className="details-info">
            <h1>{selectedMovie.title || selectedMovie.name || "Untitled"}</h1>

            {selectedMovie.tagline && (
              <p className="details-tagline">{selectedMovie.tagline}</p>
            )}

            <div className="details-meta">
              <span>{releaseYear}</span>
              {runtime !== "-" && <span>{runtime}</span>}
              <span>
                ⭐ {rating}
                {typeof rating === "number" ? "/10" : ""}
              </span>
              {selectedMovie.status && (
                <span className="details-status">{selectedMovie.status}</span>
              )}
              {isCustomMovie && (
                <span className="custom-badge">Custom Movie</span>
              )}
            </div>

            {selectedMovie.genres && selectedMovie.genres.length > 0 && (
              <div className="details-genres">
                {selectedMovie.genres.map((genre) => (
                  <span key={genre.id || genre.name} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {isCustomMovie && selectedMovie.customData?.genre && (
              <div className="details-genres">
                <span className="genre-tag">
                  {selectedMovie.customData.genre}
                </span>
              </div>
            )}

            <div className="details-overview">
              <h3>Overview</h3>
              <p>{selectedMovie.overview || "No overview available."}</p>
            </div>

            {isCustomMovie && selectedMovie.customData?.category && (
              <div className="details-category">
                <strong>Category:</strong> {selectedMovie.customData.category}
              </div>
            )}

            <div className="details-actions">
              <button
                className="btn btn-lg details-btn-play"
                type="button"
                onClick={handlePlayTrailer}
                disabled={!firstTrailer && !customTrailer}
              >
                ▶ Play{" "}
                {firstTrailer || customTrailer ? "Trailer" : "(No Trailer)"}
              </button>
              <button
                className="btn btn-lg details-btn-secondary"
                type="button"
                onClick={() => toggleMyList(selectedMovie)}
              >
                {isInMyList(selectedMovie.id)
                  ? "- Remove from My List"
                  : "+ My List"}
              </button>
              <button
                className="btn btn-lg details-btn-secondary"
                type="button"
                onClick={handleAddToWatchLater}
              >
                {addedToWatchLater ? "✓ Added to Watch Later" : "⏱ Watch Later"}
              </button>
              <button
                className="btn btn-lg details-btn-secondary"
                onClick={() => navigate("/")}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="details-extra">
        <div className="details-grid">
          {selectedMovie.production_companies &&
            selectedMovie.production_companies.length > 0 && (
              <div className="details-block">
                <h3>Production</h3>
                <ul>
                  {selectedMovie.production_companies
                    .slice(0, 5)
                    .map((company) => (
                      <li key={company.id || company.name}>{company.name}</li>
                    ))}
                </ul>
              </div>
            )}

          {selectedMovie.budget && selectedMovie.budget > 0 && (
            <div className="details-block">
              <h3>Budget</h3>
              <p>${(selectedMovie.budget / 1000000).toFixed(1)}M</p>
            </div>
          )}

          {selectedMovie.revenue && selectedMovie.revenue > 0 && (
            <div className="details-block">
              <h3>Revenue</h3>
              <p>${(selectedMovie.revenue / 1000000).toFixed(1)}M</p>
            </div>
          )}

          {selectedMovie.spoken_languages &&
            selectedMovie.spoken_languages.length > 0 && (
              <div className="details-block">
                <h3>Languages</h3>
                <p>
                  {selectedMovie.spoken_languages
                    .map((lang) => lang.english_name || lang.name)
                    .join(", ")}
                </p>
              </div>
            )}
        </div>

        {selectedMovie.videos &&
          selectedMovie.videos.results &&
          selectedMovie.videos.results.length > 0 && (
            <div className="details-videos">
              <h3>Videos & Trailers</h3>
              <div className="video-grid">
                {selectedMovie.videos.results.slice(0, 4).map((video) => (
                  <div key={video.id || video.key} className="video-card">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p>{video.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && firstTrailer && (
        <div className="trailer-modal" onClick={closeTrailerModal}>
          <div
            className="trailer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="trailer-close" onClick={closeTrailerModal}>
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${firstTrailer.key}?autoplay=1`}
              title={firstTrailer.name}
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

export default MovieDetails;
