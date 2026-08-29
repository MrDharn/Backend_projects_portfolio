const express = require('express')
const withdrawfundsRoute = express.Router()
const authenticationMiddleware = require('../middlewares/authMiddleware')
const { withdrawFunds, verificationController, resolveBankAccount} = require('../controllers/withdrawalController')

withdrawfundsRoute.route('/transfer').post(authenticationMiddleware, withdrawFunds)
withdrawfundsRoute.route('/transfer/resolve').get(authenticationMiddleware, resolveBankAccount)
withdrawfundsRoute.route('/transfer/verify/:reference').get(authenticationMiddleware, verificationController);


module.exports = withdrawfundsRoute