const API_BASE_URL = "/api/movies";

export async function fetchTrendingMovies(page = 1) {
    const response = await fetch(`${API_BASE_URL}/trending?page=${page}`);

    if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
    }

    return response.json();
}
export async function fetchMovieDetails(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }

    return response.json();
}

export async function searchMovies(query) {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
        throw new Error("Failed to search movies");
    }

    return response.json();
}

export async function fetchCustomMovies() {
    const response = await fetch(`${API_BASE_URL}/custom`);

    if (!response.ok) {
        throw new Error("Failed to fetch custom movies");
    }

    const data = await response.json();

    // Transform custom movies to match TMDB format
    return data.movies.map((movie) => ({
        id: movie._id,
        title: movie.title,
        overview: movie.description,
        poster_path: movie.poster || null,
        backdrop_path: movie.poster || null,
        release_date: movie.releaseDate,
        vote_average: 0,
        genre_ids: [],
        media_type: 'movie',
        isCustom: true, // Flag to identify custom movies
        customData: {
            trailer: movie.trailer,
            genre: movie.genre,
            category: movie.category,
            movieId: movie.movieId
        }
    }));
}

export async function fetchCustomMovieById(id) {
    const response = await fetch(`${API_BASE_URL}/custom/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch custom movie details");
    }

    const data = await response.json();
    const movie = data.movie;

    // Transform to match TMDB format
    return {
        id: movie._id,
        title: movie.title,
        overview: movie.description,
        poster_path: movie.poster || null,
        backdrop_path: movie.poster || null,
        release_date: movie.releaseDate,
        vote_average: 0,
        genre_ids: [],
        media_type: 'movie',
        isCustom: true,
        customData: {
            trailer: movie.trailer,
            genre: movie.genre,
            category: movie.category,
            movieId: movie.movieId
        }
    };
}