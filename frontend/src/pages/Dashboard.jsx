import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Bookmark,
  FileText,
  Download,
  Star,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { downloadResourceFile } from '../utils/downloadHelper';
import PdfViewerModal from '../components/PdfViewerModal';
import AiSummaryModal from '../components/AiSummaryModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myUploads, setMyUploads] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [aiModalResourceId, setAiModalResourceId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [uploadsRes, bookmarksRes] = await Promise.all([
        api.get('/resources/user/uploads'),
        api.get('/resources/user/bookmarks'),
      ]);
      setMyUploads(uploadsRes.data);
      setBookmarks(bookmarksRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUpload = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      setMyUploads(myUploads.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const handleDownload = (resource) => {
    downloadResourceFile(resource);
  };

  const totalDownloads = myUploads.reduce((acc, item) => acc + (item.downloads || 0), 0);
  const totalViews = myUploads.reduce((acc, item) => acc + (item.views || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/15">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              <span>{user?.department || 'Engineering'}</span>
              <span>•</span>
              <span>Semester {user?.semester || 5}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Track your contributed study materials, peer feedback, download milestones, and saved notes in your centralized academic command center.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              to="/upload"
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Notes</span>
            </Link>
            <Link
              to="/ai-assistant"
              className="px-4 py-2.5 bg-purple-500/30 hover:bg-purple-500/40 text-white border border-purple-300/30 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>AI Study Copilot</span>
            </Link>
          </div>

          {/* Decorative glowing backdrops */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Metric Statistics Cards (Linear / SaaS aesthetic) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                My Uploads
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {myUploads.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Saved Bookmarks
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {bookmarks.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Downloads Received
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {totalDownloads}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Total Views
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                {totalViews}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid: My Uploads & Bookmarks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: My Uploads (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-dark-border">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    My Uploaded Resources
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Materials you shared with the student community
                  </p>
                </div>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New</span>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-100 dark:bg-dark-card rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : myUploads.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                    No uploads yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                    Be the first to share notes or question papers for your semester subjects.
                  </p>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Study Material</span>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-dark-border">
                  {myUploads.map((item) => (
                    <div
                      key={item._id}
                      className="py-4 flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            Sem {item.semester} • {item.subject}
                          </span>
                        </div>
                        <Link
                          to={`/resources/${item._id}`}
                          className="font-semibold text-slate-800 dark:text-slate-200 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span>{item.downloads || 0} downloads</span>
                          <span>•</span>
                          <span>{item.views || 0} views</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {item.rating || '5.0'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                        <button
                          onClick={() => setAiModalResourceId(item._id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-dark-card rounded-lg transition-colors"
                          title="AI Summary"
                        >
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button
                          onClick={() => setSelectedPreview(item)}
                          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-card rounded-lg transition-colors"
                          title="Preview document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUpload(item._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Saved Bookmarks Preview & AI Tip */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-dark-border">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Notes</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quick access to bookmarked items
                  </p>
                </div>
                <Link
                  to="/bookmarks"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                >
                  View All ({bookmarks.length})
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-100 dark:bg-dark-card rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">No bookmarks saved yet.</p>
                  <Link
                    to="/resources"
                    className="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Browse resources to bookmark
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="truncate flex-1">
                        <Link
                          to={`/resources/${item._id}`}
                          className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subject} • {item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : 'PDF'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 shadow-2xs shrink-0"
                        title="Download Note"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Assistant Quick Launcher Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span>AI Study Copilot</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Need to prepare for an upcoming mid-term or end-semester exam? Upload your lecture slides or notes to get page-cited answers, 3D flip flashcards, and practice questions.
              </p>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PdfViewerModal
        isOpen={!!selectedPreview}
        onClose={() => setSelectedPreview(null)}
        resource={selectedPreview}
        onDownload={handleDownload}
      />

      {aiModalResourceId && (
        <AiSummaryModal
          isOpen={!!aiModalResourceId}
          onClose={() => setAiModalResourceId(null)}
          resourceId={aiModalResourceId}
        />
      )}
    </div>
  );
}
