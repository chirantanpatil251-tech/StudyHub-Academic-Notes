import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Code2,
  Database,
  Server,
  Layers,
  ArrowRight,
  Heart,
  Award,
  Compass,
} from 'lucide-react';

export default function About() {
  const TECH_STACK = [
    { name: 'React.js 18', role: 'Frontend UI & Reactive Components', icon: Code2, color: 'text-cyan-500' },
    { name: 'Tailwind CSS', role: 'Utility-First Responsive Styling & Dark Mode', icon: Layers, color: 'text-indigo-500' },
    { name: 'Node.js & Express', role: 'Robust RESTful API & File Streaming Backend', icon: Server, color: 'text-emerald-500' },
    { name: 'MongoDB & Mongoose', role: 'Document Database & User Metadata Persistence', icon: Database, color: 'text-green-500' },
    { name: 'Google Gemini AI', role: 'Generative Study Assistant & Page-Cited Q&A', icon: Sparkles, color: 'text-violet-500' },
    { name: 'JWT & bcrypt', role: 'Role-Based Authentication & Cryptographic Hashing', icon: ShieldCheck, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Empowering Students with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
              Shared Knowledge & AI Intelligence
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            StudyHub was born from a simple campus challenge: high-quality notes, lab manuals, and previous year exam solutions shouldn't be trapped in isolated WhatsApp groups or paper binders.
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-surface p-7 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Centralized Knowledge</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Organized strictly by Department, Semester, and Subject syllabus so you never spend hours hunting for unit-wise notes before finals.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-7 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI-Powered Revision</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload any PDF notes and instantly get executive summaries, key syllabus topics, 3D flip flashcards, practice quizzes, and page-cited answers.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-7 rounded-2xl border border-slate-200 dark:border-dark-border shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Peer Recognition</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Students who contribute notes earn campus reputation points, ratings, and leaderboard rankings, building a helpful community spirit.
            </p>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="bg-white dark:bg-dark-surface p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Engineering Architecture</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Built with industry-standard web technologies following modern full-stack SaaS best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex items-start gap-3.5 hover:border-indigo-300 transition-colors"
                >
                  <div className={`p-2.5 rounded-lg bg-white dark:bg-dark-surface shadow-xs ${tech.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{tech.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {tech.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Ace Your Next Semester?</h2>
          <p className="max-w-xl mx-auto text-indigo-100 text-sm sm:text-base">
            Start browsing thousands of student-reviewed notes or upload your own to help fellow learners.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/resources"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all"
            >
              Explore Study Notes
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white border border-white/20 font-bold text-sm transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
