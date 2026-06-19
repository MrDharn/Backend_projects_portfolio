import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import API from "../../services/api";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    getTotal,
    clearCart,
  } = useContext(CartContext);

  const checkout = async () => {
    const payload = {
      customerName: "Walk-in Customer",
      products: cart.map((item) => ({
        product: item._id,
        quantitySold: item.quantity,
      })),
    };

    await API.post("/sales/create", payload);

    clearCart();
    alert("Sale completed!");
  };

  return (
    <div className={styles.sidebar}>
      <h3>Cart</h3>

      {cart.map((item) => (
        <div key={item._id} className={styles.item}>
          <p>{item.productName}</p>

          <div className={styles.qty}>
            <button onClick={() => decreaseQty(item._id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increaseQty(item._id)}>+</button>
          </div>

          <button onClick={() => removeItem(item._id)}>x</button>
        </div>
      ))}

      <h4>Total: ₦{getTotal()}</h4>

      <button className={styles.checkout} onClick={checkout}>
        Issue Receipt
      </button>
    </div>
  );
}