import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import ClientInfo from '../components/ClientInfo';

const AccountPage: React.FC = () => {
  const { method } = useParams<{ method: 'manual' | 'qr' | 'nfc' }>();
  const navigate = useNavigate();

  if (!method || !['manual', 'qr', 'nfc'].includes(method)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Account Access</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Change Method
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Scanner selectedMethod={method} />
            </div>
            <ClientInfo />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;