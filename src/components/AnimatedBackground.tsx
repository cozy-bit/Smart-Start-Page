import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Orb 1: Основной шарик (Фиолетовый в темной, Мягко-синий в светлой) */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, 40, -60, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[5%] left-[10%] w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] rounded-full bg-blue-300/50 dark:bg-purple-600/20 blur-[100px] md:blur-[140px]"
      />
      
      {/* Orb 2: Вторичный шарик (Розовый/Лавандовый в светлой, Индиго в темной) */}
      <motion.div
        animate={{
          x: [0, -50, 60, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[5%] right-[5%] w-[45vw] max-w-[500px] h-[45vw] max-h-[500px] rounded-full bg-pink-300/40 dark:bg-indigo-600/20 blur-[100px] md:blur-[140px]"
      />

      {/* Orb 3: Центральный акцент для объёма */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[40%] left-[40%] w-[30vw] max-w-[400px] h-[30vw] max-h-[400px] rounded-full bg-purple-200/30 dark:bg-blue-600/10 blur-[90px] md:blur-[120px]"
      />
    </div>
  );
}
