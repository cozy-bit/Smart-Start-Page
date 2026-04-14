import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGreeting, formatTime, formatDate } from '../utils/time';

export default function GreetingWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(now);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center text-center space-y-2 my-12"
    >
      <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 drop-shadow-sm select-none">
        {formatTime(now)}
      </h1>
      <p className="text-xl md:text-2xl text-white/60 font-medium tracking-wide">
        {formatDate(now)}
      </p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-3 mt-8 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg hover:bg-white/10 transition-colors"
      >
        <span className="text-2xl" role="img" aria-label="greeting icon">{greeting.icon}</span>
        <span className="text-xl font-medium text-white/90">
          {greeting.text}, <span className="font-semibold text-white">Amirkhon</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
