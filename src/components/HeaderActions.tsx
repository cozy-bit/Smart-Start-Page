import { useState, useRef, useEffect } from 'react';
import { Plus, Settings, Palette, Timer, Menu, X } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n';

export default function HeaderActions() {
  const { setAddLinkOpen, setSettingsOpen, setPomodoroOpen } = useUIStore();
  const theme = useUserStore((s) => s.theme);
  const setTheme = useUserStore((s) => s.setTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslation();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    toast.success(`Switched to ${nextTheme} mode`);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const ItemClass = "flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full";

  return (
    <div className="fixed top-4 right-4 z-[90]">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center space-x-2">
        <button 
          onClick={() => setAddLinkOpen(true)}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg transform-gpu"
          title="Add new link"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setPomodoroOpen(true)}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg transform-gpu"
          title="Pomodoro Timer"
        >
          <Timer className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg transform-gpu"
          title="Settings & History"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white transition-all shadow-lg transform-gpu"
          title="Toggle Theme"
        >
          <Palette className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Actions */}
      <div className="sm:hidden flex items-center space-x-2" ref={menuRef}>
        <button 
          onClick={() => setPomodoroOpen(true)}
          className="p-3 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-indigo-500 dark:text-indigo-400 hover:bg-black/20 dark:hover:bg-white/10 transition-all shadow-lg transform-gpu"
        >
          <Timer className="w-5 h-5" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-black/10 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-gray-800 dark:text-white hover:bg-black/20 dark:hover:bg-white/10 transition-all shadow-lg transform-gpu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 right-0 w-48 bg-white dark:bg-[#1a1b26] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 transform-gpu"
            >
              <button onClick={() => { setAddLinkOpen(true); setIsMenuOpen(false); }} className={ItemClass}>
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>{t('Add Link')}</span>
              </button>
              <button onClick={() => { setSettingsOpen(true); setIsMenuOpen(false); }} className={ItemClass}>
                <Settings className="w-4 h-4 text-gray-500" />
                <span>{t('Settings')}</span>
              </button>
              <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-2" />
              <button onClick={toggleTheme} className={ItemClass}>
                <Palette className="w-4 h-4 text-pink-500" />
                <span>{t('Toggle Theme')}</span>
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
