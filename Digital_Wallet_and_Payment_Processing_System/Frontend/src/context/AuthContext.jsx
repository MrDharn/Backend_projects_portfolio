import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getStoredToken, setStoredToken, removeStoredToken, getUserProfile } from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
      const res = await getUserProfile();
      if (res && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
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

  const login = (newToken, remember = false) => {
    setStoredToken(newToken, remember);
    setToken(newToken);
    setSessionExpiredMsg('');
    fetchProfile();
  };

  const logout = (message = '') => {
    removeStoredToken();
    setToken('');
    setUser(null);
    if (message) {
      setSessionExpiredMsg(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isInitialized,
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
