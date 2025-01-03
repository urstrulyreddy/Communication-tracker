export enum CommunicationType {
  LINKEDIN_POST = 'LinkedIn Post',
  LINKEDIN_MESSAGE = 'LinkedIn Message',
  EMAIL = 'Email',
  PHONE_CALL = 'Phone Call',
  OTHER = 'Other'
}

export interface Company {
  id: string;
  name: string;
  location: string;
  linkedinProfile: string;
  emails: string[];
  phoneNumbers: string[];
  comments: string;
  communicationPeriodicity: number;
  preferredMethods: string[];
  mandatoryMethods: string[];
}

export interface Communication {
  id: string;
  companyId: string;
  type: CommunicationType;
  date: string;
  notes: string;
  contactDetails?: {
    email?: string;
    phone?: string;
    linkedinProfile?: string;
  };
}

export interface CommunicationMethod {
  id: string;
  name: string;
  description: string;
  sequence: number;
  isMandatory: boolean;
  isActive: boolean;
}