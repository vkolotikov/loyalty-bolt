import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScanMethodSelector from '../components/ScanMethodSelector';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleMethodSelect = (method: 'manual' | 'qr' | 'nfc') => {
    navigate(`/client/${method}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Welcome to FDS Cards</h1>
          <p className="mt-2 text-lg text-neutral/60">Access your card benefits and rewards</p>
        </div>
        <div className="w-full max-w-md px-4 sm:px-0">
          <ScanMethodSelector onSelect={handleMethodSelect} />
        </div>
      </main>
    </div>
  );
}

export default HomePage;