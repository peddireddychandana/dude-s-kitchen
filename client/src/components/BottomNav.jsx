import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Tag, User, X } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'offers', icon: Tag, label: 'Offers' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    onTabChange(id);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-9 h-9 rounded-full bg-black/90 backdrop-blur-2xl border border-white/10 flex items-center justify-center hover:bg-zinc-900 transition-all shadow-lg"
      >
        <div className="flex flex-col items-center gap-[3px]">
          <span className="block w-4 h-[2px] rounded-full bg-zinc-400" />
          <span className="block w-4 h-[2px] rounded-full bg-zinc-400" />
          <span className="block w-4 h-[2px] rounded-full bg-zinc-400" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            >
              <div className="w-full max-w-lg mx-4 mb-4">
                <div className="bg-zinc-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Navigate</span>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-[#FFD700]/10'
                              : 'hover:bg-zinc-800/50'
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                              isActive ? 'bg-[#FFD700]/10' : ''
                            }`}
                          >
                            <Icon
                              className={`transition-all duration-300 ${
                                isActive
                                  ? 'w-4 h-4 text-[#FFD700]'
                                  : 'w-4 h-4 text-zinc-400'
                              }`}
                            />
                          </div>
                          <span
                            className={`text-[9px] font-medium transition-all duration-300 ${
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
