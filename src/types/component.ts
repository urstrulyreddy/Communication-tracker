/**
 * Common props interface for components that can be extended with HTML attributes
 */
export interface BaseProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional className for styling */
  className?: string;
  /** Optional children elements */
  children?: React.ReactNode;
}

/**
 * Common form field props
 */
export interface FormFieldProps {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Help text */
  helpText?: string;
} 