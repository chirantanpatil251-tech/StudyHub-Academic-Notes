import React, { useState } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import api from '../services/api';

export default function ReportModal({ isOpen, onClose, resource }) {
  const [reason, setReason] = useState('Incorrect Subject or Content');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/admin/report', {
        resourceId: resource._id,
        resourceTitle: resource.title,
        reason,
        details,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-800">Report Resource</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-emerald-600 space-y-2">
            <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-slate-800">Report Submitted</p>
            <p className="text-xs text-slate-500">Thank you. The moderation team will review this resource shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-slate-500">
              Reporting: <span className="font-medium text-slate-700">{resource.title}</span>
            </p>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Incorrect Subject or Content">Incorrect Subject or Content</option>
                <option value="Inappropriate or Offensive Material">Inappropriate or Offensive Material</option>
                <option value="Broken File / Corrupted Download">Broken File / Corrupted Download</option>
                <option value="Copyright / Duplicate Resource">Copyright / Duplicate Resource</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe the issue you encountered..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
