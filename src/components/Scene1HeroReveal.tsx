import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Friend } from '../types';

export default function Scene1HeroReveal({ friend, onComplete }: { friend: Friend, onComplete: () => void }) {
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const text = `Happy Birthday, ${friend.name}`;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex items-center justify-center p-6 overflow-hidden"
    >
      {friend.introPhoto ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen scale-105"
          style={{ backgroundImage: `url(${friend.introPhoto})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-black to-blue-900/20" />
      )}
      
      <h1 
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-center tracking-tighter leading-tight relative z-10 text-white drop-shadow-2xl px-4"
        style={friend.heroFont ? { fontFamily: friend.heroFont } : {}}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.05,
              ease: [0.2, 0.65, 0.3, 0.9]
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  );
}
