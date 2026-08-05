import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getStoredToken, setStoredToken, removeStoredToken, getUserProfile } from '../services/apiClient';

export const AuthContext = createContext();

const PREVIEW_USER = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phoneNumber: '08012345678',
  walletNumber: '9012345678',
  balance: 154500.50,
  KYC_STATUS: 'Verified',
  isPinSet: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(PREVIEW_USER);
  const [token, setToken] = useState(getStoredToken() || 'demo_token');
  const [loading, setLoading] = useState(false);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');

  const fetchProfile = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(PREVIEW_USER);
      setLoading(false);
      return;
    }

    try {
      const res = await getUserProfile();
      if (res && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.log('Using preview user state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = (newToken, remember = false) => {
    setStoredToken(newToken, remember);
    setToken(newToken);
    setSessionExpiredMsg('');
    fetchProfile();
  };

  const logout = (message = '') => {
    removeStoredToken();
    setToken('');
    setUser(PREVIEW_USER);
    if (message) {
      setSessionExpiredMsg(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        sessionExpiredMsg,
        setSessionExpiredMsg,
        login,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
