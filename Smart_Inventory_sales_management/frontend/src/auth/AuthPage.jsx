import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { user, token, handleLogin, handleRegister, handleLogout } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await handleLogin({ username: form.username, password: form.password });
        alert('Logged in successfully!');
      } else {
        await handleRegister(form);
        alert('Registration complete! Please login.');
        setIsLoginView(true);
      }
    } catch (err) {
      alert('Authentication error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (token) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
        <h3>Active Session</h3>
        <p style={{ margin: '12px 0' }}>Logged in as: <strong>{user?.username || 'Authenticated User'}</strong></p>
        <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h3>{isLoginView ? 'User Login' : 'Register Account'}</h3>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        />

        {!isLoginView && (
          <input 
            type="email" 
            placeholder="Email Address" 
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        )}

        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        />

        <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
          {isLoginView ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {isLoginView ? "Don't have an account? " : "Already registered? "}
        <span 
          style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? 'Register' : 'Login'}
        </span>
      </p>
    </div>
  );
}