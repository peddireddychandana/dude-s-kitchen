import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoods, getCategories, getOffers, getLogo, uploadLogo } from '../utils/api';
import {
  UtensilsCrossed,
  FolderTree,
  Tag,
  LogOut,
  Loader2,
  ArrowRight,
  Image,
  Upload,
  CheckCircle,
} from 'lucide-react';

const statCards = [
  {
    label: 'Total Food Items',
    key: 'foods',
    icon: UtensilsCrossed,
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10',
    border: 'border-brand-yellow/20',
  },
  {
    label: 'Categories',
    key: 'categories',
    icon: FolderTree,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    label: 'Active Offers',
    key: 'offers',
    icon: Tag,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
];

const quickLinks = [
  { label: 'Manage Menu', path: '/menu', desc: 'Add, edit or remove food items' },
  { label: 'Manage Offers', path: '/offers', desc: 'Create and manage promotions' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ foods: 0, categories: 0, offers: 0 });
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await getLogo();
      setLogoUrl(res.data.url);
    } catch {}
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      await uploadLogo(formData);
      setLogoUploaded(true);
      fetchLogo();
      setTimeout(() => setLogoUploaded(false), 2000);
    } catch (err) {
      console.error('Logo upload failed:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [foodsRes, catsRes, offersRes] = await Promise.all([
        getFoods(),
        getCategories(),
        getOffers(),
      ]);
      setStats({
        foods: foodsRes.data?.length || 0,
        categories: catsRes.data?.length || 0,
        offers: offersRes.data?.length || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Overview of your restaurant</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-zinc-400 hover:text-red-400">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-yellow" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className={`${card.bg} ${card.border} border rounded-xl p-6 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.bg}`}>
                      <Icon className={card.color} size={24} />
                    </div>
                    <span className="text-4xl font-bold text-white">
                      {stats[card.key]}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium">
                    {card.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="glow-card">
            <h2 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="group flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-brand-yellow/30 hover:bg-zinc-800 transition-all duration-200 text-left"
                >
                  <div>
                    <p className="text-white font-medium group-hover:text-brand-yellow transition-colors">
                      {link.label}
                    </p>
                    <p className="text-zinc-500 text-sm mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-zinc-600 group-hover:text-brand-yellow transition-colors shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="glow-card mt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-brand-yellow" />
              Brand Logo
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {logoUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl.startsWith('http') ? logoUrl : `https://dude-s-kitchen-server.onrender.com${logoUrl}`}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  {(!logoUrl) && <Image className="w-8 h-8 text-zinc-600" />}
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                  <Image className="w-8 h-8 text-zinc-600" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-zinc-400">
                  Upload your restaurant logo (PNG, JPG, SVG)
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Recommended: 200x200px, transparent background
                </p>
              </div>
              <label className="btn-primary text-sm cursor-pointer flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                {uploadingLogo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : logoUploaded ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadingLogo ? 'Uploading...' : logoUploaded ? 'Uploaded' : 'Upload'}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
