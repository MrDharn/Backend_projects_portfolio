import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'pos', label: '🛒 POS Terminal' },
    { id: 'products', label: '📦 Products' },
    { id: 'categories', label: '📁 Categories' },
    { id: 'suppliers', label: '🚛 Suppliers' },
    { id: 'stock', label: '🔄 Stock Movements' },
    { id: 'reports', label: '📈 Reports' },
    { id: 'auth', label: '🔐 Auth' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SmartInventory</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}