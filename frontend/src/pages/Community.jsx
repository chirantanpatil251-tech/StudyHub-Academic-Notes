import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Award,
  TrendingUp,
  ThumbsUp,
  Share2,
  Send,
  PlusCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    dept: 'Computer Science',
    semester: 5,
    timestamp: '2 hours ago',
    title: 'Important Deadlock and Banker\'s Algorithm question for End-Sem Exam!',
    content:
      'Hey everyone! I just solved the 2024 End-Sem Question on Banker\'s Safety algorithm with 5 processes and 3 resource types (A:10, B:5, C:7). Has anyone noticed how professors always twist the Request algorithm in sub-question (b)? Make sure to practice request verification steps!',
    tags: ['Operating Systems', 'EndSem 2024', 'Deadlocks'],
    likes: 24,
    comments: 7,
    solved: true,
  },
  {
    id: 2,
    author: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    dept: 'Information Technology',
    semester: 4,
    timestamp: '4 hours ago',
    title: 'Resource Request: Need verified BCNF decomposition examples with 4 attributes',
    content:
      'Struggling with 3NF vs BCNF dependency preservation during lossless join decomposition. Does anyone have handwritten notes explaining functional dependency closures with solved textbook exercises?',
    tags: ['DBMS', 'Normalization', 'Request'],
    likes: 18,
    comments: 5,
    solved: false,
  },
  {
    id: 3,
    author: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    dept: 'AI & Data Science',
    semester: 6,
    timestamp: '1 day ago',
    title: 'Uploaded: Complete PyTorch Neural Network Cheatsheet + Lab Code',
    content:
      'Just uploaded a clean 6-page summary of Convolutional Neural Networks, Backpropagation equations, and custom loss functions with comments. Check out the resources section or ask the AI assistant to summarize it!',
    tags: ['Deep Learning', 'PyTorch', 'Notes Uploaded'],
    likes: 49,
    comments: 12,
    solved: true,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Ananya Verma', dept: 'CSE Sem 6', points: 3450, uploads: 28, badge: 'Campus Guru 🏆' },
  { rank: 2, name: 'Rohan Deshmukh', dept: 'AI&DS Sem 6', points: 2980, uploads: 21, badge: 'Resource Champ 🥈' },
  { rank: 3, name: 'Aarav Sharma', dept: 'CSE Sem 5', points: 2640, uploads: 19, badge: 'Rising Scholar 🥉' },
  { rank: 4, name: 'Sneha Rao', dept: 'ECE Sem 4', points: 1920, uploads: 14, badge: 'Top Contributor' },
  { rank: 5, name: 'Vikram Joshi', dept: 'IT Sem 5', points: 1750, uploads: 11, badge: 'Note Master' },
];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [likedPosts, setLikedPosts] = useState({});

  const handleLike = (id) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = likedPosts[id];
          return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: user ? user.name : 'Student Peer',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      dept: user?.department || 'Engineering',
      semester: user?.semester || 5,
      timestamp: 'Just now',
      title: newTitle,
      content: newContent,
      tags: newTag ? newTag.split(',').map((t) => t.trim()) : ['Discussion'],
      likes: 1,
      comments: 0,
      solved: false,
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTag('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-800 to-indigo-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-violet-200">
              <Users className="w-4 h-4 text-cyan-300" />
              <span>Campus Study Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              StudyHub Student Community
            </h1>
            <p className="text-violet-100 text-sm sm:text-base leading-relaxed">
              Connect with classmates, share exam tips, request missing notes, and collaborate with top academic contributors from your college.
            </p>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Box */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Ask a Question or Request Study Material</span>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-3">
                <input
                  type="text"
                  placeholder="Post title (e.g., Need Unit 3 CN Question Paper solutions)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                />
                <textarea
                  rows={3}
                  placeholder="Describe your question, topic, or material request in detail..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium resize-none"
                />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="Tags (e.g. Operating Systems, Exam 2025)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-xs text-slate-700 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post to Community</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50 dark:ring-indigo-900/50"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {post.author}
                          </h4>
                          {post.solved && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Solved
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {post.dept} • Sem {post.semester} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 text-[11px] font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                          likedPosts[post.id]
                            ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/50'
                            : 'hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-dark-card'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes} Helpful</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-dark-card transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments} Answers</span>
                      </button>
                    </div>

                    <Link
                      to="/resources"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Find Related Notes</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campus Leaderboard */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Top Campus Contributors
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  This Month
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {LEADERBOARD.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-dark-border text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          item.rank === 1
                            ? 'bg-amber-100 text-amber-700'
                            : item.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : item.rank === 3
                            ? 'bg-amber-50 text-amber-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {item.points} pts
                      </span>
                      <p className="text-[10px] text-slate-400">{item.uploads} notes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Study Rules / Guidelines */}
            <div className="bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Community Guidelines</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li>Upload original handwritten or faculty-approved study notes.</li>
                <li>Cite accurate department, semester, and unit details.</li>
                <li>Use clear titles so fellow classmates find materials easily.</li>
                <li>Earn up to 50 reputation points per verified resource!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
