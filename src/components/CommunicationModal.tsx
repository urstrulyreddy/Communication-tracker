import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CommunicationType } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { format } from 'date-fns';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyIds: string[];
}

export function CommunicationModal({ isOpen, onClose, selectedCompanyIds }: CommunicationModalProps) {
  const { companies, addCommunication } = useStore();
  const [type, setType] = useState<CommunicationType>(CommunicationType.LinkedIn);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');

  const selectedCompanies = companies.filter(c => selectedCompanyIds.includes(c.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    selectedCompanyIds.forEach(companyId => {
      addCommunication({
        id: crypto.randomUUID(),
        companyId,
        type,
        date: new Date(date).toISOString(),
        notes,
      });
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Log Communication
              <span className="text-sm font-normal text-gray-500 block mt-1">
                {selectedCompanies.length} {selectedCompanies.length === 1 ? 'company' : 'companies'} selected
              </span>
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Companies
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCompanies.map(company => (
                  <span
                    key={company.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Communication Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CommunicationType)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {Object.values(CommunicationType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add any additional comments..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedCompanyIds.length === 0}>
                Log Communication
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}