import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Download,
  Check,
  X,
  Trash2,
  Eye,
  Search,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PdfViewerModal from '../components/PdfViewerModal';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'resources' | 'users' | 'reports'
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, resRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/resources'),
        api.get('/admin/users'),
        api.get('/admin/reports'),
      ]);
      setStats(statsRes.data);
      setResources(resRes.data);
      setUsersList(usersRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (resourceId, newStatus) => {
    try {
      await api.put(`/admin/resources/${resourceId}/status`, { status: newStatus });
      setResources(
        resources.map((r) => (r._id === resourceId ? { ...r, status: newStatus } : r))
      );
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to update resource status');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource permanently?')) return;
    try {
      await api.delete(`/resources/${resourceId}`);
      setResources(resources.filter((r) => r._id !== resourceId));
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { status });
      setReports(reports.map((rp) => (rp._id === reportId ? { ...rp, status } : rp)));
    } catch (err) {
      alert('Failed to update report');
    }
  };

  const pendingList = resources.filter((r) => r.status === 'pending');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 uppercase tracking-wider">
                Platform Moderator
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">StudyHub Admin Control Panel</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Review submissions, manage verified academic content, and review flagged material.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Total Students
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalStudents || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Pending Approvals
              </p>
              <h3 className="text-2xl font-black text-amber-500">{pendingList.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Total Resources
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {resources.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Reports Queue
              </p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {stats?.totalReports || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-dark-border pb-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Resources ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Students Directory ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reported Materials ({reports.length})</span>
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'pending' && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Pending Submissions Review Queue
            </h3>

            {pendingList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                All submissions have been reviewed. No pending approvals in queue!
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-border">
                {pendingList.map((item) => (
                  <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Sem {item.semester} • {item.subject} • Uploaded by {item.uploaderName}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setSelectedPreview(item)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-dark-card hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              All Uploaded Study Materials
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Title & Subject</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Downloads</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {resources.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-card/50">
                    <td className="py-3 pr-4 max-w-xs truncate">
                      <span className="font-bold text-slate-800 dark:text-white block truncate">
                        {res.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {res.subject} • Sem {res.semester}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{res.category}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{res.department}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : res.status === 'pending'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{res.downloads || 0}</td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedPreview(res)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Registered Students
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Semester</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-card/50">
                    <td className="py-3 pr-4 font-bold text-slate-800 dark:text-white">{u.name}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{u.department}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">Sem {u.semester}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                            : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Reported Content Moderation
            </h3>
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No reported issues found.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-border">
                {reports.map((rp) => (
                  <div key={rp._id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                          {rp.reason}
                        </span>
                        <span className="text-xs text-slate-400">
                          Reported by {rp.reporterName} • Status: {rp.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                        {rp.resourceTitle || 'Resource'}
                      </h4>
                      {rp.details && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                          "{rp.details}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {rp.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleResolveReport(rp._id, 'resolved')}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleResolveReport(rp._id, 'dismissed')}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-dark-card text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300"
                          >
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {rp.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <PdfViewerModal
        isOpen={!!selectedPreview}
        onClose={() => setSelectedPreview(null)}
        resource={selectedPreview}
        onDownload={() => {}}
      />
    </div>
  );
}
