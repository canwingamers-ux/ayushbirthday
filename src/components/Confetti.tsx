import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CONFETTI_COLORS = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7', '#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7', '#f72585'];

interface ConfettiProps {
  count?: number;
  duration?: number;
}

export default function Confetti({ count = 100, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 10 + 5;
      const xStart = Math.random() * 100; // vw
      const xEnd = xStart + (Math.random() * 20 - 10);
      const yStart = -10; // vh
      const yEnd = 110; // vh
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + Math.random() * 720;
      const delay = Math.random() * (duration / 1000);
      const moveDuration = Math.random() * 2 + 2;

      return {
        id: i,
        size,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        xStart,
        xEnd,
        yStart,
        yEnd,
        rotationStart,
        rotationEnd,
        delay,
        moveDuration,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      };
    });

    setPieces(newPieces);
  }, [count, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.xStart}vw`,
            y: `${p.yStart}vh`,
            rotate: p.rotationStart,
            opacity: 1,
          }}
          animate={{
            x: `${p.xEnd}vw`,
            y: `${p.yEnd}vh`,
            rotate: p.rotationEnd,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.moveDuration,
            delay: p.delay,
            ease: "easeOut",
            times: [0, 0.8, 1],
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
}
