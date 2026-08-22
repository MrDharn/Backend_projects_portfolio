const express = require('express')
const transferRoute = express.Router();
const authMiddlewareAuthentication = require("../middlewares/authMiddleware");
const  {transferToWallet, verificationController, resolveWalletNameController} = require("../controllers/wallet_To_wallet_controller");
const authenticationMiddleware = require('../middlewares/authMiddleware');

transferRoute.route('/transfer-wallet').post(authenticationMiddleware, transferToWallet)
// transferRoute.route('/transfer-wallet/verify').get(authenticationMiddleware, verificationController);
// transferRoute.route('/transfer-wallet/resolve').get(authenticationMiddleware, resolveWalletNameController)

module.exports = transferRoute