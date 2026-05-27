import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Instagram, Facebook, Twitter, Send, CheckCircle } from 'lucide-react';

const businessHours = [
  { day: 'Monday - Friday', hours: '11:00 AM - 11:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 12:00 AM' },
  { day: 'Sunday', hours: '12:00 PM - 10:00 PM' },
];

const socialLinks = [
  { icon: <Instagram className="w-5 h-5" />, label: '@dudeskitchen', href: '#', color: 'hover:bg-pink-500' },
  { icon: <Facebook className="w-5 h-5" />, label: 'DUDE\'S KITCHEN', href: '#', color: 'hover:bg-blue-600' },
  { icon: <Twitter className="w-5 h-5" />, label: '@dudeskitchen', href: '#', color: 'hover:bg-sky-500' },
];

export default function ContactPage({ onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }
  }, [formData.name, formData.email, formData.message]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="relative h-44 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="absolute top-6 left-4 z-20 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </motion.button>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display font-bold text-white"
          >
            Get in <span className="text-[#FFD700]">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-zinc-400 mt-2"
          >
            We'd love to hear from you
          </motion.p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] mb-4"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange('name')}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={handleChange('message')}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all resize-none"
              required
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                submitted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4" />Message Sent!</>
              ) : (
                <><Send className="w-4 h-4" />Send Message</>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] mb-4"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">Visit Us</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Location</p>
                <p className="text-xs text-zinc-500 mt-0.5">123, Foodie Lane, Gourmet Street<br />Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Phone</p>
                <p className="text-xs text-zinc-500 mt-0.5">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-xs text-zinc-500 mt-0.5">hello@dudeskitchen.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] mb-4"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">Business Hours</h2>
          <div className="flex flex-col gap-3">
            {businessHours.map((item) => (
              <div key={item.day} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span className="text-sm text-zinc-400">{item.day}</span>
                <span className="text-sm font-semibold text-white">{item.hours}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] mb-6"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-4">Follow Us</h2>
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-zinc-900 text-zinc-400 border border-white/[0.06] ${link.color} hover:text-white transition-all duration-200 group`}
              >
                <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="text-[10px] font-medium text-zinc-400">{link.label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
