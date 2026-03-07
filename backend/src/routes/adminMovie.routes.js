const { Router } = require('express');
const { createMovie, updateMovie, deleteMovie, getAllMovies } = require('../controllers/adminMovie.controller');
const { adminMiddleware, identifyUser } = require('../middlewares/authMiddleware');
const movieCreateRouter = Router();

movieCreateRouter.post("/create", identifyUser, adminMiddleware, createMovie)

movieCreateRouter.put("/:id", identifyUser, adminMiddleware, updateMovie)

movieCreateRouter.delete("/:id", identifyUser, adminMiddleware, deleteMovie)

movieCreateRouter.get("/", identifyUser, adminMiddleware, getAllMovies)


module.exports = movieCreateRouter