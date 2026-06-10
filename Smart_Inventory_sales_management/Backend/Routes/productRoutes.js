const express = require('express')
const productRouter = express.Router();
const authMiddleware = require('../Middlewares/authMiddleware')
const userManagementMiddleware = require('../Middlewares/userManagementMiddleware')
const {
  createProduct,
  allProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  filterByCategory,
  searchProduct, getLowStockedProducts,
  restockProduct
} = require('../controllers/productController');

productRouter.route('/').post(authMiddleware, createProduct)
productRouter.route('/').get(authMiddleware, allProducts)
productRouter.route('/search').get(authMiddleware, searchProduct)
productRouter.route('/category').get(authMiddleware, filterByCategory)
productRouter.route('/low-stock').get(authMiddleware, getLowStockedProducts)
productRouter.route('/restock').get(authMiddleware,userManagementMiddleware, restockProduct)
productRouter.route('/:id').get(authMiddleware,getSingleProduct)
productRouter.route('/:id').patch(authMiddleware, userManagementMiddleware, updateProduct)
productRouter.route('/:id').delete(authMiddleware, userManagementMiddleware,deleteProduct)

module.exports = productRouter