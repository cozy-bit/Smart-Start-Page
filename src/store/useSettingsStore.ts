import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  enableWeather: boolean;
  enableNotes: boolean;
  enableHistory: boolean;
  toggleSetting: (key: keyof Omit<SettingsState, 'toggleSetting'>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      enableWeather: true,
      enableNotes: true,
      enableHistory: true,

      toggleSetting: (key) =>
        set((state) => ({
          [key]: !state[key],
        })),
    }),
    {
      name: 'smart-start-settings',
    }
  )
);
