import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import MonthlyTrendsChart from './MonthlyTrendsChart';

const AdminStats: React.FC = () => {
  const { stats, loading, refreshStats } = useAdmin();

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: UsersIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Clients',
      value: stats.activeClients,
      icon: ChartBarIcon,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary">Statistics Overview</h2>
          <button
            onClick={() => refreshStats()}
            className="btn-secondary"
          >
            Refresh Stats
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statItems.map((item) => (
            <div 
              key={item.title} 
              className="p-6 rounded-lg border border-gray-200 hover:border-secondary/30 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-neutral/60">{item.title}</p>
                  <p className="text-2xl font-bold text-neutral">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-primary mb-6">Monthly Trends</h2>
        <MonthlyTrendsChart />
      </div>
    </div>
  );
};

export default AdminStats;