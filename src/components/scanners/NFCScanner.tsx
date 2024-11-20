import React, { useEffect } from 'react';
import { useScanner } from '../../hooks/useScanner';

const NFCScanner: React.FC = () => {
  const [isNFCSupported, setIsNFCSupported] = React.useState(false);
  const { scanning, setScanning, error, setError, handleScan } = useScanner({ type: 'nfc' });

  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsNFCSupported(true);
    }
  }, []);

  const startScanning = async () => {
    if (!isNFCSupported) {
      setError('NFC is not supported on this device');
      return;
    }

    try {
      setError(null);
      setScanning(true);

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.addEventListener("reading", async ({ message }: any) => {
        try {
          const decoder = new TextDecoder();
          const record = message.records[0];
          const data = JSON.parse(decoder.decode(record.data));

          if (data.clientId) {
            await handleScan(data.clientId);
            setScanning(false);
          } else {
            setError('Invalid NFC tag format');
          }
        } catch (e) {
          setError('Invalid NFC tag format');
        }
      });

      ndef.addEventListener("error", () => {
        setError('Error reading NFC tag');
        setScanning(false);
      });

    } catch (error) {
      console.error('Error starting NFC scan:', error);
      setError(error instanceof Error ? error.message : 'Failed to start NFC scanner');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
  };

  if (!isNFCSupported) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">NFC Scanner</h2>
        <p className="text-gray-500 text-center">NFC is not supported on this device</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">NFC Scanner</h2>
      <div className="bg-gray-100 rounded-lg p-6 mb-4 text-center">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : scanning ? (
          <p className="text-secondary">Bring NFC tag close to your device...</p>
        ) : (
          <p className="text-gray-600">Click "Start NFC Scan" to begin</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={scanning ? stopScanning : startScanning}
          className={scanning ? 'btn-danger' : 'btn-primary'}
        >
          {scanning ? 'Stop NFC Scan' : 'Start NFC Scan'}
        </button>
        {error && (
          <button
            onClick={() => setError(null)}
            className="btn-neutral"
          >
            Clear Error
          </button>
        )}
      </div>
    </div>
  );
};

export default NFCScanner;