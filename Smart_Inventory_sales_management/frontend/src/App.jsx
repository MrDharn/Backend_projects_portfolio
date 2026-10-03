import React, { useState, useEffect, useCallback } from "react";


import {Routes, Route, Navigate} from 'react-router-dom'
import MainLayout from "./layout/MainLayout";
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
import { Form } from "react-router-dom";

export default function App() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [products, setProducts] = useState([]);

  // Fetch inventory when authenticated
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

  // 1. If NOT authenticated, show ONLY the Auth Page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // 2. If authenticated, render full application layout with Sidebar
  return (
    <Routes>
      <Route path='/login' element={<AuthPage/>} />

      {/* Protected ROutes */}

      <Route element={<ProtectedRoute/>}>
        <Route element={<MainLayout/>}>
          <Route path="/dashboard" element = {

            <div className="card">
              <h2>Welcome to Smart Inventory</h2>
              <p>Select a module from a sidebar to get started. </p>

            </div>
          } />

          <Route path='/pos' element={<PosTerminal products={products} onSalescomplete={fetchInventory} />} />
          <Route path='/products' element = {<ProductList products={products} refreshProducts={fetchInventory} />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path = "/suppliers" element={<SupplierList/>} />
          <Route path = '/stock' element={<StockMovementLogs />} />
          <Route path='/reports' element = {<ReportsDashboard /> } />
        </Route>
      </Route>

      {/* Catch all routes */}
      <Route path='*' element={<Navigate to={isAuthenticated ? "/dashboard" : '/login'} replace /> } />
    </Routes>
  )
}