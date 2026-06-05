const express = require('express')
const {signUpController, loginController, userProfileController}= require('../controllers/authController');
const authMiddleware = require('../Middlewares/authMiddleware')
const authRoute = express.Router();

authRoute.route('/register').post(signUpController);
authRoute.route('/login').post(loginController);
authRoute.route('/profile').get(authMiddleware, userProfileController)

module.exports = authRoute