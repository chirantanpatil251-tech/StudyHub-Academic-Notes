import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Search, Download, Trash2, ArrowLeft, BookOpen, FileQuestion } from 'lucide-react';
import api from '../services/api';
import { downloadResourceFile } from '../utils/downloadHelper';
import ResourceCard from '../components/ResourceCard';
import PdfViewerModal from '../components/PdfViewerModal';
import AiSummaryModal from '../components/AiSummaryModal';
import { useAuth } from '../context/AuthContext';

export default function Bookmarks() {
  const { user, toggleBookmarkInState } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [aiModalResourceId, setAiModalResourceId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources/user/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (id) => {
    try {
      await api.post(`/resources/${id}/bookmark`);
      toggleBookmarkInState(id);
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (resource) => {
    downloadResourceFile(resource);
  };

  const filteredBookmarks = bookmarks.filter((item) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-8 h-8 text-amber-500 fill-amber-500" />
              <span>My Saved Bookmarks</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your personal library of saved study guides, question papers, and revision notes.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search saved bookmarks..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-xs text-slate-800 dark:text-dark-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 bg-white dark:bg-dark-surface rounded-2xl animate-pulse border border-slate-200 dark:border-dark-border"
              />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-slate-200 dark:border-dark-border shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No saved bookmarks yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              When browsing notes, tap the bookmark icon to save materials for quick access during exam week.
            </p>
            <Link
              to="/resources"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-block"
            >
              Browse Academic Resources
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                isBookmarked={true}
                onToggleBookmark={handleToggleBookmark}
                onDownload={handleDownload}
                onPreview={(r) => setSelectedPreview(r)}
                onOpenAiSummary={(id) => setAiModalResourceId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <PdfViewerModal
        isOpen={!!selectedPreview}
        onClose={() => setSelectedPreview(null)}
        resource={selectedPreview}
        onDownload={handleDownload}
      />

      <AiSummaryModal
        isOpen={!!aiModalResourceId}
        onClose={() => setAiModalResourceId(null)}
        resourceId={aiModalResourceId}
      />
    </div>
  );
}
