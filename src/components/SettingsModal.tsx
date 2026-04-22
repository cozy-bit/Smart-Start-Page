import { X, Settings, Clock, Link as LinkIcon, Search, Trash2, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useTranslation } from '../i18n';
import { useState } from 'react';

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen } = useUIStore();
  const { enableWeather, enableNotes, enableHistory, enableEcoMode, fontFamily, customWallpaper, language, toggleSetting, setStringSetting } = useSettingsStore();
  const { history, clearHistory } = useHistoryStore();
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'appearance'>('settings');
  const t = useTranslation();

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-md p-4"
        onClick={() => setSettingsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-[#111218] border border-black/10 dark:border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 text-lg font-semibold transition-colors ${
                  activeTab === 'settings' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/80'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>{t('Settings')}</span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center space-x-2 text-lg font-semibold transition-colors ${
                  activeTab === 'appearance' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/80'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span>{t('Appearance')}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 text-lg font-semibold transition-colors ${
                  activeTab === 'history' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/80'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{t('History')}</span>
              </button>
            </div>
            <button 
              onClick={() => setSettingsOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {activeTab === 'settings' ? (
              <div className="space-y-6">
                <ToggleItem 
                  label={t('Weather Sidebar')} 
                  description={t('Show daily and weekly forecast widget.')}
                  active={enableWeather}
                  onChange={() => toggleSetting('enableWeather')}
                />
                <ToggleItem 
                  label={t('Quick Notes Sidebar')} 
                  description={t('Show scratchpad for temporary notes.')}
                  active={enableNotes}
                  onChange={() => toggleSetting('enableNotes')}
                />
                <ToggleItem 
                  label={t('Track Action History')} 
                  description={t('Keep a local log of recent searches and link clicks.')}
                  active={enableHistory}
                  onChange={() => toggleSetting('enableHistory')}
                />
              </div>
            ) : activeTab === 'appearance' ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">{t('Language')}</label>
                  <select 
                    value={language}
                    onChange={(e) => setStringSetting('language', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
                  >
                    <option value="ru" className="dark:bg-gray-800">Русский</option>
                    <option value="en" className="dark:bg-gray-800">English</option>
                  </select>
                </div>

                <ToggleItem 
                  label={t('Eco Mode')} 
                  description={t('Disable heavy animations and blurs to save battery and increase performance.')}
                  active={enableEcoMode}
                  onChange={() => toggleSetting('enableEcoMode')}
                />
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">{t('Font Family')}</label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setStringSetting('fontFamily', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
                  >
                    <option value="Inter" className="dark:bg-gray-800">Inter (Default)</option>
                    <option value="JetBrains Mono" className="dark:bg-gray-800">JetBrains Mono</option>
                    <option value="Outfit" className="dark:bg-gray-800">Outfit</option>
                    <option value="Space Grotesk" className="dark:bg-gray-800">Space Grotesk</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white">{t('Custom Wallpaper URL')}</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={customWallpaper}
                    onChange={(e) => setStringSetting('customWallpaper', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Leave empty to use the dynamic Aurora background.')}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('Recent Actions')}</span>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-xs flex items-center space-x-1 text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('Clear all')}</span>
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    {t('No history recorded yet.')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <a
                        key={item.id}
                        href={item.type === 'link' ? item.payload : undefined}
                        onClick={(e) => {
                          if (item.type === 'search') {
                            e.preventDefault();
                            // Re-run search
                            let searchUrl = '';
                            if (item.engine === 'youtube') searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.payload)}`;
                            else if (item.engine === 'github') searchUrl = `https://github.com/search?q=${encodeURIComponent(item.payload)}`;
                            else searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.payload)}`;
                            window.location.href = searchUrl;
                          }
                        }}
                        className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                          {item.type === 'link' ? <LinkIcon className="w-4 h-4 text-primary" /> : <Search className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item.payload}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ToggleItem({ label, description, active, onChange }: { label: string, description: string, active: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
      <div className="pr-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            active ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
