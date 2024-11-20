import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminStats from '../components/admin/AdminStats';
import ClientRegistrationForm from '../components/admin/ClientRegistrationForm';
import ClientList from '../components/admin/ClientList';
import { adminApi } from '../services/admin';
import { Client } from '../types/client';

const AdminDashboardPage: React.FC = () => {
  const { admin, stats, loading, error, logout, refreshStats } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'clients' | 'register'>('stats');
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    
    if (!stats) {
      refreshStats();
    }

    // Load clients for stats
    const loadClients = async () => {
      try {
        const data = await adminApi.getClients();
        setClients(data);
      } catch (err) {
        console.error('Failed to load clients:', err);
      }
    };
    loadClients();
  }, [admin, stats, navigate, refreshStats]);

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-neutral mr-4">Welcome, {admin.username}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-neutral/60 hover:text-neutral hover:border-neutral/30'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-neutral/60 hover:text-neutral hover:border-neutral/30'
              }`}
            >
              Client List
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'register'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-neutral/60 hover:text-neutral hover:border-neutral/30'
              }`}
            >
              Register Client
            </button>
          </nav>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
              {error}
            </div>
          )}
          
          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'clients' && <ClientList />}
          {activeTab === 'register' && <ClientRegistrationForm />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;