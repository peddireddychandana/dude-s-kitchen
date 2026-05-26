import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const imgUrl = (path) => {
  if (!path) return null;
  const url = path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/q_auto,f_auto/');
  }
  return url;
};

export default function FoodDetailModal({ food, gradient, emoji, onClose }) {
  const imgSrc = imgUrl(food.image);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        key={food._id}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 260 }}
        className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {food.veg !== undefined && (
          <div className="absolute top-4 left-4 z-20">
            {food.veg ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-emerald-400/50" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Veg</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-red-500 ring-1 ring-red-400/50" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Non-Veg</span>
              </div>
            )}
          </div>
        )}

        <div className="relative h-64 md:h-72 bg-zinc-800 overflow-hidden">
          {imgSrc ? (
            <>
              <img
                src={imgSrc}
                alt={food.name}
                className="w-full h-full object-cover"
                
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
              <span className="text-7xl">{emoji || '🍽️'}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {food.name}
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {food.description && (
            <p className="text-sm text-zinc-400 leading-relaxed">
              {food.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Price</span>
            <span className="text-2xl font-extrabold text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              ₹{food.price}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
