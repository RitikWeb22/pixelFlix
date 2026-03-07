const { Router } = require("express")
const { adminMiddleware, identifyUser } = require("../middlewares/authMiddleware")
const { getAllUsers, banUser, deleteUser } = require("../controllers/admin.controller")

const AdminRouter = Router()

/**
 * @route Get Admin Dashboard
 * @route /api/admin/dashboard
 * @access Admin
 * */
AdminRouter.get("/users", identifyUser, adminMiddleware, getAllUsers)

AdminRouter.patch("/users/:id/ban", identifyUser, adminMiddleware, banUser)

AdminRouter.delete("/users/:id", identifyUser, adminMiddleware, deleteUser)



module.exports = AdminRouter