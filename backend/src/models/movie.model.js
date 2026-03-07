const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"]
    },

    poster: String,

    description: {
        type: String,
        default: "Description not available"
    },

    movieId: {
        type: String,
        required: [true, "Movie ID is required"],
        unique: [true, "Movie ID must be unique"]
    },

    releaseDate: {
        type: String,
        default: "Release date not available"
    },

    trailer: {
        type: String,
        default: "Trailer not available"
    },

    genre: {
        type: String,
        default: "Genre not available"
    },

    category: {
        type: String,
        default: "Category not available"
    }

}, { timestamps: true })



const movieModel = mongoose.model("movies", movieSchema)
module.exports = movieModel