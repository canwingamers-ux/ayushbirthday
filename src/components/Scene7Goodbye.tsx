import { motion } from 'framer-motion';
import { Friend } from '../types';

export default function Scene7Goodbye({ friend }: { friend: Friend }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex items-center justify-center p-6 bg-black"
    >
      {friend.outroPhoto && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen scale-105"
          style={{ backgroundImage: `url(${friend.outroPhoto})` }}
        />
      )}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="text-center relative z-10 drop-shadow-xl"
      >
        <h2 className="text-3xl md:text-5xl font-medium text-white/90 tracking-tight mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {friend.goodbyeText || "Created with ❤️ for you"}
        </h2>
        <p className="text-xl text-white/60">
          {friend.goodbyeSubtitle || "Hope you enjoyed this little surprise"}
        </p>
      </motion.div>
    </motion.div>
  );
}
