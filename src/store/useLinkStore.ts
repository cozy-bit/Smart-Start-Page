import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  group: string;
  clicks?: number;
  isPinned?: boolean;
}

interface LinkState {
  links: LinkItem[];
  addLink: (link: Omit<LinkItem, 'id' | 'clicks' | 'isPinned'>) => void;
  removeLink: (id: string) => void;
  editLink: (id: string, updatedLink: Partial<LinkItem>) => void;
  incrementClick: (id: string) => void;
  togglePin: (id: string) => void;
  restoreLink: (link: LinkItem) => void;
}

const defaultLinks: LinkItem[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com', group: 'Работа' },
  { id: '2', title: 'YouTube', url: 'https://youtube.com', group: 'Развлечения' },
  { id: '3', title: 'DuckDuckGo', url: 'https://duckduckgo.com', group: 'Работа' },
];

export const useLinkStore = create<LinkState>()(
  persist(
    (set) => ({
      links: defaultLinks,
      addLink: (link) =>
        set((state) => ({
          links: [...state.links, { ...link, id: crypto.randomUUID(), clicks: 0, isPinned: false }],
        })),
      removeLink: (id) =>
        set((state) => ({
          links: state.links.filter((l) => l.id !== id),
        })),
      editLink: (id, updatedLink) =>
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, ...updatedLink } : l
          ),
        })),
      incrementClick: (id) =>
        set((state) => ({
          links: state.links.map((l) => 
            l.id === id ? { ...l, clicks: (l.clicks || 0) + 1 } : l
          ),
        })),
      togglePin: (id) =>
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, isPinned: !l.isPinned } : l
          ),
        })),
      restoreLink: (link) =>
        set((state) => ({
          links: [...state.links, link],
        })),
    }),
    {
      name: 'smart-start-links', // name of the item in the storage (must be unique)
    }
  )
);
