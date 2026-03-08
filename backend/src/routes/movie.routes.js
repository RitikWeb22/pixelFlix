const { Router } = require('express');

const movieController = require('../controllers/movie.controller');
const movieRouter = Router();

/**
 * @route Get custom created movies
 * @route /api/movies/custom
 * @access Public
 */
movieRouter.get('/custom', movieController.getCustomMoviesController);

/**
 * @route Get single custom movie by ID
 * @route /api/movies/custom/:id
 * @access Public
 */
movieRouter.get('/custom/:id', movieController.getCustomMovieByIdController);

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




