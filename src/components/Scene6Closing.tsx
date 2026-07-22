import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Friend } from '../types';

export default function Scene6Closing({ friend, onComplete }: { friend: Friend, onComplete: () => void }) {
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 flex items-center justify-center p-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/20 via-black to-pink-900/20" />
      
      <motion.div
        initial={{ scale: 0.8, filter: "blur(20px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 whitespace-pre-line">
          {friend.closingText || `Happy Birthday,\n${friend.name}`}
        </h1>
      </motion.div>
    </motion.div>
  );
}
