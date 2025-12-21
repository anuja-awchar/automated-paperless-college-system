import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, X } from 'lucide-react';

const LeaveList = () => {
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ reason: '', start_date: '', end_date: '' });
    const { authTokens, user } = useAuth();

    useEffect(() => {
        fetchLeaves();
    }, [authTokens]);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/leave/requests/', {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            setLeaves(response.data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/leave/requests/', formData, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            alert('Leave request submitted!');
            setShowModal(false);
            setFormData({ reason: '', start_date: '', end_date: '' });
            fetchLeaves();
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit leave request.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Leave Applications</h1>
                    {user && user.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Apply for Leave
                        </button>
                    )}
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {leaves.length === 0 ? (
                            <li className="px-4 py-4 text-center text-gray-500">No leave requests found.</li>
                        ) : (
                            leaves.map((leave) => (
                                <li key={leave.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{leave.student_name} - {leave.reason}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
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
                            <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
                                >
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveList;
