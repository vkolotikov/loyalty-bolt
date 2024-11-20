import React from 'react';
import { QrCodeIcon, IdentificationIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface ScanMethodSelectorProps {
  onSelect: (method: 'manual' | 'qr' | 'nfc') => void;
}

const ScanMethodSelector: React.FC<ScanMethodSelectorProps> = ({ onSelect }) => {
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Select Login Method</h2>
      <div className="space-y-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id as 'manual' | 'qr' | 'nfc')}
            className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <method.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            <div className="ml-auto">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500"
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
      </div>
    </div>
  );
};

export default ScanMethodSelector;