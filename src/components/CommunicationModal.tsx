import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { CommunicationType } from '../types';
import { X } from 'lucide-react';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string | null;
}

interface FormData {
  type: CommunicationType;
  date: string;
  notes: string;
}

export function CommunicationModal({ isOpen, onClose, companyId }: CommunicationModalProps) {
  const { companies, addCommunication } = useStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (!companyId) return;
    
    addCommunication({
      id: crypto.randomUUID(),
      companyId,
      type: data.type,
      date: new Date(data.date).toISOString(),
      notes: data.notes
    });
    
    onClose();
  };

  const company = companies.find(c => c.id === companyId);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Log Communication
              {company && <span className="text-gray-500 ml-2">with {company.name}</span>}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Communication Type
              </label>
              <select
                {...register('type', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {Object.values(CommunicationType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">Type is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">Date is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}