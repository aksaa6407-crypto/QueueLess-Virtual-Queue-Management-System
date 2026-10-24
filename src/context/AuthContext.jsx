import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('queueless_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('queueless_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync token & profile on initial app load
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('queueless_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('queueless_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session verification expired or invalid. Clearing credentials.');
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('queueless_token', receivedToken);
      localStorage.setItem('queueless_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('queueless_token', receivedToken);
      localStorage.setItem('queueless_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('queueless_token');
    localStorage.removeItem('queueless_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('queueless_user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
