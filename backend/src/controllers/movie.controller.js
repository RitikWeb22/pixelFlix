const {
    fetchTrendingMovies,
    searchMovies,
    getMovieDetails
} = require("../services/movie.api");
const movieModel = require("../models/movie.model");

/**
 * @description Movie trending 
 */


async function getTrendingMoviesController(req, res) {
    return fetchTrendingMovies(req, res);
}


/**
 * @description Get custom created movies (public access)
 */
async function getCustomMoviesController(req, res) {
    try {
        const movies = await movieModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Custom movies retrieved successfully',
            movies
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve custom movies' });
    }
}

/**
 * @description Get single custom movie by ID
 */
async function getCustomMovieByIdController(req, res) {
    try {
        const { id } = req.params;
        const movie = await movieModel.findById(id);

        if (!movie) {
            return res.status(404).json({ error: 'Custom movie not found' });
        }

        res.status(200).json({
            message: 'Custom movie retrieved successfully',
            movie
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve custom movie' });
    }
}


/**
 * @description Movie search
 */
async function searchMoviesController(req, res) {
    return searchMovies(req, res);
}


/**
 * @description Movie details
 */
async function getMovieDetailsController(req, res) {

    return getMovieDetails(req, res)


}



module.exports = {
    getTrendingMoviesController,
    searchMoviesController,
    getMovieDetailsController,
    getCustomMoviesController,
    getCustomMovieByIdController
};