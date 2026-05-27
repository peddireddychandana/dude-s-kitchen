import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item._id !== foodId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === foodId ? { ...item, quantity } : item
      )
    );
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity }),
    [cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
