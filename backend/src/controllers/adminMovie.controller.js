const movieModel = require("../models/movie.model");


async function createMovie(req, res) {
    try {

        const { title, description, releaseDate, trailer, genre, category, poster } = req.body;

        const movieId = 'movie_' + Date.now()

        // check if movie with the same already exists
        const existingMovie = await movieModel.findOne({ $or: [{ title }, { movieId }] });
        if (existingMovie) {
            return res.status(400).json({ error: 'Movie already exists with this title' });
        }

        const newMovie = await movieModel.create({ title, description, releaseDate, trailer, genre, category, poster, movieId });
        res.status(201).json({
            message: 'Movie created successfully',
            movie: newMovie
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create movie' });
    }
}

async function updateMovie(req, res) {
    try {
        const { id } = req.params;
        const { title, description, releaseDate, trailer, genre, category, poster } = req.body;
        const updatedMovie = await movieModel.findByIdAndUpdate(id, { title, description, releaseDate, trailer, genre, category, poster }, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json({
            message: 'Movie updated successfully',
            movie: updatedMovie
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update movie' });
    }

}

async function deleteMovie(req, res) {
    try {
        const { id } = req.params;
        const deletedMovie = await movieModel.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json({
            message: 'Movie deleted successfully',
            movie: deletedMovie
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete movie' });
    }
}

// get all movies - for admin
async function getAllMovies(req, res) {
    try {
        const movies = await movieModel.find();
        res.status(200).json({
            message: 'Movies retrieved successfully',
            movies
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve movies' });
    }
}

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getAllMovies
}
