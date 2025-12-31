import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, logout as apiLogout } from '@/api/auth.api';
import { getToken, removeToken } from '@/api/apiClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getToken('auth_token');
      if (token) {
        try {
          const response = await getProfile();
          if (response.success) {
            const userData = {
              id: response.user?.id || response.user?.user_id,
              email: response.user?.email,
              full_name: response.user?.full_name,
              role_id: response.user?.role_id,
              branch_id: response.user?.branch_id,
              must_change_password: response.user?.must_change_password || false,
              role: getToken('userRole') || 'user'
            };
            setUser(userData);
            setIsAuthenticated(true);

            // Check if user must change password
            if (userData.must_change_password && window.location.pathname !== '/auth/change-password') {
              navigate('/auth/change-password');
            }
          } else {
            // Token is invalid, clear it
            removeToken('auth_token');
            removeToken('refreshToken');
            removeToken('userRole');
            removeToken('userId');
            removeToken('userName');
            removeToken('userEmail');
            removeToken('roleId');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          // Clear authentication state on any error
          // This prevents redirect loops and ensures clean state
          removeToken('auth_token');
          removeToken('refreshToken');
          removeToken('userRole');
          removeToken('userId');
          removeToken('userName');
          removeToken('userEmail');
          removeToken('roleId');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);

    // Check if user must change password
    if (userData.must_change_password && window.location.pathname !== '/auth/change-password') {
      navigate('/auth/change-password');
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeToken('auth_token');
      removeToken('refreshToken');
      removeToken('userRole');
      removeToken('userId');
      removeToken('userName');
      removeToken('userEmail');
      removeToken('roleId');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    role: user?.role,
    userId: user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    roleId: user?.role_id,
    branchId: user?.branch_id,
    mustChangePassword: user?.must_change_password
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};