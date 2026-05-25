import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UtensilsCrossed, Star, Heart, Award, Quote } from 'lucide-react';

const stats = [
  { icon: <UtensilsCrossed className="w-5 h-5 text-[#FFD700]" />, value: '50+', label: 'Dishes' },
  { icon: <Star className="w-5 h-5 text-[#FFD700]" />, value: '4.9', label: 'Rating' },
  { icon: <Heart className="w-5 h-5 text-[#FFD700]" />, value: '10K+', label: 'Happy Customers' },
  { icon: <Award className="w-5 h-5 text-[#FFD700]" />, value: '2024', label: 'Best Restaurant' },
];

const milestones = [
  { year: '2019', title: 'The Beginning', desc: 'DUDE\'S KITCHEN opened its doors with a vision to redefine fast food.' },
  { year: '2021', title: 'Expansion', desc: 'Opened 3 new locations across the city with an expanded menu.' },
  { year: '2023', title: 'Digital Leap', desc: 'Launched our premium online ordering platform with contactless delivery.' },
  { year: '2024', title: 'Award Winning', desc: 'Named "Best Premium Fast Food Chain" by Food Critics Association.' },
];

export default function AboutPage({ onBack, logoUrl }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="relative h-56 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="absolute top-6 left-4 z-20 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </motion.button>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.1)_0%,_transparent_70%)]" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FFD700]/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FFD700]/5 blur-3xl" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-display font-bold text-white"
          >
            Our <span className="text-[#FFD700]">Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-zinc-400 mt-2 max-w-md"
          >
            Crafting flavors that bring people together since 2019
          </motion.p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <Quote className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
              <p className="text-sm text-zinc-400 leading-relaxed italic">
              At DUDE'S KITCHEN, we believe every meal should be an experience. 
              From our signature fried chicken to our handcrafted burgers, 
              every dish is made with passion, premium ingredients, and a dash of love.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt="" className="w-14 h-14 rounded-full object-cover bg-zinc-900" />
            ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#E6B800] flex items-center justify-center text-black font-bold text-sm">
              DK
            </div>
            )}
            <div>
              <p className="text-sm font-bold text-white">DUDE'S KITCHEN</p>
              <p className="text-xs text-zinc-500">Founder & Chef</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06] flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <span className="text-xl font-display font-bold text-white">{stat.value}</span>
              <span className="text-xs text-zinc-500 mt-0.5">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-3">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#FFD700]/30" />
            <div className="flex flex-col gap-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-[12px] top-1.5 w-4 h-4 rounded-full bg-[#FFD700] border-2 border-zinc-900 shadow-sm" />
                  <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06]">
                    <span className="text-[10px] font-bold text-[#FFD700] tracking-wider">{m.year}</span>
                    <h3 className="text-sm font-bold text-white mt-1">{m.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 text-center mb-6"
        >
          <UtensilsCrossed className="w-8 h-8 text-[#FFD700] mx-auto mb-3" />
          <h3 className="text-lg font-display font-bold text-white mb-2">Visit Us Today</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Experience the taste that everyone's talking about. 
            Good food, great vibes, and memories that last.
          </p>
          <button className="mt-4 px-6 py-2.5 bg-[#FFD700] text-black text-sm font-bold rounded-xl hover:bg-[#E6B800] transition-colors">
            Find Our Location
          </button>
        </motion.div>
      </div>
    </div>
  );
}
