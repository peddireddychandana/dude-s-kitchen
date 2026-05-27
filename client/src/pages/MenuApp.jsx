import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySidebar from '../components/CategorySidebar';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';
import BottomNav from '../components/BottomNav';
import { getCategories, getFoods, getCachedData, LOGO_URL } from '../utils/api';
import socket from '../utils/socket';
import { Search, X } from 'lucide-react';

const OffersPage = lazy(() => import('./OffersPage'));
const AboutPage = lazy(() => import('./AboutPage'));
const ContactPage = lazy(() => import('./ContactPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));

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
  'Fried Chicken': '🍗', Burgers: '🍔', Pizza: '🍕', Wraps: '🌮',
  Hotdogs: '🌭', Sandwiches: '🥪', Mojitos: '🍹', Milkshakes: '🥤',
  'Quick Bites': '🍟', "DUDE'S KITCHEN SPECIAL": '🔥', default: '🍽️',
};

const categoryNames = {
  'Fried Chicken': 'Fried\nChicken', Burgers: 'Burgers', Pizza: 'Pizza',
  Wraps: 'Wraps', Hotdogs: 'Hotdogs', Sandwiches: 'Sand-\nwiches',
  Mojitos: 'Mojitos', Milkshakes: 'Milk-\nshakes', 'Quick Bites': 'Quick\nBites',
  "DUDE'S KITCHEN SPECIAL": 'Specials',
};

const fallbackCategories = [
  { name: 'Fried Chicken' }, { name: 'Burgers' }, { name: 'Pizza' },
  { name: 'Wraps' }, { name: 'Hotdogs' }, { name: 'Sandwiches' },
  { name: 'Mojitos' }, { name: 'Milkshakes' }, { name: 'Quick Bites' },
  { name: "DUDE'S KITCHEN SPECIAL" },
];

const fallbackNames = ['Fried Chicken','Burgers','Pizza','Wraps','Hotdogs','Sandwiches','Mojitos','Milkshakes','Quick Bites',"DUDE'S KITCHEN SPECIAL"];

function SearchBar({ searchQuery, setSearchQuery, onClose }) {
  return (
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
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        )}
      </div>
    </div>
  );
}

const MemoSearchBar = React.memo(SearchBar);

