import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  enableWeather: boolean;
  enableNotes: boolean;
  enableHistory: boolean;
  enableEcoMode: boolean;
  fontFamily: string;
  customWallpaper: string;
  language: 'ru' | 'en';
  pomodoroTheme: string;
  pomodoroDigitTheme: string;
  toggleSetting: (key: keyof Omit<SettingsState, 'toggleSetting' | 'fontFamily' | 'customWallpaper' | 'language' | 'pomodoroTheme' | 'pomodoroDigitTheme'>) => void;
  setStringSetting: (key: 'fontFamily' | 'customWallpaper' | 'language' | 'pomodoroTheme' | 'pomodoroDigitTheme', value: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      enableWeather: true,
      enableNotes: true,
      enableHistory: true,
      enableEcoMode: false,
      fontFamily: 'Inter',
      customWallpaper: '',
      language: 'ru',
      pomodoroTheme: 'Purple Space',
      pomodoroDigitTheme: 'White',

      toggleSetting: (key) =>
        set((state) => ({
          [key]: !state[key as keyof SettingsState],
        })),
      setStringSetting: (key, value) =>
        set(() => ({
          [key]: value,
        })),
    }),
    {
      name: 'smart-start-settings',
    }
  )
);
