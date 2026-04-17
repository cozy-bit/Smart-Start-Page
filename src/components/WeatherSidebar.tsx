import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeather, getWeatherIcon, formatHour, formatDay, WeatherData } from '../utils/weather';
import { useUserStore } from '../store/useUserStore';
import { Loader2 } from 'lucide-react';

export default function WeatherSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { location, setLocation } = useUserStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // default to Dushanbe
  const defaultLoc = { latitude: 38.5598, longitude: 68.7870, city: 'Dushanbe' };

  useEffect(() => {
    if (!location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
             setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, city: 'Local' });
          },
          () => {
             setLocation(defaultLoc);
          }
        );
      } else {
        setLocation(defaultLoc);
      }
    }
  }, [location, setLocation]);

  useEffect(() => {
    const loc = location || defaultLoc;
    setIsLoading(true);
    fetchWeather(loc.latitude, loc.longitude)
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-ignore-outside="true"]')) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  if (isLoading && !data) {
    return (
      <div className="fixed top-4 left-4 md:top-1/2 md:left-2 md:-translate-y-1/2 z-[60] flex items-center">
        <div className="glass-panel flex items-center justify-center p-3 md:p-4 md:py-6 shadow-xl">
           <Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-white/50" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={sidebarRef} className="fixed top-4 left-4 md:top-1/2 md:left-2 md:-translate-y-1/2 z-[60] flex items-center">
      <AnimatePresence initial={false}>
        {!expanded ? (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            onClick={() => setExpanded(true)}
            whileHover={{ scale: 1.05 }}
            className="glass-panel flex md:flex-col items-center justify-center p-3 md:p-4 md:py-6 space-x-2 md:space-x-0 md:space-y-3 cursor-pointer shadow-xl hover:shadow-primary/20"
          >
            <span className="hidden md:block text-sm font-semibold text-gray-500 dark:text-white/50 tracking-wider [writing-mode:vertical-lr] rotate-180">
              {location?.city || 'Weather'}
            </span>
            <span className="block md:hidden text-sm font-semibold text-gray-500 dark:text-white/50 pl-1">
              {location?.city || 'Weather'}
            </span>
            <span className="text-3xl">{getWeatherIcon(data.current.weatherCode)}</span>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{Math.round(data.current.temperature)}°</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, width: 0, x: -50 }}
            animate={{ opacity: 1, width: 340, x: 0 }}
            exit={{ opacity: 0, width: 0, x: -50, transition: { duration: 0.3 } }}
            className="glass-panel overflow-hidden h-[85vh] md:h-[80vh] max-h-[700px] flex flex-col shadow-2xl relative max-w-[90vw]"
          >
            <div className="p-5 md:p-6 pb-2 min-w-[280px] md:min-w-[340px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{location?.city || 'Local'}</h2>
                  <p className="text-gray-500 dark:text-white/60">Current Weather</p>
                </div>
                <button onClick={() => setExpanded(false)} className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white p-1">
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-2xl p-5 mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-5xl">{getWeatherIcon(data.current.weatherCode)}</span>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round(data.current.temperature)}°</div>
                    <div className="text-gray-500 dark:text-white/60 text-sm mt-1">Feels like {Math.round(data.current.feelsLike)}°</div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600 dark:text-white/70 space-y-1">
                  <div>💧 {data.current.humidity}%</div>
                  <div>🌬️ {data.current.windSpeed} km/h</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 custom-scrollbar min-w-[340px]">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-3">Today</h3>
                <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                  {data.hourly.time.slice(0, 12).map((time, i) => (
                    <div key={i} className="flex flex-col items-center bg-black/5 dark:bg-white/5 rounded-xl p-3 min-w-[60px]">
                      <span className="text-xs text-gray-500 dark:text-white/60 mb-2">{formatHour(time)}</span>
                      <span className="text-2xl mb-1">{getWeatherIcon(data.hourly.weatherCode[i])}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{Math.round(data.hourly.temperature[i])}°</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-3">7-Day Forecast</h3>
                <div className="space-y-2">
                  {data.daily.time.map((time, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <span className="w-12 font-medium text-gray-600 dark:text-white/80">{i === 0 ? 'Today' : formatDay(time)}</span>
                      <span className="text-xl">{getWeatherIcon(data.daily.weatherCode[i])}</span>
                      <div className="flex space-x-3 w-20 justify-end font-medium">
                        <span className="text-gray-400 dark:text-white/50">{Math.round(data.daily.temperatureMin[i])}°</span>
                        <span className="text-gray-900 dark:text-white">{Math.round(data.daily.temperatureMax[i])}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
