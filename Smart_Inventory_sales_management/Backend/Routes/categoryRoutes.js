const {deleteCategory,updateCategory,allCategories,getSingleCategory, createCategory} = require('../controllers/categoryController')
const express = require('express')
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')
const categoryRoute = express.Router();

categoryRoute.route('/').post(authMiddleware, userManagementMiddleware, createCategory)
categoryRoute.route('/').get(authMiddleware, userManagementMiddleware, allCategories)
categoryRoute.route('/:id').get(authMiddleware, userManagementMiddleware, getSingleCategory)
categoryRoute.route('/:id').get(authMiddleware, userManagementMiddleware, updateCategory)
categoryRoute.route('/:id').get(authMiddleware, userManagementMiddleware, deleteCategory)

module.exports = categoryRoute