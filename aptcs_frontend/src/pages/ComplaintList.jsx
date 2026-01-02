import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, X, Lock } from 'lucide-react';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', is_anonymous: false });
    const { authTokens, user } = useAuth();

    useEffect(() => {
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Complaints & Suggestions</h1>
                    {user && user.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            File Complaint
                        </button>
                    )}
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {complaints.length === 0 ? (
                            <li className="px-4 py-4 text-center text-gray-500">No complaints found.</li>
                        ) : (
                            complaints.map((complaint) => (
                                <li key={complaint.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {complaint.is_anonymous && <Lock className="h-4 w-4 text-gray-400 mr-2" />}
                                                <p className="text-sm font-medium text-gray-900 truncate">{complaint.subject}</p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                        complaint.status === 'dismissed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>{complaint.description}</p>
                                            <p className="mt-2 text-xs text-gray-400">
                                                Submitted by: {complaint.student_name} on {new Date(complaint.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-red-600">File a Complaint</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="anonymous"
                                        type="checkbox"
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        checked={formData.is_anonymous}
                                        onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                                    />
                                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                                        Submit Anonymously
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors shadow-lg"
                                >
                                    Submit Complaint
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintList;
