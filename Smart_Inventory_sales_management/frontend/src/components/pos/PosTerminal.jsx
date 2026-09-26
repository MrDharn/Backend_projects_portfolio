import React, { useState } from 'react';
import ProductGrid from './ProductGrid';
import CartDrawer from './CartDrawer';
import { createSale } from '../../services/salesService';


export default function PosTerminal({ products, onSaleComplete }) {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return alert('Out of stock!');
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const payload = {
      items: cart.map(item => ({ productId: item._id, quantity: item.qty })),
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    };

    try {
      await createSale(payload);
      alert('Sale processed successfully!');
      setCart([]);
      if (onSaleComplete) onSaleComplete();
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="pos-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
      <CartDrawer cart={cart} setCart={setCart} onCheckout={handleCheckout} />
    </div>
  );
}