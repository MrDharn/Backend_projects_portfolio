import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import React from "react";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/categories/Categories";
import Sales from "../pages/sales/Sales";
import Suppliers from "../pages/suppliers/Suppliers";
import Customers from "../pages/customers/Customers";
import Purchases from "../pages/purchases/Purchases";
import Settings from "../pages/settings/Settings";
import Users from "../pages/users/Users";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboar  */}
      <Route
        path="/"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/products"
        element={
          <DashboardLayout>
            <Products />
          </DashboardLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <DashboardLayout>
            <Categories />
          </DashboardLayout>
        }
      />

      <Route
        path="/sales"
        element={
          <DashboardLayout>
            <Sales />
          </DashboardLayout>
        }
      />

      <Route
        path="suppliers"
        element={
          <DashboardLayout>
            <Suppliers />
          </DashboardLayout>
        }
      />

      <Route
        path="/purchases"
        element={
          <DashboardLayout>
            <Purchases />
          </DashboardLayout>
        }
      />

      <Route
        path="/customers"
        element={
          <DashboardLayout>
            <Customers />
          </DashboardLayout>
        }
      />

      <Route
        path="/users"
        element={
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
