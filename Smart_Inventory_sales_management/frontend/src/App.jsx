import React, { useState, useEffect } from 'react';
import Sidebar from './components/sideBar/sideBar';
import PosTerminal from './components/pos/PosTerminal';
import ProductList from './components/products/ProductList';
import ReportsDashboard from './components/reports/ReportsDashboard';
import StockMovementLogs from './components/stockMovements/StockMovementLogs';
import { getProducts } from './services/productService';
import './assets/styles/global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);

  const fetchInventory = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="app-layout" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {activeTab === 'pos' && (
          <PosTerminal products={products} onSaleComplete={fetchInventory} />
        )}
        {activeTab === 'products' && (
          <ProductList products={products} refreshProducts={fetchInventory} />
        )}
        {activeTab === 'stock' && <StockMovementLogs />}
        {activeTab === 'reports' && <ReportsDashboard />}
      </main>
    </div>
  );
}