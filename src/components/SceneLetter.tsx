import { motion } from 'framer-motion';
import { Friend } from '../types';
import Markdown from 'react-markdown';
import { getTheme } from '../themes';

export default function SceneLetter({ friend, onNext }: { friend: Friend, onNext: () => void }) {
  const themeConfig = getTheme(friend.theme);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden p-6"
    >
      <div className="max-w-2xl mx-auto py-20 min-h-full flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`backdrop-blur-2xl ${themeConfig.accent} p-8 md:p-14 rounded-md border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex-1 flex flex-col relative`}
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

          <div className="relative z-10 flex-1 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight pb-6 border-b border-white/20 opacity-90" style={{ fontFamily: 'Georgia, serif' }}>
              Dear {friend.name},
            </h2>
            
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none font-medium text-white/90 leading-loose mb-12 flex-1" style={{ fontFamily: 'Georgia, serif' }}>
              <Markdown>{friend.letterText || "Wishing you the absolute best on this special day. We've shared so many wonderful memories, and I can't wait to make more."}</Markdown>
            </div>

            {friend.letterPhotos && friend.letterPhotos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {friend.letterPhotos.map((photo, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, rotate: -5 + Math.random() * 10, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="rounded-sm p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl"
                  >
                    <img src={photo} className="w-full aspect-[4/3] object-cover rounded-sm" alt="" />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-auto pt-8">
              <button 
                onClick={onNext}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors text-lg"
              >
                Turn Page 
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
