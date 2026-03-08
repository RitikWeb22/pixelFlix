const axios = require("axios")

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.MOVIE_API_KEY
const redis = require("../config/cache")
/**
 * Trending Movies
 */

async function fetchTrendingMovies(req, res) {
    // pagination
    const { page = 1 } = req.query

    // optimize with redis caching
    const trendPage = `trending:${page}`
    const trendPageCache = await redis.get(trendPage)
    if (trendPageCache) {
        return res.json(JSON.parse(trendPageCache))
    }
    try {

        const response = await axios.get(
            `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
        )

        // Cache for 1 hour
        await redis.set(trendPage, JSON.stringify(response.data.results), 'EX', 3600)

        res.json(response.data.results)

    } catch (error) {

        res.status(500).json({ message: "Failed to fetch trending movies" })

    }

}


/**
 * Search Movies
 */

async function searchMovies(req, res) {

    const { query } = req.query

    try {

        const response = await axios.get(
            `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
        )

        res.json(response.data.results)

    } catch (error) {

        res.status(500).json({ message: "Search failed" })

    }

}


/**
 * Movie Details
 */

async function getMovieDetails(req, res) {

    const { id } = req.params

    try {

        const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
        )

        res.json(response.data)

    } catch (error) {
        console.error('Movie Details Error:', error.response?.data || error.message)
        res.status(500).json({ message: "Failed to fetch movie details", error: error.message })

    }

}

module.exports = {
    fetchTrendingMovies,
    searchMovies,
    getMovieDetails
}