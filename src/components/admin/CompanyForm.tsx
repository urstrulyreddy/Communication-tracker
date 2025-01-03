/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useFieldArray, useForm } from 'react-hook-form';
import { Company } from '../../types';
import { Button } from '../ui/Button';
import { Plus, Trash } from 'lucide-react';
import { useCommunicationMethodsStore } from '../../store/communicationMethodsStore';



interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: Company) => void;
  onCancel: () => void;
  name: string;
}

// const companySchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   location: z.string().min(2, 'Location is required'),
//   linkedinProfile: z.string().url('Must be a valid URL'),
//   emails: z.array(z.string().email('Must be valid email')),
//   phoneNumbers: z.array(z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number')),
//   communicationPeriodicity: z.number().min(1, 'Must be at least 1 day'),
//   preferredMethods: z.array(z.string()),
//   mandatoryMethods: z.array(z.string())
// });



export function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Company>({
    defaultValues: initialData || {
      id: crypto.randomUUID(),
      name: '',
      location: '',
      linkedinProfile: '',
      emails: [''] as string[],
      phoneNumbers: [''] as string[],
      comments: '',
      communicationPeriodicity: 14,
      preferredMethods: [] as string[],
      mandatoryMethods: [] as string[]
    }
  });

  // @ts-ignore
  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray<Company>({
    control,
    name: 'emails'
  });

  // @ts-ignore
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray<Company>({
    control,
    name: 'phoneNumbers'
  });

  const { methods } = useCommunicationMethodsStore();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
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
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
        <input
          type="url"
          {...register('linkedinProfile', {
            pattern: {
              value: /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/.*/i,
              message: 'Must be a valid LinkedIn URL'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.linkedinProfile && (
          <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Emails</label>
        {emailFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              type="email"
              {...register(`emails.${index}`, {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {index > 0 && (
              <Button type="button" variant="secondary" onClick={() => removeEmail(index)}>
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => appendEmail('')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Email
        </Button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
        {phoneFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              type="tel"
              {...register(`phoneNumbers.${index}`, {
                pattern: {
                  value: /^\+?[\d\s-]{10,}$/,
                  message: 'Invalid phone number'
                }
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {index > 0 && (
              <Button type="button" variant="secondary" onClick={() => removePhone(index)}>
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => appendPhone('')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Phone Number
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          {...register('comments')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Communication Periodicity (days)</label>
        <input
          type="number"
          {...register('communicationPeriodicity', { 
            required: 'Periodicity is required',
            min: { value: 1, message: 'Must be at least 1 day' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.communicationPeriodicity && (
          <p className="mt-1 text-sm text-red-600">{errors.communicationPeriodicity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Communication Methods
        </label>
        <div className="mt-2 space-y-2">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center">
              <input
                type="checkbox"
                {...register('preferredMethods')}
                value={method.name}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                {method.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Company
        </Button>
      </div>
    </form>
  );
}