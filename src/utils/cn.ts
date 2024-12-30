type ClassValue = string | number | boolean | undefined | null;
type ClassArray = ClassValue[];
type ClassObject = { [key: string]: any };
type ClassInput = ClassValue | ClassArray | ClassObject;

export function cn(...inputs: ClassInput[]): string {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') return input;
      if (Array.isArray(input)) return input.filter(Boolean).join(' ');
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ');
} 