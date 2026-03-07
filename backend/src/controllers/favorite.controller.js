
const favoriteModel = require('../models/favorite.model');


async function addFavorite(req, res) {
    const userId = req.user.id;
    const { movieId } = req.params;
    try {
        const favorite = await favoriteModel.create({ userId, movieId });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add favorite' });
    }

}

// remove favorite

async function removeFavorite(req, res) {
    const userId = req.user.id;
    const { movieId } = req.params;
    try {
        await favoriteModel.deleteOne({ userId, movieId });
        res.status(200).json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
}

// Get favorites

async function getFavorites(req, res) {
    const userId = req.user.id;
    try {
        const favorites = await favoriteModel.find({ userId });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
}