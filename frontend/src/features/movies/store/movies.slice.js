import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMovieDetails, fetchTrendingMovies, fetchCustomMovies, fetchCustomMovieById } from "../api/movie.api";

const readMyList = () => {
    try {
        const storedList = localStorage.getItem("pixelflix-my-list");
        return storedList ? JSON.parse(storedList) : [];
    } catch {
        return [];
    }
};

const writeMyList = (list) => {
    try {
        localStorage.setItem("pixelflix-my-list", JSON.stringify(list));
    } catch {
        // Ignore storage write failures.
    }
};

export const loadTrendingMovies = createAsyncThunk(
    "movies/loadTrendingMovies",
    async (page = 1) => {
        const data = await fetchTrendingMovies(page);
        return {
            page,
            movies: Array.isArray(data) ? data : [],
        };
    },
);

export const loadCustomMovies = createAsyncThunk(
    "movies/loadCustomMovies",
    async () => {
        const customMovies = await fetchCustomMovies();
        return customMovies;
    },
);

export const loadMovieDetails = createAsyncThunk(
    "movies/loadMovieDetails",
    async (id, { getState }) => {
        // Check if this is a custom movie ID (MongoDB _id format)
        const state = getState();
        const isCustomMovie = state.movies.customMovies.some(movie => movie.id === id);

        if (isCustomMovie) {
            const data = await fetchCustomMovieById(id);
            return data;
        } else {
            const data = await fetchMovieDetails(id);
            return data;
        }
    },
);

const initialState = {
    movies: [],
    customMovies: [],
    page: 1,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: "",
    selectedMovie: null,
    detailsLoading: false,
    detailsError: "",
    myList: readMyList().filter((item) => item && item.media_type !== "tv"),
};

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        clearSelectedMovie(state) {
            state.selectedMovie = null;
        },
        toggleMyList(state, action) {
            const movie = action.payload;
            if (!movie?.id || movie.media_type === "tv") {
                return;
            }

            const exists = state.myList.some((item) => item.id === movie.id);
            if (exists) {
                state.myList = state.myList.filter((item) => item.id !== movie.id);
            } else {
                state.myList = [movie, ...state.myList];
            }

            writeMyList(state.myList.filter((item) => item && item.media_type !== "tv"));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTrendingMovies.pending, (state, action) => {
                if ((action.meta.arg || 1) > 1) {
                    state.loadingMore = true;
                } else {
                    state.loading = true;
                }
                state.error = "";
            })
            .addCase(loadTrendingMovies.fulfilled, (state, action) => {
                const { page, movies } = action.payload;

                if (page > 1) {
                    const seenIds = new Set(state.movies.map((movie) => movie.id));
                    const nextUnique = movies.filter((movie) => !seenIds.has(movie.id));
                    state.movies = [...state.movies, ...nextUnique];
                } else {
                    state.movies = movies;
                }

                state.page = page;
                state.hasMore = movies.length > 0;
                state.loading = false;
                state.loadingMore = false;
            })
            .addCase(loadTrendingMovies.rejected, (state, action) => {
                state.error = action.error.message || "Unable to load movies";
                state.loading = false;
                state.loadingMore = false;
            })
            .addCase(loadMovieDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = "";
            })
            .addCase(loadMovieDetails.fulfilled, (state, action) => {
                state.selectedMovie = action.payload;
                state.detailsLoading = false;
            })
            .addCase(loadMovieDetails.rejected, (state, action) => {
                state.detailsError = action.error.message || "Unable to load movie details";
                state.detailsLoading = false;
            })
            .addCase(loadCustomMovies.pending, (state) => {
                // Custom movies load silently, no loading state change
            })
            .addCase(loadCustomMovies.fulfilled, (state, action) => {
                state.customMovies = action.payload;
            })
            .addCase(loadCustomMovies.rejected, (state, action) => {
                // Silently fail, log to console
                console.error("Failed to load custom movies:", action.error.message);
            });
    },
});

export const { clearSelectedMovie, toggleMyList } = moviesSlice.actions;

export default moviesSlice.reducer;
