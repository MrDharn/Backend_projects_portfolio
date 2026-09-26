import React, { useState } from 'react';
import { restockProduct } from '../../services/productServices';

export default function RestockModal({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restockProduct({ productId: product._id, quantity: Number(quantity) });
      alert(`Restocked ${quantity} units for ${product.name}`);
      onSuccess();
    } catch (err) {
      console.error('Restock failed:', err);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div className="card" style={{ width: '360px' }}>
        <h3>Restock Product</h3>
        <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Product: <strong>{product.name}</strong> (Current Stock: {product.stock})
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          <label style={{ fontSize: '0.85rem' }}>Quantity to Add:</label>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm Restock</button>
          </div>
        </form>
      </div>
    </div>
  );
}