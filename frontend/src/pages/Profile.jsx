import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Edit3,
  CheckCircle,
  FileText,
  Download,
  Star,
  Trash2,
  Eye,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'settings'
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || 5,
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUploads();
  }, [user]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources/user/uploads');
      setMyUploads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await api.put('/auth/profile', editData);
      updateUser(res.data);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUpload = async (id) => {
    if (!window.confirm('Delete this uploaded resource permanently?')) return;
    try {
      await api.delete(`/resources/${id}`);
      setMyUploads(myUploads.filter((u) => u._id !== id));
    } catch (err) {
      alert('Could not delete resource');
    }
  };

  const totalDownloads = myUploads.reduce((acc, item) => acc + (item.downloads || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Banner */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800" />
          <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-dark-surface shadow-md overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {user?.department}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    Semester {user?.semester}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                      Faculty Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border">
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 block">
                  {myUploads.length}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Uploads</span>
              </div>
              <div className="text-center px-4 py-2 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border">
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  {totalDownloads}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Downloads</span>
              </div>
              <div className="text-center px-4 py-2 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border">
                <span className="text-base font-extrabold text-amber-500 block">
                  {user?.bookmarks?.length || 0}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-dark-border pb-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            My Uploaded Notes ({myUploads.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-card'
            }`}
          >
            Edit Profile & Academic Info
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'notes' ? (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Uploaded Study Materials
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 dark:bg-dark-card rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : myUploads.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                You haven't uploaded any study materials yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-border">
                {myUploads.map((item) => (
                  <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        {item.category}
                      </span>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm mt-1 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{item.subject}</span>
                        <span>•</span>
                        <span>{item.downloads} downloads</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.rating || '5.0'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteUpload(item._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200/90 dark:border-dark-border shadow-xs p-6 sm:p-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Academic & Profile Details
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Bio / Academic Focus
                </label>
                <textarea
                  rows={2}
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="e.g. 3rd Year CSE student specializing in Systems and AI"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-800 dark:text-dark-text"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engg</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Current Semester
                  </label>
                  <select
                    value={editData.semester}
                    onChange={(e) =>
                      setEditData({ ...editData, semester: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-dark-text"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
