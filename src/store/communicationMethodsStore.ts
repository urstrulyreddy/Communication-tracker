import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunicationMethod, CommunicationType } from '../types';

interface CommunicationMethodsState {
  methods: CommunicationMethod[];
  addMethod: (method: CommunicationMethod) => void;
  updateMethod: (method: CommunicationMethod) => void;
  deleteMethod: (id: string) => void;
}

export const useCommunicationMethodsStore = create<CommunicationMethodsState>()(
  persist(
    (set) => ({
      methods: [
        {
          id: '1',
          name: CommunicationType.LINKEDIN_POST,
          description: 'Post on company LinkedIn page',
          sequence: 1,
          isMandatory: true
        },
        {
          id: '2',
          name: CommunicationType.LINKEDIN_MESSAGE,
          description: 'Direct message on LinkedIn',
          sequence: 2,
          isMandatory: true
        },
        {
          id: '3',
          name: CommunicationType.EMAIL,
          description: 'Email communication',
          sequence: 3,
          isMandatory: true
        },
        {
          id: '4',
          name: CommunicationType.PHONE_CALL,
          description: 'Phone call communication',
          sequence: 4,
          isMandatory: true
        },
        {
          id: '5',
          name: CommunicationType.OTHER,
          description: 'Other forms of communication',
          sequence: 5,
          isMandatory: false
        }
      ],
      
      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, method],
        })),
        
      updateMethod: (method) =>
        set((state) => ({
          methods: state.methods.map((m) =>
            m.id === method.id ? method : m
          ),
        })),
        
      deleteMethod: (id) =>
        set((state) => ({
          methods: state.methods.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'communication-methods-storage',
    }
  )
);