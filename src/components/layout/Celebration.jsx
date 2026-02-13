// src/components/layout/Celebration.jsx
import React, { useEffect, useState } from 'react';

const Celebration = ({ active }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible) return null;

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden'
  };

  const emojiStyle = (delay, startX, endX, duration) => ({
    position: 'absolute',
    fontSize: '2rem',
    animation: `celebration-fall ${duration}s linear ${delay}s forwards`,
    left: `${startX}%`,
    top: '-10%',
    opacity: 0
  });

  const emojis = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎆'];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    delay: Math.random() * 0.5,
    startX: Math.random() * 100,
    endX: Math.random() * 100,
    duration: 2 + Math.random()
  }));

  return (
    <>
      <style>
        {`
          @keyframes celebration-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        {particles.map((particle, i) => (
          <div
            key={i}
            style={emojiStyle(particle.delay, particle.startX, particle.endX, particle.duration)}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
    </>
  );
};

export default Celebration;