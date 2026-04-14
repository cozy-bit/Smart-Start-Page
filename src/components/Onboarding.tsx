import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'sonner';

export default function Onboarding() {
  const { firstName, setFirstName } = useUserStore();
  const [name, setName] = useState('');

  if (firstName) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setFirstName(name.trim());
      toast.success(`Welcome aboard, ${name.trim()}!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/98 backdrop-blur-3xl p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 transition-colors">
          Welcome to your space
        </h1>
        <p className="text-xl text-gray-500 dark:text-white/50 mb-8 transition-colors">What should we call you?</p>
        
        <form onSubmit={handleSubmit} className="relative group">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amirkhon"
            className="w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-5 text-2xl text-center text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-400 dark:placeholder-white/20 shadow-xl"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 bg-primary hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-primary text-white font-semibold py-4 rounded-2xl transition-colors text-lg shadow-lg"
          >
            Get Started
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
