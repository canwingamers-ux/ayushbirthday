import { motion } from 'framer-motion';
import { Friend } from '../types';
import { ChevronRight } from 'lucide-react';

export default function Scene3CustomContent({ friend, onNext }: { friend: Friend, onNext: () => void }) {
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
    >
      <div className="min-h-full flex flex-col items-center py-20 px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full text-center mb-12"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-sm p-2 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
            <div className="w-full h-full rounded-sm overflow-hidden relative z-10 flex items-center justify-center bg-white/5 text-3xl font-bold">
              {friend.profilePhoto ? (
                <img src={friend.profilePhoto} alt={friend.name} className="w-full h-full object-cover" />
              ) : (
                friend.name.charAt(0)
              )}
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 relative z-10 whitespace-pre-wrap font-serif italic">
              "{friend.customMessage}"
            </p>
          </div>
        </motion.div>

        {friend.photoTemplate && friend.photoTemplate.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          >
            {friend.photoTemplate.map((photo, i) => (
              <div key={i} className="aspect-[3/4] rounded-sm p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl group relative">
                {/* Subtle paper texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                <div className="w-full h-full rounded-sm overflow-hidden relative z-10">
                  <img 
                    src={photo} 
                    alt="Memory" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={onNext}
          className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
