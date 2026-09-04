const express = require('express')
const adminRoute = express.Router();
const {getAdminDashboardData, downloadProjectAsset} = require('../controllers/admincontroller')
const adminAuth = require('../middlewares/AdminAuth')


adminRoute.route('/dashboard').get(adminAuth,getAdminDashboardData)
adminRoute.route('/asset/:id').get(adminAuth,downloadProjectAsset)

module.exports = adminRoute