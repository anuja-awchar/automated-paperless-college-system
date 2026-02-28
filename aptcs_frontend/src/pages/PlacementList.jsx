import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Calendar, ExternalLink, IndianRupee, Building2, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlacementList = () => {
  const { authTokens, user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createData, setCreateData] = useState({
    company_name: '',
    role: '',
    description: '',
    eligibility: '',
    salary: '',
    location: '',
    apply_link: '',
    deadline: '',
  });

  const fetchDrives = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/placement/`, {
        headers: authTokens ? { Authorization: `Bearer ${authTokens.access}` } : {},
      });
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching placement drives:', error);
      toast.error('Failed to load placement drives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [authTokens]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/placement/`, createData, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Placement drive created.');
      setIsCreateOpen(false);
      setCreateData({
        company_name: '',
        role: '',
        description: '',
        eligibility: '',
        salary: '',
        location: '',
        apply_link: '',
        deadline: '',
      });
      fetchDrives();
    } catch (error) {
      console.error('Error creating placement drive:', error);
      toast.error('Failed to create placement drive.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/80 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/80">
                <Briefcase className="w-6 h-6 text-white" />
              </span>
              Placement Drives
            </h1>
            <p className="text-slate-400 mt-2">
              Explore current and upcoming campus recruitment opportunities.
            </p>
          </div>
          {(user?.role === 'admin' || user?.role === 'faculty') && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Drive
            </button>
          )}
        </div>

        {drives.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10 text-center">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No active placement drives</h2>
            <p className="text-slate-400">
              Check back later for new company visits and recruitment opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">
                        {drive.company_name}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{drive.role}</h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Posted on{' '}
                    {drive.created_at
                      ? new Date(drive.created_at).toLocaleDateString()
                      : '—'}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {drive.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <span>{drive.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>
                      Apply before{' '}
                      {drive.deadline
                        ? new Date(drive.deadline).toLocaleString()
                        : '—'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-2">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <span>Eligibility:</span>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                  {drive.eligibility}
                </p>

                {drive.apply_link && (
                  <a
                    href={drive.apply_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors shadow-md shadow-indigo-500/30"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {(user?.role === 'admin' || user?.role === 'faculty') && isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full p-6 relative shadow-2xl">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Post Placement Drive</h2>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={createData.company_name}
                    onChange={(e) => setCreateData({ ...createData, company_name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Role / Position</label>
                  <input
                    type="text"
                    required
                    value={createData.role}
                    onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Salary</label>
                    <input
                      type="text"
                      required
                      value={createData.salary}
                      onChange={(e) => setCreateData({ ...createData, salary: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={createData.location}
                      onChange={(e) => setCreateData({ ...createData, location: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={createData.deadline}
                    onChange={(e) => setCreateData({ ...createData, deadline: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Apply Link</label>
                  <input
                    type="url"
                    value={createData.apply_link}
                    onChange={(e) => setCreateData({ ...createData, apply_link: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Eligibility</label>
                  <textarea
                    rows={3}
                    required
                    value={createData.eligibility}
                    onChange={(e) => setCreateData({ ...createData, eligibility: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={createData.description}
                    onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70"
                >
                  {isSubmitting ? 'Posting...' : 'Post Drive'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementList;
