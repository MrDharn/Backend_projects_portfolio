import React from 'react';

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="card">
      <h3>Inventory Catalog</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
        {products.map((product) => (
          <div 
            key={product._id} 
            className="card" 
            style={{ cursor: 'pointer', textAlign: 'center', borderColor: product.stock <= 0 ? '#fca5a5' : '#e2e8f0' }}
            onClick={() => onAddToCart(product)}
          >
            <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>{product.name}</h4>
            <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${product.price.toFixed(2)}</p>
            <span style={{ fontSize: '0.75rem', color: product.stock <= 5 ? 'var(--danger)' : 'var(--text-muted)' }}>
              Stock: {product.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}