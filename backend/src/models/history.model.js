const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    movieId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    watchedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

historySchema.index({ user: 1, movieId: 1 }, { unique: true })

const historyModel = mongoose.model("history", historySchema)
module.exports = historyModel;