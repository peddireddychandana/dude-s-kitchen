import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Instagram,
  MessageCircle,
  ExternalLink,
  Navigation,
  ChefHat,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const GlowCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

const FloatingIcon = ({ Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay, type: 'spring' }}
    className="absolute w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
  >
    <Icon className="w-5 h-5 text-[#FFD700]" />
  </motion.div>
);

const ContactButton = ({ icon: Icon, label, href, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
        isPrimary
          ? 'bg-gradient-to-r from-[#FFD700] to-[#E6B800] text-black shadow-lg shadow-[#FFD700]/20 hover:shadow-[#FFD700]/40'
          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.a>
  );
};

const InfoRow = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-start gap-3 group"
  >
    <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#FFD700]/20 transition-colors">
      <Icon className="w-4 h-4 text-[#FFD700]" />
    </div>
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white/90 leading-relaxed">{value}</p>
    </div>
  </motion.div>
);

const imgUrl = (path) =>
  path ? (path.startsWith('http') ? path : `https://dude-s-kitchen-server.onrender.com${path}`) : null;

const readAllReviewsUrl = 'https://www.google.com/search?sca_esv=853093b83e557101&sxsrf=ANbL-n7g0BTHnv-lV4JmfHaf8uRMl542cA:1779725618732&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQNyKULduFnOuoYf7Vn-FzbDKicCsovO-CUY_OG-OnOR8Ppq6zZ7Qx92K9jpXQV2AW_B6Ti5DyvDkPJ9LSNEOJIdl1eo&q=DUDE%27S+KITCHEN+Reviews&sa=X&ved=2ahUKEwiTkbXK6tSUAxWNxjgGHSiCKu4Q0bkNegQIOxAF&biw=1536&bih=694&dpr=1.25#lrd=0x3bb3874e280761b5:0x55b436dd349de9ec,3,,,,';

export default function ProfilePage({ onBack, logoUrl }) {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] pb-28 overflow-hidden">
      <Particles />

      <FloatingIcon Icon={ChefHat} />
      <div className="absolute top-20 right-6">
        <FloatingIcon Icon={Sparkles} delay={0.2} />
      </div>

      <div className="relative z-10 px-4 pt-12 pb-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-4"
          >
            {logoUrl ? (
              <img
                src={imgUrl(logoUrl)}
                alt="DUDE'S KITCHEN"
                className="w-full h-full object-cover rounded-full shadow-xl shadow-[#FFD700]/20"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] to-[#E6B800] shadow-xl shadow-[#FFD700]/20 flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-black" />
              </div>
            )}
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            DUDE'S KITCHEN
          </h1>
          <p className="text-sm text-zinc-400 mt-1 italic font-light">
            "Think Food, Think Us"
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
            <span className="text-sm font-bold text-white">5.0</span>
            <span className="text-xs text-zinc-500">• Google Reviews</span>
          </div>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400">
            Food Court
          </span>
        </motion.div>

        <div className="space-y-4 max-w-lg mx-auto">
          <GlowCard delay={0.2}>
            <div className="p-5 space-y-5">
              <InfoRow
                icon={MapPin}
                label="Address"
                value="21/633, Rajaji Rd, Rameswaram Pet, Proddatur, Andhra Pradesh 516360"
                delay={0.25}
              />

              <hr className="border-white/5" />

              <InfoRow
                icon={Phone}
                label="Phone"
                value="063046 17455"
                delay={0.3}
              />

              <hr className="border-white/5" />

              <InfoRow
                icon={Clock}
                label="Opening Hours"
                value="Open Daily: 12:00 PM – 10:30 PM"
                delay={0.35}
              />
            </div>
          </GlowCard>

          <GlowCard delay={0.3}>
            <div className="p-5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <ContactButton
                  icon={Phone}
                  label="Call Now"
                  href="tel:06304617455"
                />
                <ContactButton
                  icon={MessageCircle}
                  label="Chat on WhatsApp"
                  href="https://wa.me/916304617455"
                  variant="secondary"
                />
                <ContactButton
                  icon={ExternalLink}
                  label="Order on Zomato"
                  href="https://www.zomato.com/proddatur/dudes-kitchen-proddatur-locality/order"
                  variant="secondary"
                />
                <ContactButton
                  icon={Instagram}
                  label="Follow on Instagram"
                  href="https://instagram.com/dudes_kitchen_2025"
                  variant="secondary"
                />
                <ContactButton
                  icon={Star}
                  label="Google Reviews"
                  href={readAllReviewsUrl}
                  variant="secondary"
                />
              </div>
            </div>
          </GlowCard>

          <GlowCard delay={0.4}>
            <div className="p-5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">
                Social Media
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Instagram</p>
                    <p className="text-xs text-zinc-500">@dudes_kitchen_2025</p>
                  </div>
                </div>
                <a
                  href="https://instagram.com/dudes_kitchen_2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFD700] text-xs font-semibold hover:underline"
                >
                  Follow
                </a>
              </div>

              <hr className="border-white/5 my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Zomato</p>
                    <p className="text-xs text-zinc-500">Order online</p>
                  </div>
                </div>
                <a
                  href="https://www.zomato.com/proddatur/dudes-kitchen-proddatur-locality/order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFD700] text-xs font-semibold hover:underline"
                >
                  Order
                </a>
              </div>
            </div>
          </GlowCard>

          <GlowCard delay={0.45}>
            <div className="p-5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-3">
                Location
              </h3>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] bg-zinc-900">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.123456789!2d78.555!3d14.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQ1JzAwLjAiTiA3OMKwMzMnMTguMCJF!5e0!3m2!1sen!2sin!4v1"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: 'invert(0.9) hue-rotate(180deg)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <motion.a
                  href="https://maps.google.com/?q=21/633+Rajaji+Rd+Proddatur+Andhra+Pradesh+516360"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700] text-black text-xs font-bold shadow-lg hover:shadow-[#FFD700]/30 transition-shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </motion.a>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
