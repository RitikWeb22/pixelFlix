

// getAllUsers, deleteUser, banUser

const userModel = require("../models/auth.model");

async function getAllUsers(req, res) {
    //    check if user is admin
    const users = await userModel.find().select("-password");
    res.json(users);

}

// delete user
async function deleteUser(req, res) {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
}

// ban user and unban user
async function banUser(req, res) {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBanned = !user.isBanned;
        await user.save();
        res.json({ message: `User ${user.isBanned ? "banned" : "unbanned"} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Failed to ban/unban user" });
    }
}

module.exports = {
    getAllUsers,
    deleteUser,
    banUser,
}