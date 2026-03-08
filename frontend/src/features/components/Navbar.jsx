import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { searchMovies } from "../movies/api/movie.api";

const Navbar = ({
  isAuthView = true,
  onNavigate = () => {},
  onLogout = () => {},
  activeLink = "home",
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef(null);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsSearching(true);

    // Set new timer (500ms debounce)
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchMovies(searchQuery);
        setSearchResults(results.slice(0, 8)); // Show max 8 results
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const getPosterUrl = (movie) => {
    if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
    }
    return "https://via.placeholder.com/92x138?text=No+Image";
  };

  return (
    <header className={`site-navbar ${isAuthView ? "auth" : "movies"}`}>
      <button
        className="brand-button"
        type="button"
        onClick={() => onNavigate("home")}
      >
        PIXELFLIX
      </button>

      {isAuthView ? (
        <nav className="nav-actions" aria-label="Authentication navigation">
          <button
            className="nav-pill"
            type="button"
            onClick={() => onNavigate("login")}
          >
            Sign In
          </button>
          <button
            className="nav-pill accent"
            type="button"
            onClick={() => onNavigate("register")}
          >
            Sign Up
          </button>
        </nav>
      ) : (
        <>
          <nav className="movie-links" aria-label="Movie navigation">
            <button
              type="button"
              className={activeLink === "home" ? "is-active" : ""}
              onClick={() => onNavigate("home")}
            >
              Home
            </button>
            <button
              type="button"
              className={activeLink === "movies" ? "is-active" : ""}
              onClick={() => onNavigate("movies")}
            >
              Movies
            </button>
            <button
              type="button"
              className={activeLink === "my-list" ? "is-active" : ""}
              onClick={() => onNavigate("my-list")}
            >
              My List
            </button>
            <button
              type="button"
              className={activeLink === "watch-later" ? "is-active" : ""}
              onClick={() => onNavigate("watch-later")}
            >
              Watch Later
            </button>
            {user?.role === "admin" && (
              <button
                type="button"
                className={activeLink === "admin" ? "is-active" : ""}
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            )}
          </nav>
          <div className="nav-search-container" ref={searchRef}>
            <div className="nav-search-input">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
              />
              {isSearching && (
                <span className="search-loading">Searching...</span>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="nav-search-results">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(movie.id)}
                  >
                    <img
                      src={getPosterUrl(movie)}
                      alt={movie.title || movie.name}
                    />
                    <div className="search-result-info">
                      <h4>{movie.title || movie.name}</h4>
                      <p>
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "N/A"}
                        {movie.vote_average && (
                          <> • ⭐ {movie.vote_average.toFixed(1)}</>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="nav-user-area">
            <span className="nav-username">Hi, {user?.username || "User"}</span>
            <button className="nav-pill" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
