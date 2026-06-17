const express = require('express')
const stockMovementRoute = express.Router();
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')
const {getAllStockMovement, getSingleStockMovement, getProductStockMovement} = require('../controllers/stockMovementController')

stockMovementRoute.route('/').get(authMiddleware, userManagementMiddleware, getAllStockMovement);
stockMovementRoute.route('/product/:id').get(authMiddleware,userManagementMiddleware,getProductStockMovement)
stockMovementRoute.route('/:id').get(authMiddleware,userManagementMiddleware, getSingleStockMovement)

module.exports = stockMovementRoute