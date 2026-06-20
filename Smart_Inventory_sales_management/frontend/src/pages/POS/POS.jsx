import { useState } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";

export default function POS() {
  const { cart, addToCart, removeFromCart, updateQty, total, clearCart } =
    useCart();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  // search products
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) return;

    const res = await API.get(
      `/products/search?name=${value}`
    );

    setProducts(res.data.returnProduct);
  };

  // checkout
  const handleCheckout = async () => {
    try {
      await API.post("/sales", {
        items: cart,
        totalAmount: total,
      });

      clearCart();
      alert("Payment successful");
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div className="pos-container">
      {/* LEFT - PRODUCTS */}
      <div>
        <h2>POS</h2>

        <input
          placeholder="Search product..."
          value={search}
          onChange={handleSearch}
        />

        <div>
          {products.map((p) => (
            <div key={p._id}>
              <p>{p.productName}</p>
              <p>₦{p.sellingPrice}</p>

              <button
                onClick={() => addToCart(p)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - CART */}
      <div>
        <h2>Cart</h2>

        {cart.map((item) => (
          <div key={item._id}>
            <p>{item.productName}</p>

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateQty(
                  item._id,
                  Number(e.target.value)
                )
              }
            />

            <button
              onClick={() =>
                removeFromCart(item._id)
              }
            >
              Remove
            </button>
          </div>
        ))}

        <h3>Total: ₦{total}</h3>

        <button onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}