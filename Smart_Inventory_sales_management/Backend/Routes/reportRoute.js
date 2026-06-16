const express = require('express')
const reportRoute = express.Router()

const {getBestSellingProduct, getReport} = require('../controllers/reportController')
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')

reportRoute.route('/:date').get(authMiddleware, userManagementMiddleware, getReport)
reportRoute.route('/best-product').get(authMiddleware, userManagementMiddleware, getBestSellingProduct)


module.exports = reportRoute