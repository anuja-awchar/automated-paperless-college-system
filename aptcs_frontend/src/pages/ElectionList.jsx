import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, ChevronRight, BarChart2, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ElectionList = () => {
    const [elections, setElections] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createData, setCreateData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
    });
    const { authTokens, user } = useAuth();

    const fetchElections = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/election/elections/`, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            setElections(response.data);
        } catch (error) {
            console.error("Error fetching elections:", error);
            toast.error('Failed to load elections.');
        }
    };

    useEffect(() => {
        if (authTokens) {
            fetchElections();
        }
    }, [authTokens]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/election/elections/`, createData, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            toast.success('Election created successfully.');
            setIsCreateOpen(false);
            setCreateData({
                title: '',
                description: '',
                start_date: '',
                end_date: '',
                is_active: true,
            });
            fetchElections();
        } catch (error) {
            console.error('Error creating election:', error);
            toast.error('Failed to create election.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900/80 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 animate-fade-in-up">
                            Active Elections
                        </h1>
                        <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Participate in democracy using the secure digital voting system.
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Election
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {elections.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">No active elections found.</p>
                            <p className="text-gray-400 text-sm mt-2">Check back later for new voting sessions.</p>
                        </div>
                    ) : (
                        elections.map((election, index) => (
                            <div
                                key={election.id}
                                className="group relative bg-white shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            {election.is_open ? (
                                                <span className="animate-pulse px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                                                    Live
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                                                    Ended
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 font-medium flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" /> {new Date(election.start_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{election.title}</h3>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{election.description}</p>
                                    </div>

                                    <div className="flex items-center space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
                                        {election.is_voted ? (
                                            <span className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-green-50 text-green-700 border border-green-100 shadow-sm">
                                                Voted <span className="ml-1.5 text-lg">✓</span>
                                            </span>
                                        ) : election.is_open ? (
                                            <Link to={`/election/${election.id}`} className="flex-1 sm:flex-none justify-center inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                                                Vote Now <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <Link to={`/election/${election.id}/results`} className="flex-1 sm:flex-none justify-center inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-300 transition-all shadow-sm hover:shadow">
                                                View Results <BarChart2 className="ml-2 h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                                        Voting ends {new Date(election.end_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center group-hover:text-indigo-600 transition-colors">
                                        Detailed Overview <ChevronRight className="w-3 h-3 ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {user?.role === 'admin' && isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Election</h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={createData.title}
                                    onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={createData.description}
                                    onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={createData.start_date}
                                        onChange={(e) => setCreateData({ ...createData, start_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={createData.end_date}
                                        onChange={(e) => setCreateData({ ...createData, end_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={createData.is_active}
                                    onChange={(e) => setCreateData({ ...createData, is_active: e.target.checked })}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">
                                    Active
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Election'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElectionList;
