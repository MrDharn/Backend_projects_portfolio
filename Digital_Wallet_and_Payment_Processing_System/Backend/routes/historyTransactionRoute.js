const express = require('express')

const historyTransactionRoute = express.Router();
const {getAllTransactionHistory} = require('../controllers/transactionHistoryController')
const authenticationMiddleware = require('../middlewares/authMiddleware')
historyTransactionRoute.route('/transactions').get(authenticationMiddleware, getAllTransactionHistory)
module.exports = historyTransactionRoute