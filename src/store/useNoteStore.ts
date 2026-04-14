import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NoteState {
  noteContent: string;
  setNoteContent: (val: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      noteContent: '',
      setNoteContent: (val) => set({ noteContent: val }),
    }),
    {
      name: 'smart-start-notes',
    }
  )
);
