import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Key,
  Moon,
  Sun,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { authApi } from '../api/authApi.js';
import { Toast } from '../components/common/Toast.jsx';

const TARGET_ROLES = [
  'Software Development Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Engineer',
  'DevOps / Cloud Engineer',
  'Other',
];

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    targetRole: user?.targetRole || 'Software Development Engineer',
    college: user?.college || '',
    graduationYear: user?.graduationYear || '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateProfile(formData);
      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setToast({ message: 'Profile settings updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Could not update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, target engineering role, and application settings.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Avatar URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Profile Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Engineering Role
            </label>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* College & Grad Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="2025"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Interface Theme
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Current Mode: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</p>
            <p className="text-xs text-slate-400">
              High-contrast developer theme with indigo and cyan accents.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-600 transition-colors flex items-center gap-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-300" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gemini AI Integration Info */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Google Gemini API Configuration
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The backend reads the <code className="text-indigo-400 font-mono">GEMINI_API_KEY</code> from your <code className="text-slate-300 font-mono">server/.env</code> file.
          When an API key is provided, resume analysis and interview simulations use live Google Gemini 1.5. If no key is set, the application operates with intelligent offline rubric evaluation.
        </p>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-400">
          GEMINI_API_KEY=AIzaSy...<br />
          GEMINI_MODEL=gemini-1.5-flash
        </div>
      </div>
    </div>
  );
};
