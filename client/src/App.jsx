import React, { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import MenuApp from './pages/MenuApp';
import { CartProvider } from './context/CartContext';

function App() {
  const [showMenu, setShowMenu] = useState(() => sessionStorage.getItem('showMenu') === 'true');

  const enterMenu = useCallback(() => {
    sessionStorage.setItem('showMenu', 'true');
    setShowMenu(true);
  }, []);

  return (
    <div className="app-container">
      {!showMenu ? (
        <LandingPage key="landing" onEnter={enterMenu} />
      ) : (
        <CartProvider key="menu">
          <MenuApp />
        </CartProvider>
      )}
    </div>
  );
}

export default App;
