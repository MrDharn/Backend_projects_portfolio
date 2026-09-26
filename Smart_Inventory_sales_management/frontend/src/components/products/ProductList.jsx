import React, { useState } from 'react';
import RestockModal from './RestockModal';
import { deleteProduct, searchProducts, getLowStockProducts } from '../../services/productServices';

export default function ProductList({ products, refreshProducts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      refreshProducts();
      return;
    }
    try {
      const res = await searchProducts(searchQuery);
      refreshProducts(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleFilterLowStock = async () => {
    try {
      const res = await getLowStockProducts();
      refreshProducts(res.data);
    } catch (err) {
      console.error('Failed to filter low stock:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refreshProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const openRestock = (product) => {
    setSelectedProduct(product);
    setIsRestockOpen(true);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3>Products Directory</h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '4px' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            />
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>

          <button className="btn btn-secondary" onClick={handleFilterLowStock}>⚠️ Low Stock Filter</button>
          <button className="btn btn-secondary" onClick={() => refreshProducts()}>Reset List</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => {
            const isLow = prod.stock <= (prod.lowStockThreshold || 5);
            return (
              <tr key={prod._id}>
                <td><strong>{prod.name}</strong></td>
                <td>{prod.category?.name || 'Uncategorized'}</td>
                <td>${prod.price?.toFixed(2)}</td>
                <td>{prod.stock}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      backgroundColor: isLow ? '#fee2e2' : '#d1fae5',
                      color: isLow ? '#991b1b' : '#065f46'
                    }}
                  >
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '8px' }} onClick={() => openRestock(prod)}>Restock</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(prod._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isRestockOpen && selectedProduct && (
        <RestockModal 
          product={selectedProduct} 
          onClose={() => setIsRestockOpen(false)} 
          onSuccess={() => {
            setIsRestockOpen(false);
            refreshProducts();
          }} 
        />
      )}
    </div>
  );
}