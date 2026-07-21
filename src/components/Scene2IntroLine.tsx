import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Friend } from '../types';

export default function Scene2IntroLine({ friend, onComplete }: { friend: Friend, onComplete: () => void }) {
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex items-end justify-center p-8 pb-32 overflow-hidden"
    >
      {friend.introLinePhoto && (
        <div className="absolute inset-0 z-0">
          <img src={friend.introLinePhoto} alt="Intro background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}
      <motion.p 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-2xl md:text-4xl font-medium text-center text-white/90 tracking-tight leading-relaxed max-w-2xl relative z-10 drop-shadow-2xl"
      >
        "{friend.introLine || 'May this birthday fill you with joy'}"
      </motion.p>
    </motion.div>
  );
}
