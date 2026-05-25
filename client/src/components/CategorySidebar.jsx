import React from 'react';
import { motion } from 'framer-motion';

export default function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
  categoryNames,
  emojis,
}) {
  return (
    <div className="relative flex-shrink-0 w-[90px] min-h-screen">
      <div className="fixed left-0 top-0 w-[90px] h-full bg-[#FFD700] rounded-r-3xl overflow-hidden z-10 shadow-[4px_0_20px_rgba(0,0,0,0.15)]">
        <div className="h-full overflow-y-auto no-scrollbar py-4">
          <div className="flex flex-col items-center gap-1 px-2">
            {categories.map((cat, index) => {
              const isActive = activeCategory === cat.name;
              const displayName = categoryNames?.[cat.name] || cat.name;
              const emoji = emojis?.[cat.name] || '🍽️';

              return (
                <motion.button
                  key={cat._id || cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryChange(cat.name)}
                  className={`w-full py-3 px-2 rounded-2xl text-center transition-all duration-300 ${
                    isActive
                      ? 'bg-white shadow-lg scale-105'
                      : 'bg-transparent hover:bg-white/20'
                  }`}
                >
                  <span className="text-xl block mb-0.5">{emoji}</span>
                  <span
                    className={`text-[11px] font-bold leading-tight block whitespace-pre-line ${
                      isActive ? 'text-zinc-900' : 'text-zinc-700'
                    }`}
                  >
                    {displayName}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
