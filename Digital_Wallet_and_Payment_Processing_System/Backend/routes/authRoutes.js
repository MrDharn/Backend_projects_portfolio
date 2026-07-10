const express = require('express')
const authenticationMiddleware = require('../middlewares/authMiddleware');
const { Register, Login, ChangePassword, SetPin, ChangePin } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.route('/register').post(Register)
authRoutes.route('/login').post(Login)
authRoutes.route('/change-password').post(authenticationMiddleware, ChangePassword)
authRoutes.route('/set-pin').post(authenticationMiddleware, SetPin)
authRoutes.route('/change-pin').post(authenticationMiddleware, ChangePin)

module.exports = authRoutes