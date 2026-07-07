const express = require('express')
const fundwalletRoute = express.Router()

const { fundWallet , verificationController} = require('../controllers/fundWalletController')
const authenticationMiddleware = require('../middlewares/authMiddleware')

fundwalletRoute.route('/deposit').post(authenticationMiddleware, fundWallet)
fundwalletRoute.route('/deposit/verify:reference').get(authenticationMiddleware, verificationController)

module.exports = fundwalletRoute
