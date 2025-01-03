import { Company, Communication} from '../types';

/**
 * Main application state interface
 */
export interface AppState {
  /** List of companies */
  companies: Company[];
  /** List of communications */
  communications: Communication[];
  
  /** Add a new company */
  addCompany: (company: Company) => void;
  /** Update an existing company */
  updateCompany: (company: Company) => void;
  /** Delete a company and its communications */
  deleteCompany: (id: string) => void;
  /** Add a new communication */
  addCommunication: (communication: Communication) => void;
}

/**
 * Communication methods state interface
 */
export interface CommunicationMethodsState {
  /** List of available communication methods */
  methods: CommunicationMethod[];
  /** Add a new method */
  addMethod: (method: CommunicationMethod) => void;
  /** Toggle method active status */
  toggleMethod: (id: string) => void;
  /** Delete a method */
  deleteMethod: (id: string) => void;
}

/**
 * Communication method interface
 */
export interface CommunicationMethod {
  /** Unique identifier */
  id: string;
  /** Method name */
  name: string;
  /** Whether the method is currently active */
  isActive: boolean;
} 