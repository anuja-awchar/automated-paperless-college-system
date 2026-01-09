import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, X, Loader2, CheckCircle, AlertCircle, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const FacilityList = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [bookingData, setBookingData] = useState({ start_time: '', end_time: '', purpose: '' });
    const { authTokens } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFacilities();
    }, [authTokens]);

    const fetchFacilities = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/facility/facilities/`, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            setFacilities(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
            setErrorMessage('Failed to load facilities. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookClick = (facility) => {
        setSelectedFacility(facility);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/facility/bookings/`, {
                facility: selectedFacility.id,
                ...bookingData
            }, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            toast.success('Booking request submitted successfully!');
            setShowModal(false);
            setBookingData({ start_time: '', end_time: '', purpose: '' });
        } catch (error) {
            console.error("Booking failed:", error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Booking failed. Please try again.';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Campus Facilities</h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <span className="ml-2 text-slate-400">Loading facilities...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((facility) => (
                            <div key={facility.id} className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/70 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
                                <div className="h-48 bg-slate-700/50">
                                    {facility.image ? (
                                        <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <Building className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                        {facility.name}
                                    </h3>
                                    <div className="flex items-center text-slate-400 mb-4">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>Capacity: {facility.capacity}</span>
                                    </div>
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        {facility.description}
                                    </p>
                                    <button
                                        onClick={() => handleBookClick(facility)}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 group-hover:shadow-indigo-500/40"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>Book Now</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                    {/* Booking Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <h2 className="text-2xl font-bold text-white mb-6">Book {selectedFacility?.name}</h2>

                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400 text-sm">{errorMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                            value={bookingData.start_time}
                                            onChange={(e) => setBookingData({ ...bookingData, start_time: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                            value={bookingData.end_time}
                                            onChange={(e) => setBookingData({ ...bookingData, end_time: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Purpose</label>
                                        <textarea
                                            required
                                            rows="3"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 resize-none"
                                            value={bookingData.purpose}
                                            onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                                            placeholder="Describe the purpose of your booking..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Confirm Booking</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default FacilityList;
