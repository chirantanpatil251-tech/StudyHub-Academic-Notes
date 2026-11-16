import React from 'react';
import { BookOpen, Heart, Sparkles, Users, GraduationCap, Github, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-400 pt-14 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Study<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Your Academic Knowledge Hub — a modern EdTech ecosystem where university students discover, organize, upload, and collaborate on syllabus notes, lab records, and exam papers with AI-powered study assistance.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Powered by Dual-Engine Gemini AI</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/resources" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Study Notes
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Subject Directory
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-purple-600 dark:text-purple-400">
                  AI PDF Assistant ✨
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Student Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/resources?category=Handwritten+Notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Handwritten Notes
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Previous+Year+Papers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Previous Year Papers (PYQs)
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Lab+Manuals" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Lab Manuals & Code
                </Link>
              </li>
              <li>
                <Link to="/resources?category=PPT+Slides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Lecture Presentations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Upload Resources
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About & Tech Stack
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Demo Student / Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} StudyHub – Academic Knowledge Hub. Full-Stack EdTech Project.</p>
          <p className="flex items-center space-x-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Academic Excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
