const { Router } = require("express")
const historyRouter = Router()

const { addHistory, getHistory } = require("../controllers/history.controller")
const { identifyUser } = require("../middlewares/authMiddleware")


historyRouter.post("/:movieId", identifyUser, addHistory)

historyRouter.get("/", identifyUser, getHistory)

module.exports = historyRouter