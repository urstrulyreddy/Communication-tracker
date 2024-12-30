import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: 'bg-white shadow-lg rounded-lg p-4',
        success: {
          className: 'border-l-4 border-green-500',
        },
        error: {
          className: 'border-l-4 border-red-500',
        },
      }}
    />
  );
} 