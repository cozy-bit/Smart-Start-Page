import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

// Simple Web Audio API Synthesizer for notifications
class AudioEngine {
  ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  playTick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // A nice bell-like sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.2); // E5

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);
  }
}

const audio = new AudioEngine();

const MODES = {
  '25/5': { focus: 25 * 60, break: 5 * 60 },
  '50/10': { focus: 50 * 60, break: 10 * 60 }
};

const THEMES = [
  { id: 'Purple Space', classes: 'from-[#121321] to-[#2a1738]', triggerClass: 'bg-purple-900' },
  { id: 'Dark Minimal', classes: 'from-gray-900 to-black', triggerClass: 'bg-gray-800' },
  { id: 'Lavender', classes: 'from-indigo-100 to-purple-100', triggerClass: 'bg-indigo-300' },
  { id: 'Forest', classes: 'from-green-900 to-[#12241b]', triggerClass: 'bg-green-800' },
  { id: 'Ocean', classes: 'from-[#0f172a] to-[#1e3a8a]', triggerClass: 'bg-blue-900' },
  { id: 'Sunset', classes: 'from-[#4c1d95] to-[#9f1239]', triggerClass: 'bg-rose-900' },
  { id: 'Coffee', classes: 'from-[#292524] to-[#451a03]', triggerClass: 'bg-amber-900' },
  { id: 'Mint', classes: 'from-[#ecfdf5] to-[#a7f3d0]', triggerClass: 'bg-emerald-200' },
];

const DIGIT_THEMES = [
  { id: 'White', colorClass: 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]', triggerClass: 'bg-white' },
  { id: 'Dark', colorClass: 'text-gray-900 drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]', triggerClass: 'bg-gray-900' },
  { id: 'Indigo', colorClass: 'text-indigo-400 drop-shadow-[0_0_40px_rgba(129,140,248,0.4)]', triggerClass: 'bg-indigo-400' },
  { id: 'Emerald', colorClass: 'text-emerald-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.4)]', triggerClass: 'bg-emerald-400' },
  { id: 'Rose', colorClass: 'text-rose-400 drop-shadow-[0_0_40px_rgba(251,113,133,0.4)]', triggerClass: 'bg-rose-400' },
  { id: 'Amber', colorClass: 'text-amber-400 drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]', triggerClass: 'bg-amber-400' },
  { id: 'Cyan', colorClass: 'text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]', triggerClass: 'bg-cyan-400' },
  { id: 'Fuchsia', colorClass: 'text-fuchsia-400 drop-shadow-[0_0_40px_rgba(232,121,249,0.4)]', triggerClass: 'bg-fuchsia-400' },
];

import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../i18n';

