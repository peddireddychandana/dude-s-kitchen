import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import MenuApp from './pages/MenuApp';
import { CartProvider } from './context/CartContext';

function App() {
  const [showMenu, setShowMenu] = useState(() => localStorage.getItem('showMenu') === 'true');

  const enterMenu = () => {
    localStorage.setItem('showMenu', 'true');
    setShowMenu(true);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!showMenu ? (
          <LandingPage key="landing" onEnter={enterMenu} />
        ) : (
          <CartProvider key="menu">
            <MenuApp />
          </CartProvider>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
