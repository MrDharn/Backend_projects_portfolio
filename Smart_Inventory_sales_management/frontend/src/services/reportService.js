import API from "./api";

export const getDailyReport = async (date) => {
  const res = await API.get(`/reports/daily?date=${date}`);
  return res.data;
};

export const getBestProducts = async () => {
  const res = await API.get(`/reports/best-products`);
  return res.data;
};

export const getBestStaff = async () => {
  const res = await API.get(`/reports/best-staff`);
  return res.data;
};