function FoodSkeleton() {
  return (
    <div className="flex flex-col gap-3 pb-4 px-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-2.5 gap-2.5">
          <div className="w-[72px] h-[72px] md:w-24 md:h-24 rounded-xl skeleton-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 skeleton-pulse rounded" />
            <div className="h-3 w-1/2 skeleton-pulse rounded" />
            <div className="h-4 w-1/4 skeleton-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FoodListSection({ foods, activeCategory, showSearch, onView }) {
  if (showSearch) {
    return (
      <div className="flex flex-col gap-3 pb-4">
        {foods.map((food, index) => (
          <FoodCard
            key={food._id || index}
            food={food}
            gradient={categoryGradients[food.category] || categoryGradients.default}
            emoji={categoryEmojis[food.category] || categoryEmojis.default}
            onView={onView}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {activeCategory === "DUDE'S KITCHEN SPECIAL" ? (
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#FFD700] to-red-500" />
          <div>
            <h2 className="text-sm font-extrabold text-[#FFD700] tracking-tight flex items-center gap-2">
              🔥 DUDE'S KITCHEN <span className="text-white"> SPECIAL</span>
            </h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Premium signature selections</p>
          </div>
        </div>
      ) : (
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4">
          {activeCategory}
        </h2>
      )}

      {foods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <span className="text-5xl mb-4">🔍</span>
          <p className="text-base font-medium">No dishes found</p>
          <p className="text-sm mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {foods.map((food, index) => (
            <FoodCard
              key={food._id || index}
              food={food}
              gradient={categoryGradients[food.category] || categoryGradients.default}
              emoji={categoryEmojis[food.category] || categoryEmojis.default}
              onView={onView}
            />
          ))}
        </div>
      )}
    </>
  );
}

const MemoFoodListSection = React.memo(FoodListSection);

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
      <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function MenuApp() {
  const cached = getCachedData();
  const [categories, setCategories] = useState(cached?.categories || []);
  const [foods, setFoods] = useState(cached?.foods || []);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState(() => {
    if (cached?.categories?.length > 0) {
      const saved = localStorage.getItem('activeCategory');
      if (saved && cached.categories.some((c) => c.name === saved)) return saved;
      return cached.categories[0].name;
    }
    return localStorage.getItem('activeCategory') || '';
  });
  const [loading, setLoading] = useState(!cached);
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || 'home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [cats, foodsData] = await Promise.all([getCategories(), getFoods()]);
      setCategories(cats);
      setFoods(foodsData.filter((f) => f.available !== false));
      if (cats.length > 0) {
        const saved = localStorage.getItem('activeCategory');
        setActiveCategory((prev) => {
          if (saved && cats.some((c) => c.name === saved)) return saved;
          return prev || cats[0].name;
        });
      }
    } catch {
      if (categories.length === 0) {
        setCategories(fallbackCategories);
        const saved = localStorage.getItem('activeCategory');
        setActiveCategory((prev) => (saved && fallbackNames.includes(saved)) ? saved : (prev || 'Fried Chicken'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    socket.connect();
    socket.on('foods:update', loadData);
    socket.on('categories:update', loadData);
    return () => {
      socket.off('foods:update', loadData);
      socket.off('categories:update', loadData);
    };
  }, [loadData]);

  useEffect(() => {
    if (loading) {
      if (cached) setFilteredFoods(cached.foods.filter((f) => f.category === activeCategory));
      return;
    }
    let result;
    if (showSearch && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = foods.filter(
        (food) => food.name?.toLowerCase().includes(query) || food.description?.toLowerCase().includes(query)
      );
    } else if (activeCategory) {
      result = foods.filter((food) => food.category === activeCategory);
    } else {
      result = foods;
    }
    setFilteredFoods(result);
  }, [activeCategory, foods, searchQuery, showSearch, loading, cached]);

  const handleCategoryChange = useCallback((category) => {
    localStorage.setItem('activeCategory', category);
    setActiveCategory(category);
    setShowSearch(false);
    setSearchQuery('');
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    sessionStorage.setItem('activeTab', tab);
    if (tab === 'search') {
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchQuery('');
    }
  }, []);

  const handleCloseSearch = useCallback(() => setSearchQuery(''), []);
  const handleSelectFood = useCallback((food) => setSelectedFood(food), []);
  const handleCloseModal = useCallback(() => setSelectedFood(null), []);

  const renderMainContent = useCallback(() => {
    const goHome = () => handleTabChange('home');

    if (activeTab === 'offers') return <Suspense fallback={<PageFallback />}><OffersPage onBack={goHome} /></Suspense>;
    if (activeTab === 'about') return <Suspense fallback={<PageFallback />}><AboutPage onBack={goHome} /></Suspense>;
    if (activeTab === 'contact') return <Suspense fallback={<PageFallback />}><ContactPage onBack={goHome} /></Suspense>;
    if (activeTab === 'profile') return <Suspense fallback={<PageFallback />}><ProfilePage onBack={goHome} /></Suspense>;

    return (
      <div className="flex h-full pb-10">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          categoryNames={categoryNames}
          emojis={categoryEmojis}
        />

        <div className="flex-1 bg-[#0A0A0A] min-h-screen overflow-y-auto no-scrollbar">
          <div className="sticky top-0 z-30 bg-[#0A0A0A] px-4 pt-3 pb-2 flex items-center gap-3 border-b border-white/[0.06]">
            <img src={LOGO_URL} alt="DUDE'S KITCHEN" className="w-12 h-12 object-cover rounded-xl" fetchpriority="high" decoding="async" />
            <span className="text-base font-extrabold tracking-tight">
              <span className="text-[#FFD700]">DUDE'S</span>
              <span className="text-white"> KITCHEN</span>
            </span>
          </div>
          {showSearch && <MemoSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClose={handleCloseSearch} />}

          <div className="px-4 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + (showSearch ? '-search' : '')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {loading && !cached ? (
                  <FoodSkeleton />
                ) : (
                  <MemoFoodListSection
                    foods={filteredFoods}
                    activeCategory={activeCategory}
                    showSearch={showSearch}
                    onView={handleSelectFood}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }, [activeTab, categories, activeCategory, handleCategoryChange, showSearch, searchQuery, handleCloseSearch, loading, cached, filteredFoods, handleSelectFood, handleTabChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="relative w-full min-h-screen bg-[#0A0A0A]"
    >
      {renderMainContent()}

      <AnimatePresence>
        {selectedFood && (
          <FoodDetailModal
            food={selectedFood}
            gradient={categoryGradients[selectedFood.category] || categoryGradients.default}
            emoji={categoryEmojis[selectedFood.category] || categoryEmojis.default}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </motion.div>
  );
}
