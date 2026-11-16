import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Upload,
  Bookmark,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
  Sun,
  Moon,
  GraduationCap,
  Users,
  Info,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Study<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    SaaS
                  </span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500 -mt-1">
                  Knowledge Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/resources"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/resources')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Notes</span>
            </Link>

            <Link
              to="/subjects"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/subjects')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Subjects</span>
            </Link>

            <Link
              to="/ai-assistant"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isActive('/ai-assistant')
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
              <span>AI Assistant</span>
            </Link>

            <Link
              to="/community"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/community')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community</span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/about')
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </Link>
          </nav>

          {/* Right Action Bar: Theme Toggle + Auth / Profile */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/upload"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-white max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-border">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                          {user.role === 'admin' ? 'Faculty Admin' : `${user.department || 'Engineering'} • Sem ${user.semester || 1}`}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-card font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                          <span>Student Dashboard</span>
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-card font-medium"
                        >
                          <Bookmark className="w-4 h-4 text-amber-500" />
                          <span>Saved Bookmarks</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-card font-medium"
                        >
                          <User className="w-4 h-4 text-cyan-500" />
                          <span>Profile Settings</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Admin Center</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-dark-border">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Home</span>
          </Link>
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <Search className="w-5 h-5 text-indigo-600" />
            <span>Explore Notes</span>
          </Link>
          <Link
            to="/subjects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Subjects</span>
          </Link>
          <Link
            to="/ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI Study Assistant</span>
          </Link>
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Community</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <Info className="w-5 h-5 text-indigo-600" />
            <span>About</span>
          </Link>
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
          >
            <Upload className="w-5 h-5 text-indigo-600" />
            <span>Upload Notes</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
              >
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <span>Bookmarks</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                <span>Student Dashboard</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card font-medium"
              >
                <User className="w-5 h-5 text-indigo-600" />
                <span>My Profile</span>
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium"
                >
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <span>Admin Control Center</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out ({user.name})</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-dark-card rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
