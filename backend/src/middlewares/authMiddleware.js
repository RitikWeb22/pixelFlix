const jwt = require('jsonwebtoken');
const redis = require('../config/cache');
const userModel = require('../models/auth.model');
const identifyUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    // token blacklist check
    const isBlacklisted = await redis.get(`blacklist_${token}`);
    if (isBlacklisted) {
        return res.status(400).json({ message: 'Token is blacklisted' });
    }

    let decoded = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }

}


async function adminMiddleware(req, res, next) {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    let userRole = req.user.role;

    // Backward compatibility: older JWTs may not include role.
    if (!userRole && req.user.id) {
        const user = await userModel.findById(req.user.id).select("role");
        userRole = user?.role;
    }

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
    }

    next()
}

module.exports = {
    identifyUser,
    adminMiddleware
};