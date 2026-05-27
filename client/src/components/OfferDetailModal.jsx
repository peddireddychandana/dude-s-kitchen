import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Gift, Clock, Percent } from 'lucide-react';
import OptimizedImage, { imgUrl } from './OptimizedImage';

const offerIcons = {
  default: <Sparkles className="w-6 h-6 text-[#FFD700]" />,
  combo: <Gift className="w-6 h-6 text-[#FFD700]" />,
  limited: <Clock className="w-6 h-6 text-[#FFD700]" />,
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300, mass: 0.8 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

export default function OfferDetailModal({ offer, onClose }) {
  const imgSrc = offer.banner ? imgUrl(offer.banner) : null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        key={offer._id}
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="relative h-64 md:h-72 bg-zinc-800 overflow-hidden">
          {imgSrc ? (
            <>
              <OptimizedImage
                src={offer.banner}
                alt={offer.title}
                className="w-full h-full"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Percent className="w-20 h-20 text-zinc-700" />
            </div>
          )}
          {offer.discount && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">{offer.discount}% OFF</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {offer.title}
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {offer.description && (
            <p className="text-sm text-zinc-400 leading-relaxed">
              {offer.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {offerIcons[offer.type] || offerIcons.default}
              </div>
              {offer.code && (
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Use code</span>
                  <p className="text-sm font-mono font-bold text-[#FFD700]">{offer.code}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {offer.price > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Price</span>
                  <p className="text-sm font-bold text-[#FFD700]">₹{offer.price}</p>
                </div>
              )}
              {offer.expiryDate && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Expires</span>
                  <p className="text-xs text-zinc-400">
                    {new Date(offer.expiryDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
