import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          // Token is valid, fetch user profile
          const profileRes = await api.getProfile();
          setUser(profileRes.data.user);
          setProfile(profileRes.data);
        } else {
          // Token expired, try to refresh
          await refreshToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        const response = await api.refreshAccessToken(refresh);
        localStorage.setItem('access_token', response.data.access);
        await checkAuth();
      } catch (error) {
        logout();
      }
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      const { user, profile, tokens } = response.data;
      
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      setUser(user);
      setProfile(profile);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      const { user, profile, tokens } = response.data;
      
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      setUser(user);
      setProfile(profile);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await api.logout(refresh);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.updateProfile(profileData);
      setProfile(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAuthor: profile?.role === 'author',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};