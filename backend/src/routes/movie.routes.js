const { Router } = require('express');

const movieController = require('../controllers/movie.controller');
const movieRouter = Router();

/**
 * @routr Get  trending movies
 * @route /api/movies/trending
 * @access Public
 */
movieRouter.get('/trending', movieController.getTrendingMoviesController);

/**
 * @route Get Search Movies
 * @route /api/movies/search
 * @access Public
 */
movieRouter.get('/search', movieController.searchMoviesController);

/**
 * @route Get Movie Details
 * @route /api/movies/:id
 * @access Public
 */
movieRouter.get('/:id', movieController.getMovieDetailsController);

module.exports = movieRouter;




