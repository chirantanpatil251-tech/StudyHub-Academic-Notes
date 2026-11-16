import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@studyhub.edu', 'admin123');
        navigate('/admin');
      } else {
        await login('student@studyhub.edu', 'student123');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              Study<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to access your notes, bookmarks, and upload dashboard.
          </p>
        </div>

        {/* Quick Demo Login Box */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 mb-6 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Evaluation Quick 1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-dark-surface border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold shadow-2xs hover:bg-indigo-50/50 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                College Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@studyhub.edu"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
