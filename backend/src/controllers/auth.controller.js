const userModel = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../config/cache');


/**
 * @description register user logic
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    //  check if user already exists
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(401).json({ message: 'Username or email already exists' });
    }

    // hash the password
    const newPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await userModel.create({
        username,
        email,
        password: newPassword
    });

    // token set
    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('token', token)

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email } });


}

/** *
 *  @description login user logic
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;
    // check if user exists
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // token set
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.cookie('token', token)

    res.status(200).json({ message: 'User logged in successfully', user: { id: user._id, username: user.username, email: user.email } });
}


/**
 * @description get-me for current user
 */

async function getMeController(req, res) {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: "User fetched successfully",
        user
    })
}


/**
 * @description logout user logic
 */
async function logoutController(req, res) {
    const token = req.cookies.token;

    await redis.set(`blacklist_${token}`, 'blacklisted', 'EX', 2 * 24 * 60 * 60);

    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
}

module.exports = {
    registerUserController,
    loginUserController,
    getMeController,
    logoutController
}

