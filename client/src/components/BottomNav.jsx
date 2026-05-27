import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Tag, User, X } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'offers', icon: Tag, label: 'Offers' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300, mass: 0.8 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.15 } },
};

function NavItem({ item, activeTab, onSelect }) {
  const Icon = item.icon;
  const isActive = activeTab === item.id;

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-[#FFD700]/10 text-[#FFD700]'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
      }`}
    >
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
        isActive ? 'bg-[#FFD700]/10' : ''
      }`}>
        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFD700]' : 'text-zinc-400'}`} />
      </div>
      <span className="text-sm font-medium">{item.label}</span>
    </button>
  );
}

const MemoNavItem = React.memo(NavItem);

export default function BottomNav({ activeTab, onTabChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback((id) => {
    onTabChange(id);
    setOpen(false);
  }, [onTabChange]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-9 h-9 rounded-full bg-black/90 backdrop-blur-2xl border border-white/10 flex items-center justify-center hover:bg-zinc-900 transition-all shadow-lg"
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
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50"
            >
              <div className="h-full w-56 bg-zinc-900/95 backdrop-blur-2xl border-l border-white/10 shadow-[-4px_0_20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                <div className="flex justify-end px-3 pt-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-1 p-3">
                  {navItems.map((item) => (
                    <MemoNavItem
                      key={item.id}
                      item={item}
                      activeTab={activeTab}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
