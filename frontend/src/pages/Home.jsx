import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Upload,
  Download,
  Star,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileText,
  FileCheck,
  FolderOpen,
  Code,
  Layers,
  Database,
  Cpu,
  Calculator,
  Compass,
  Wrench,
  Globe,
  Brain,
  Zap,
  Bookmark,
  Share2,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import { downloadResourceFile } from '../utils/downloadHelper';
import ResourceCard from '../components/ResourceCard';
import PdfViewerModal from '../components/PdfViewerModal';
import AiSummaryModal from '../components/AiSummaryModal';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, toggleBookmarkInState } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [aiModalResourceId, setAiModalResourceId] = useState(null);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources?sort=downloads');
      setFeaturedResources(res.data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching featured notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/resources');
    }
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

  // 8 Popular Categories specified in prompt
  const POPULAR_CATEGORIES = [
    {
      name: 'Computer Science',
      query: 'Computer Science & Engineering',
      icon: Code,
      count: '4,200+ Notes',
      gradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Information Technology',
      query: 'Information Technology',
      icon: Globe,
      count: '2,150+ Notes',
      gradient: 'from-cyan-600 to-blue-600',
      lightBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    },
    {
      name: 'Artificial Intelligence',
      query: 'Artificial Intelligence & Data Science',
      icon: Brain,
      count: '1,800+ Notes',
      gradient: 'from-purple-600 to-indigo-600',
      lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    {
      name: 'Data Science',
      query: 'Artificial Intelligence & Data Science',
      icon: Database,
      count: '1,450+ Notes',
      gradient: 'from-violet-600 to-purple-600',
      lightBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    },
    {
      name: 'Electronics',
      query: 'Electronics & Communication',
      icon: Cpu,
      count: '980+ Notes',
      gradient: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
    {
      name: 'Mathematics',
      query: 'Basic Sciences & Humanities',
      icon: Calculator,
      count: '1,600+ Notes',
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    },
    {
      name: 'Physics',
      query: 'Basic Sciences & Humanities',
      icon: Compass,
      count: '720+ Notes',
      gradient: 'from-rose-500 to-pink-600',
      lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    },
    {
      name: 'Engineering',
      query: 'Mechanical Engineering',
      icon: Wrench,
      count: '850+ Notes',
      gradient: 'from-slate-700 to-slate-900',
      lightBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-mesh-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
                <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
                <span>Next-Gen Academic Knowledge & AI Copilot</span>
              </div>

              {/* Exact heading from prompt */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Your Knowledge. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
                  Your Community.
                </span> <br />
                Your Success.
              </h1>

              {/* Exact subtitle from prompt */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover, share, and access quality academic resources from students across your campus.
              </p>

              {/* Primary & Secondary CTAs from prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/resources"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/upload"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-card text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-dark-border shadow-xs transition-all hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Share Your Notes</span>
                </Link>

                <Link
                  to="/ai-assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI PDF Assistant</span>
                </Link>
              </div>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-lg mx-auto lg:mx-0">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes, topics, or subjects (e.g. Operating Systems)..."
                    className="w-full pl-11 pr-24 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Illustration + Floating Statistics Cards */}
            <div className="lg:col-span-5 relative">
              {/* Main Illustration Container */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Showcase Card (Linear/Notion style) */}
                <div className="rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-2xl p-6 relative z-10 space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-400 ml-2">StudyHub Preview</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                      Syllabus 2026
                    </span>
                  </div>

                  {/* Resource Snippet */}
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-violet-900 text-white space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-200">
                      <span>Computer Science • Sem 5</span>
                      <span className="font-bold flex items-center gap-1 text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.9 (128 reviews)
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight text-white">
                      Operating Systems Unit 3 – Deadlocks & Banker's Algorithm
                    </h3>
                    <p className="text-xs text-indigo-100 line-clamp-2">
                      Complete handwritten notes covering 4 Coffman conditions, Resource Allocation Graphs, and Deadlock Recovery.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-cyan-200 font-semibold">PDF • 4 Pages • 1.2k Downloads</span>
                      <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[11px] font-bold">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* AI Copilot page citation simulation */}
                  <div className="p-3.5 rounded-xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-violet-800 dark:text-violet-300">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      <span>AI Answer with Page Citations</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      "Deadlock occurs when mutual exclusion, hold & wait, no preemption, and circular wait hold simultaneously <span className="font-bold text-indigo-600 dark:text-indigo-400">[Page 1]</span>."
                    </p>
                  </div>
                </div>

                {/* Floating Statistics Card 1: 10K+ Study Resources (Required by prompt) */}
                <div className="absolute -top-6 -left-6 sm:-left-8 bg-white dark:bg-dark-surface p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xl z-20 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                      10K+
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Study Resources
                    </p>
                  </div>
                </div>

                {/* Floating Statistics Card 2: 5K+ Students (Required by prompt) */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white dark:bg-dark-surface p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xl z-20 flex items-center gap-3 animate-bounce [animation-duration:5s]">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                      5K+
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Active Students
                    </p>
                  </div>
                </div>

                {/* Floating Statistics Card 3: 20+ Subjects (Required by prompt) */}
                <div className="absolute -bottom-8 -right-4 sm:-right-6 bg-white dark:bg-dark-surface p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xl z-20 flex items-center gap-3 animate-bounce [animation-duration:4.5s]">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                      20+
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Core Subjects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section (Required by prompt: Computer Science, IT, AI, Data Science, Electronics, Mathematics, Physics, Engineering) */}
      <section className="py-16 sm:py-20 bg-white dark:bg-dark-surface border-y border-slate-200/80 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Curriculum Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Popular Categories
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore syllabus-matched study materials, lab records, and question banks.
              </p>
            </div>

            <Link
              to="/subjects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              <span>View All 20+ Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 8 Categories Grid with Icon, Title, Resource count & Hover effect */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {POPULAR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/resources?department=${encodeURIComponent(cat.query)}`}
                  className="group relative bg-[#F8FAFC] dark:bg-dark-card p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-dark-border hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-4 ${cat.lightBg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{cat.count}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Resources Section (Required by prompt: thumbnail, title, subject/sem, uploaded by, downloads, rating, bookmark, download button) */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
                <span>Highest Rated This Semester</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Trending Resources
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Peer-reviewed notes, exam solutions, and lab records downloaded by students this week.
              </p>
            </div>

            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-2xs"
            >
              <span>Explore All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Resource Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border animate-pulse"
                />
              ))}
            </div>
          ) : featuredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((res) => (
                <ResourceCard
                  key={res._id}
                  resource={res}
                  isBookmarked={user?.bookmarks?.includes(res._id)}
                  onToggleBookmark={handleToggleBookmark}
                  onDownload={handleDownload}
                  onPreview={(r) => setSelectedPreview(r)}
                  onOpenAiSummary={(id) => setAiModalResourceId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No resources available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section (Required by prompt: 3 simple steps: 1. Discover, 2. Share, 3. Learn and grow together) */}
      <section className="py-16 sm:py-20 bg-white dark:bg-dark-surface border-t border-slate-200/80 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
              How StudyHub Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Transforming individual notebook pages into a collaborative campus intelligence network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative bg-[#F8FAFC] dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Discover academic resources
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Filter by department, semester, subject, and category. Find verified handwritten notes, solved previous exam papers, and lab manuals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[#F8FAFC] dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-violet-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Share your own notes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Upload your scanned PDF summaries, solved assignments, and lab records. Help your peers ace exams while earning campus reputation points.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[#F8FAFC] dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-cyan-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Learn and grow together
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Use the AI study assistant to generate chapter summaries, 3D flip flashcards, and exam practice quizzes with exact page citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Copilot Feature Showcase Banner */}
      <section className="py-14 bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Integrated AI Study Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Upload any PDF. Ask questions. Generate flashcards.
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
                StudyHub's Dual-Engine AI reads your notes and provides page-cited answers, concept breakdowns, revision sheets, and practice MCQs in seconds.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/ai-assistant"
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Assistant</span>
              </Link>
              <Link
                to="/resources"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Browse Sample Notes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modals for PDF Preview and AI Summary */}
      {selectedPreview && (
        <PdfViewerModal resource={selectedPreview} onClose={() => setSelectedPreview(null)} />
      )}

      {aiModalResourceId && (
        <AiSummaryModal
          resourceId={aiModalResourceId}
          onClose={() => setAiModalResourceId(null)}
        />
      )}
    </div>
  );
}
