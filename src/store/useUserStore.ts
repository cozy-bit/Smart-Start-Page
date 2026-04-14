import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
}

interface UserState {
  firstName: string;
  location: Location | null;
  theme: 'light' | 'dark' | 'system';
  setFirstName: (name: string) => void;
  setLocation: (loc: Location) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firstName: '',
      location: null,
      theme: 'dark', // defaults to dark because user likes it, but let's make it dark by default instead of system since app was born dark
      setFirstName: (name) => set({ firstName: name }),
      setLocation: (loc) => set({ location: loc }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'smart-start-user',
    }
  )
);
