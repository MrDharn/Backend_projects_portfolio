import API from './apiConfig';

export const getProducts = () => API.get('/products');
export const getSingleProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/categories', data);
export const updateProduct = (id, data) => API.patch(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const searchProducts = (query) => API.get(`/products/search?q=${query}`);
export const filterProductsByCategory = (catId) => API.get(`/products/filter?category=${catId}`);
export const getLowStockProducts = () => API.get('/products/lowStock');
export const restockProduct = (data) => API.post('/categories', data);