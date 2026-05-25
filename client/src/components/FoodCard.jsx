import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export default function FoodCard({ food, gradient, emoji, onView }) {

  const truncatedDesc = food.description
    ? food.description.length > 60
      ? `${food.description.slice(0, 60)}...`
      : food.description
    : '';

  const imgUrl = food.image
    ? food.image.startsWith('http')
      ? food.image
      : `https://dude-s-kitchen-server.onrender.com${food.image}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-[#FFD700]/20 transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-center p-2.5 gap-2.5">
        {imgUrl ? (
          <div className="relative w-[72px] h-[72px] md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10">
            {food.category === "DUDE'S KITCHEN SPECIAL" && (
              <div className="absolute top-0 left-0 right-0 z-10">
                <span className="block w-full text-center py-0.5 text-[7px] font-bold text-black bg-[#FFD700] uppercase tracking-wider shadow-sm">
                  SPECIAL
                </span>
              </div>
            )}
            <img src={imgUrl} alt={food.name} className="w-full h-full object-cover" />
            {food.veg !== undefined && (
              <div className="absolute top-1 left-1">
                {food.veg ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-1 ring-emerald-400/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 ring-1 ring-red-400/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`relative w-[72px] h-[72px] md:w-24 md:h-24 rounded-xl bg-gradient-to-br ${gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center flex-shrink-0 shadow-inner`}
          >
            <span className="text-2xl md:text-4xl">{emoji || '🍽️'}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-xs md:text-sm font-bold text-white leading-tight">
            {food.name}
          </h3>

          {truncatedDesc && (
            <p className="text-[10px] md:text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-1">
              {truncatedDesc}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs md:text-sm font-extrabold text-[#FFD700]">
              ₹{food.price}
            </span>
            <span className="text-[9px] text-zinc-600">•</span>
            {food.veg !== undefined && (
              <span className={`text-[9px] font-semibold ${food.veg ? 'text-emerald-400' : 'text-red-400'}`}>
                {food.veg ? 'Veg' : 'Non-Veg'}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onView?.(food)}
          className="absolute right-1.5 bottom-1.5 md:right-2.5 md:bottom-2.5 transition-all duration-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[8px] md:text-[10px] font-bold text-[#FFD700] hover:bg-[#FFD700]/20 flex items-center gap-0.5 md:gap-1"
        >
          <Eye className="w-2 h-2 md:w-2.5 md:h-2.5" />
          View
        </button>
      </div>
    </motion.div>
  );
}
