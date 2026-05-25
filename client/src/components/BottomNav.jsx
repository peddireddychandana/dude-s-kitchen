import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Tag, User } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'offers', icon: Tag, label: 'Offers' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-lg mx-4 pointer-events-auto"
      >
        <div className="bg-black/95 backdrop-blur-2xl rounded-t-2xl border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-around px-2 pt-2 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative flex flex-col items-center gap-0.5 py-0.5 px-2 transition-all duration-300"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-[#FFD700]/10' : ''
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'w-4 h-4 text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.5)]'
                          : 'w-4 h-4 text-zinc-500'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[8px] font-medium transition-all duration-300 ${
                      isActive ? 'text-[#FFD700]' : 'text-zinc-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
