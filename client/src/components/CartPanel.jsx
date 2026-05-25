import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPanel({ onClose }) {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white rounded-t-[2rem] shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zinc-800" />
            <h2 className="text-lg font-display font-bold text-zinc-800">
              Your Cart
            </h2>
            {cartCount > 0 && (
              <span className="text-xs bg-[#FFD700] text-black font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <ShoppingBag className="w-16 h-16 mb-4 text-zinc-200" />
              <p className="text-base font-medium text-zinc-500">Your cart is empty</p>
              <p className="text-sm mt-1">Add some delicious items!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-zinc-800 truncate">{item.name}</h3>
                      <p className="text-sm font-extrabold text-[#FFD700] mt-0.5">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-red-400" />
                        ) : (
                          <Minus className="w-3 h-3 text-zinc-500" />
                        )}
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-zinc-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#FFD700] flex items-center justify-center hover:bg-[#E6B800] transition-colors"
                      >
                        <Plus className="w-3 h-3 text-black" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-zinc-100 px-6 py-4 bg-white rounded-b-[2rem]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-500">Total</span>
              <span className="text-xl font-display font-bold text-zinc-800">
                ₹{cartTotal}
              </span>
            </div>
            <button className="w-full py-3.5 bg-gradient-to-r from-[#FFD700] to-[#E6B800] text-black font-bold text-sm rounded-xl hover:shadow-lg transition-shadow">
              Proceed to Checkout
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
