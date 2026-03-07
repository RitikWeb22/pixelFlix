const {
    fetchTrendingMovies,
    searchMovies,
    getMovieDetails
} = require("../services/movie.api");

/**
 * @description Movie trending 
 */


async function getTrendingMoviesController(req, res) {
    return fetchTrendingMovies(req, res);
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



module.exports = { getTrendingMoviesController, searchMoviesController, getMovieDetailsController };