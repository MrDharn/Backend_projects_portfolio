import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authServices';
import { getMe } from '../services/user';
import { getStoredToken } from '../../../../Digital_Wallet_and_Payment_Processing_System/Frontend/src/services/apiClient';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken() || '')
  const [isInitialized, setIsInitialized] = useState(false)
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('')

  const fetchProfile = useCallback(async()=> {
    const stored = getStoredToken();
    if(!stored){
      setUser(null);

      return
    }

    try{

      const response = await getMe();
      if(response && response.data){
        setUser(response.data)
      }
    }catch(err){
      console.error('Failed to fetch user profile', err)
    }
  }, [])

  useEffect(()=>{
    const initAuth = async()=> {
      const stored = getStoredToken();
      if(stored){
        setToken(stored)

        await fetchProfile();
      }

      setIsInitialized(true)
    }

    initAuth()
  }, [fetchProfile])

  const login = (newToken, remember = false)=> {
    setToken(newToken)
    setStoredToken(newToken, remember)
    fetchProfile()
  }

  const logout = (message = '')=> {
    removeStoredToken();
    setToken('')
    setUser(null);

    if(message){
      setSessionExpiredMsg(message)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,token,
      isInitialized,
      setSessionExpiredMsg,
      setSessionExpiredMsg,
      login,
      logout,
      refreshProfile : fetchProfile
    }}></AuthContext.Provider>
  )
}
 