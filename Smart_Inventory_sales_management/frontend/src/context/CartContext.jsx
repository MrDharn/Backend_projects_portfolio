import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add product
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) => item._id === product._id
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        { ...product, quantity: 1 },
      ];
    });
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item._id !== id)
    );
  };

  // Update quantity
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) =>
      sum + item.sellingPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);