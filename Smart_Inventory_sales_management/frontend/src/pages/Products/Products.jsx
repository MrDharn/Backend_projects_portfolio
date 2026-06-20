import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  searchProduct,
} from "../../services/productService";

import ProductForm from "../../components/ProductForm/ProductForm";

import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    await deleteProduct(id);

    loadProducts();
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    if (!value.trim()) {
      loadProducts();
      return;
    }

    const res = await searchProduct(value);

    setProducts(res.returnProduct);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Products</h2>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search product..."
        onChange={handleSearch}
        className={styles.search}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.productName}</td>

              <td>
                {product.category?.categoryName ||
                  "No Category"}
              </td>

              <td>
                {product.supplier?.supplierName ||
                  "No Supplier"}
              </td>

              <td>{product.quantity}</td>

              <td>₦{product.costPrice}</td>

              <td>₦{product.sellingPrice}</td>

              <td>
                {product.quantity === 0 ? (
                  <span className={styles.outStock}>
                    Out of Stock
                  </span>
                ) : product.quantity <= 10 ? (
                  <span className={styles.lowStock}>
                    Low Stock
                  </span>
                ) : (
                  <span className={styles.inStock}>
                    In Stock
                  </span>
                )}
              </td>

              <td>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(product._id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          close={() => setShowForm(false)}
          refresh={loadProducts}
        />
      )}
    </div>
  );
}