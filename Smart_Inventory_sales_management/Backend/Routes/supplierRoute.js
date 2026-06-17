const express = require('express');
//supplier controllers
const {createSupplier, allSuppliers, getSingleSupplier, updateSupplier,deleteSupplier} = require('../controllers/supplierController');

//middlewares
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')
const supplierRoute = express.Router();

supplierRoute.route('/').post(authMiddleware, userManagementMiddleware, createSupplier)
supplierRoute.route('/').get(authMiddleware, userManagementMiddleware, allSuppliers)
supplierRoute.route('/:id').get(authMiddleware, userManagementMiddleware, getSingleSupplier)
supplierRoute.route('/:id').patch(authMiddleware, userManagementMiddleware, updateSupplier)
supplierRoute.route('/:id').delete(authMiddleware, userManagementMiddleware, deleteSupplier)

module.exports = supplierRoute