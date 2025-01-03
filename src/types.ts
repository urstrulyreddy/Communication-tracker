export enum CommunicationType {
  LinkedIn = 'LinkedIn',
  Email = 'Email',
  Phone = 'Phone',
  VideoCall = 'Video Call',
  InPerson = 'In-Person'
}

export interface Company {
  id: string;
  name: string;
  location: string;
  linkedinProfile: string;
  emails: string[];
  phoneNumbers: string[];
  communicationPeriodicity: number;
  comments?: string;
  preferredMethods: string[];
  mandatoryMethods: string[];
}

export interface Communication {
  id: string;
  companyId: string;
  type: CommunicationType;
  date: string;
  notes?: string;
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
} 