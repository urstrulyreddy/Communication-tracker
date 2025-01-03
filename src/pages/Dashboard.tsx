/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { CommunicationType, Communication } from '../types';
import { Plus, X, MessageCircle, AlertCircle, Clock, CheckCircle, Building, Search } from 'lucide-react';
import { CommunicationModal } from '../components/CommunicationModal';
import { Dialog } from '@headlessui/react';
import { Badge } from '../components/ui/Badge';
import { QuickActionCard } from '../components/QuickActionCard';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Button } from '../components/ui/Button';

interface CommunicationHistoryProps {
  communications: Communication[];
  onClose: () => void;
  companyName: string;
}

function CommunicationHistory({ communications, onClose, companyName }: CommunicationHistoryProps) {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Communication History - {companyName}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {communications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No communications recorded yet.</p>
            ) : (
              communications
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((comm) => (
                  <div
                    key={comm.id}
                    className="border rounded-lg p-4 space-y-2 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {comm.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(parseISO(comm.date), 'PPp')}
                        </span>
                      </div>
                    </div>
                    {comm.notes && (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comm.notes}
                      </p>
                    )}
                    {comm.contactDetails && (
                      <div className="text-sm text-gray-500 space-y-1 border-t pt-2 mt-2">
                        {comm.contactDetails.email && (
                          <p>Email: {comm.contactDetails.email}</p>
                        )}
                        {comm.contactDetails.phone && (
                          <p>Phone: {comm.contactDetails.phone}</p>
                        )}
                        {comm.contactDetails.linkedinProfile && (
                          <p>LinkedIn: {comm.contactDetails.linkedinProfile}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

interface CompanyHighlightOverride {
  companyId: string;
  disabled: boolean;
}

export function Dashboard() {
  const { companies, communications } = useStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'due' | 'upcoming'>('all');
  const [highlightOverrides, setHighlightOverrides] = useState<CompanyHighlightOverride[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);

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
    const override = highlightOverrides.find(h => h.companyId === companyId);
    if (override?.disabled) return 'default';

    const next = getNextCommunication(companyId);
    if (!next) return 'default';

    const today = new Date();
    if (parseISO(next.date.toISOString()) < today) return 'overdue';
    if (format(next.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return 'due';
    return 'default';
  };

  const toggleHighlight = (companyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setHighlightOverrides(prev => {
      const existing = prev.find(h => h.companyId === companyId);
      if (existing) {
        return prev.filter(h => h.companyId !== companyId);
      }
      return [...prev, { companyId, disabled: true }];
    });
  };

  const handleRowClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setShowHistory(true);
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const selectedCompanyComms = selectedCompanyId 
    ? communications.filter(c => c.companyId === selectedCompanyId)
    : [];

  const overdueCount = communications.filter(c => getRowStatus(c.companyId) === 'overdue').length;
  const dueTodayCount = communications.filter(c => getRowStatus(c.companyId) === 'due').length;
  const completedCount = communications.filter(c => getRowStatus(c.companyId) === 'completed').length;

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const status = getRowStatus(company.id);
      const matchesFilter = filterStatus === 'all' || status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, filterStatus]);

  const toggleCompanySelection = (companyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCompanyIds(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      }
      return [...prev, companyId];
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="space-y-6 p-6 bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="grid grid-cols-4 gap-4">
        <QuickActionCard
          title="Overdue"
          count={overdueCount}
          icon={AlertCircle}
          className="bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          onClick={() => setFilterStatus('overdue')}
        />
        <QuickActionCard
          title="Due Today"
          count={dueTodayCount}
          icon={Clock}
          className="bg-yellow-50"
        />
        <QuickActionCard
          title="Completed"
          count={completedCount}
          icon={CheckCircle}
          className="bg-green-50"
        />
        <QuickActionCard
          title="Total Companies"
          count={companies.length}
          icon={Building}
          className="bg-blue-50"
        />
      </div>

      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Companies Communication Status
            </h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={selectedCompanyIds.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Communication ({selectedCompanyIds.length})
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                label="Search"
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="max-w-xs"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-md border-gray-300"
            >
              <option value="all">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="due">Due Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedCompanyIds.length === companies.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCompanyIds(companies.map(c => c.id));
                        } else {
                          setSelectedCompanyIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Five Communications
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Scheduled
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Highlights
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => {
                  const status = getRowStatus(company.id);
                  const isHighlightDisabled = highlightOverrides.some(
                    h => h.companyId === company.id && h.disabled
                  );
                  const statusColors = {
                    overdue: 'bg-red-50 hover:bg-red-100',
                    due: 'bg-yellow-50 hover:bg-yellow-100',
                    default: 'hover:bg-gray-50'
                  };

                  return (
                    <tr
                      key={company.id}
                      className={`${isHighlightDisabled ? 'hover:bg-gray-50' : statusColors[status]} transition-colors cursor-pointer`}
                      onClick={() => handleRowClick(company.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCompanyIds.includes(company.id)}
                          onChange={(e) => toggleCompanySelection(company.id, e)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {company.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {company.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {company.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {getLastFiveCommunications(company.id).map((comm, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              title={comm.notes || ''}
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
                          const dateStr = format(next.date, 'MMM d');
                          const isOverdue = status === 'overdue';
                          return (
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {next.type} ({dateStr})
                              {isOverdue && ' - Overdue'}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <Switch
                            checked={!isHighlightDisabled}
                            onCheckedChange={() => toggleHighlight(company.id, event as any)}
                          />
                          <span className="text-gray-500">
                            {isHighlightDisabled ? 'Disabled' : 'Enabled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleRowClick(company.id)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          View History
                        </button>
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
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompanyIds([]);
          }}
          selectedCompanyIds={selectedCompanyIds}
        />
      )}

      {showHistory && selectedCompany && (
        <CommunicationHistory
          communications={selectedCompanyComms}
          onClose={() => {
            setShowHistory(false);
            setSelectedCompanyId(null);
          }}
          companyName={selectedCompany.name}
        />
      )}
    </div>
  );
}