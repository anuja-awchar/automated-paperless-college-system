import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, X, Lock, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', is_anonymous: false });
    const { authTokens, user } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        fetchComplaints();
    }, [authTokens]);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/complaint/complaints/', {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            setComplaints(response.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/complaint/complaints/', formData, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            alert('Complaint submitted successfully!');
            setShowModal(false);
            setFormData({ subject: '', description: '', is_anonymous: false });
            fetchComplaints();
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit complaint.");
        }
    };

    return (
        <div className={`p-8 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Complaints & Suggestions</h1>
                        <p className="text-slate-400">Share your feedback or report issues to help us improve.</p>
                    </div>
                    {user && user.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-red-500/30 transition-all transform hover:scale-105"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            File Complaint
                        </button>
                    )}
                </div>

                <div className="grid gap-6">
                    {complaints.length === 0 ? (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No complaints yet</h3>
                            <p className="text-slate-400">Have an issue? File a complaint using the button above.</p>
                        </div>
                    ) : (
                        complaints.map((complaint, index) => (
                            <div
                                key={complaint.id}
                                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {complaint.is_anonymous && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                                                    <Lock className="w-3 h-3 mr-1" /> Anonymous
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-500">
                                                {new Date(complaint.created_at).toLocaleDateString(undefined, {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{complaint.subject}</h3>
                                        <p className="text-slate-300 leading-relaxed mb-4">{complaint.description}</p>

                                        {!complaint.is_anonymous && (
                                            <div className="flex items-center text-sm text-slate-500 mt-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold mr-2">
                                                    {complaint.student_name ? complaint.student_name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                {complaint.student_name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border ${complaint.status === 'resolved'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : complaint.status === 'dismissed'
                                                    ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {complaint.status === 'resolved' && <CheckCircle className="w-4 h-4 mr-1.5" />}
                                            {complaint.status === 'pending' && <Clock className="w-4 h-4 mr-1.5" />}
                                            {complaint.status === 'dismissed' && <X className="w-4 h-4 mr-1.5" />}
                                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
                                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-700">
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-8">
                                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                                        <span className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mr-3">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </span>
                                        File a Complaint
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                placeholder="Brief summary of the issue"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                            <textarea
                                                required
                                                rows="4"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                placeholder="Please provide specific details..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                                            <input
                                                id="anonymous"
                                                type="checkbox"
                                                className="h-5 w-5 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-700/50"
                                                checked={formData.is_anonymous}
                                                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                                            />
                                            <label htmlFor="anonymous" className="ml-3 block text-sm font-medium text-slate-300">
                                                Submit Anonymously
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-[1.02] shadow-lg shadow-red-500/25"
                                        >
                                            Submit Complaint
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintList;
