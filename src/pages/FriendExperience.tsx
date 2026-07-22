import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Friend } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { getTheme } from '../themes';
import { playTransitionSound } from '../sounds';
import { ArrowLeft } from 'lucide-react';

// Scenes
import Scene0PinGate from '../components/Scene0PinGate';
import Scene1HeroReveal from '../components/Scene1HeroReveal';
import Scene2IntroLine from '../components/Scene2IntroLine';
import Scene3CustomContent from '../components/Scene3CustomContent';
import Scene4InteractiveCandle from '../components/Scene4InteractiveCandle';
import SceneLetter from '../components/SceneLetter';
import Scene5PhotoCollage from '../components/Scene5PhotoCollage';
import SceneVideo from '../components/SceneVideo';
import Scene6Closing from '../components/Scene6Closing';
import Scene7Goodbye from '../components/Scene7Goodbye';

export default function FriendExperience({ previewFriend }: { previewFriend?: Friend }) {
  const { id } = useParams<{ id: string }>();
  const [friend, setFriend] = useState<Friend | null>(previewFriend || null);
  const [loading, setLoading] = useState(!previewFriend);
  const [error, setError] = useState('');
  
  const [scene, setScene] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // If we're in preview mode and the prop changes, update the local state
    if (previewFriend) {
      setFriend(previewFriend);
      setLoading(false);
      return;
    }

    const fetchFriend = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'friends', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFriend(docSnap.data() as Friend);
        } else {
          setError('Friend not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchFriend();
  }, [id, previewFriend]);

  useEffect(() => {
    if (friend?.bgmUrl) {
      if (!audioRef.current) {
        const audio = new Audio(friend.bgmUrl);
        audio.loop = true;
        audioRef.current = audio;
      } else if (audioRef.current.src !== friend.bgmUrl) {
        audioRef.current.src = friend.bgmUrl;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
      }
    }
  }, [friend?.bgmUrl, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !friend) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">{error}</div>;
  }

  const nextScene = () => {
    if (scene > 0) playTransitionSound();
    setScene(s => s + 1);
  };

  const handleUnlock = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
    nextScene();
    if (previewFriend) return;
    try {
      await updateDoc(doc(db, 'friends', friend.id), {
        visits: increment(1)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCandleBlown = async () => {
    nextScene();
    if (previewFriend) return;
    try {
      await updateDoc(doc(db, 'friends', friend.id), {
        candleBlown: increment(1)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const themeConfig = getTheme(friend.theme);

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} overflow-hidden relative font-sans transition-colors duration-1000`}>
      {!previewFriend && (
        <Link to="/" className="absolute top-6 left-6 z-[100] p-3 rounded-full bg-black/20 backdrop-blur border border-white/10 hover:bg-black/40 transition-colors text-white/70 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
      )}
      <AnimatePresence mode="wait">
        {/* @ts-ignore */}
        {scene === 0 && <Scene0PinGate key="scene0" friend={friend} onUnlock={handleUnlock} />}
        {/* @ts-ignore */}
        {scene === 1 && <Scene1HeroReveal key="scene1" friend={friend} onComplete={nextScene} />}
        {/* @ts-ignore */}
        {scene === 2 && <Scene2IntroLine key="scene2" friend={friend} onComplete={nextScene} />}
        {/* @ts-ignore */}
        {scene === 3 && <Scene3CustomContent key="scene3" friend={friend} onNext={nextScene} />}
        {/* @ts-ignore */}
        {scene === 4 && <SceneLetter key="scene4" friend={friend} onNext={nextScene} />}
        {/* @ts-ignore */}
        {scene === 5 && <Scene4InteractiveCandle key="scene5" friend={friend} onComplete={handleCandleBlown} />}
        {/* @ts-ignore */}
        {scene === 6 && <Scene5PhotoCollage key="scene6" friend={friend} onNext={nextScene} />}
        {/* @ts-ignore */}
        {scene === 7 && <SceneVideo key="sceneVideo" friend={friend} onNext={nextScene} />}
        {/* @ts-ignore */}
        {scene === 8 && <Scene6Closing key="scene7" friend={friend} onComplete={nextScene} />}
        {/* @ts-ignore */}
        {scene === 9 && <Scene7Goodbye key="scene8" friend={friend} />}
      </AnimatePresence>
    </div>
  );
}
