const express = require('express')
const salesRoute = express.Router();
const {createSales, allSales, getSingleSales} = require('../controllers/salesController');
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')
const authMiddleware = require('../Middlewares/authMiddleware')
const managerMiddleware = require('../Middlewares/managerMiddleware')

salesRoute.route('/').post(authMiddleware, createSales);
salesRoute.route('/').get(authMiddleware, allSales)
salesRoute.route('/:id').get(authMiddleware, getSingleSales)

module.exports = salesRoute