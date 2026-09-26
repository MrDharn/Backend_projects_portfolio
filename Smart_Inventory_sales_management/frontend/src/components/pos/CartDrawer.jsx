import React from 'react';

export default function CartDrawer({ cart, setCart, onCheckout }) {
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item._id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3>Cart Summary</h3>
        <div style={{ marginTop: '16px', maxHeight: '350px', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQty(item._id, -1)} style={{ padding: '2px 8px' }}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, 1)} style={{ padding: '2px 8px' }}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '16px' }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={onCheckout} 
          disabled={cart.length === 0}
          style={{ width: '100%', padding: '12px', backgroundColor: 'var(--success)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Process Sale
        </button>
      </div>
    </div>
  );
}