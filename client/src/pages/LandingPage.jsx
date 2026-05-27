import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { LOGO_URL, prefetchData } from '../utils/api';

const floatingFoods = [
  { emoji: '🍔', className: 'top-[10%] left-[8%] text-6xl md:text-7xl opacity-20 rotate-12', delay: 0 },
  { emoji: '🍕', className: 'top-[5%] right-[12%] text-5xl md:text-6xl opacity-25 -rotate-6', delay: 0.8 },
  { emoji: '🍟', className: 'bottom-[15%] left-[5%] text-5xl md:text-6xl opacity-20 rotate-[30deg]', delay: 1.6 },
  { emoji: '🍗', className: 'bottom-[20%] right-[8%] text-5xl md:text-6xl opacity-15 -rotate-[20deg]', delay: 2.4 },
  { emoji: '🌮', className: 'top-[40%] left-[2%] text-4xl md:text-5xl opacity-20 rotate-45', delay: 3.2 },
  { emoji: '🥩', className: 'top-[35%] right-[3%] text-4xl md:text-5xl opacity-15 -rotate-[15deg]', delay: 4.0 },
  { emoji: '🍝', className: 'bottom-[35%] left-[15%] text-4xl opacity-20 rotate-[10deg]', delay: 4.8 },
  { emoji: '🥗', className: 'top-[60%] right-[15%] text-3xl md:text-4xl opacity-20 rotate-[-8deg]', delay: 5.6 },
];

const glowSpots = [
  { className: 'top-1/4 left-1/4 w-96 h-96 opacity-20' },
  { className: 'bottom-1/3 right-1/4 w-80 h-80 opacity-15' },
];

export default function LandingPage({ onEnter }) {
  const containerRef = useRef(null);

  useEffect(() => {
    prefetchData();
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') onEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {glowSpots.map((spot, i) => (
        <div key={i} className={`absolute rounded-full bg-[#FFD700] blur-[120px] pointer-events-none ${spot.className}`} />
      ))}

      {floatingFoods.map((food, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none ${food.className}`}
          style={{
            willChange: 'transform',
            animation: `float 6s ease-in-out ${food.delay}s infinite`,
          }}
        >
          {food.emoji}
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#0A0A0A] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-5 fade-in-up">
          <img
            src={LOGO_URL}
            alt="DUDE'S KITCHEN"
            className="w-28 h-28 object-cover rounded-2xl mx-auto gpu"
            fetchpriority="high"
            decoding="async"
          />
        </div>

        <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#FFD700]/70 mb-6 font-medium fade-in-up">
          Premium Dining Experience
        </span>

        <div className="flex flex-col items-center mb-4 fade-in-up">
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none">
            <span className="text-white">DUDE'S</span>
          </h1>
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none mt-1">
            <span className="text-[#FFD700] glow-yellow">KITCHEN</span>
          </h1>
        </div>

        <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-zinc-400 font-medium mb-6 fade-in-up">
          Think Food, Think Us
        </p>

        <div className="w-24 h-[2px] bg-[#FFD700]/60 mb-6 fade-in-up" />

        <p className="text-sm md:text-base text-zinc-500 font-light max-w-md mb-10 fade-in-up">
          Experience flavors that tell a story
        </p>

        <button
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#E6B800] text-black font-bold text-base md:text-lg tracking-wide flex items-center gap-3 animate-pulseGlow hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-shadow duration-300 cursor-pointer fade-in-up gpu"
        >
          Explore Our Menu
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-xs text-zinc-600 tracking-wider animate-swipe flex items-center gap-1 fade-in-up">
          Swipe to explore
          <span className="inline-block">→</span>
        </p>
      </div>
    </motion.div>
  );
}
