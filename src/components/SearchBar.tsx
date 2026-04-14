import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (q.startsWith('/yt ')) {
      window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(q.substring(4))}`;
    } else if (q.startsWith('/gh ')) {
      window.location.href = `https://github.com/search?q=${encodeURIComponent(q.substring(4))}`;
    } else if (q.startsWith('/g ')) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q.substring(3))}`;
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 z-20 relative">
      <form onSubmit={handleSearch} className="relative group">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 20px 40px -10px rgba(99, 102, 241, 0.15)' 
              : '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
          }}
          className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2rem] transition-colors"
        />
        <div className="relative flex items-center px-6 py-4">
          <Search className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-gray-400 dark:text-white/40'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search Google or type a command (/yt, /gh)..."
            className="w-full bg-transparent border-none px-4 text-xl text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-white/30 transition-colors"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
