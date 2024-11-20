import { useState, useCallback } from 'react';
import { useClient } from '../context/ClientContext';
import { ScanData } from '../types/client';
import { api } from '../services/api';

interface UseScannerProps {
  type: 'qr' | 'nfc' | 'manual';
}

export const useScanner = ({ type }: UseScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setClient, setLoading } = useClient();

  const handleScan = useCallback(async (cardNumber: string) => {
    if (!cardNumber) {
      setError('Please enter a valid card number');
      return;
    }

    const formattedCardNumber = cardNumber.trim().toUpperCase();
    setLoading(true);
    setError(null);
    
    try {
      const scanData: ScanData = {
        clientId: formattedCardNumber,
        type,
        timestamp: new Date().toISOString()
      };

      const clientData = await api.getClientByCardNumber(formattedCardNumber);
      await api.sendClientDetails(formattedCardNumber);
      setClient(clientData);
      return clientData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Client not found';
      setError(errorMessage);
      setClient(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [type, setClient, setLoading]);

  return {
    scanning,
    setScanning,
    error,
    setError,
    handleScan
  };
};