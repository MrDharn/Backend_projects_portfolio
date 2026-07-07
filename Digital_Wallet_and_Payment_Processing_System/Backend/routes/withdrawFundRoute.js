const express = require('express')
const withdrawfundsRoute = express.Router()
const authenticationMiddleware = require('../middlewares/authMiddleware')
const { withdrawFunds, verificationController } = require('../controllers/withdrawalController')

withdrawfundsRoute.route('/transfer').post(authenticationMiddleware, withdrawFunds, verificationController)

module.exports = withdrawfundsRoute