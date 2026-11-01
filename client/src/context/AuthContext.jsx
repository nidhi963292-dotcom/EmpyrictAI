import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('empyrict_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('empyrict_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('empyrict_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem('empyrict_user', JSON.stringify(res.user));
        } catch (error) {
          console.warn('[AuthContext] Session expired, logging out.');
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('empyrict_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateUser
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
