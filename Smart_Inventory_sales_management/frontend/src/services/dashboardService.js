import API from "./api";

export const getOverview = async () => {
  const res = await API.get("/overview");
  return res.data;
};

export const getBestSellingProduct = async () => {
  const res = await API.get(
    "/reports/best-selling-product"
  );
  return res.data;
};

export const getBestStaff = async () => {
  const res = await API.get(
    "/reports/best-staff"
  );
  return res.data;
};

export const getLowStock = async () => {
  const res = await API.get(
    "/products/low-stock"
  );
  return res.data;
};