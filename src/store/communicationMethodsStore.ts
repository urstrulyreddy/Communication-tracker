import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleCommunicationMethods } from '../mocks/sampleData';

interface CommunicationMethod {
  id: string;
  name: string;
  isActive: boolean;
}

interface State {
  methods: CommunicationMethod[];
  addMethod: (method: CommunicationMethod) => void;
  toggleMethod: (id: string) => void;
  deleteMethod: (id: string) => void;
}

export const useCommunicationMethodsStore = create<State>()(
  persist(
    (set) => ({
      methods: sampleCommunicationMethods,
      
      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, method],
        })),
        
      toggleMethod: (id) =>
        set((state) => ({
          methods: state.methods.map((m) =>
            m.id === id ? { ...m, isActive: !m.isActive } : m
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