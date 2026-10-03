import API from './apiConfig';

export const getSuppliers = () => API.get('/suppliers');
export const getSingleSupplier = (id) => API.get(`/suppliers/${id}`);
export const createSupplier = (data) => API.post('/suppliers', data);
export const updateSupplier = (id, data) => API.patch(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);