import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/movies/store/movies.slice";

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
    },
});
