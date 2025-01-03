/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function NotificationBell() {
  const { companies, communications } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = companies.reduce((acc, company) => {
    const lastComm = communications
      .filter(c => c.companyId === company.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastComm) return acc;

    const nextDate = new Date(lastComm.date);
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (nextDate < today) {
      acc.overdue.push({ company, dueDate: nextDate });
    } else if (format(nextDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      acc.dueToday.push({ company, dueDate: nextDate });
    }

    return acc;
  }, { overdue: [] as Array<{ company: Company; dueDate: Date }>, dueToday: [] as Array<{ company: Company; dueDate: Date }> });

  const totalCount = notifications.overdue.length + notifications.dueToday.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {totalCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded-full">
            {totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            
            {totalCount === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No pending communications.</p>
            ) : (
              <div className="mt-2 space-y-4">
                {notifications.overdue.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-red-600 uppercase tracking-wider">
                      Overdue ({notifications.overdue.length})
                    </h4>
                    <div className="mt-1 space-y-2">
                      {notifications.overdue.map(({ company, dueDate }) => (
                        <button
                          key={company.id}
                          onClick={() => {
                            navigate('/');
                            setIsOpen(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{company.name}</p>
                              <p className="text-xs text-gray-500">Due {format(dueDate, 'MMM d')}</p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {notifications.dueToday.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-yellow-600 uppercase tracking-wider">
                      Due Today ({notifications.dueToday.length})
                    </h4>
                    <div className="mt-1 space-y-2">
                      {notifications.dueToday.map(({ company, dueDate }) => (
                        <button
                          key={company.id}
                          onClick={() => {
                            navigate('/');
                            setIsOpen(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{company.name}</p>
                              <p className="text-xs text-gray-500">Due today</p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Due Today
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 