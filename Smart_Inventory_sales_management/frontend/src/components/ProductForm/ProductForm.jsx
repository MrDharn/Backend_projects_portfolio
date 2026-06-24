import { useEffect, useState } from "react";

import {
  createProduct,
  updateProduct,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";

import styles from "./ProductForm.module.css";

export default function ProductForm({
  product,
  close,
  refresh,
}) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    category: "",
    supplier: "",
  });

  useEffect(() => {
    loadData();

    if (product) {
      setFormData({
        productName: product.productName || "",
        description: product.description || "",
        quantity: product.quantity || "",
        costPrice: product.costPrice || "",
        sellingPrice: product.sellingPrice || "",
        category: product.category?._id || "",
        supplier: product.supplier?._id || "",
      });
    }
  }, []);

  const loadData = async () => {
    const categoryRes = await getCategories();
    const supplierRes = await getSuppliers();

    setCategories(categoryRes.categories);
    setSuppliers(supplierRes.suppliers);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (product) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
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
          {product
            ? "Update Product"
            : "Create Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={formData.costPrice}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* SUPPLIER */}

          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Supplier
            </option>

            {suppliers.map((supplier) => (
              <option
                key={supplier._id}
                value={supplier._id}
              >
                {supplier.supplierName}
              </option>
            ))}
          </select>

          <div className={styles.actions}>
            <button type="submit">
              {product ? "Update" : "Create"}
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