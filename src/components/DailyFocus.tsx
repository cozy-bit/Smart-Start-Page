import { useState, useRef, useEffect } from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useTranslation } from '../i18n';
import confetti from 'canvas-confetti';

export default function DailyFocus() {
  const { dailyFocus, setDailyFocus } = useUIStore();
  const t = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempValue.trim() !== '') {
      setDailyFocus(tempValue.trim());
      setCompleted(false);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue('');
    }
  };

  const clearFocus = () => {
    setDailyFocus('');
    setCompleted(false);
    setIsEditing(false);
  };

  const toggleComplete = () => {
    if (!completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#ec4899', '#f59e0b']
      });
    }
    setCompleted(!completed);
  };

  if (!dailyFocus && !isEditing) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => { setIsEditing(true); setTempValue(''); }}
        className="mt-4 md:mt-2 mb-6 group flex items-center justify-center space-x-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white/80 transition-colors mx-auto"
      >
        <Target className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        <span className="text-sm font-medium tracking-wide">{t('Set your daily focus')}</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 md:mt-2 mb-6 flex flex-col items-center justify-center mx-auto max-w-sm w-full relative z-20"
    >
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{t('Today')}</div>
      
      {isEditing ? (
        <div className="w-full relative">
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={t("What's on your mind?")}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-center text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="group relative flex items-center justify-center w-full"
          >
            <button
              onClick={toggleComplete}
              className={`flex flex-col items-center justify-center w-full p-4 rounded-2xl border transition-all duration-300 ${
                completed
                  ? 'border-green-500/30 bg-green-50 dark:bg-green-500/10 opacity-70'
                  : 'border-black/5 dark:border-white/5 bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                )}
                <span className={`text-lg md:text-xl font-medium transition-all ${
                  completed ? 'text-green-700 dark:text-green-400 line-through decoration-2 decoration-green-500/40' : 'text-gray-900 dark:text-white'
                }`}>
                  {dailyFocus}
                </span>
              </div>
            </button>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFocus}
              className="absolute -right-2 -top-2 w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Clear focus"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
