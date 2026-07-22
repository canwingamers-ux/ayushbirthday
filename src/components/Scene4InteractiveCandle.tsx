import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playBlowSound, triggerHaptic } from '../sounds';
import { Friend } from '../types';
import Confetti from './Confetti';

export default function Scene4InteractiveCandle({ friend, onComplete }: { friend: Friend, onComplete: () => void }) {
  const [candlesLit, setCandlesLit] = useState(3);
  
  // Track previous candles to play sound only once per blow out
  const prevCandles = useRef(3);

  useEffect(() => {
    if (candlesLit < prevCandles.current) {
      playBlowSound();
      triggerHaptic('success');
      prevCandles.current = candlesLit;
    }
    
    // If all candles are blown out, trigger completion
    if (candlesLit === 0) {
      setTimeout(onComplete, 2000);
    }
  }, [candlesLit, onComplete]);

  const handleTap = () => {
    setCandlesLit(prev => Math.max(0, prev - 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent opacity-50" />
      
      {candlesLit === 0 && <Confetti count={150} duration={4000} />}

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {friend.scene4Title || "Make a Wish"}
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 text-white/80">
            {candlesLit > 0 
              ? (friend.scene4Instruction || "Tap the candles to make a wish") 
              : (friend.scene4Success || "Yay! Wish made!")}
          </p>
          
          <div className="relative w-64 h-64 mx-auto cursor-pointer" onClick={handleTap}>
            {/* Cake base */}
            <div className="absolute bottom-0 w-full h-24 bg-pink-900/40 backdrop-blur rounded-t-3xl border-t border-pink-500/20 flex flex-col justify-end overflow-hidden shadow-2xl">
              <div className="w-full h-8 bg-pink-800/50" />
            </div>
            
            {/* Candles */}
            <div className="absolute bottom-24 w-full flex justify-center gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <AnimatePresence>
                    {candlesLit > i && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: [1, 1.2, 1],
                          rotate: [-5, 5, -5]
                        }}
                        exit={{ opacity: 0, scale: 0, y: -20 }}
                        transition={{ 
                          duration: 0.5,
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }}
                        className="w-4 h-12 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full blur-[2px] shadow-[0_0_20px_rgba(253,224,71,0.8)] z-20 mb-1"
                      />
                    )}
                  </AnimatePresence>
                  <div className="w-3 h-16 bg-white/80 rounded-t-sm z-10 striped-candle" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Add candle striping via raw CSS in a style tag for simplicity */}
      <style>{`
        .striped-candle {
          background: repeating-linear-gradient(
            45deg,
            #ffb7b2,
            #ffb7b2 10px,
            #e28484 10px,
            #e28484 20px
          );
        }
      `}</style>
    </motion.div>
  );
}
