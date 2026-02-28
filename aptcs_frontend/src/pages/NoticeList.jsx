import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Bell, Calendar, User, Flag, Search, X } from 'lucide-react';

const NoticeList = () => {
    const { authTokens, user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        priority: 'medium',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notices/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });
            setNotices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notices:', error);
            toast.error('Failed to load notices.');
            setLoading(false);
        }
    };

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/notices/`, newNotice, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });
            toast.success('Notice posted successfully!');
            setIsModalOpen(false);
            setNewNotice({ title: '', content: '', priority: 'medium' });
            fetchNotices();
        } catch (error) {
            console.error('Error creating notice:', error);
            toast.error('Failed to post notice.');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || notice.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const isAuthorized = user?.role === 'admin' || user?.role === 'faculty';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Bell className="w-8 h-8 text-indigo-500" />
                        Notice Board
                    </h1>
                    <p className="text-slate-400 mt-1">Stay updated with the latest announcements and news.</p>
                </div>
                {isAuthorized && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Post Notice
                    </button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotices.map((notice) => (
                    <div key={notice.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-xl group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                                    {notice.priority.toUpperCase()}
                                </span>
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(notice.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                {notice.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-4">
                                {notice.content}
                            </p>
                            <div className="flex items-center gap-2 text-slate-500 text-xs border-t border-slate-700 pt-4 mt-auto">
                                <User className="w-4 h-4" />
                                <span>Posted by {notice.posted_by_name || 'Admin'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredNotices.length === 0 && (
                <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                    <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No notices found</h3>
                    <p className="text-slate-400">There are no notices to display at the moment.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl animate-fadeIn">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Post New Notice</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Notice Title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                <select
                                    value={newNotice.priority}
                                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                                <textarea
                                    required
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                                    placeholder="Write your notice content here..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                                >
                                    Post Notice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeList;
