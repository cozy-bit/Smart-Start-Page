import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Command as CommandIcon, Plus, Palette, FileText } from 'lucide-react';
import { useLinkStore } from '../store/useLinkStore';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';

interface PaletteItem {
  id: string;
  title: string;
  type: 'link' | 'command';
  url?: string;
  icon: React.ReactNode;
  action?: () => void;
  subtitle?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { links } = useLinkStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Actions
  const { setAddLinkOpen, setNotesOpen } = useUIStore();
  const { theme, setTheme } = useUserStore();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      const isK = e.key.toLowerCase() === 'k' || e.code === 'KeyK';
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const globalCommands: PaletteItem[] = [
    { id: 'c1', title: 'Add new link', type: 'command', icon: <Plus className="w-5 h-5 text-green-400" />, action: () => setAddLinkOpen(true) },
    { id: 'c2', title: 'Create note', type: 'command', icon: <FileText className="w-5 h-5 text-yellow-400" />, action: () => setNotesOpen(true) },
    { id: 'c3', title: 'Switch theme', type: 'command', icon: <Palette className="w-5 h-5 text-purple-400" />, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];

  const linkItems: PaletteItem[] = links.map(link => ({
    id: `l-${link.id}`,
    title: link.title,
    subtitle: link.group,
    type: 'link',
    url: link.url,
    icon: <ExternalLink className="w-5 h-5 text-blue-400" />
  }));

  const allItems = [...globalCommands, ...linkItems];
  
  const filteredItems = query
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  // Reset index if out of bounds after filtering
  useEffect(() => {
    if (activeIndex >= filteredItems.length && filteredItems.length > 0) {
      setActiveIndex(filteredItems.length - 1);
    } else if (filteredItems.length === 0) {
      setActiveIndex(0);
    }
  }, [query, filteredItems.length, activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        executeItem(filteredItems[activeIndex]);
      }
    }
  };

  const executeItem = (item: PaletteItem) => {
    setIsOpen(false);
    if (item.type === 'link' && item.url) {
      window.location.href = item.url;
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#111218] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
          >
            <div className="relative border-b border-white/10 flex items-center px-4">
              <Search className="w-5 h-5 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search links..."
                className="w-full bg-transparent border-none px-4 py-4 text-white text-lg focus:outline-none focus:ring-0 placeholder-white/30"
              />
              <div className="text-xs text-white/30 border border-white/10 px-2 py-1 rounded-md hidden sm:block">ESC</div>
            </div>

            <div className="overflow-y-auto max-h-[400px] p-2 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-white/40">No results found for "{query}"</div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                        index === activeIndex ? 'bg-primary/20 text-white' : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <div className={`flex items-center justify-center p-2 rounded-lg ${
                         item.type === 'command' ? 'bg-white/5' : 'bg-transparent'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="font-medium">{item.title}</div>
                        {item.subtitle && <div className="text-xs text-white/40 mt-0.5">{item.subtitle}</div>}
                      </div>
                      {item.type === 'command' && (
                        <div className="text-xs font-medium text-white/30 px-2 py-1 bg-white/5 rounded">Command</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-white/5 p-3 flex items-center justify-between text-xs text-white/30 bg-black/20">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1"><span>↑↓</span> <span>to navigate</span></span>
                <span className="flex items-center space-x-1"><span>↵</span> <span>to execute</span></span>
              </div>
              <div className="flex items-center space-x-1">
                <CommandIcon className="w-3 h-3" />
                <span>Command Palette</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
