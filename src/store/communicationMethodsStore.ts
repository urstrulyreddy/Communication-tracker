import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface CommunicationMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface State {
  methods: CommunicationMethod[];
  addMethod: (method: CommunicationMethod) => void;
  updateMethod: (method: CommunicationMethod) => void;
  toggleMethod: (id: string) => void;
  deleteMethod: (id: string) => void;
}

export const useCommunicationMethodsStore = create<State>()(
  persist(
    (set) => ({
      methods: [],
      
      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, { ...method, isActive: true }],
        })),
        
      updateMethod: (method) =>
        set((state) => ({
          methods: state.methods.map(m => m.id === method.id ? method : m),
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