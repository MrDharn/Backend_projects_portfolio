import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authServices';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user')
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    const response = await loginUser(credentials);
    const {token: authToken, user: userData} = response.data
    if (authToken) {
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('user'. JSON.stringify(userData))
    }
    return response.data;
  };

  const handleRegister = async (userData) => {
    return await registerUser(userData);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
     localStorage.removeItem('token')
    localStorage.removeItem('user')
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleRegister, handleLogout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);