import API from "./api";
import API from "./api";

export const getSuppliers = async () => {
  const res = await API.get("/suppliers");
  return res.data;
};

export const createSupplier = async (data) => {
  const res = await API.post("/suppliers", data);
  return res.data;
};

export const updateSupplier = async (id, data) => {
  const res = await API.put(`/suppliers/${id}`, data);
  return res.data;
};

export const deleteSupplier = async (id) => {
  const res = await API.delete(`/suppliers/${id}`);
  return res.data;
};