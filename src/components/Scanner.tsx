import React from 'react';
import QRScanner from './scanners/QRScanner';
import NFCScanner from './scanners/NFCScanner';
import ManualInput from './scanners/ManualInput';

interface ScannerProps {
  selectedMethod: 'manual' | 'qr' | 'nfc';
}

const Scanner: React.FC<ScannerProps> = ({ selectedMethod }) => {
  const renderScanner = () => {
    switch (selectedMethod) {
      case 'manual':
        return <ManualInput />;
      case 'qr':
        return <QRScanner />;
      case 'nfc':
        return <NFCScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderScanner()}
    </div>
  );
};

export default Scanner;