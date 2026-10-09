import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Loader2, Utensils, Leaf, Flame, Lightbulb, Wine } from 'lucide-react';

const SPICE_CONFIG = {
  Mild: { color: 'bg-green-500', width: 'w-1/4', text: 'text-green-400' },
  Medium: { color: 'bg-yellow-500', width: 'w-2/4', text: 'text-yellow-400' },
  Hot: { color: 'bg-orange-500', width: 'w-3/4', text: 'text-orange-400' },
  'Very Hot': { color: 'bg-red-500', width: 'w-full', text: 'text-red-400' },
};

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  typical: 'Typical',
  needs_confirmation: 'Needs confirmation',
};

function SpiceBar({ label, isEstimate }) {
  const cfg = SPICE_CONFIG[label] || SPICE_CONFIG.Mild;
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
        <span>
          Spice Level: <span className={`font-semibold ${cfg.text}`}>{label || 'Mild'}</span>
          {isEstimate && <span className="text-zinc-500 ml-1">(estimate)</span>}
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${cfg.color} ${cfg.width} rounded-full transition-all duration-500`} />
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function AIAnalysisModal({ open, onClose, analysis, loading, error, onRetry }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const spice = analysis?.spiceLevel || {};
  const allergens = analysis?.allergens || {};

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="AI dish analysis"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          className="absolute bottom-0 left-0 right-0 max-h-[88vh] bg-zinc-950 border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">AI Dish Analysis</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-5">
                  <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
                <p className="text-white font-semibold">AI is exploring this dish...</p>
                <p className="text-sm text-zinc-500 mt-1">Analyzing ingredients, taste & more</p>
                <div className="mt-6 w-full max-w-xs space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 skeleton-pulse rounded" style={{ width: `${100 - i * 15}%` }} />
                  ))}
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertTriangle className="w-9 h-9 text-red-400 mb-4" />
                <p className="text-white font-medium mb-4 max-w-xs">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {analysis && !loading && !error && (
              <div className="space-y-5">
                {analysis.overview && (
                  <Section icon={<Utensils className="w-4 h-4 text-[#FFD700]" />} title="Overview">
                    <p className="text-sm text-zinc-300 leading-relaxed">{analysis.overview}</p>
                  </Section>
                )}

                {analysis.ingredients?.length > 0 && (
                  <Section icon={<Leaf className="w-4 h-4 text-emerald-400" />} title="Main Ingredients">
                    <div className="flex flex-wrap gap-2">
                      {analysis.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-full text-xs border ${
                            ing.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-300 border-white/5'
                          }`}
                        >
                          {ing.name}
                          <span className="text-zinc-500 ml-1">
                            ({STATUS_LABELS[ing.status] || 'Typical'})
                          </span>
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {analysis.tasteProfile?.length > 0 && (
                  <Section icon={<Flame className="w-4 h-4 text-orange-400" />} title="Taste Profile">
                    <div className="flex flex-wrap gap-2">
                      {analysis.tasteProfile.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {analysis.texture && (
                  <Section icon={<Sparkles className="w-4 h-4 text-pink-400" />} title="Texture">
                    <p className="text-sm text-zinc-300">{analysis.texture}</p>
                  </Section>
                )}

                {analysis.spiceLevel && <SpiceBar label={spice.label} isEstimate={spice.isEstimate} />}

                {analysis.dietaryType && (
                  <Section icon={<Leaf className="w-4 h-4 text-emerald-400" />} title="Dietary Information">
                    <p className="text-sm text-zinc-300">
                      {analysis.dietaryType}
                      {analysis.dietaryConfidence !== 'confirmed' && (
                        <span className="text-zinc-500"> • Please confirm with the restaurant.</span>
                      )}
                    </p>
                  </Section>
                )}

                <Section icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} title="Allergens">
                  <p className="text-xs text-amber-300 mb-2 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {allergens.warning || 'Confirm all ingredients and cross-contamination risks with the restaurant.'}
                  </p>
                  {allergens.potential?.length > 0 && (
                    <p className="text-sm text-zinc-300">
                      <span className="text-zinc-500">Potential: </span>
                      {allergens.potential.join(', ')}
                    </p>
                  )}
                  {allergens.confirmed?.length > 0 && (
                    <p className="text-sm text-zinc-300 mt-1">
                      <span className="text-zinc-500">Confirmed: </span>
                      {allergens.confirmed.join(', ')}
                    </p>
                  )}
                  {!allergens.potential?.length && !allergens.confirmed?.length && (
                    <p className="text-sm text-zinc-500">No specific allergens identified.</p>
                  )}
                </Section>

                {analysis.bestFor?.length > 0 && (
                  <Section icon={<Lightbulb className="w-4 h-4 text-yellow-400" />} title="Best For">
                    <p className="text-sm text-zinc-300">{analysis.bestFor.join(', ')}</p>
                  </Section>
                )}

                {analysis.servingSuggestions?.length > 0 && (
                  <Section icon={<Wine className="w-4 h-4 text-rose-400" />} title="Serving Suggestions">
                    <p className="text-sm text-zinc-300">{analysis.servingSuggestions.join(', ')}</p>
                  </Section>
                )}

                {analysis.recommendation && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl p-3.5">
                    <h3 className="text-white font-semibold mb-1 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI Recommendation
                    </h3>
                    <p className="text-sm text-zinc-200 leading-relaxed">{analysis.recommendation}</p>
                  </div>
                )}

                <p className="text-[11px] text-zinc-600 text-center pt-1">
                  AI-generated guidance for reference only. Always confirm ingredients and allergens with restaurant staff.
                  {analysis.provider && ` · Powered by ${analysis.provider}${analysis.model ? ' (' + analysis.model + ')' : ''}`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
