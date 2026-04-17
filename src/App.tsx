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
import { Toaster, toast } from 'sonner';
import { useUserStore } from './store/useUserStore';
import { useUIStore } from './store/useUIStore';
import { useSettingsStore } from './store/useSettingsStore';
import { Palette, Search, FileText, Plus, Settings } from 'lucide-react';

function App() {
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const { setAddLinkOpen, setNotesOpen, setSettingsOpen } = useUIStore();
  const { enableWeather, enableNotes } = useSettingsStore();

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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    toast.success(`Switched to ${nextTheme} mode`);
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', metaKey: true } as KeyboardEventInit));
  };

  return (
    <>
      <AnimatedBackground />
      <Toaster position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} />
      <Onboarding />
      {enableWeather && <WeatherSidebar />}
      <CommandPalette />
      {enableNotes && <NotesSidebar />}
      <SettingsModal />

      {/* Mobile/Global header buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <button 
          onClick={() => setAddLinkOpen(true)}
          className="p-2.5 hidden sm:block bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg"
          title="Add new link"
        >
          <Plus className="w-5 h-5" />
        </button>
        {enableNotes && (
          <button 
            onClick={() => setNotesOpen(true)}
            className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-yellow-600 dark:text-yellow-400/80 hover:text-yellow-700 dark:hover:text-yellow-400 transition-all shadow-lg"
            title="Quick Notes"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={openCommandPalette}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg"
          title="Open Command Palette"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg"
          title="Settings & History"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg"
          title="Toggle Theme"
        >
          <Palette className="w-5 h-5" />
        </button>
      </div>

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
