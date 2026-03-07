const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User ID is required']
    },
    movieId: {
        type: Number,
        required: [true, 'Movie ID is required']
    },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const favoriteModel = mongoose.model('favorites', favoriteSchema);

module.exports = favoriteModel;