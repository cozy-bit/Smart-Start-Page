import { create } from 'zustand';

interface UIState {
  isAddLinkOpen: boolean;
  setAddLinkOpen: (val: boolean) => void;
  isNotesOpen: boolean;
  setNotesOpen: (val: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddLinkOpen: false,
  setAddLinkOpen: (val) => set({ isAddLinkOpen: val }),
  isNotesOpen: false,
  setNotesOpen: (val) => set({ isNotesOpen: val }),
}));
