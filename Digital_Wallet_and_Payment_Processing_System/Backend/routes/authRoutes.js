const express = require('express')
const authenticationMiddleware = require('../middlewares/authMiddleware');
const { Register, Login } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.route('/register').post(Register)
authRoutes.route('/login').post(authenticationMiddleware, Login)

module.exports = authRoutes