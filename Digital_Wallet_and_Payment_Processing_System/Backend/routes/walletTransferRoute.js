const express = require('express')
const transferRoute = express.Router();
const authMiddlewareAuthentication = require("../middlewares/authMiddleware");
const  {transferToWallet, verificationController} = require("../controllers/wallet_To_wallet_controller");
const authenticationMiddleware = require('../middlewares/authMiddleware');

transferRoute.route('/transfer-wallet').post(authenticationMiddleware, transferToWallet)
transferRoute.route('/transfer-wallet/verify').get(authenticationMiddleware, verificationController);

module.exports = transferRoute