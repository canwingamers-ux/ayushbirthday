import { motion } from 'framer-motion';
import { Friend } from '../types';
import { ChevronRight } from 'lucide-react';

export default function SceneVideo({ friend, onNext }: { friend: Friend, onNext: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (!friend.videos || friend.videos.length === 0) {
    onNext();
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden p-6"
    >
      <div className="max-w-5xl mx-auto py-12 min-h-full flex flex-col justify-center">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {friend.videos.map((url, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/40"
            >
              <video 
                src={url} 
                controls
                playsInline
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={onNext}
          className="fixed bottom-8 right-8 bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform z-50"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
