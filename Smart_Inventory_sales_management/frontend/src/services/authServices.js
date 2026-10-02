import API from './apiConfig';

export const loginUser = async (credentials) => API.post('/auth/login', credentials);
export const registerUser = async (userData) => API.post('/auth/register', userData);