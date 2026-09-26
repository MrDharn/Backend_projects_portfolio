import API from './apiConfig';

export const getOverviewReport = () => API.get('/reports/overview');
export const getSalesReport = () => API.get('/reports/sales');
export const getBestSellingProducts = () => API.get('/reports/best-selling');
export const getStaffPerformance = () => API.get('/reports/staff-performance');