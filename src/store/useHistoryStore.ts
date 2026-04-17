import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HistoryItemType = 'search' | 'link';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  title: string;
  payload: string; // url for links, search query for searches
  timestamp: number;
  engine?: string; // only for search
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],

      addHistory: (item) =>
        set((state) => {
          // Avoid duplicate consecutive searches or links (spam protection)
          const lastItem = state.history[0];
          if (lastItem && lastItem.payload === item.payload && lastItem.type === item.type) {
            return state;
          }

          const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          // Store up to 20 last items
          return {
            history: [newItem, ...state.history].slice(0, 20),
          };
        }),

      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      clearHistory: () =>
        set({
          history: [],
        }),
    }),
    {
      name: 'smart-start-history',
    }
  )
);
