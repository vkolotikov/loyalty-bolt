import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCodeIcon, IdentificationIcon, DevicePhoneMobileIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface ScanMethodSelectorProps {
  onSelect: (method: 'manual' | 'qr' | 'nfc') => void;
}

const ScanMethodSelector: React.FC<ScanMethodSelectorProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  
  const methods = [
    {
      id: 'manual',
      name: 'Manual Entry',
      description: 'Enter your client card number manually',
      icon: IdentificationIcon,
    },
    {
      id: 'qr',
      name: 'QR Code',
      description: 'Scan the QR code on your client card',
      icon: QrCodeIcon,
    },
    {
      id: 'nfc',
      name: 'NFC Tag',
      description: 'Tap your NFC-enabled client card',
      icon: DevicePhoneMobileIcon,
    },
  ];

  const handleMethodSelect = (method: string) => {
    navigate(`/client/${method}`);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6 text-primary">Select Login Method</h2>
      <div className="space-y-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
              <method.icon className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-neutral">{method.name}</h3>
              <p className="text-sm text-neutral/60">{method.description}</p>
            </div>
            <div className="ml-auto">
              <svg
                className="w-5 h-5 text-neutral/30 group-hover:text-secondary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        ))}

        <button
          onClick={() => navigate('/admin/login')}
          className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <UserCircleIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-medium text-neutral">Admin Access</h3>
            <p className="text-sm text-neutral/60">Login to admin dashboard</p>
          </div>
          <div className="ml-auto">
            <svg
              className="w-5 h-5 text-neutral/30 group-hover:text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ScanMethodSelector;