import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
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
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const isCheckingAuth = useRef(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for storage changes from OTHER tabs only
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react to changes from OTHER tabs (e.key will be set)
      if (!e.key) return;
      
      // If tokens were removed in another tab, don't affect this tab
      if (e.key === 'access_token' || e.key === 'refresh_token') {
        // Do nothing - each tab maintains its own session
        return;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      
      // Refresh 5 minutes before expiry
      const refreshTime = expiresIn - 5 * 60 * 1000;
      
      if (refreshTime > 0) {
        const timer = setTimeout(() => {
          refreshToken();
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }, [user]);

  const checkAuth = async () => {
    if (isCheckingAuth.current) return;
    isCheckingAuth.current = true;

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
        // Don't logout, just clear state for this tab
        setUser(null);
        setProfile(null);
      }
    }
    setLoading(false);
    isCheckingAuth.current = false;
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        const response = await api.refreshAccessToken(refresh);
        localStorage.setItem('access_token', response.data.access);
        
        // Fetch profile again
        const profileRes = await api.getProfile();
        setUser(profileRes.data.user);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear this tab's session
        setUser(null);
        setProfile(null);
      }
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      const { user, profile, tokens } = response.data;
      
      // Store tokens - this won't affect other tabs
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
      // Only clear tokens and state for THIS tab
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
      setUser(response.data.user);
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
    sessionId, // Unique ID for this tab session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};