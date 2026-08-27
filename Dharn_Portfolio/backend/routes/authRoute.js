const express = require('express')
const authRoute = express.Router()

const adminLogin = require('../controllers/AuthController')
authRoute.route('/login').post(adminLogin)

module.exports = authRoute
