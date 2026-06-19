import API from "./api";

export const getOverview = async () => {
  const res = await API.get("/reports/overview");
  return res.data;
};