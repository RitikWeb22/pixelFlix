const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { identifyUser } = require('../middlewares/authMiddleware');
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 *  @route POST /api/auth/login
 *  @desc Login user
 * @access Public
 * */
authRouter.post('/login', authController.loginUserController);


/**
 * @route POST /api/auth/get-me
 * @desc Get current user
 * @access Private
 */
authRouter.get('/get-me', identifyUser, authController.getMeController);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post('/logout', identifyUser, authController.logoutController);


module.exports = authRouter;