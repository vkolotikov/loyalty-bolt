import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '../context/ClientContext';
import Scanner from '../components/Scanner';
import ClientInfo from '../components/ClientInfo';

const ClientPage: React.FC = () => {
  const { method } = useParams<{ method: string }>();
  const navigate = useNavigate();
  const { client } = useClient();

  useEffect(() => {
    if (!method || !['manual', 'qr', 'nfc'].includes(method)) {
      navigate('/');
    }
  }, [method, navigate]);

  if (!method || !['manual', 'qr', 'nfc'].includes(method)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {client ? 'Client Information' : 'Account Access'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {client ? 'Start New Scan' : 'Change Method'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {client ? (
            <ClientInfo />
          ) : (
            <div className="max-w-md mx-auto">
              <Scanner selectedMethod={method as 'manual' | 'qr' | 'nfc'} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientPage;