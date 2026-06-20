import { useState } from "react";
import {
  createSupplier,
  updateSupplier,
} from "../../services/supplierService";

import styles from "./SupplierForm.module.css";

export default function SupplierForm({
  supplier,
  close,
  refresh,
}) {
  const [formData, setFormData] = useState({
    supplierName: supplier?.supplierName || "",
    email: supplier?.email || "",
    phoneNumber: supplier?.phoneNumber || "",
    address: supplier?.address || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (supplier) {
        await updateSupplier(
          supplier._id,
          formData
        );
      } else {
        await createSupplier(formData);
      }

      refresh();
      close();
    } catch (error) {
      console.log(error);
      alert("Operation failed");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>
          {supplier
            ? "Update Supplier"
            : "Create Supplier"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="supplierName"
            placeholder="Supplier Name"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className={styles.actions}>
            <button type="submit">
              {supplier ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}