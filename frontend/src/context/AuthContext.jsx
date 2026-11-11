import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setStoredToken } from '../services/api';
import { playSuccess, playError } from '../utils/audio';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cyber_jwt_token'));
  const [loading, setLoading] = useState(true);

  // Valida token existente ao inicializar
  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await api.me();
          setUser(res.user);
        } catch (err) {
          console.warn('Sessão expirada ou token inválido');
          setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await api.login(username, password);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      playSuccess();
      return res;
    } catch (err) {
      playError();
      throw err;
    }
  };

  const register = async (username, password, callsign) => {
    try {
      const res = await api.register(username, password, callsign);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      playSuccess();
      return res;
    } catch (err) {
      playError();
      throw err;
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    playError();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