export default function PomodoroTimer() {
  const { isPomodoroOpen, setPomodoroOpen } = useUIStore();
  const { pomodoroTheme, pomodoroDigitTheme, setStringSetting } = useSettingsStore();
  const t = useTranslation();
  
  const [mode, setMode] = useState<'25/5' | '50/10'>('25/5');
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES['25/5'].focus);
  const [isActive, setIsActive] = useState(false);
  
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [isDigitPickerOpen, setIsDigitPickerOpen] = useState(false);
  
  const lastTickedSecond = useRef<number>(-1);
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPomodoroOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isPomodoroOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target as Node)) {
        setIsBgPickerOpen(false);
        setIsDigitPickerOpen(false);
      }
    };
    if (isBgPickerOpen || isDigitPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isBgPickerOpen, isDigitPickerOpen]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(MODES[mode][phase]);
    }
  }, [mode, phase]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          
          if (newTime > 0 && newTime <= 4 && lastTickedSecond.current !== newTime) {
            audio.playTick();
            lastTickedSecond.current = newTime;
          }

          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      audio.playChime();
      if (phase === 'focus') {
        const nextPhase = 'break';
        setPhase(nextPhase);
        setTimeLeft(MODES[mode][nextPhase]);
      } else {
        const nextPhase = 'focus';
        setPhase(nextPhase);
        setTimeLeft(MODES[mode][nextPhase]);
        setIsActive(false); 
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, phase, mode]);

  const toggleTimer = () => {
    audio.init(); 
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode][phase]);
    lastTickedSecond.current = -1;
  };

  if (!isPomodoroOpen) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const currentThemeObj = THEMES.find(t => t.id === pomodoroTheme) || THEMES[0];
  const currentDigitThemeObj = DIGIT_THEMES.find(t => t.id === pomodoroDigitTheme) || DIGIT_THEMES[0];
  const isLight = ['Lavender', 'Mint'].includes(currentThemeObj.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br ${currentThemeObj.classes} transition-colors duration-1000`}
      >
        <button
          onClick={() => setPomodoroOpen(false)}
          className={`absolute top-5 right-5 md:top-8 md:right-8 p-2 md:p-3 rounded-full transition-all duration-500 z-[200] ${isActive ? 'opacity-10 hover:opacity-100' : 'opacity-100'} ${isLight ? 'text-gray-500 hover:text-black bg-black/5 hover:bg-black/10' : 'text-white/40 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          <X className="w-5 h-5 md:w-8 md:h-8" />
        </button>

        {/* Top Control Bar: Colors */}
        <AnimatePresence>
          {!isActive && (
            <motion.div 
              ref={topBarRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-6 md:top-12 flex space-x-1.5 md:space-x-4 ${isLight ? 'bg-black/5' : 'bg-white/5'} p-1.5 md:p-2 rounded-2xl backdrop-blur-md items-center shadow-lg z-[210]`}
            >
              {/* Background Theme Selector */}
              <div className="relative">
                <button 
                  onClick={() => { setIsBgPickerOpen(!isBgPickerOpen); setIsDigitPickerOpen(false); }}
                  className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-xl transition-colors font-medium text-xs md:text-sm ${isLight ? 'hover:bg-white text-gray-700' : 'hover:bg-white/10 text-white/80'}`}
                >
                  <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-black/20 dark:border-white/20 ${currentThemeObj.triggerClass}`} />
                  <span className="hidden sm:block">{currentThemeObj.id}</span>
                  <span className="sm:hidden">Bg</span>
                </button>
                
                <AnimatePresence>
                  {isBgPickerOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute left-0 top-full mt-2 w-48 rounded-xl shadow-2xl overflow-y-auto max-h-[50vh] py-2 scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20 ${isLight ? 'bg-white' : 'bg-[#1a1b26] border border-white/10'}`}
                    >
                      {THEMES.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setStringSetting('pomodoroTheme', theme.id);
                            setIsBgPickerOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors text-sm ${isLight ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-white/5 text-white/80'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border border-black/20 dark:border-white/20 ${theme.triggerClass}`} />
                          <span>{theme.id}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`w-px h-5 md:h-8 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

              {/* Digit Theme Selector */}
              <div className="relative">
                <button 
                  onClick={() => { setIsDigitPickerOpen(!isDigitPickerOpen); setIsBgPickerOpen(false); }}
                  className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-xl transition-colors font-medium text-xs md:text-sm ${isLight ? 'hover:bg-white text-gray-700' : 'hover:bg-white/10 text-white/80'}`}
                >
                  <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-black/20 dark:border-white/20 ${currentDigitThemeObj.triggerClass}`} />
                  <span className="hidden sm:block">{currentDigitThemeObj.id}</span>
                  <span className="sm:hidden">Text</span>
                </button>
                
                <AnimatePresence>
                  {isDigitPickerOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl overflow-y-auto max-h-[50vh] py-2 scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20 ${isLight ? 'bg-white' : 'bg-[#1a1b26] border border-white/10'}`}
                    >
                      {DIGIT_THEMES.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setStringSetting('pomodoroDigitTheme', theme.id);
                            setIsDigitPickerOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors text-sm ${isLight ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-white/5 text-white/80'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border border-black/20 dark:border-white/20 ${theme.triggerClass}`} />
                          <span>{theme.id}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Container */}
        <div className="flex flex-col items-center group relative mt-0 z-[50]">
          {/* Phase Indicator */}
          <div className={`absolute -top-16 font-bold tracking-widest uppercase text-xl ${isLight ? 'text-indigo-500' : 'text-white/30'}`}>
            {phase === 'focus' ? t('FOCUS') : t('BREAK')}
          </div>

          <div className={`text-[10rem] sm:text-[14rem] md:text-[18rem] font-bold tracking-tighter leading-none tabular-nums opacity-90 ${currentDigitThemeObj.colorClass} transition-colors duration-1000`}>
            {minutes}:{seconds}
          </div>

          {/* Mode Toggles Below Timer */}
          <AnimatePresence>
            {!isActive && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex space-x-4 mt-8"
              >
                <button
                  onClick={() => { setMode('25/5'); setPhase('focus'); }}
                  className={`flex items-center space-x-2 px-5 md:px-6 py-2.5 rounded-xl transition-all font-semibold text-sm md:text-base ${
                    mode === '25/5' 
                      ? (isLight ? 'bg-white shadow-sm text-indigo-600' : 'bg-indigo-500/20 text-indigo-300') 
                      : (isLight ? 'text-gray-500 hover:bg-white/50' : 'text-white/50 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>25/5 {t('min')}</span>
                </button>
                <button
                  onClick={() => { setMode('50/10'); setPhase('focus'); }}
                  className={`flex items-center space-x-2 px-5 md:px-6 py-2.5 rounded-xl transition-all font-semibold text-sm md:text-base ${
                    mode === '50/10' 
                      ? (isLight ? 'bg-white shadow-sm text-pink-600' : 'bg-pink-500/20 text-pink-300') 
                      : (isLight ? 'text-gray-500 hover:bg-white/50' : 'text-white/50 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>50/10 {t('min')}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions: Always visible on mobile, visible on hover on desktop */}
          <div className="flex items-center space-x-6 mt-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-[60]">
            <button
              onClick={toggleTimer}
              className={`p-5 md:p-6 rounded-full transition-all transform-gpu hover:scale-105 ${isLight ? 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-500' : 'bg-white text-black hover:bg-indigo-100 shadow-[0_0_40px_rgba(255,255,255,0.3)]'}`}
            >
              {isActive ? <Pause className={`w-6 h-6 md:w-8 md:h-8 ${isLight ? 'fill-white' : 'fill-black'}`} /> : <Play className={`w-6 h-6 md:w-8 md:h-8 ml-1 ${isLight ? 'fill-white' : 'fill-black'}`} />}
            </button>

            <button
              onClick={resetTimer}
              className={`p-4 md:p-5 rounded-full transition-all ${isLight ? 'bg-black/5 text-gray-500 hover:bg-black/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
