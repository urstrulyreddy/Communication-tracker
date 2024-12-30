import { useForm } from 'react-hook-form';
import { CommunicationMethod } from '../../types';
import { Button } from '../ui/Button';

interface CommunicationMethodFormProps {
  initialData?: CommunicationMethod;
  onSubmit: (data: CommunicationMethod) => void;
  onCancel: () => void;
}

export function CommunicationMethodForm({ initialData, onSubmit, onCancel }: CommunicationMethodFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CommunicationMethod>({
    defaultValues: initialData || {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      sequence: 1,
      isMandatory: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Method Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sequence</label>
        <input
          type="number"
          {...register('sequence', { 
            required: 'Sequence is required',
            min: { value: 1, message: 'Sequence must be at least 1' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.sequence && (
          <p className="mt-1 text-sm text-red-600">{errors.sequence.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('isMandatory')}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Mandatory in sequence
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Method
        </Button>
      </div>
    </form>
  );
} 