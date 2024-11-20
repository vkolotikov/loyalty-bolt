import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin';
import { Client } from '../../types/client';
import { PencilIcon, TrashIcon, EnvelopeIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import EditClientModal from "./modals/EditClientModal";
import ClientStatsModal from "./modals/ClientStatsModal";
import { api } from "../../services/api";

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingStats, setViewingStats] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<string | null>(null);
  const [sendingDetails, setSendingDetails] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await adminApi.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleViewStats = (client: Client) => {
    setViewingStats(client);
    setIsStatsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    setDeletingClient(id);
    setError(null);

    try {
      await adminApi.deleteClient(id);
      setClients(prevClients => prevClients.filter(client => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
    } finally {
      setDeletingClient(null);
    }
  };

  const handleSendDetails = async (cardNumber: string) => {
    setSendingDetails(cardNumber);
    try {
      await api.sendClientDetails(cardNumber);
      alert('Details sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send details');
    } finally {
      setSendingDetails(null);
    }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      await adminApi.updateClient(updatedClient.id, updatedClient);
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );
      setIsEditModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
    }
  };

  const getCardTypeStyle = (cardType: string) => {
    switch (cardType) {
      case 'gift':
        return 'bg-green-100 text-green-800';
      case 'discount':
        return 'bg-orange-100 text-orange-800';
      case 'points':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary">Client List</h2>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No clients found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-secondary">{client.cardNumber}</div>
                      <div className="text-xs text-neutral/60">ID: {client.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral">{client.firstName} {client.lastName}</div>
                      <div className="text-sm text-neutral/60">{client.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral">{client.email}</div>
                      <div className="text-sm text-neutral/60">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.cardType === 'gift' ? (
                        <div className="text-sm text-green-600 font-bold">€{client.balance?.toFixed(2) || '0.00'}</div>
                      ) : client.cardType === 'points' ? (
                        <div className="text-sm text-blue-600 font-bold">{client.points}/10 points</div>
                      ) : (
                        <div className="text-sm text-orange-600 font-bold">{client.discount}% discount</div>
                      )}
                      {client.bonusDiscount && (
                        <div className="text-xs text-green-600">+{client.bonusDiscount}% bonus</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCardTypeStyle(client.cardType)}`}>
                        {client.cardType.charAt(0).toUpperCase() + client.cardType.slice(1)}
                      </span>
                      <div className="text-xs text-neutral/60 mt-1">
                        Last visit: {new Date(client.lastVisit).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-primary hover:text-primary-dark"
                          title="Edit client"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewStats(client)}
                          className="text-secondary hover:text-secondary-dark"
                          title="View statistics"
                        >
                          <ChartBarIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleSendDetails(client.cardNumber)}
                          disabled={sendingDetails === client.cardNumber}
                          className={`text-primary hover:text-primary-dark ${
                            sendingDetails === client.cardNumber ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Send details"
                        >
                          <EnvelopeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingClient === client.id}
                          className={`text-red-600 hover:text-red-900 ${
                            deletingClient === client.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete client"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingClient && (
        <EditClientModal
          client={editingClient}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleUpdateClient}
        />
      )}

      {viewingStats && (
        <ClientStatsModal
          client={viewingStats}
          isOpen={isStatsModalOpen}
          onClose={() => {
            setIsStatsModalOpen(false);
            setViewingStats(null);
          }}
        />
      )}
    </>
  );
};

export default ClientList;