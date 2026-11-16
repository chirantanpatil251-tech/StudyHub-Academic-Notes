import React from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';

export default function PdfViewerModal({ isOpen, onClose, resource, onDownload }) {
  if (!isOpen || !resource) return null;

  const isExternal = resource.fileUrl && resource.fileUrl.startsWith('http');
  const fileUrl = resource.fileUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50 dark:bg-dark-card">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-semibold text-slate-800 dark:text-white text-base truncate">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {resource.subject} • {resource.category} • {resource.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onDownload(resource)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-surface rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-dark-bg relative overflow-hidden flex flex-col items-center justify-center">
          {resource.fileType === 'pdf' ? (
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0`}
              title={resource.title}
              className="w-full h-full border-none"
            />
          ) : resource.fileType === 'png' || resource.fileType === 'jpg' || resource.fileType === 'jpeg' ? (
            <div className="p-6 overflow-auto max-h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt={resource.title}
                className="max-h-[70vh] max-w-full rounded-lg shadow-md object-contain"
              />
            </div>
          ) : (
            <div className="p-8 text-center max-w-md">
              <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                Document Preview
              </h4>
              <p className="text-sm text-slate-600 mb-6">
                This {resource.fileType?.toUpperCase()} document can be downloaded and opened with your favorite desktop viewer or office suite.
              </p>
              <button
                onClick={() => onDownload(resource)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {resource.originalFileName || 'File'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
