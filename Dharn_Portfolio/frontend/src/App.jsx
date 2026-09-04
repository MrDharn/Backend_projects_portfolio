
import React, { useState } from 'react';
import Header from './components/Header';
import PublicShowcase from './features/public/PublicShowcase';
import AdminPortal from './features/public/AdminPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasToken={Boolean(adminToken)} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'portfolio' ? (
          <PublicShowcase />
        ) : (
          <AdminPortal token={adminToken} setToken={setAdminToken} />
        )}
      </main>
    </div>
  );
}