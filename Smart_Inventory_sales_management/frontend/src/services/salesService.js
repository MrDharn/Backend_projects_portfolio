import API from "./apiConfig";

export const createSale = (saleData) => API.post('/categories', saleData);
export const getAllSales = () => API.get('/sales');
export const getSingleSale = (id) => API.get(`/sales/${id}`);