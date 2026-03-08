
const historyModel = require("../models/history.model");

// add history
async function addHistory(req, res) {
    const userId = req.user.id;
    const { movieId } = req.params;
    try {
        const history = await historyModel.findOneAndUpdate(
            { user: userId, movieId },
            { watchedAt: new Date() },
            { new: true, upsert: true }
        );
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add history' });
    }
}

// get history
async function getHistory(req, res) {
    const userId = req.user.id;
    try {
        const history = await historyModel.find({ user: userId }).sort({ watchedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
}


module.exports = {
    addHistory,
    getHistory
}