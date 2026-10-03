import React, { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Sidebar from "./components/sideBar/sideBar";
import { useAuth } from "./context/AuthContext";

import AuthPage from "./auth/AuthPage";
import PosTerminal from "./components/pos/PosTerminal";
import ProductList from "./components/products/ProductList";
import CategoryList from "./components/categories/CategoryList";
import SupplierList from "./components/suppliers/SupplierList";
import StockMovementLogs from "./components/stockMovements/StockMovementLogs";
import ReportsDashboard from "./components/reports/ReportsDashBoard";

import { getProducts } from "./services/productServices";
import "./assets/styles/global.css";

export default function App() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState(isAuthenticated ? "dashboard" : "auth");
  const [products, setProducts] = useState([]);

  // Sync active tab when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab("auth");
    } else if (activeTab === "auth") {
      setActiveTab("dashboard");
    }
  }, [isAuthenticated]);

  // Memoized fetch function to prevent infinite re-render loop
  const fetchInventory = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventory();
    }
  }, [isAuthenticated, fetchInventory]);

  if (!isInitialized) {
    return <div className="loading-screen">Loading Application...</div>;
  }

  return (
    <div className="app-layout" style={{ display: "flex", height: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main
        className="main-content"
        style={{ flex: 1, padding: "24px", overflowY: "auto" }}
      >
        {activeTab === "auth" && <AuthPage />}

        {activeTab === "dashboard" && (
          <ProtectedRoute>
            <div className="card">
              <h2>Welcome to Smart Inventory</h2>
              <p style={{ marginTop: "8px", color: "var(--text-muted)" }}>
                Select a module from the sidebar to manage products, categories,
                sales, and analytics.
              </p>
            </div>
          </ProtectedRoute>
        )}

        {activeTab === "pos" && (
          <ProtectedRoute>
            <PosTerminal products={products} onSaleComplete={fetchInventory} />
          </ProtectedRoute>
        )}

        {activeTab === "products" && (
          <ProtectedRoute>
            <ProductList products={products} refreshProducts={fetchInventory} />
          </ProtectedRoute>
        )}

        {activeTab === "categories" && (
          <ProtectedRoute>
            <CategoryList />
          </ProtectedRoute>
        )}

        {activeTab === "suppliers" && (
          <ProtectedRoute>
            <SupplierList />
          </ProtectedRoute>
        )}

        {activeTab === "stock" && (
          <ProtectedRoute>
            <StockMovementLogs />
          </ProtectedRoute>
        )}

        {activeTab === "reports" && (
          <ProtectedRoute>
            <ReportsDashboard />
          </ProtectedRoute>
        )}
      </main>
    </div>
  );
}