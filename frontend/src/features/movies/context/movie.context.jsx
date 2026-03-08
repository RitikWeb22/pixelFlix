import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchTrendingMovies, fetchMovieDetails } from "../api/movie.api";

export const MovieContext = createContext(null);

const keepMovieOnly = (list = []) =>
  list.filter((item) => item && item.media_type !== "tv");

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState(() => {
    try {
      const storedList = localStorage.getItem("pixelflix-my-list");
      return storedList ? JSON.parse(storedList) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const loadTrendingMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchTrendingMovies(page);
      // Allow both movies and TV shows in the home feed
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMovieDetails = useCallback(async (id) => {
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const data = await fetchMovieDetails(id);
      setSelectedMovie(data);
      return data;
    } catch (err) {
      setDetailsError(err.message || "Unable to load movie details");
      throw err;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const clearSelectedMovie = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const toggleMyList = useCallback((movie) => {
    if (!movie?.id || movie.media_type === "tv") {
      return;
    }

    setMyList((previousList) => {
      const exists = previousList.some((item) => item.id === movie.id);
      if (exists) {
        return previousList.filter((item) => item.id !== movie.id);
      }

      return [movie, ...previousList];
    });
  }, []);

  const isInMyList = useCallback(
    (movieId) => myList.some((movie) => movie.id === movieId),
    [myList],
  );

  useEffect(() => {
    loadTrendingMovies();
  }, [loadTrendingMovies]);

  useEffect(() => {
    localStorage.setItem(
      "pixelflix-my-list",
      JSON.stringify(keepMovieOnly(myList)),
    );
  }, [myList]);

  const value = useMemo(
    () => ({
      movies,
      selectedMovie,
      myList,
      loading,
      detailsLoading,
      error,
      detailsError,
      refreshMovies: loadTrendingMovies,
      fetchMovieDetails: loadMovieDetails,
      clearSelectedMovie,
      toggleMyList,
      isInMyList,
    }),
    [
      movies,
      selectedMovie,
      myList,
      loading,
      detailsLoading,
      error,
      detailsError,
      loadTrendingMovies,
      loadMovieDetails,
      clearSelectedMovie,
      toggleMyList,
      isInMyList,
    ],
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
