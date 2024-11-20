import React, { createContext, useContext, useState } from 'react';
import { Client } from '../types/client';
import { api } from '../services/api';

interface ClientContextType {
  client: Client | null;
  loading: boolean;
  error: string | null;
  setClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePoints: (points: number) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  useBonusDiscount: () => Promise<void>;
  sendDetails: () => Promise<void>;
  confirmVisit: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

function useClientContext() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}

function ClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePoints = async (points: number) => {
    if (!client) return;
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await api.updatePoints(client.cardNumber, points);
      setClient(updatedClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update points';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (amount: number) => {
    if (!client) return;
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await api.updateGiftCardBalance(client.cardNumber, amount);
      setClient(updatedClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update balance';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const useBonusDiscount = async () => {
    if (!client) return;
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await api.useBonusDiscount(client.cardNumber);
      setClient(updatedClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to use bonus discount';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendDetails = async () => {
    if (!client) return;
    setLoading(true);
    setError(null);
    try {
      await api.sendClientDetails(client.cardNumber);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmVisit = async () => {
    if (!client) return;
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await api.confirmVisit(client.cardNumber);
      setClient(updatedClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm visit';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    client,
    loading,
    error,
    setClient,
    setLoading,
    setError,
    updatePoints,
    updateBalance,
    useBonusDiscount,
    sendDetails,
    confirmVisit
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}

export { ClientProvider, useClientContext as useClient };