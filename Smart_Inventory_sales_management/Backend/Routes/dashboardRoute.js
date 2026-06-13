const express =  require('express')
const dashBoardRoute = express.Router();
const dashboardController = require('../controllers/dashboardController')

dashBoardRoute.route('/').get(dashboardController)

module.exports = dashBoardRoute
