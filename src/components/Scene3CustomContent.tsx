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
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/20">
            {friend.profilePhoto ? (
              <img src={friend.profilePhoto} alt={friend.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center text-3xl font-bold">
                {friend.name.charAt(0)}
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{friend.scene3Title || "A Journey Together"}</h2>
          <p className="text-gray-400 mb-8">{friend.scene3Subtitle || "Some beautiful moments we've shared..."}</p>

          <div className="bg-[#151518] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 relative z-10 whitespace-pre-wrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
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
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden group border border-white/10 relative">
                <img 
                  src={photo} 
                  alt="Memory" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
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
