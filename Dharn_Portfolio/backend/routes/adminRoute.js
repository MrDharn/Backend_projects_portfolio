const express = require('express')
const adminRoute = express.Router();
const {getAdminDashboardData, downloadProjectAsset} = require('../controllers/admincontroller')
const adminAuth = require('../middlewares/AdminAuth')

adminRoute.use(adminAuth);

adminRoute.route('/dashboard', getAdminDashboardData)
adminRoute.route('/asset/:id', downloadProjectAsset)

module.exports = adminRoute