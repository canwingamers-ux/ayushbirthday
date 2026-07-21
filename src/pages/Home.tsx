import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Friend } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'friends'), (snapshot) => {
      setFriends(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Friend)));
    });
    return unsubscribe;
  }, []);

  // Sort friends by next birthday
  const sortedFriends = [...friends].sort((a, b) => {
    const getNext = (dateStr?: string) => {
      if (!dateStr) return Infinity;
      const now = new Date();
      const [year, month, day] = dateStr.split('-');
      let nextBirthday = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
      const isToday = now.getMonth() === parseInt(month) - 1 && now.getDate() === parseInt(day);
      if (isToday) return 0;
      if (now.getTime() > nextBirthday.getTime() + 86400000) {
        nextBirthday = new Date(now.getFullYear() + 1, parseInt(month) - 1, parseInt(day));
      }
      return nextBirthday.getTime() - now.getTime();
    };
    return getNext(a.birthdate) - getNext(b.birthdate);
  });

  const todayBirthdays = friends.filter(f => {
    if (!f.birthdate) return false;
    const now = new Date();
    const [year, month, day] = f.birthdate.split('-');
    return now.getMonth() === parseInt(month) - 1 && now.getDate() === parseInt(day);
  });

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden font-sans">
      {/* Background decorations - premium metallic/neon look */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[30%] w-[20vw] h-[20vw] bg-pink-500/10 rounded-full blur-[90px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-block relative">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-4xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/20"
            >
              ✨
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-7xl text-white font-extrabold tracking-tighter mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Celebrations
          </h1>
          <p className="mt-4 text-gray-400 font-medium tracking-[0.2em] text-xs uppercase max-w-xl mx-auto leading-relaxed">
            Choose a friend's profile to experience a personalized birthday celebration.
          </p>
        </motion.div>

        {todayBirthdays.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 relative overflow-hidden bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-50" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold tracking-widest uppercase mb-4 border border-pink-500/30">Happening Today</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Happy Birthday, {todayBirthdays.map(f => f.name).join(' & ')}!</h2>
              <p className="text-white/60 font-medium">Click their card below to unlock the celebration.</p>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence>
            {sortedFriends.map(friend => (
              // @ts-ignore
              <BirthdayCard key={friend.id} friend={friend} />
            ))}
          </AnimatePresence>
          {friends.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full text-center text-gray-500 py-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              No birthdays added yet. Ask the admin to create one!
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Hidden entry point for Admin */}
      <Link 
        to="/admin" 
        className="absolute bottom-6 right-6 text-gray-800 hover:text-gray-400 transition-colors cursor-pointer text-xs font-medium uppercase tracking-widest z-20"
      >
        Admin Profile
      </Link>
    </div>
  );
}

function BirthdayCard({ friend }: { friend: Friend }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    if (!friend.birthdate) return;
    const calculateTimeLeft = () => {
      const now = new Date();
      const [year, month, day] = friend.birthdate!.split('-');
      let nextBirthday = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
      
      const isToday = now.getMonth() === parseInt(month) - 1 && now.getDate() === parseInt(day);
      if (isToday) {
        setIsBirthdayToday(true);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setIsBirthdayToday(false);
      if (now.getTime() > nextBirthday.getTime() + 86400000) {
        nextBirthday = new Date(now.getFullYear() + 1, parseInt(month) - 1, parseInt(day));
      }

      const diff = nextBirthday.getTime() - now.getTime();
      
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [friend.birthdate]);

  // Trigger confetti if it is their birthday
  useEffect(() => {
    if (isBirthdayToday) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
    }
  }, [isBirthdayToday]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
      }}
      whileHover={{ scale: 1.03, translateY: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/${friend.id}`} className="block h-full relative group rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
        
        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/10 group-hover:border-white/30 transition-all duration-500 h-full flex flex-col relative z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] overflow-hidden">
          {friend.profilePhoto && (
            <>
              <div className="absolute inset-0 bg-cover bg-center opacity-20 transform group-hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: `url(${friend.profilePhoto})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            </>
          )}
          
          <div className="flex items-center gap-5 mb-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-sm blur-md group-hover:blur-xl transition-all duration-500" />
              {friend.profilePhoto ? (
                <div className="w-16 h-16 rounded-sm p-1.5 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
                  <img src={friend.profilePhoto} alt="" className="w-full h-full object-cover rounded-sm" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm p-1.5 flex items-center justify-center font-bold text-2xl relative z-10 border border-white/20 shadow-lg">
                  {friend.name.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-tight text-white/90 group-hover:text-white transition-colors">{friend.name || 'Unnamed'}</h3>
              {friend.birthdate && (
                <p className="text-white/50 text-sm font-medium mt-1 uppercase tracking-wider">
                  {new Date(friend.birthdate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-auto relative z-10">
            {isBirthdayToday ? (
              <div className="text-pink-400 font-bold text-lg text-center py-5 bg-pink-500/10 backdrop-blur-md rounded-2xl border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                ✨ Today is the day! ✨
              </div>
            ) : timeLeft ? (
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                <TimeBlock value={timeLeft.d} label="Days" />
                <TimeBlock value={timeLeft.h} label="Hrs" />
                <TimeBlock value={timeLeft.m} label="Min" />
                <TimeBlock value={timeLeft.s} label="Sec" />
              </div>
            ) : (
              <div className="text-gray-500 text-sm text-center py-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                Birthdate pending
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TimeBlock({ value, label }: { value: number, label: string }) {
  return (
    <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-col items-center justify-center group-hover:bg-black/80 group-hover:border-white/20 transition-all duration-300 shadow-inner">
      <div className="font-mono text-xl md:text-2xl text-white font-semibold mb-1 tracking-tighter">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
        {label}
      </div>
    </div>
  );
}
