import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Download,
  Eye,
  Star,
  Sparkles,
  FileText,
  FileCheck,
  FolderOpen,
  Code,
  Video,
  Presentation,
  BookMarked,
  User,
  ExternalLink,
} from 'lucide-react';

const categoryIcons = {
  'Handwritten Notes': FileText,
  'Previous Year Papers': FileCheck,
  'Lab Manuals': FolderOpen,
  'PPT Slides': Presentation,
  'Syllabus & Reference': BookMarked,
  'Tutorials & Code': Code,
  'Video Lectures': Video,
};

const categoryBadgeColors = {
  'Handwritten Notes': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Previous Year Papers': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Lab Manuals': 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  'PPT Slides': 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Syllabus & Reference': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'Tutorials & Code': 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'Video Lectures': 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

// Department color themes for thumbnail preview banners
const deptGradients = {
  'Computer Science & Engineering': 'from-indigo-600 via-indigo-700 to-violet-800',
  'Information Technology': 'from-cyan-600 via-blue-700 to-indigo-800',
  'Artificial Intelligence & Data Science': 'from-violet-600 via-purple-700 to-indigo-900',
  'Electronics & Communication': 'from-emerald-600 via-teal-700 to-cyan-900',
  'Mechanical Engineering': 'from-amber-600 via-orange-700 to-rose-900',
  'Civil Engineering': 'from-teal-600 via-emerald-700 to-slate-900',
};

export default function ResourceCard({
  resource,
  isBookmarked,
  onToggleBookmark,
  onDownload,
  onPreview,
  onOpenAiSummary,
}) {
  const Icon = categoryIcons[resource.category] || FileText;
  const badgeClass =
    categoryBadgeColors[resource.category] ||
    'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const gradientBg =
    deptGradients[resource.department] || 'from-indigo-600 via-violet-700 to-indigo-900';

  const uploaderName = resource.uploadedBy?.name || resource.uploadedBy || 'Campus Scholar';
  const uploaderInitial = uploaderName.charAt(0).toUpperCase();

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      <div>
        {/* PDF Preview Thumbnail Header */}
        <div
          className={`relative h-28 w-full bg-gradient-to-tr ${gradientBg} p-4 flex flex-col justify-between overflow-hidden cursor-pointer`}
          onClick={() => onPreview && onPreview(resource)}
        >
          {/* Subtle watermark / pattern */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-3 top-3 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300 text-white">
            <Icon className="w-16 h-16" />
          </div>

          {/* Top badges on banner */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase border border-white/20">
              PDF • {resource.fileSize ? `${Math.round(resource.fileSize / 1024)} KB` : 'Verified'}
            </span>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              {onOpenAiSummary && (
                <button
                  onClick={() => onOpenAiSummary(resource._id)}
                  className="p-1.5 rounded-lg bg-black/30 backdrop-blur-md text-cyan-200 hover:text-white hover:bg-black/50 transition-colors border border-white/20"
                  title="Ask AI Summary"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onToggleBookmark && onToggleBookmark(resource._id)}
                className="p-1.5 rounded-lg bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors border border-white/20"
                title={isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Bottom department & semester on banner */}
          <div className="relative z-10">
            <p className="text-[11px] font-semibold text-white/90 truncate">
              {resource.department || 'Engineering'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Category & Semester */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span className="truncate">{resource.category}</span>
            </span>

            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              Sem {resource.semester}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/resources/${resource._id}`}
            className="block font-bold text-slate-800 dark:text-slate-100 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            {resource.title}
          </Link>

          {/* Subject */}
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 truncate">
            Subject: <span className="text-slate-700 dark:text-slate-300">{resource.subject}</span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {resource.description || 'Verified course materials, lecture summaries, and solved practice questions.'}
          </p>

          {/* Uploaded By */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-dark-border">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-[10px] flex items-center justify-center">
              {uploaderInitial}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              By <strong className="text-slate-700 dark:text-slate-300 font-medium">{uploaderName}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/80 dark:bg-dark-card/50 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{resource.rating ? Number(resource.rating).toFixed(1) : '5.0'}</span>
          </div>
          <div className="flex items-center space-x-1" title="Total Downloads">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.downloads || 0}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPreview && onPreview(resource)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-100 dark:hover:bg-dark-card transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onDownload && onDownload(resource)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all hover:scale-105"
            title="Download Notes"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
