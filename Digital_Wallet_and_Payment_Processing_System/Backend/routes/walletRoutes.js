const express = require('express')
const walletRoutes = express.Router();

const authenticationMiddleware = require('../middlewares/authMiddleware')
const {getAllWallet, CreatePin, ChangePin} = require('../controllers/walletController');

walletRoutes.route('/').get(authenticationMiddleware, getAllWallet)
walletRoutes.route('/pin').post(authenticationMiddleware, CreatePin)
walletRoutes.route('/change-pin').post(authenticationMiddleware, ChangePin)

module.exports = walletRoutes