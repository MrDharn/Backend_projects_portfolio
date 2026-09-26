import React, { useState, useEffect } from 'react';
import { getAllStockMovements } from '../../services/stockMovementServices';

export default function StockMovementLogs() {
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    async function loadMovements() {
      try {
        const res = await getAllStockMovements();
        setMovements(res.data || []);
      } catch (err) {
        console.error('Failed to load stock movements:', err);
      }
    }
    loadMovements();
  }, []);

  return (
    <div className="card">
      <h3>Stock Movement Audit Ledger</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
        Real-time audit log of inventory changes (Sales, Restocks, Manual Adjustments).
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Product</th>
            <th>Movement Type</th>
            <th>Quantity</th>
            <th>Reference/Reason</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt || Date.now()).toLocaleString()}</td>
              <td><strong>{log.product?.name || log.productId}</strong></td>
              <td>
                <span 
                  style={{ 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: log.type === 'IN' ? '#d1fae5' : '#fee2e2',
                    color: log.type === 'IN' ? '#065f46' : '#991b1b'
                  }}
                >
                  {log.type}
                </span>
              </td>
              <td>{log.type === 'IN' ? `+${log.quantity}` : `-${log.quantity}`}</td>
              <td>{log.reason || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}