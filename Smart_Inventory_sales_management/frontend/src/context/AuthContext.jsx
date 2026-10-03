import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authServices';
import { getMe } from '../services/user';

const AuthContext = createContext(null);

// Local Storage Helper Functions
const getStoredToken = () => localStorage.getItem('token') || '';
const setStoredToken = (token) => localStorage.setItem('token', token);
const removeStoredToken = () => localStorage.removeItem('token');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken() || '');
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');

  const fetchProfile = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(null);
      return;
    }

    try {
      const response = await getMe();
      if (response && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      // Clear invalid session on profile fetch error
      removeStoredToken();
      setToken('');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredToken();
      if (stored) {
        setToken(stored);
        await fetchProfile();
      }
      setIsInitialized(true);
    };

    initAuth();
  }, [fetchProfile]);

  const handleLogin = async (credentials) => {
    const response = await loginUser(credentials);
    const newToken = response.data?.token || response.token;
    if (newToken) {
      setStoredToken(newToken);
      setToken(newToken);
      await fetchProfile();
    }
    return response;
  };

  const handleRegister = async (userData) => {
    return await registerUser(userData);
  };

  const handleLogout = (message = '') => {
    removeStoredToken();
    setToken('');
    setUser(null);

    if (message) {
      setSessionExpiredMsg(message);
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isInitialized,
        sessionExpiredMsg,
        setSessionExpiredMsg,
        handleLogin,
        handleRegister,
        handleLogout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}