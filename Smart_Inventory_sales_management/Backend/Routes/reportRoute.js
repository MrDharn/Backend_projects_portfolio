const express = require('express')
const reportRoute = express.Router()

const {getBestSellingProduct, getReport, getBestStaff} = require('../controllers/reportController')
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')

reportRoute.route('/best-product').get(authMiddleware, userManagementMiddleware, getBestSellingProduct)
reportRoute.route('/best-staff').get(authMiddleware, userManagementMiddleware, getBestStaff)
reportRoute.route('/:date').get(authMiddleware, userManagementMiddleware, getReport)


module.exports = reportRoute