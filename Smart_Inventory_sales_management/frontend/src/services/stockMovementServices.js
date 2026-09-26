import API from './apiConfig';

export const getAllStockMovements = () => API.get('/stock-movements');
export const getStockMovementsByProduct = (productId) => API.get(`/stock-movements?product=${productId}`);
export const getSingleStockMovement = (id) => API.get(`/stock-movements/${id}`);