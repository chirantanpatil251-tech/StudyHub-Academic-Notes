import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const departmentsList = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Basic Sciences & Humanities',
];

const categoriesList = [
  'Handwritten Notes',
  'Previous Year Papers',
  'Lab Manuals',
  'PPT Slides',
  'Syllabus & Reference',
  'Tutorials & Code',
  'Video Lectures',
];

export default function UploadResource() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || 5,
    subject: searchParams.get('subject') || '',
    subjectCode: '',
    category: 'Handwritten Notes',
    description: '',
    externalLink: '',
    tags: '',
  });

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sub = searchParams.get('subject');
    if (sub) {
      setFormData((prev) => ({ ...prev, subject: sub, title: `${sub} - Handwritten Study Notes` }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (uploadType === 'file' && !file) {
      setError('Please select or drag a document file to upload');
      return;
    }

    if (uploadType === 'link' && !formData.externalLink.trim()) {
      setError('Please enter a valid external link (URL)');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('department', formData.department);
      data.append('semester', formData.semester);
      data.append('subject', formData.subject);
      data.append('subjectCode', formData.subjectCode);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('tags', formData.tags);

      if (uploadType === 'file' && file) {
        data.append('file', file);
      } else {
        data.append('externalLink', formData.externalLink);
      }

      await api.post('/resources', data);

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 px-6 sm:px-8 py-6 text-white">
            <h1 className="text-2xl font-bold tracking-tight">Upload Study Material</h1>
            <p className="text-xs text-indigo-200 mt-1">
              Share handwritten notes, solved papers, and lab manuals to help fellow students.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="py-12 text-center text-emerald-600 dark:text-emerald-400 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Resource Uploaded Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your academic notes have been indexed and are now live for peer discovery.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Format Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Resource Source
                  </label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-dark-card p-1 border border-slate-200 dark:border-dark-border">
                    <button
                      type="button"
                      onClick={() => setUploadType('file')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        uploadType === 'file'
                          ? 'bg-white dark:bg-dark-surface text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Document (PDF, Image, Doc)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('link')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        uploadType === 'link'
                          ? 'bg-white dark:bg-dark-surface text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>External Link / Drive / GitHub</span>
                    </button>
                  </div>
                </div>

                {/* File Dropzone or External URL */}
                {uploadType === 'file' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Document File (Max 25MB)
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        dragActive
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : file
                          ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-slate-300 dark:border-dark-border hover:border-slate-400 bg-slate-50/50 dark:bg-dark-card/50'
                      }`}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{file.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pointer-events-none">
                          <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto" />
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Drag & drop your PDF, slides, or scanned notes here
                          </p>
                          <p className="text-xs text-slate-400">
                            or browse from your computer (PDF, PNG, JPG, PPT)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      External Learning Link (Google Drive, GitHub, Notion, YouTube)
                    </label>
                    <input
                      type="url"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... or https://github.com/..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Complete Trees & Graphs Handwritten Notes with Solved PYQs"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 dark:text-dark-text"
                  />
                </div>

                {/* Subject & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Data Structures & Algorithms"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Subject Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleChange}
                      placeholder="e.g. CS201"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                    />
                  </div>
                </div>

                {/* Department & Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-dark-text"
                    >
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Semester *
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-dark-text"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Resource Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-dark-text"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Description & Overview
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mention specific chapters covered, professor references, or solved problem types..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-800 dark:text-dark-text"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Search Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. Trees, Graphs, Midterm, Solved"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-end space-x-3">
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card rounded-xl transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Publish Resource</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
