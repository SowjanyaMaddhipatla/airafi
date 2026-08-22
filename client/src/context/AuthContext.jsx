import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem('airafi_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem('airafi_token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = (token, userData, profileData) => {
    localStorage.setItem('airafi_token', token);
    setUser(userData);
    setProfile(profileData || null);
  };

  const logout = () => {
    localStorage.removeItem('airafi_token');
    setUser(null);
    setProfile(null);
  };

  const setActiveProfile = (profileData) => setProfile(profileData);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, logout, setActiveProfile, refresh: loadSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
