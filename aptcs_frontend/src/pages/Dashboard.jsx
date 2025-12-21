import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">APTCS</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user && user.username} ({user && user.role})</span>
                            <button onClick={logoutUser} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex-grow p-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-500 transition-colors">
                            <h3 className="text-lg font-semibold mb-2">Election System</h3>
                            <p className="text-gray-600 mb-4">Vote for candidates or view results.</p>
                            <a href="/elections" className="text-indigo-600 hover:text-indigo-800 font-medium">Go to Elections &rarr;</a>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-500 transition-colors">
                            <h3 className="text-lg font-semibold mb-2">Facility Booking</h3>
                            <p className="text-gray-600">Book auditorium, labs, or grounds.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-500 transition-colors">
                            <h3 className="text-lg font-semibold mb-2">Leave Management</h3>
                            <p className="text-gray-600">Apply for leave or check status.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
