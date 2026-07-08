const express = require('express')
const authenticationMiddleware = require('../middlewares/authMiddleware');
const { Register, Login, ChangePassword } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.route('/register').post(Register)
authRoutes.route('/login').post(Login)
authRoutes.route('/change-password').post(authenticationMiddleware, ChangePassword)

module.exports = authRoutes