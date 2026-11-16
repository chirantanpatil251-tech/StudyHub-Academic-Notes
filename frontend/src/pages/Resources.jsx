import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  BookOpen,
  ArrowUpDown,
  FileQuestion,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { downloadResourceFile } from '../utils/downloadHelper';
import ResourceCard from '../components/ResourceCard';
import PdfViewerModal from '../components/PdfViewerModal';
import AiSummaryModal from '../components/AiSummaryModal';
import { useAuth } from '../context/AuthContext';

const departmentsList = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
];

const categoriesList = [
  'All Categories',
  'Handwritten Notes',
  'Previous Year Papers',
  'Lab Manuals',
  'PPT Slides',
  'Syllabus & Reference',
  'Tutorials & Code',
  'Video Lectures',
];

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, toggleBookmarkInState } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [aiModalResourceId, setAiModalResourceId] = useState(null);

  // Filter States
  const keyword = searchParams.get('keyword') || '';
  const department = searchParams.get('department') || 'All Departments';
  const semester = searchParams.get('semester') || 'All Semesters';
  const category = searchParams.get('category') || 'All Categories';
  const sort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    fetchResources();
  }, [searchParams]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (keyword) params.keyword = keyword;
      if (department && department !== 'All Departments') params.department = department;
      if (semester && semester !== 'All Semesters') params.semester = semester;
      if (category && category !== 'All Categories') params.category = category;
      if (sort) params.sort = sort;

      const res = await api.get('/resources', { params });
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All Departments' || value === 'All Semesters' || value === 'All Categories') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('keyword', searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleToggleBookmark = async (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/resources/${id}/bookmark`);
      toggleBookmarkInState(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (resource) => {
    downloadResourceFile(resource);
  };

  const activeFiltersCount = [
    keyword,
    department !== 'All Departments',
    semester !== 'All Semesters',
    category !== 'All Categories',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curriculum Repository
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Browse Academic Resources
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Access subject-wise handwritten notes, university PYQs, lab manuals, and syllabus guides.
            </p>
          </div>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs shadow-2xs hover:bg-purple-100 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Document Copilot</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs space-y-4">
          {/* Row 1: Search & Sort */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search notes by title, topic, or tags..."
                className="w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-xs sm:text-sm text-slate-800 dark:text-dark-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="w-full md:w-auto flex items-center justify-end space-x-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="downloads">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Row 2: Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-dark-border">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => updateParam('department', e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => updateParam('semester', e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All Semesters">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Resource Category
              </label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Active Filters:</span>
              {keyword && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <span>Keyword: "{keyword}"</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('keyword', '')} />
                </span>
              )}
              {department !== 'All Departments' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <span>{department}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('department', '')} />
                </span>
              )}
              {semester !== 'All Semesters' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <span>Sem {semester}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('semester', '')} />
                </span>
              )}
              {category !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <span>{category}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('category', '')} />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>

        {/* Resources Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Showing {resources.length} Academic Materials
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-white dark:bg-dark-surface rounded-2xl animate-pulse border border-slate-200 dark:border-dark-border"
                />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="bg-white dark:bg-dark-surface rounded-3xl p-12 text-center border border-slate-200 dark:border-dark-border shadow-xs max-w-lg mx-auto">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                No matching study resources found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                We couldn't find any documents matching your current search criteria. Try loosening your filters or search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res) => (
                <ResourceCard
                  key={res._id}
                  resource={res}
                  isBookmarked={user?.bookmarks?.some((b) => (b?._id || b).toString() === res._id.toString())}
                  onToggleBookmark={handleToggleBookmark}
                  onDownload={handleDownload}
                  onPreview={(r) => setSelectedPreview(r)}
                  onOpenAiSummary={(id) => setAiModalResourceId(id)}
                />
              ))}
            </div>
          )}
        </div>
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
