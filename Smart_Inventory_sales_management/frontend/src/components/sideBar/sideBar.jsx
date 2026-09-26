import React from "react";
import { useAuth } from "../../context/AuthContext";
export default function Sidebar({ activeTab, setActiveTab }) {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "pos", label: "🛒 POS Terminal" },
    { id: "products", label: "📦 Products" },
    { id: "categories", label: "📁 Categories" },
    { id: "suppliers", label: "🚛 Suppliers" },
    { id: "stock", label: "🔄 Stock Movements" },
    { id: "reports", label: "📈 Reports" },
    { id: "auth", label: "🔐 Auth" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SmartInventory</div>
      <nav className="sidebar-nav">
        {!isAuthenticated ? (
          <button
            className={`nav-btn ${activeTab === "auth" ? "active" : ""}`}
            onClick={() => setActiveTab("auth")}
          >
            🔐 Login / Register
          </button>
        ) : (
          <>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </>
        )}
      </nav>

      {isAuthenticated && (
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
            Logged in as: <strong>{user?.username || 'User'}</strong>
          </div>
          <button 
            className="btn btn-danger" 
            style={{ width: '100%', padding: '8px' }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </aside>
  );
}
