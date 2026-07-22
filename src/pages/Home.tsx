import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Friend } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Gift, ChevronRight, Clock } from 'lucide-react';

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#0c0c0e] text-white font-sans overflow-x-hidden pt-24">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="px-4 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-[#db0000] font-black text-2xl md:text-3xl tracking-tighter cursor-pointer" style={{ fontFamily: 'Outfit, sans-serif' }}>
              BIRTHDAYS
            </h1>
            <div className="hidden md:flex gap-4 text-sm font-medium text-gray-400">
              <span className="text-white cursor-pointer font-bold">Home</span>
              <span className="cursor-pointer hover:text-white transition-colors">Birthdays</span>
              <span className="cursor-pointer hover:text-white transition-colors">Upcoming</span>
            </div>
          </div>
          <Link to="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Admin
          </Link>
        </div>
      </nav>

      {/* Content Rows */}
      <div className="relative z-20 pb-20">
        {todayBirthdays.length > 0 && (
          <BirthdayRow title="Happening Today" friends={todayBirthdays} />
        )}
        
        {sortedFriends.length > 0 && (
          <BirthdayRow title="Upcoming Birthdays" friends={sortedFriends.filter(f => !todayBirthdays.includes(f))} />
        )}

        {sortedFriends.length > 0 && (
          <BirthdayRow title="All Friends" friends={sortedFriends} isSmall />
        )}
      </div>
    </div>
  );
}

function BirthdayRow({ title, friends, isSmall = false }: { title: string, friends: Friend[], isSmall?: boolean }) {
  if (friends.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="px-4 md:px-12 mb-4 flex items-center justify-between group cursor-pointer">
        <h2 className="text-xl md:text-2xl font-bold text-gray-200 flex items-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {title}
          <span className="text-sm text-gray-400 font-medium ml-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center translate-x-[-10px] group-hover:translate-x-0 duration-300">
            Explore All <ChevronRight size={16} />
          </span>
        </h2>
      </div>
      
      <div className="px-4 md:px-12 flex gap-2 md:gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x">
        {friends.map((friend) => (
          <BirthdayCard key={friend.id} friend={friend} isSmall={isSmall} />
        ))}
      </div>
    </div>
  );
}

function BirthdayCard({ friend, isSmall }: { friend: Friend, isSmall: boolean }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation with a slight damping factor
    setRotateX(((y - centerY) / centerY) * -12);
    setRotateY(((x - centerX) / centerX) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <Link 
      to={`/${friend.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`flex-none snap-start relative group rounded-md overflow-hidden transition-all duration-200 hover:z-30 shadow-lg cursor-pointer bg-[#151518] border border-white/5 ${isSmall ? 'w-48 md:w-64 aspect-video' : 'w-56 md:w-80 aspect-[3/4]'}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${rotateX !== 0 || rotateY !== 0 ? 1.05 : 1})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {friend.profilePhoto ? (
        <img 
          src={friend.profilePhoto} 
          alt={friend.name} 
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
          style={{ transform: "translateZ(0px)" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#1c1c20] text-4xl font-bold text-gray-600">
          {friend.name.charAt(0)}
        </div>
      )}
      
      {/* Always visible overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/50 to-transparent flex flex-col justify-end p-4 transition-all duration-300 pointer-events-none"
        style={{ transform: "translateZ(30px)" }}
      >
        <div>
          <h3 className="text-white font-bold text-xl md:text-2xl truncate drop-shadow-md" style={{ fontFamily: 'Outfit, sans-serif' }}>{friend.name}</h3>
          {friend.birthdate && (
            <p className="text-gray-300 text-sm font-medium mt-1 drop-shadow-md">
              DOB: {new Date(friend.birthdate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
        
        <div className="mt-4">
          {!isBirthdayToday && timeLeft ? (
            <div className="mb-2">
              <div className="flex items-center gap-1 text-gray-300 text-[10px] md:text-xs mb-1 uppercase tracking-wider font-bold">
                <Clock size={12} /> Countdown
              </div>
              <div className="flex gap-1 md:gap-2">
                <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 md:px-2 py-1 flex flex-col items-center flex-1 border border-white/5">
                  <span className="text-white font-bold text-sm md:text-base font-mono">{timeLeft.d}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-400">Days</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 md:px-2 py-1 flex flex-col items-center flex-1 border border-white/5">
                  <span className="text-white font-bold text-sm md:text-base font-mono">{timeLeft.h}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-400">Hrs</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 md:px-2 py-1 flex flex-col items-center flex-1 border border-white/5">
                  <span className="text-white font-bold text-sm md:text-base font-mono">{timeLeft.m}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-400">Min</span>
                </div>
                {!isSmall && (
                  <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 md:px-2 py-1 flex flex-col items-center flex-1 border border-white/5">
                    <span className="text-white font-bold text-sm md:text-base font-mono">{timeLeft.s}</span>
                    <span className="text-[8px] md:text-[10px] text-gray-400">Sec</span>
                  </div>
                )}
              </div>
            </div>
          ) : isBirthdayToday ? (
            <div className="mb-2 text-[#db0000] font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 bg-[#db0000]/10 p-2 rounded border border-[#db0000]/20 backdrop-blur-sm">
              <Gift size={16} /> Today is the day!
            </div>
          ) : null}

          {/* Hover state for play button */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
            <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0 shadow-lg shadow-white/10">
              <Play fill="currentColor" size={14} />
            </button>
            <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#db0000]"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Always visible label for today's birthday at the top */}
      {isBirthdayToday && (
        <div className="absolute top-2 right-2 bg-[#db0000] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider z-10 border border-white/10">
          Today!
        </div>
      )}
    </Link>
  );
}
