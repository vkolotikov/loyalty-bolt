import React from 'react';
import { VisitRecord } from '../types/client';

interface VisitHistoryProps {
  visits: VisitRecord[];
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ visits = [] }) => {
  const sortedVisits = [...visits].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Visit History</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
        {sortedVisits.length === 0 ? (
          <p className="text-gray-500 text-sm p-4 text-center">No visits recorded yet</p>
        ) : (
          sortedVisits.map((visit, index) => (
            <div key={visit.id} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Visit #{sortedVisits.length - index}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(visit.timestamp).toLocaleString()}
                </p>
              </div>
              {(sortedVisits.length - index) % 10 === 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  10th Visit Bonus!
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VisitHistory;