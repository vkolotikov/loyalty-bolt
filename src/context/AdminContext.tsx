import React, { createContext, useContext, useState, useCallback } from 'react';
import { Admin, AdminStats } from '../types/admin';
import { adminApi } from '../services/admin';

interface AdminContextType {
  admin: Admin | null;
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Separate hook into named function for better Fast Refresh support
function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const adminData = await adminApi.login(username, password);
      setAdmin(adminData);
      const statsData = await adminApi.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setAdmin(null);
    setStats(null);
    setError(null);
  }, []);

  const refreshStats = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    setError(null);
    try {
      const newStats = await adminApi.getStats();
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  const value = {
    admin,
    stats,
    loading,
    error,
    login,
    logout,
    refreshStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Export named components and hooks
export { AdminProvider, useAdminContext as useAdmin };