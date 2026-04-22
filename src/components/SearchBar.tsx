import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../i18n';

type Engine = 'google' | 'youtube' | 'github';
const ENGINES: Engine[] = ['google', 'youtube', 'github'];

const engineConfig = {
  google: { icon: Search, color: 'text-blue-500', placeholder: 'Search Google...', hint: '/g', ruHint: '.п' },
  youtube: { icon: FaYoutube, color: 'text-red-500', placeholder: 'Search YouTube...', hint: '/yt', ruHint: '.не' },
  github: { icon: FaGithub, color: 'text-gray-800 dark:text-white', placeholder: 'Search GitHub...', hint: '/gh', ruHint: '.пр' }
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [engineIndex, setEngineIndex] = useState(0);
  const [dropdownIndex, setDropdownIndex] = useState(0);
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSpotlight, setSpotlight } = useUIStore();
  const { addHistory } = useHistoryStore();
  const enableHistory = useSettingsStore((s) => s.enableHistory);
  const t = useTranslation();

  const currentEngine = ENGINES[engineIndex];
  const ActiveIcon = engineConfig[currentEngine].icon;

  useEffect(() => {
    // If exact hint typed, select it in dropdown
    if (query.startsWith('/') || query.startsWith('.')) {
      const matchIndex = ENGINES.findIndex(eng => query.startsWith(engineConfig[eng].hint) || query.startsWith(engineConfig[eng].ruHint));
      if (matchIndex !== -1) setDropdownIndex(matchIndex);
    }
  }, [query]);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      const isSlash = e.key === '/' || e.code === 'Slash';
      const isF = e.key.toLowerCase() === 'f' || e.code === 'KeyF';

      // Toggle Spotlight globally
      if (!isInput && (isSlash || (e.ctrlKey && e.shiftKey && isF))) {
        e.preventDefault();
        setSpotlight(true);
        inputRef.current?.focus();
      }
      
      if (e.key === 'Escape' && isSpotlight) {
        setSpotlight(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [isSpotlight, setSpotlight]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isAutocompleteOpen = (isFocused || isSpotlight) && (query.startsWith('/') || query.startsWith('.') || dropdownForceOpen);

    if (e.key === 'Escape') {
      setQuery('');
      if (isSpotlight) setSpotlight(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      setEngineIndex((prev) => (prev + 1) % ENGINES.length);
      return;
    }

    if (isAutocompleteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setDropdownIndex((prev) => (prev + 1) % ENGINES.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setDropdownIndex((prev) => (prev - 1 + ENGINES.length) % ENGINES.length);
      } else if (e.key === 'Enter') {
        const trimmed = query.trim();
        // If they just typed a hint or partial hint, use it to switch engines, don't search yet
        if (trimmed === '/' || trimmed === '.' || ENGINES.some(eng => trimmed === engineConfig[eng].hint || trimmed === engineConfig[eng].ruHint)) {
          e.preventDefault();
          setEngineIndex(dropdownIndex);
          setQuery('');
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    let targetEngine = currentEngine;
    let actualQuery = q;

    if (q.startsWith('/yt ') || q.startsWith('.не ')) {
      targetEngine = 'youtube';
      actualQuery = q.substring(4);
    } else if (q.startsWith('/gh ') || q.startsWith('.пр ')) {
      targetEngine = 'github';
      actualQuery = q.substring(4);
    } else if (q.startsWith('/g ') || q.startsWith('.п ')) {
      targetEngine = 'google';
      actualQuery = q.substring(3);
    }

    if (enableHistory) {
      addHistory({
        type: 'search',
        title: actualQuery,
        payload: actualQuery,
        engine: targetEngine
      });
    }

    if (targetEngine === 'youtube') window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(actualQuery)}`;
    else if (targetEngine === 'github') window.location.href = `https://github.com/search?q=${encodeURIComponent(actualQuery)}`;
    else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(actualQuery)}`;
  };

  return (
    <>
      <AnimatePresence>
        {isSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[60]"
            onClick={() => {
              setSpotlight(false);
              inputRef.current?.blur();
            }}
          />
        )}
      </AnimatePresence>

      <div className={`w-full max-w-2xl mx-auto px-4 relative transition-all duration-500 ${isSpotlight ? 'z-[70] scale-[1.02] -translate-y-4' : 'z-20'}`}>
        <form onSubmit={handleSearch} className="relative group">
          <motion.div
            animate={{
              scale: isFocused || isSpotlight ? 1.02 : 1,
              boxShadow: isFocused || isSpotlight
                ? '0 20px 40px -10px rgba(99, 102, 241, 0.15)' 
                : '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
            }}
            className={`absolute inset-0 transition-colors rounded-[2rem] border ${isSpotlight ? 'bg-white dark:bg-gray-900 border-primary/30' : 'bg-white/40 dark:bg-white/5 backdrop-blur-xl border-black/5 dark:border-white/10'}`}
          />
          <div className="relative flex items-center px-6 py-4">
            <ActiveIcon className={`w-6 h-6 transition-colors duration-300 ${engineConfig[currentEngine].color}`} />
            
            {/* Engine Indicator */}
            <AnimatePresence>
              {(isFocused || isSpotlight) && (
                <motion.button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownForceOpen((v) => !v);
                    inputRef.current?.focus();
                  }}
                  initial={{ opacity: 0, width: 0, scale: 0.8, overflow: 'hidden' }} 
                  animate={{ opacity: 1, width: 'auto', scale: 1, transitionEnd: { overflow: 'visible' } }}
                  exit={{ opacity: 0, width: 0, scale: 0.8, overflow: 'hidden' }}
                  className="whitespace-nowrap pl-3 pr-1 py-1 flex items-center flex-shrink-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors"
                >
                  <span className="px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-gray-600 dark:text-white/60 block pointer-events-none">
                    {currentEngine}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (dropdownForceOpen) setDropdownForceOpen(false);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setDropdownForceOpen(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isSpotlight ? t("Search...") : t(engineConfig[currentEngine].placeholder)}
              className="w-full bg-transparent border-none px-4 text-sm sm:text-xl text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-white/30 transition-colors"
            />
            
            <AnimatePresence>
              {(query || isSpotlight) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery('');
                    setSpotlight(false);
                    inputRef.current?.blur();
                  }}
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white pointer-events-auto"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {/* Autocomplete Dropdown for Prefixes */}
          <AnimatePresence>
            {(isFocused || isSpotlight) && (query.startsWith('/') || query.startsWith('.') || dropdownForceOpen) && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
               >
                 <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">{t('Select Search Engine')}</div>
                 {ENGINES.map((eng, idx) => {
                   const conf = engineConfig[eng];
                   const Icon = conf.icon;
                   const isActiveItem = idx === dropdownIndex;
                   
                   return (
                     <button
                       key={eng}
                       type="button"
                       onMouseDown={(e) => {
                         e.preventDefault(); // Critical! Prevents input from blurring.
                       }}
                       onClick={() => {
                         setEngineIndex(idx);
                         setQuery('');
                         setDropdownForceOpen(false);
                         inputRef.current?.focus();
                       }}
                       className={`w-full flex items-center px-6 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isActiveItem ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                     >
                       <Icon className={`w-5 h-5 mr-3 ${conf.color}`} />
                       <span className="flex-1 text-left text-gray-800 dark:text-gray-100 font-medium">{t('Search with')} {eng}</span>
                       <span className="text-gray-400 dark:text-gray-500 font-mono text-sm bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{conf.hint} <span className="opacity-40">/</span> {conf.ruHint}</span>
                     </button>
                   );
                 })}
               </motion.div>
            )}
          </AnimatePresence>
        </form>

        {isSpotlight && !query.startsWith('/') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute top-full left-0 right-0 mt-6 text-center text-gray-500 dark:text-white/70 text-sm font-medium hidden sm:block"
          >
            Нажмите <kbd className="mx-1 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-md shadow-sm font-mono text-xs">Tab</kbd> чтобы сменить поисковик. <kbd className="mx-1 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-md shadow-sm font-mono text-xs">Esc</kbd> чтобы выйти.
          </motion.div>
        )}
      </div>
    </>
  );
}
