import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffers, LOGO_URL } from '../utils/api';
import socket from '../utils/socket';
import OfferDetailModal from '../components/OfferDetailModal';
import OptimizedImage, { imgUrl } from '../components/OptimizedImage';
import { ArrowLeft, Percent, Eye } from 'lucide-react';

const badgeConfig = {
  student: { label: 'Student Deal', icon: '🎓', gradient: 'from-blue-600/20 to-purple-600/20', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/20', day: '' },
  birthday: { label: 'Birthday Special', icon: '🎂', gradient: 'from-rose-600/20 to-amber-600/20', border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/20', day: '' },
  combo: { label: 'Hot Deal', icon: '🔥', gradient: 'from-orange-600/20 to-red-600/20', border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/20', day: '' },
  limited: { label: 'Limited Time', icon: '⏳', gradient: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/20', day: '' },
  monday: { label: 'Monday Offer', icon: '📅', gradient: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/20', day: 'Monday' },
  tuesday: { label: 'Tuesday Offer', icon: '📅', gradient: 'from-rose-600/20 to-pink-600/20', border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/20', day: 'Tuesday' },
  wednesday: { label: 'Wednesday Offer', icon: '📅', gradient: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/20', day: 'Wednesday' },
  thursday: { label: 'Thursday Offer', icon: '📅', gradient: 'from-purple-600/20 to-fuchsia-600/20', border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/20', day: 'Thursday' },
  friday: { label: 'Friday Offer', icon: '📅', gradient: 'from-orange-600/20 to-red-600/20', border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/20', day: 'Friday' },
  saturday: { label: 'Saturday Offer', icon: '📅', gradient: 'from-indigo-600/20 to-violet-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400', bg: 'bg-indigo-500/20', day: 'Saturday' },
  sunday: { label: 'Sunday Special', icon: '☀️', gradient: 'from-amber-600/20 to-yellow-600/20', border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/20', day: 'Sunday' },
  yearly: { label: '365 Day Offer', icon: '🏆', gradient: 'from-[#FFD700]/20 to-red-600/20', border: 'border-[#FFD700]/30', text: 'text-[#FFD700]', bg: 'bg-[#FFD700]/20', day: '365 Days' },
  default: { label: 'Special Offer', icon: '✨', gradient: 'from-[#FFD700]/20 to-amber-600/20', border: 'border-[#FFD700]/30', text: 'text-[#FFD700]', bg: 'bg-[#FFD700]/20', day: '' },
};

const accentColors = [
  { from: 'from-blue-500', to: 'to-purple-600' },
  { from: 'from-rose-500', to: 'to-amber-600' },
  { from: 'from-orange-500', to: 'to-red-600' },
  { from: 'from-emerald-500', to: 'to-teal-600' },
  { from: 'from-violet-500', to: 'to-fuchsia-600' },
];

function OfferCard({ offer, i, onView }) {
  const badge = badgeConfig[offer.type] || badgeConfig.default;
  const accent = accentColors[i % accentColors.length];
  const banner = offer.banner ? imgUrl(offer.banner) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden hover:border-[#FFD700]/30 transition-all duration-300 shadow-lg gpu"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative h-36 overflow-hidden">
        {banner ? (
          <>
            <OptimizedImage
              src={offer.banner}
              alt={offer.title}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              fetchPriority={i < 2 ? 'high' : 'low'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${accent.from} ${accent.to} bg-opacity-20 flex items-center justify-center`}>
            <Percent className="w-12 h-12 text-white/20" />
          </div>
        )}

        {badge.day && (
          <div className="absolute top-2 left-2 z-10">
            <div className="px-2.5 py-1 rounded-lg bg-white shadow-lg shadow-white/30">
              <span className="text-[9px] font-extrabold text-black uppercase tracking-wider">{badge.day}</span>
            </div>
          </div>
        )}

        {offer.discount && (
          <div className="absolute -bottom-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <span className="text-xs font-extrabold text-white">{offer.discount}% OFF</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative p-4 pt-5 space-y-2">
        <h3 className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors duration-200 leading-tight">
          {offer.title}
        </h3>

        {offer.description && (
          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
            {offer.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          {offer.code ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500">Use</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#FFD700] text-[10px] font-mono font-bold">
                {offer.code}
              </span>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => onView(offer)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[10px] font-bold text-[#FFD700] hover:bg-[#FFD700]/20 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </div>

        {offer.expiryDate && (
          <p className="text-[9px] text-zinc-600">
            Expires: {new Date(offer.expiryDate).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        )}
        {offer.price > 0 && (
          <p className="text-[9px] text-[#FFD700] font-bold">
            Price: ₹{offer.price}
          </p>
        )}
      </div>
    </motion.div>
  );
}

const MemoOfferCard = React.memo(OfferCard);

export default function OffersPage({ onBack }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getOffers();
        if (mounted) setOffers(data || []);
      } catch {
        if (mounted) setOffers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    socket.connect();
    const handler = () => getOffers().then((data) => { if (mounted) setOffers(data || []); }).catch(() => {});
    socket.on('offers:update', handler);
    return () => {
      mounted = false;
      socket.off('offers:update', handler);
    };
  }, []);

  const handleView = useCallback((offer) => setSelectedOffer(offer), []);
  const handleClose = useCallback(() => setSelectedOffer(null), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="sticky top-0 z-30 bg-[#0A0A0A] flex items-center gap-2 px-4 pt-3 pb-2 border-b border-white/[0.06]">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </motion.button>
        <div className="flex-1" />
        <img src={LOGO_URL} alt="" className="w-10 h-10 object-cover rounded-xl" fetchpriority="high" />
        <span className="text-base font-extrabold tracking-tight">
          <span className="text-[#FFD700]">DUDE'S</span>
          <span className="text-white"> KITCHEN</span>
        </span>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.08)_0%,_transparent_70%)]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FFD700]/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#FFD700]/5 blur-3xl" />

        <div className="relative z-10 px-6 py-12 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Special Offers at{' '}
              <span className="text-[#FFD700]">DUDE'S</span>
              <br className="md:hidden" />
              <span className="text-white"> KITCHEN</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-400 mt-4 max-w-lg mx-auto font-light">
              Enjoy delicious deals & save more 🍔🥤
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 py-8">
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 border border-white/10">
              <Percent className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white">No Offers Available</h3>
            <p className="text-sm text-zinc-500 mt-1 text-center max-w-xs">
              There are no active offers right now. Check back later for exciting deals!
            </p>
          </div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-5"
            >
              {offers.length} Offer{offers.length !== 1 ? 's' : ''} Available
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {offers.map((offer, i) => (
                <MemoOfferCard key={offer._id} offer={offer} i={i} onView={handleView} />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedOffer && (
          <OfferDetailModal offer={selectedOffer} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
