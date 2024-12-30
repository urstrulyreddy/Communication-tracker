import { Company, Communication, CommunicationType } from '../types';
import { subDays, addDays } from 'date-fns';

export const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    linkedinProfile: 'https://linkedin.com/company/techcorp',
    emails: ['contact@techcorp.com', 'sales@techcorp.com'],
    phoneNumbers: ['+1-555-0123'],
    communicationPeriodicity: 7,
    comments: 'Key enterprise client',
  },
  {
    id: '2',
    name: 'Global Innovations',
    location: 'New York, NY',
    linkedinProfile: 'https://linkedin.com/company/globalinnovations',
    emails: ['info@globalinnovations.com'],
    phoneNumbers: ['+1-555-0124'],
    communicationPeriodicity: 14,
    comments: 'Interested in new products',
  },
  {
    id: '3',
    name: 'Future Systems',
    location: 'Austin, TX',
    linkedinProfile: 'https://linkedin.com/company/futuresystems',
    emails: ['contact@futuresystems.com'],
    phoneNumbers: ['+1-555-0125'],
    communicationPeriodicity: 30,
    comments: 'Potential partnership opportunity',
  },
  {
    id: '4',
    name: 'DataFlow Inc',
    location: 'Seattle, WA',
    linkedinProfile: 'https://linkedin.com/company/dataflow',
    emails: ['info@dataflow.com'],
    phoneNumbers: ['+1-555-0126'],
    communicationPeriodicity: 7,
    comments: 'Regular follow-up required',
  },
  {
    id: '5',
    name: 'Smart Solutions',
    location: 'Boston, MA',
    linkedinProfile: 'https://linkedin.com/company/smartsolutions',
    emails: ['contact@smartsolutions.com'],
    phoneNumbers: ['+1-555-0127'],
    communicationPeriodicity: 14,
    comments: 'New client onboarding',
  },
];

export const sampleCommunications: Communication[] = [
  {
    id: '1',
    companyId: '1',
    type: CommunicationType.LinkedIn,
    date: subDays(new Date(), 8).toISOString(), // Overdue
    notes: 'Discussed upcoming product launch',
  },
  {
    id: '2',
    companyId: '2',
    type: CommunicationType.Email,
    date: subDays(new Date(), 15).toISOString(), // Overdue
    notes: 'Sent proposal for new services',
  },
  {
    id: '3',
    companyId: '3',
    type: CommunicationType.Phone,
    date: subDays(new Date(), 5).toISOString(), // Due soon
    notes: 'Quarterly review call',
  },
  {
    id: '4',
    companyId: '4',
    type: CommunicationType.LinkedIn,
    date: new Date().toISOString(), // Due today
    notes: 'Shared company update',
  },
  {
    id: '5',
    companyId: '5',
    type: CommunicationType.Email,
    date: subDays(new Date(), 2).toISOString(), // Upcoming
    notes: 'Welcome email sent',
  },
];

export const sampleCommunicationMethods = [
  { id: '1', name: 'LinkedIn', isActive: true },
  { id: '2', name: 'Email', isActive: true },
  { id: '3', name: 'Phone', isActive: true },
  { id: '4', name: 'Video Call', isActive: true },
  { id: '5', name: 'In-Person', isActive: true },
]; 