import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Friend } from '../types';
import { Lock } from 'lucide-react';
import { playSuccessSound, playErrorSound, triggerHaptic } from '../sounds';

export default function Scene0PinGate({ friend, onUnlock }: { friend: Friend, onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin === friend.pin) {
      playSuccessSound();
      triggerHaptic('success');
      onUnlock();
    } else {
      setError(true);
      setPin('');
      playErrorSound();
      triggerHaptic('error');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-sm z-50"
    >
      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm backdrop-blur-xl bg-[#151518]/90 p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          {friend.pinPhoto ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 relative shadow-2xl">
              <img src={friend.pinPhoto} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#1c1c20] rounded-full flex items-center justify-center border border-white/10 shadow-lg">
              <Lock className="text-white" size={32} />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Enter PIN</h2>
        <p className="text-white/70 text-center text-sm mb-8 font-medium">This experience is protected.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input 
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={e => {
                setPin(e.target.value.replace(/\D/g, ''));
                if (e.target.value.length > pin.length) {
                  triggerHaptic('tap');
                }
              }}
              autoFocus
              className="w-full text-center text-4xl bg-transparent border-b-2 border-white/30 focus:border-white focus:outline-none py-2 tracking-widest text-white placeholder-white/30 transition-colors"
              placeholder="••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={pin.length < 4}
            className="w-full bg-white text-black py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Unlock
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
