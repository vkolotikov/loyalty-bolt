import React from 'react';
import { Client } from '../../types/client';

interface VisitHistoryListProps {
  clients: Client[];
}

const VisitHistoryList: React.FC<VisitHistoryListProps> = ({ clients = [] }) => {
  // Combine all visits from all clients and sort by timestamp
  const allVisits = clients
    .filter(client => client && Array.isArray(client.visitHistory)) // Ensure client and visitHistory exist
    .flatMap(client => 
      (client.visitHistory || []).map(visit => ({
        ...visit,
        clientName: `${client.firstName} ${client.lastName}`,
        clientId: client.id,
        cardNumber: client.cardNumber,
        cardType: client.cardType
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Visit History</h2>
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-4 gap-4 px-6 py-3">
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Card Info
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit Time
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {allVisits.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No visits recorded yet
              </div>
            ) : (
              allVisits.map((visit, index) => (
                <div key={visit.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{visit.clientName}</div>
                    <div className="text-gray-500">ID: {visit.clientId}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-mono text-yellow-600">{visit.cardNumber}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCardTypeStyle(visit.cardType)}`}>
                      {visit.cardType.charAt(0).toUpperCase() + visit.cardType.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(visit.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm">
                    {(index + 1) % 10 === 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        10th Visit Bonus!
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitHistoryList;