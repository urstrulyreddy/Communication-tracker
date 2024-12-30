import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company, Communication } from '../types';
import { sampleCompanies, sampleCommunications } from '../mocks/sampleData';

interface State {
  companies: Company[];
  communications: Communication[];
  addCompany: (company: Company) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  addCommunication: (communication: Communication) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      companies: sampleCompanies,
      communications: sampleCommunications,
      
      addCompany: (company) =>
        set((state) => ({
          companies: [...state.companies, company],
        })),
        
      updateCompany: (company) =>
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === company.id ? company : c
          ),
        })),
        
      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
          communications: state.communications.filter((c) => c.companyId !== id),
        })),
        
      addCommunication: (communication) =>
        set((state) => ({
          communications: [...state.communications, communication],
        })),
    }),
    {
      name: 'communication-tracker-storage',
    }
  )
);