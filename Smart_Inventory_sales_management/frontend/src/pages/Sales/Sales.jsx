import { useState, useContext, useEffect } from "react";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import styles from "./Sales.module.css";
import CartSidebar from "../../components/CartSidebar/CartSidebar";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const { addToCart } = useContext(CartContext);

  // SEARCH PRODUCTS
  const searchProducts = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      setProducts([]);
      return;
    }

    const res = await API.get(`/products/search?name=${value}`);
    setProducts(res.data.returnProduct);
  };

  return (
    <div className={styles.container}>
      <h2>POS System</h2>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => searchProducts(e.target.value)}
        className={styles.search}
      />

      {/* PRODUCTS */}
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <h3>{product.productName}</h3>
            <p>₦{product.sellingPrice}</p>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>{/* SEARCH PRODUCTS */}</div>

        <CartSidebar />
      </div>
    </div>
  );
}
