import React, { useState } from 'react';
import { api } from '../../services/api';

export default function AdminLogin({ setToken }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.loginAdmin(loginData);
      if (response.status === 'success' && response.token) {
        setToken(response.token);
        localStorage.setItem('adminToken', response.token);
      } else {
        setError(response.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 font-mono">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
        <h2 className="text-lg font-bold text-slate-100">Admin Authentication Required</h2>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Admin Email</label>
          <input
            type="email"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors"
        >
          {loading ? 'Authenticating...' : 'Authenticate & Unlock'}
        </button>
      </form>
    </div>
  );
}