import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGreeting, formatTime, formatDate } from '../utils/time';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Edit2 } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function GreetingWidget() {
  const [now, setNow] = useState(new Date());
  const { firstName, setFirstName } = useUserStore();
  const language = useSettingsStore(s => s.language) || 'ru';
  const t = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isEditing) {
      setEditValue(firstName);
    }
  }, [isEditing, firstName]);

  const handleSaveName = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editValue.trim() && editValue.trim() !== firstName) {
      setFirstName(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(firstName); 
    }
  };

  const greeting = getGreeting(now);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center text-center space-y-2 mt-8 mb-6 md:my-12"
    >
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-white dark:via-white/90 dark:to-white/40 drop-shadow-sm select-none pr-2">
        {formatTime(now)}
      </h1>
      <p className="text-lg md:text-2xl text-gray-500 dark:text-white/60 font-medium tracking-wide transition-colors">
        {formatDate(now, language)}
      </p>
      {firstName && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-3 mt-4 md:mt-8 bg-black/5 dark:bg-white/5 backdrop-blur-md px-5 py-2 md:px-6 md:py-3 rounded-full border border-black/5 dark:border-white/10 shadow-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
        >
          <span className="text-xl md:text-2xl" role="img" aria-label="greeting icon">{greeting.icon}</span>
          
          <div className="flex items-center text-lg md:text-xl font-medium text-gray-700 dark:text-white/90 transition-colors">
            <span>{t(greeting.text)},</span>
            {isEditing ? (
              <form onSubmit={handleSaveName} className="ml-2 w-auto max-w-[150px]">
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveName()}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white dark:bg-black/30 text-gray-900 dark:text-white rounded-md px-2 py-0.5 outline-none ring-1 ring-primary/50 text-center font-semibold transition-colors"
                />
              </form>
            ) : (
              <div 
                className="ml-1 md:ml-2 font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center space-x-2 transition-colors"
                onClick={() => setIsEditing(true)}
                title="Click to change your name"
              >
                <span>{firstName}</span>
                <Edit2 className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-60 transition-opacity text-gray-400 dark:text-white/80 hover:text-gray-900 dark:hover:text-white" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
