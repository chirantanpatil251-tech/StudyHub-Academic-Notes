import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Bookmark,
  Share2,
  Sparkles,
  AlertTriangle,
  Star,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
  User,
  ExternalLink,
  ArrowLeft,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { downloadResourceFile } from '../utils/downloadHelper';
import StarRating from '../components/StarRating';
import ReportModal from '../components/ReportModal';
import AiSummaryModal from '../components/AiSummaryModal';
import { useAuth } from '../context/AuthContext';

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleBookmarkInState } = useAuth();

  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Discussion comment state
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resources/${id}`);
      setResource(res.data.resource);
      setReviews(res.data.reviews || []);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Error fetching resource details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resource) return;
    downloadResourceFile(resource);
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/resources/${resource._id}/bookmark`);
      toggleBookmarkInState(resource._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.post(`/resources/${id}/reviews`, {
        rating: ratingInput,
        comment: reviewComment.trim(),
      });
      setReviews([res.data.review, ...reviews]);
      setResource({
        ...resource,
        rating: res.data.averageRating,
        totalRatings: (resource.totalRatings || 0) + 1,
      });
      setReviewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentInput.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/comments/${id}`, {
        content: commentInput.trim(),
      });
      setComments([res.data, ...comments]);
      setCommentInput('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting discussion comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Resource Not Found</h2>
        <Link to="/resources" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          Return to resource catalog
        </Link>
      </div>
    );
  }

  const isBookmarked = user?.bookmarks?.some(
    (b) => (b?._id || b).toString() === resource._id.toString()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Resources</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              {/* Category & Semester Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {resource.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300">
                  Sem {resource.semester}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300">
                  {resource.department}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
                {resource.title}
              </h1>

              {/* Subject & Uploader */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Subject: {resource.subject}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Uploaded by {resource.uploaderName || 'Faculty / Peer'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link
                to={`/ai-assistant?resourceId=${resource._id}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Study with AI Suite</span>
              </Link>

              <button
                onClick={() => setAiModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Quick Summary</span>
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`p-2.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 text-indigo-600'
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-50'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="p-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                title="Report issue"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content & Side Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Column (2 cols): Document Viewer & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Embedded Document Previewer */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-dark-card border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Document Preview ({resource.fileType?.toUpperCase()})
                </span>
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Fullscreen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="h-[520px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                {resource.fileType === 'pdf' ? (
                  <iframe
                    src={`${resource.fileUrl}#toolbar=1&navpanes=0`}
                    title={resource.title}
                    className="w-full h-full border-none"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      {resource.originalFileName || 'Academic Resource File'}
                    </p>
                    <button
                      onClick={handleDownload}
                      className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-sm"
                    >
                      Download to View
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                About this Study Material
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                {resource.description || 'Comprehensive verified classroom notes and solved examination materials.'}
              </p>

              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews and Ratings Section */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-dark-border mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Student Reviews & Ratings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Feedback from peers who downloaded this note
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {resource.rating ? Number(resource.rating).toFixed(1) : '5.0'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    ({resource.totalRatings || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Add Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="mb-8 p-5 bg-slate-50/80 dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  Leave a Review
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Your Rating:</span>
                  <StarRating
                    rating={ratingInput}
                    onRatingChange={(val) => setRatingInput(val)}
                    readOnly={false}
                    size={22}
                  />
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={2}
                  required
                  placeholder="Share how helpful this resource was for your exams or lab assignments..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No reviews yet. Be the first to rate this resource!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 bg-slate-50/50 dark:bg-dark-card rounded-2xl border border-slate-100/90 dark:border-dark-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rev.userName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={rev.rating} readOnly={true} size={14} />
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discussion Comments Thread */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-dark-border mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <span>Peer Discussion & Questions</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask doubts, request page clarifications, or share tips
                  </p>
                </div>
              </div>

              <form onSubmit={handleCommentSubmit} className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Ask a question about this topic or say thanks..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
                >
                  {submittingComment ? '...' : 'Ask'}
                </button>
              </form>

              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No discussion comments yet. Start a discussion above!
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((cm) => (
                    <div
                      key={cm._id}
                      className="p-3 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {cm.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {cm.userName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(cm.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {cm.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: File specs & Uploader Card */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Resource Details
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-500 dark:text-slate-400">File Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {resource.fileType}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-500 dark:text-slate-400">File Size</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {resource.fileSize ? `${Math.round(resource.fileSize / 1024)} KB` : 'Verified'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-500 dark:text-slate-400">Downloads</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {resource.downloads || 0} times
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-dark-border">
                  <span className="text-slate-500 dark:text-slate-400">Total Views</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {resource.views || 0}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary Banner Shortcut */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 rounded-3xl p-6 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Need Fast Exam Revision?</h4>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Let StudyHub AI synthesize the core exam takeaways and difficulty breakdown for this document.
              </p>
              <button
                onClick={() => setAiModalOpen(true)}
                className="w-full py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Generate AI Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        resource={resource}
      />

      <AiSummaryModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        resourceId={resource._id}
      />
    </div>
  );
}
