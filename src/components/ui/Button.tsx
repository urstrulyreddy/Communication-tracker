import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md',
        {
          'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500': variant === 'primary',
          'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500': variant === 'secondary',
          'bg-transparent hover:bg-gray-50': variant === 'ghost'
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-base': size === 'lg'
        },
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}