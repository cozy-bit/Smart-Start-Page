import { useEffect } from 'react';
import GreetingWidget from './components/GreetingWidget';
import DailyFocus from './components/DailyFocus';
import SearchBar from './components/SearchBar';
import QuickLinks from './components/QuickLinks';
import Onboarding from './components/Onboarding';
import WeatherSidebar from './components/WeatherSidebar';
import CommandPalette from './components/CommandPalette';
import NotesSidebar from './components/NotesSidebar';
import AnimatedBackground from './components/AnimatedBackground';
import SettingsModal from './components/SettingsModal';
import { Toaster } from 'sonner';
import { useUserStore } from './store/useUserStore';

import { useSettingsStore } from './store/useSettingsStore';
import HeaderActions from './components/HeaderActions';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const theme = useUserStore((s) => s.theme);
  const { enableWeather, enableNotes } = useSettingsStore();
  const fontFamily = useSettingsStore((s) => s.fontFamily);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };
    
    applyTheme();
    
    const listener = () => {
       if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Apply font family globally
  useEffect(() => {
    document.body.style.fontFamily = fontFamily === 'JetBrains Mono' 
      ? '"JetBrains Mono", monospace' 
      : fontFamily;
  }, [fontFamily]);



  return (
    <>
      <AnimatedBackground />
      <Toaster position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} />
      <Onboarding />
      {enableWeather && <WeatherSidebar />}
      <CommandPalette />
      {enableNotes && <NotesSidebar />}
      <SettingsModal />
      <PomodoroTimer />
      <HeaderActions />

      <div className="container mx-auto px-4 pt-24 pb-8 md:pt-16 md:pb-16 max-w-6xl flex flex-col min-h-screen relative z-10">
        <main className="flex-grow flex flex-col justify-center items-center">
          <div className="w-full">
            <GreetingWidget />
            <DailyFocus />
            <SearchBar />
            <QuickLinks />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
