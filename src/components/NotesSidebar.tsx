import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useNoteStore } from '../store/useNoteStore';
import { FileText, X } from 'lucide-react';

export default function NotesSidebar() {
  const { isNotesOpen, setNotesOpen } = useUIStore();
  const { noteContent, setNoteContent } = useNoteStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking inside floating menu triggers
      if ((e.target as Element).closest('[data-ignore-outside="true"]')) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setNotesOpen(false);
      }
    };
    if (isNotesOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotesOpen, setNotesOpen]);

  return (
    <div ref={sidebarRef} className="fixed right-4 md:right-2 top-24 md:top-1/2 md:-translate-y-1/2 z-40 flex items-center justify-end">
      <AnimatePresence initial={false} mode="wait">
        {!isNotesOpen ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            onClick={() => setNotesOpen(true)}
            whileHover={{ scale: 1.05 }}
            className="glass-panel flex md:flex-col items-center justify-center p-3 md:p-4 space-x-2 cursor-pointer shadow-xl hover:shadow-primary/20 md:space-x-0 md:space-y-3 md:py-6"
          >
            <FileText className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <span className="hidden md:block text-sm font-semibold text-gray-500 dark:text-white/50 tracking-wider [writing-mode:vertical-rl] rotate-180">
              Notes
            </span>
            <span className="block md:hidden text-sm font-semibold text-gray-500 dark:text-white/50 pr-1">
              Notes
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 0, x: 50 }}
            animate={{ opacity: 1, width: 340, x: 0 }}
            exit={{ opacity: 0, width: 0, x: 50, transition: { duration: 0.3 } }}
            className="glass-panel overflow-hidden h-[75vh] md:h-[80vh] max-h-[700px] flex flex-col shadow-2xl relative max-w-[90vw]"
          >
            <div className="p-5 md:p-6 pb-2 min-w-[280px] md:min-w-[340px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Quick Notes</h2>
                  <p className="text-gray-500 dark:text-white/60 text-sm">Saved locally</p>
                </div>
                <button onClick={() => setNotesOpen(false)} className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white p-1">
                  <X className="w-5 h-5"/>
                </button>
              </div>
            </div>

            <div className="flex-1 px-5 md:px-6 pb-5 md:pb-6 min-w-[280px] md:min-w-[340px]">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your notes here... (Saves automatically)"
                className="w-full h-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder-white/30 custom-scrollbar transition-colors"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
