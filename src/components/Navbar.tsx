import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LANDING_ANCHORS = [
  { label: 'Tentang', anchor: 'tentang' },
  { label: 'Program', anchor: 'program' },
  { label: 'Kontak', anchor: 'kontak' },
];

function scrollTo(anchor: string) {
  const el = document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

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
          {/* Beranda */}
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              isLanding ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Beranda
          </Link>

          {/* Anchor links — visible always */}
          {LANDING_ANCHORS.map(({ label, anchor }) => (
            <a
              key={anchor}
              href={`/#${anchor}`}
              onClick={(e) => handleAnchorClick(e, anchor)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              {label}
            </a>
          ))}

          {/* Separator */}
          <span className="text-white/10 px-1 select-none">|</span>

          {/* Dashboard Murid */}
          <Link
            to="/kelas"
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              location.pathname === '/kelas' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard Murid
          </Link>

          {/* Dashboard Dosen */}
          <Link
            to="/mentor"
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              location.pathname === '/mentor' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard Dosen
          </Link>
        </div>

        {/* Right: SSO + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
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
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </>
          ) : (
            <a
              href="/auth/login"
              className="flex items-center gap-1.5 text-sm font-bold text-black bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 rounded-lg transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk</span>
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#16181D] border-t border-white/10 px-4 py-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${isLanding ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Beranda
          </Link>
          {LANDING_ANCHORS.map(({ label, anchor }) => (
            <a
              key={anchor}
              href={`/#${anchor}`}
              onClick={(e) => handleAnchorClick(e, anchor)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
              {label}
            </a>
          ))}
          <Link
            to="/kelas"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${location.pathname === '/kelas' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Dashboard Murid
          </Link>
          <Link
            to="/mentor"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${location.pathname === '/mentor' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-white/5'}`}
          >
            Dashboard Dosen
          </Link>
        </div>
      )}
    </nav>
  );
}
