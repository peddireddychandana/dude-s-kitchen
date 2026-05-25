import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Menu,
  X,
} from 'lucide-react';
import { getLogo } from '../utils/api';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/offers', label: 'Offers', icon: Tag },
];

export default function Sidebar() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getLogo()
      .then((res) => {
        const url = res.data?.url || res.url;
        if (url) setLogoUrl(url);
      })
      .catch(() => {});
  }, []);

  const logoSrc = logoUrl
    ? logoUrl.startsWith('http') ? logoUrl : `https://dude-s-kitchen-server.onrender.com${logoUrl}`
    : null;

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="DUDE'S KITCHEN"
              className="w-12 h-12 object-cover rounded-xl"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-yellow to-yellow-600 flex items-center justify-center text-sm font-extrabold text-black">
              DK
            </div>
          )}
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-tight">
              <span className="text-brand-yellow">DUDE'S</span>
              <span className="text-white"> KITCHEN</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 text-center">
          &copy; {new Date().getFullYear()} Dude's Kitchen
        </p>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex-col z-50">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
