import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ExternalLink, MessageSquare, ThumbsUp } from 'lucide-react';

const reviews = [
  { name: 'Priya S.', text: 'Best biryani in town! The ambience is amazing and the staff is very friendly.', rating: 5 },
  { name: 'Rahul K.', text: 'Love their burgers. The chicken crispy burger is a must try.', rating: 5 },
  { name: 'Ananya R.', text: 'Great place for family dinners. Highly recommended!', rating: 4 },
  { name: 'Vikram P.', text: 'The specials menu is outstanding. Quality and taste are top notch.', rating: 5 },
  { name: 'Sneha M.', text: 'Affordable prices with premium quality food. My go to spot.', rating: 4 },
  { name: 'Arjun D.', text: 'Their milkshakes are divine. Food delivery is always on time.', rating: 5 },
];

const googleReviewUrl = 'https://www.google.com/search?sca_esv=853093b83e557101&sxsrf=ANbL-n7g0BTHnv-lV4JmfHaf8uRMl542cA:1779725618732&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQNyKULduFnOuoYf7Vn-FzbDKicCsovO-CUY_OG-OnOR8Ppq6zZ7Qx92K9jpXQV2AW_B6Ti5DyvDkPJ9LSNEOJIdl1eo&q=DUDE%27S+KITCHEN+Reviews&sa=X&ved=2ahUKEwiTkbXK6tSUAxWNxjgGHSiCKu4Q0bkNegQIOxAF&biw=1536&bih=694&dpr=1.25#lrd=0x3bb3874e280761b5:0x55b436dd349de9ec,3,,,,';

export default function ReviewsPage({ onBack, logoUrl }) {
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
            Customer <span className="text-[#FFD700]">Reviews</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-zinc-400 mt-2 max-w-md"
          >
            What our customers say about us
          </motion.p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-white">4.9</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />)}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1">Google Rating</span>
            </div>
            <div className="flex-1 h-16 border-l border-white/10" />
            <div className="flex flex-col gap-2">
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#E6B800] text-black text-xs font-bold shadow-lg shadow-[#FFD700]/20 hover:shadow-[#FFD700]/40 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Write a Review
              </a>
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 hover:bg-white/20 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Read All Reviews
              </a>
            </div>
          </div>
        </motion.div>

        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/3 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{review.name}</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-zinc-600'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-3 mt-3">
                <ThumbsUp className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-600">Found helpful</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
