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
        className="relative max-w-[200px] mx-auto pointer-events-auto"
      >
        <div className="bg-black/90 backdrop-blur-2xl rounded-full border border-white/5 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-around px-1.5 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative flex flex-col items-center gap-0.5 py-0.5 px-1.5 transition-all duration-300"
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300 ${
                      isActive ? 'bg-[#FFD700]/10' : ''
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'w-3 h-3 text-[#FFD700] drop-shadow-[0_0_4px_rgba(255,215,0,0.5)]'
                          : 'w-3 h-3 text-zinc-500'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[7px] font-medium leading-none transition-all duration-300 ${
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
