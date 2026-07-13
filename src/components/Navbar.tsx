import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, UserCircle, Menu, X, Bell, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types';

interface NavbarProps {
  notifications?: Notification[];
  onMarkNotifRead?: (id: string) => void;
}

const LANDING_ANCHORS = [
  { label: 'Tentang', anchor: 'tentang' },
  { label: 'Program', anchor: 'program' },
  { label: 'Kontak', anchor: 'kontak' },
];

function scrollTo(anchor: string) {
  const el = document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar({ notifications = [], onMarkNotifRead }: NavbarProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const isLanding = location.pathname === '/';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close bell dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isLanding) {
      scrollTo(anchor);
    } else {
      navigate('/');
      setTimeout(() => scrollTo(anchor), 300);
    }
  };

  const typeIcon: Record<string, string> = {
    payment: '💳', material: '📚', forum: '💬', announcement: '📢',
  };

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}j lalu`;
    return `${Math.floor(hrs / 24)}h lalu`;
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0F1115]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          <span className="font-black text-white text-sm tracking-wider uppercase">Rahmato Academy</span>
        </Link>

        {/* Center links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${isLanding ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Beranda
          </Link>

          {LANDING_ANCHORS.map(({ label, anchor }) => (
            <a key={anchor} href={`/#${anchor}`} onClick={(e) => handleAnchorClick(e, anchor)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition">
              {label}
            </a>
          ))}

          <span className="text-white/10 px-1 select-none">|</span>

          {user?.realm !== 'mentor' && user?.realm !== 'admin' && (
            <Link to="/kelas" className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${location.pathname === '/kelas' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              Dashboard Murid
            </Link>
          )}

          {(user?.realm === 'mentor' || user?.realm === 'admin') && (
            <Link to="/mentor" className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${location.pathname === '/mentor' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              Dashboard Dosen
            </Link>
          )}

          {user?.realm === 'admin' && (
            <Link to="/admin" className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${location.pathname === '/admin' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/5'}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Right: Bell + SSO + hamburger */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Notification bell */}
          {!loading && (
            <div className="relative" ref={bellRef}>
              <button onClick={() => setBellOpen(!bellOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/5">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-10 w-80 bg-[#16181D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-bold text-white">Notifikasi</span>
                    {unreadCount > 0 && (
                      <button onClick={() => notifications.filter(n => !n.read).forEach(n => onMarkNotifRead?.(n.id))}
                        className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1">
                        <Check className="h-3 w-3" /> Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-8">Belum ada notifikasi</p>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <div key={n.id} onClick={() => onMarkNotifRead?.(n.id)}
                          className={`flex gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition ${!n.read ? 'bg-emerald-500/5' : ''}`}>
                          <span className="text-lg shrink-0 mt-0.5">{typeIcon[n.type] ?? '🔔'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                              {!n.read && <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SSO */}
          {loading ? (
            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
          ) : user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
                <UserCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold">{user.name ?? user.email ?? 'Pengguna'}</span>
                {user.realm && <span className="text-slate-500 text-xs">· {user.realm}</span>}
              </div>
              <form action="/auth/logout" method="post">
                <button type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </>
          ) : (
            <a href="/auth/login"
              className="flex items-center gap-1.5 text-sm font-bold text-black bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 rounded-lg transition">
              <LogIn className="h-4 w-4" />
              <span>Masuk</span>
            </a>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white transition cursor-pointer">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#16181D] border-t border-white/10 px-4 py-4 space-y-1">
          <Link to="/" onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${isLanding ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}>
            Beranda
          </Link>
          {LANDING_ANCHORS.map(({ label, anchor }) => (
            <a key={anchor} href={`/#${anchor}`} onClick={(e) => handleAnchorClick(e, anchor)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5">
              {label}
            </a>
          ))}
          {user?.realm !== 'mentor' && user?.realm !== 'admin' && (
            <Link to="/kelas" onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${location.pathname === '/kelas' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}>
              Dashboard Murid
            </Link>
          )}
          {(user?.realm === 'mentor' || user?.realm === 'admin') && (
            <Link to="/mentor" onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${location.pathname === '/mentor' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}>
              Dashboard Dosen
            </Link>
          )}
          {user?.realm === 'admin' && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${location.pathname === '/admin' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300 hover:bg-white/5'}`}>
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
