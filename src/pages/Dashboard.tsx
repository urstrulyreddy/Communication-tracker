import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { CommunicationType } from '../types';
import { Plus } from 'lucide-react';
import { CommunicationModal } from '../components/CommunicationModal';

export function Dashboard() {
  const { companies, communications } = useStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLastFiveCommunications = (companyId: string) => {
    return communications
      .filter(c => c.companyId === companyId)
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, 5);
  };

  const getNextCommunication = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return null;

    const lastComm = communications
      .filter(c => c.companyId === companyId)
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0];

    if (!lastComm) return null;

    const nextDate = parseISO(lastComm.date);
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);

    const nextType = Object.values(CommunicationType)[
      (Object.values(CommunicationType).indexOf(lastComm.type) + 1) %
        Object.values(CommunicationType).length
    ];

    return { date: nextDate, type: nextType };
  };

  const getRowStatus = (companyId: string) => {
    const next = getNextCommunication(companyId);
    if (!next) return 'default';

    const today = new Date();
    if (parseISO(next.date.toISOString()) < today) return 'overdue';
    if (format(next.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return 'due';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Companies Communication Status</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Communication
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Five Communications
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Scheduled
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => {
                  const status = getRowStatus(company.id);
                  const statusColors = {
                    overdue: 'bg-red-50',
                    due: 'bg-yellow-50',
                    default: 'bg-white'
                  };

                  return (
                    <tr
                      key={company.id}
                      className={`${statusColors[status]} hover:bg-gray-50 cursor-pointer`}
                      onClick={() => setSelectedCompanyId(company.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          {getLastFiveCommunications(company.id).map((comm, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {comm.type} ({format(parseISO(comm.date), 'MMM d')})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const next = getNextCommunication(company.id);
                          if (!next) return 'No communications yet';
                          return `${next.type} (${format(next.date, 'MMM d')})`;
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CommunicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          companyId={selectedCompanyId}
        />
      )}
    </div>
  );
}