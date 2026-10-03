import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/pos", label: "🛒 POS Terminal" },
    { path: "/products", label: "📦 Products" },
    { path: "/categories", label: "📁 Categories" },
    { path: "/suppliers", label: "🚛 Suppliers" },
    { path: "/stock", label: "🔄 Stock Movements" },
    { path: "/reports", label: "📈 Reports" },
  ];

  const onLogout = () => {
    handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SmartInventory</div>

      <nav className="sidebar-nav">
        {!isAuthenticated ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-btn ${isActive ? "active" : ""}`
            }
          >
            🔐 Login / Register
          </NavLink>
        ) : (
          menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"} // Ensures exact match for home route
              className={({ isActive }) =>
                `nav-btn ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))
        )}
      </nav>

      {isAuthenticated && (
        <div
          style={{
            marginTop: "auto",
            padding: "16px",
            borderTop: "1px solid #1e293b",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Logged in as: <strong>{user?.username || user?.email || "User"}</strong>
          </div>
          <button
            type="button"
            className="btn btn-danger"
            style={{ width: "100%", padding: "8px" }}
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </aside>
  );
}