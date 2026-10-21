import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('code_minder_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('code_minder_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('code_minder_user', JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('code_minder_token');
          localStorage.removeItem('code_minder_user');
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        setUser(null);
        localStorage.removeItem('code_minder_token');
        localStorage.removeItem('code_minder_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res.token) {
        localStorage.setItem('code_minder_token', res.token);
      }
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('code_minder_user', JSON.stringify(res.data.user));
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authApi.register(userData);
      if (res.token) {
        localStorage.setItem('code_minder_token', res.token);
      }
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('code_minder_user', JSON.stringify(res.data.user));
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('code_minder_token');
      localStorage.removeItem('code_minder_user');
      setUser(null);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('code_minder_user', JSON.stringify(updatedUserData));
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('code_minder_user', JSON.stringify(response.data.user));
      }
    } catch (err) {
      // Keep existing state if offline
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
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
