import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySidebar from '../components/CategorySidebar';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';
import BottomNav from '../components/BottomNav';
import OffersPage from './OffersPage';

import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import ProfilePage from './ProfilePage';
import { getCategories, getFoods, getLogo } from '../utils/api';
import { Search, X } from 'lucide-react';

const categoryGradients = {
  'Fried Chicken': 'from-amber-500 to-orange-600',
  Burgers: 'from-red-500 to-rose-600',
  Pizza: 'from-yellow-500 to-orange-500',
  Wraps: 'from-teal-500 to-cyan-600',
  Hotdogs: 'from-pink-500 to-rose-500',
  Sandwiches: 'from-blue-500 to-indigo-600',
  Mojitos: 'from-cyan-500 to-blue-600',
  Milkshakes: 'from-purple-500 to-fuchsia-600',
  'Quick Bites': 'from-orange-500 to-red-500',
  "DUDE'S KITCHEN SPECIAL": 'from-[#FFD700] to-red-600',
  default: 'from-gray-500 to-gray-600',
};

const categoryEmojis = {
  'Fried Chicken': '🍗',
  Burgers: '🍔',
  Pizza: '🍕',
  Wraps: '🌮',
  Hotdogs: '🌭',
  Sandwiches: '🥪',
  Mojitos: '🍹',
  Milkshakes: '🥤',
  'Quick Bites': '🍟',
  "DUDE'S KITCHEN SPECIAL": '🔥',
  default: '🍽️',
};

const categoryNames = {
  'Fried Chicken': 'Fried\nChicken',
  Burgers: 'Burgers',
  Pizza: 'Pizza',
  Wraps: 'Wraps',
  Hotdogs: 'Hotdogs',
  Sandwiches: 'Sand-\nwiches',
  Mojitos: 'Mojitos',
  Milkshakes: 'Milk-\nshakes',
  'Quick Bites': 'Quick\nBites',
  "DUDE'S KITCHEN SPECIAL": 'Specials',
};

export default function MenuApp() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState(() => localStorage.getItem('activeCategory') || '');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchLogo = useCallback(async () => {
    try {
      const d = await getLogo();
      if (d.url) setLogoUrl(d.url);
    } catch {}
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [cats, foodsData] = await Promise.all([
        getCategories(),
        getFoods(),
      ]);
      setCategories(cats);
      setFoods(foodsData.filter((f) => f.available !== false));
      if (cats.length > 0) {
        const saved = localStorage.getItem('activeCategory');
        if (saved && cats.some((c) => c.name === saved)) {
          setActiveCategory(saved);
        } else {
          setActiveCategory(cats[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setCategories([
        { name: 'Fried Chicken' },
        { name: 'Burgers' },
        { name: 'Pizza' },
        { name: 'Wraps' },
        { name: 'Hotdogs' },
        { name: 'Sandwiches' },
        { name: 'Mojitos' },
        { name: 'Milkshakes' },
        { name: 'Quick Bites' },
        { name: "DUDE'S KITCHEN SPECIAL" },
      ]);
      const saved = localStorage.getItem('activeCategory');
      if (saved && ['Fried Chicken','Burgers','Pizza','Wraps','Hotdogs','Sandwiches','Mojitos','Milkshakes','Quick Bites',"DUDE'S KITCHEN SPECIAL"].includes(saved)) {
        setActiveCategory(saved);
      } else {
        setActiveCategory('Fried Chicken');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchLogo();
  }, [loadData, fetchLogo]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
        fetchLogo();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [loadData, fetchLogo]);

  useEffect(() => {
    if (showSearch && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredFoods(
        foods.filter(
          (food) =>
            food.name?.toLowerCase().includes(query) ||
            food.description?.toLowerCase().includes(query)
        )
      );
    } else if (activeCategory) {
      setFilteredFoods(
        foods.filter((food) => food.category === activeCategory)
      );
    } else {
      setFilteredFoods(foods);
    }
  }, [activeCategory, foods, searchQuery, showSearch]);

  const handleCategoryChange = useCallback(
    (category) => {
      setTransitioning(true);
      localStorage.setItem('activeCategory', category);
      setTimeout(() => {
        setActiveCategory(category);
        setShowSearch(false);
        setSearchQuery('');
        setTransitioning(false);
      }, 150);
    },
    []
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    if (tab === 'search') {
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchQuery('');
    }
  }, []);

  const renderMainContent = () => {
    const goHome = () => handleTabChange('home');
    if (activeTab === 'offers') return <OffersPage onBack={goHome} logoUrl={logoUrl} />;
    if (activeTab === 'about') return <AboutPage onBack={goHome} logoUrl={logoUrl} />;
    if (activeTab === 'contact') return <ContactPage onBack={goHome} logoUrl={logoUrl} />;
    if (activeTab === 'profile') return <ProfilePage onBack={goHome} />;

    return (
      <div className="flex h-full" style={{ paddingBottom: '60px' }}>
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          categoryNames={categoryNames}
          emojis={categoryEmojis}
        />

        <div className="flex-1 bg-[#0A0A0A] min-h-screen overflow-y-auto no-scrollbar">
          <div className="sticky top-0 z-30 bg-[#0A0A0A] px-4 pt-3 pb-2 flex items-center gap-3 border-b border-white/[0.06]">
            {logoUrl ? (
              <img
                src={logoUrl.startsWith('http') ? logoUrl : `https://dude-s-kitchen-server.onrender.com${logoUrl}`}
                alt="DUDE'S KITCHEN"
                className="w-12 h-12 object-cover rounded-xl"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6B800] flex items-center justify-center text-xs font-extrabold text-black">
                DK
              </div>
            )}
            <span className="text-base font-extrabold tracking-tight">
              <span className="text-[#FFD700]">DUDE'S</span>
              <span className="text-white"> KITCHEN</span>
            </span>
          </div>
          {showSearch && (
            <div className="sticky top-0 z-20 bg-[#0A0A0A] px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="px-4 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + (showSearch ? '-search' : '')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!showSearch && (
                  activeCategory === "DUDE'S KITCHEN SPECIAL" ? (
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#FFD700] to-red-500" />
                      <div>
                        <h2 className="text-sm font-extrabold text-[#FFD700] tracking-tight flex items-center gap-2">
                          🔥 DUDE'S KITCHEN
                          <span className="text-white"> SPECIAL</span>
                        </h2>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Premium signature selections</p>
                      </div>
                    </div>
                  ) : (
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4">
                      {activeCategory}
                    </h2>
                  )
                )}

                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-zinc-900 rounded-2xl h-28 animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredFoods.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <span className="text-5xl mb-4">🔍</span>
                    <p className="text-base font-medium">No dishes found</p>
                    <p className="text-sm mt-1">Try a different category or search term</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pb-4">
                    {filteredFoods.map((food, index) => (
                      <FoodCard
                        key={food._id || index}
                        food={food}
                        gradient={
                          categoryGradients[food.category] ||
                          categoryGradients.default
                        }
                        emoji={
                          categoryEmojis[food.category] ||
                          categoryEmojis.default
                        }
                        onView={setSelectedFood}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full min-h-screen bg-[#0A0A0A]"
    >
      {renderMainContent()}

      <AnimatePresence>
        {selectedFood && (
          <FoodDetailModal
            food={selectedFood}
            gradient={
              categoryGradients[selectedFood.category] ||
              categoryGradients.default
            }
            emoji={
              categoryEmojis[selectedFood.category] ||
              categoryEmojis.default
            }
            onClose={() => setSelectedFood(null)}
          />
        )}
      </AnimatePresence>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </motion.div>
  );
}
