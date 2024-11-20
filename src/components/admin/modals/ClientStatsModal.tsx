import React from 'react';
import { Client, VisitRecord } from '../../../types/client';

interface ClientStatsModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

const ClientStatsModal: React.FC<ClientStatsModalProps> = ({ client, isOpen, onClose }) => {
  if (!isOpen) return null;

  const visits = client.visitHistory || [];
  const totalVisits = visits.length;
  const bonusMilestones = Math.floor(totalVisits / 10);
  
  // Calculate visit frequency
  const visitDates = visits.map(v => new Date(v.timestamp));
  let averageDaysBetweenVisits = 0;
  if (visitDates.length > 1) {
    const firstVisit = Math.min(...visitDates.map(d => d.getTime()));
    const lastVisit = Math.max(...visitDates.map(d => d.getTime()));
    const daysDiff = (lastVisit - firstVisit) / (1000 * 60 * 60 * 24);
    averageDaysBetweenVisits = Math.round(daysDiff / (visitDates.length - 1));
  }

  // Group visits by month
  const visitsByMonth: Record<string, VisitRecord[]> = {};
  visits.forEach(visit => {
    const date = new Date(visit.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!visitsByMonth[monthKey]) {
      visitsByMonth[monthKey] = [];
    }
    visitsByMonth[monthKey].push(visit);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Client Statistics
              </h2>
              <p className="text-neutral/60 mt-1">
                {client.firstName} {client.lastName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral/40 hover:text-neutral/60"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral/60 mb-2">Visit Summary</h3>
              <div className="space-y-2">
                <p className="text-neutral">Total Visits: <span className="font-semibold">{totalVisits}</span></p>
                <p className="text-neutral">Bonus Milestones: <span className="font-semibold">{bonusMilestones}</span></p>
                {averageDaysBetweenVisits > 0 && (
                  <p className="text-neutral">Avg. Days Between Visits: <span className="font-semibold">{averageDaysBetweenVisits}</span></p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral/60 mb-2">Card Details</h3>
              <div className="space-y-2">
                <p className="text-neutral">Card Type: <span className="font-semibold capitalize">{client.cardType}</span></p>
                {client.cardType === 'points' && (
                  <>
                    <p className="text-neutral">Current Points: <span className="font-semibold">{client.points}/10</span></p>
                    <p className="text-neutral">Total Points: <span className="font-semibold">{client.visitPoints}</span></p>
                  </>
                )}
                {client.cardType === 'discount' && (
                  <p className="text-neutral">Regular Discount: <span className="font-semibold">{client.discount}%</span></p>
                )}
                {client.cardType === 'gift' && (
                  <p className="text-neutral">Current Balance: <span className="font-semibold">€{client.balance?.toFixed(2)}</span></p>
                )}
                {client.bonusDiscount && (
                  <p className="text-green-600">Bonus Discount: <span className="font-semibold">+{client.bonusDiscount}%</span></p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-neutral">Visit History</h3>
            
            {Object.entries(visitsByMonth)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([monthKey, monthVisits]) => {
                const [year, month] = monthKey.split('-');
                const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
                
                return (
                  <div key={monthKey} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium text-neutral">
                        {monthName} {year} ({monthVisits.length} visits)
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {monthVisits.map((visit, index) => {
                        const visitNumber = totalVisits - visits.indexOf(visit);
                        const isMilestone = visitNumber % 10 === 0;
                        
                        return (
                          <div
                            key={visit.id}
                            className={`px-4 py-3 flex justify-between items-center ${
                              isMilestone ? 'bg-green-50' : ''
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-neutral">
                                Visit #{visitNumber}
                                {isMilestone && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Milestone!
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-neutral/60">
                                {new Date(visit.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {client.cardType === 'points' && visit.pointsEarned && (
                              <span className="text-sm text-neutral/60">
                                +{visit.pointsEarned} point
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {visits.length === 0 && (
              <p className="text-center text-neutral/60 py-4">
                No visits recorded yet
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn-neutral"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientStatsModal;