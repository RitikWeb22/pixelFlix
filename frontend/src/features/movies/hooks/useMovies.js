import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearSelectedMovie,
    loadMovieDetails,
    loadTrendingMovies,
    loadCustomMovies,
    toggleMyList,
} from "../store/movies.slice";

export const useMovies = () => {
    const dispatch = useDispatch();
    const {
        movies,
        customMovies,
        selectedMovie,
        myList,
        loading,
        loadingMore,
        error,
        detailsLoading,
        detailsError,
        page,
        hasMore,
    } = useSelector((state) => state.movies);

    // Merge custom movies with TMDB movies (custom movies first)
    const allMovies = useMemo(() => {
        return [...customMovies, ...movies];
    }, [customMovies, movies]);

    useEffect(() => {
        if (!movies.length && !loading && !error) {
            dispatch(loadTrendingMovies(1));
        }
    }, [dispatch, movies.length, loading, error]);

    // Load custom movies on mount
    useEffect(() => {
        if (!customMovies.length) {
            dispatch(loadCustomMovies());
        }
    }, [dispatch, customMovies.length]);

    const refreshMovies = useCallback(
        async (targetPage = 1) => {
            await dispatch(loadTrendingMovies(targetPage)).unwrap();
        },
        [dispatch],
    );

    const loadMoreMovies = useCallback(async () => {
        if (loading || loadingMore || !hasMore) {
            return;
        }

        await dispatch(loadTrendingMovies(page + 1)).unwrap();
    }, [dispatch, loading, loadingMore, hasMore, page]);

    const fetchMovieDetails = useCallback(
        async (id) => dispatch(loadMovieDetails(id)).unwrap(),
        [dispatch],
    );

    const clearMovieDetails = useCallback(
        () => dispatch(clearSelectedMovie()),
        [dispatch],
    );

    const toggleMovieInList = useCallback(
        (movie) => dispatch(toggleMyList(movie)),
        [dispatch],
    );

    const isInMyList = useCallback(
        (movieId) => myList.some((movie) => movie.id === movieId),
        [myList],
    );

    return {
        movies,
        customMovies,
        allMovies, // Merged movies (custom + TMDB)
        selectedMovie,
        myList,
        loading,
        loadingMore,
        error,
        detailsLoading,
        detailsError,
        page,
        hasMore,
        refreshMovies,
        loadMoreMovies,
        fetchMovieDetails,
        clearSelectedMovie: clearMovieDetails,
        toggleMyList: toggleMovieInList,
        isInMyList,
    };
};
