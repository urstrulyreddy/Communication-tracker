import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, multiline, rows = 3, className = '', ...props }, ref) => {
    const inputClasses = `
      mt-1 block w-full rounded-md border-gray-300 shadow-sm
      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
      ${error ? 'border-red-300' : ''}
      ${className}
    `;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {multiline ? (
          <textarea
            {...props}
            className={inputClasses}
            rows={rows}
          />
        ) : (
          <input
            ref={ref}
            {...props}
            className={inputClasses}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);