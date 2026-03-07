const express = require("express")
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favorite.controller")
const { identifyUser } = require("../middlewares/authMiddleware")
const favRouter = express.Router()




favRouter.post("/:movieId", identifyUser, addFavorite)

favRouter.delete("/:movieId", identifyUser, removeFavorite)

favRouter.get("/", identifyUser, getFavorites)

module.exports = favRouter