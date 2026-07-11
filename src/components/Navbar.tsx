import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Kelas', path: '/kelas' },
  ];

  if (user?.realm === 'mentor') {
    navLinks.push({ label: 'Panel Mentor', path: '/mentor' });
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0F1115]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          <span className="font-black text-white text-sm tracking-wider uppercase">Rahmato Academy</span>
        </Link>

        {/* Center links — desktop only */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: SSO status */}
        <div className="flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
          ) : user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
                <UserCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold">{user.name ?? user.email ?? 'Pengguna'}</span>
                {user.realm && (
                  <span className="text-slate-500 text-xs">· {user.realm}</span>
                )}
              </div>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Keluar</span>
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
        </div>
      </div>
    </nav>
  );
}
