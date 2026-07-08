import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import wallet from "../src/pages/wallet";
import Transfer from "../src/pages/Transfer";
import Transactions from "../src/pages/Transactions";
import Profile from "../src/pages/Profile";
import Settings from "../src/pages/Settings";


//
import ProtectedRoute from './routes/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/transfer" element={
         <ProtectedRoute>
            <Transfer/>
          </ProtectedRoute>
      } />
      <Route path="/transactions" element={
         <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
      } />
      <Route path="/profile" element={
         <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
      } />
      <Route path="/settings" element={
         <ProtectedRoute>
            <Settings/>
          </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
