import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthPage from '../../auth/AuthPage'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ 
          maxWidth: '480px', 
          margin: '40px auto', 
          padding: '24px', 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '8px' }}>🔒 Authentication Required</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            You must log in or register an account to access the Smart Inventory System.
          </p>
          <AuthPage />
        </div>
      </div>
    );
  }

  return children;
}