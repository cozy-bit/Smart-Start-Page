import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface UIState {
  isAddLinkOpen: boolean;
  setAddLinkOpen: (val: boolean) => void;
  isNotesOpen: boolean;
  setNotesOpen: (val: boolean) => void;
  isSpotlight: boolean;
  setSpotlight: (val: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (val: boolean) => void;
  dailyFocus: string;
  setDailyFocus: (val: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isAddLinkOpen: false,
      setAddLinkOpen: (val) => set({ isAddLinkOpen: val }),
      isNotesOpen: false,
      setNotesOpen: (val) => set({ isNotesOpen: val }),
      isSpotlight: false,
      setSpotlight: (val) => set({ isSpotlight: val }),
      isSettingsOpen: false,
      setSettingsOpen: (val) => set({ isSettingsOpen: val }),
      dailyFocus: '',
      setDailyFocus: (val) => set({ dailyFocus: val }),
    }),
    {
      name: 'smart-start-ui',
      partialize: (state) => ({ dailyFocus: state.dailyFocus }),
    }
  )
);
