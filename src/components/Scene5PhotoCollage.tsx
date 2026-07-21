import { motion } from 'framer-motion';
import { Friend } from '../types';
import { ChevronRight } from 'lucide-react';

export default function Scene5PhotoCollage({ friend, onNext }: { friend: Friend, onNext: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden p-6"
    >
      <div className="max-w-5xl mx-auto py-12 min-h-full flex flex-col justify-center">
        
        {friend.collagePhotos && friend.collagePhotos.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="columns-2 md:columns-3 gap-4 space-y-4 mb-16"
          >
            {friend.collagePhotos.map((url, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="break-inside-avoid rounded-sm p-2 sm:p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl relative group mb-4"
              >
                {/* Subtle paper texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 rounded-sm pointer-events-none" />
                <div className="rounded-sm overflow-hidden relative z-0">
                  <img 
                    src={url} 
                    alt={`Memory ${i+1}`} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {friend.showParagraph && friend.collageParagraph && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-serif italic backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10">
              {friend.collageParagraph}
            </p>
          </motion.div>
        )}
        
        {(!friend.collagePhotos || friend.collagePhotos.length === 0) && (!friend.showParagraph || !friend.collageParagraph) && (
          <div className="text-center text-white/50 py-20">
            No collage content provided.
          </div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          onClick={onNext}
          className="fixed bottom-8 right-8 bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform z-50"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
