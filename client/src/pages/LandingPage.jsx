import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { LOGO_URL } from '../utils/api';

const floatingFoods = [
  { emoji: '🍔', className: 'top-[10%] left-[8%] text-6xl md:text-7xl opacity-20 rotate-12' },
  { emoji: '🍕', className: 'top-[5%] right-[12%] text-5xl md:text-6xl opacity-25 -rotate-6' },
  { emoji: '🍟', className: 'bottom-[15%] left-[5%] text-5xl md:text-6xl opacity-20 rotate-[30deg]' },
  { emoji: '🍗', className: 'bottom-[20%] right-[8%] text-5xl md:text-6xl opacity-15 -rotate-[20deg]' },
  { emoji: '🌮', className: 'top-[40%] left-[2%] text-4xl md:text-5xl opacity-20 rotate-45' },
  { emoji: '🥩', className: 'top-[35%] right-[3%] text-4xl md:text-5xl opacity-15 -rotate-[15deg]' },
  { emoji: '🍝', className: 'bottom-[35%] left-[15%] text-4xl opacity-20 rotate-[10deg]' },
  { emoji: '🥗', className: 'top-[60%] right-[15%] text-3xl md:text-4xl opacity-20 rotate-[-8deg]' },
];

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${3 + Math.random() * 4}s`,
}));

const glowSpots = [
  { className: 'top-1/4 left-1/4 w-96 h-96 opacity-20' },
  { className: 'bottom-1/3 right-1/4 w-80 h-80 opacity-15' },
];

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.5 } },
};

const contentVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function FloatingFood({ food, i }) {
  return (
    <div
      className={`absolute pointer-events-none ${food.className}`}
      style={{
        willChange: 'transform',
        animation: `float 6s ease-in-out ${i * 0.8}s infinite`,
      }}
    >
      {food.emoji}
    </div>
  );
}

const MemoFloatingFood = React.memo(FloatingFood);

export default function LandingPage({ onEnter }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {glowSpots.map((spot, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-[#FFD700] blur-[120px] pointer-events-none ${spot.className}`}
        />
      ))}

      {floatingFoods.map((food, i) => (
        <MemoFloatingFood key={i} food={food} i={i} />
      ))}

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/30 pointer-events-none w-1 h-1"
          style={{
            left: p.left,
            top: p.top,
            animation: `float ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#0A0A0A] pointer-events-none" />

      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <img
            src={LOGO_URL}
            alt="DUDE'S KITCHEN"
            className="w-28 h-28 object-cover rounded-2xl mx-auto"
            fetchpriority="high"
            decoding="async"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#FFD700]/70 mb-6 font-medium"
        >
          Premium Dining Experience
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-col items-center mb-4"
        >
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none">
            <span className="text-white">DUDE'S</span>
          </h1>
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none mt-1">
            <span className="text-[#FFD700] glow-yellow">KITCHEN</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.25em] uppercase text-zinc-400 font-medium mb-6"
        >
          Think Food, Think Us
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-24 h-[2px] bg-[#FFD700]/60 mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm md:text-base text-zinc-500 font-light max-w-md mb-10"
        >
          Experience flavors that tell a story
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#E6B800] text-black font-bold text-base md:text-lg tracking-wide flex items-center gap-3 animate-pulseGlow hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-shadow duration-300 cursor-pointer"
        >
          Explore Our Menu
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-xs text-zinc-600 tracking-wider animate-swipe flex items-center gap-1"
        >
          Swipe to explore
          <span className="inline-block">→</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
