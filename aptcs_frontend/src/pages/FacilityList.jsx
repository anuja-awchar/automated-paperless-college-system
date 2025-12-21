import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, X } from 'lucide-react';

const FacilityList = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [bookingData, setBookingData] = useState({ start_time: '', end_time: '', purpose: '' });
    const { authTokens } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFacilities();
    }, [authTokens]);

    const fetchFacilities = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/facility/facilities/', {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            setFacilities(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
        }
    };

    const handleBookClick = (facility) => {
        setSelectedFacility(facility);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/facility/bookings/', {
                facility: selectedFacility.id,
                ...bookingData
            }, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            alert('Booking request submitted!');
            setShowModal(false);
            setBookingData({ start_time: '', end_time: '', purpose: '' });
        } catch (error) {
            console.error("Booking failed:", error);
            alert(JSON.stringify(error.response?.data));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Campus Facilities</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="h-48 bg-gray-200">
                                {facility.image ? (
                                    <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{facility.name}</h3>
                                <div className="flex items-center text-gray-500 mb-4">
                                    <Users className="h-4 w-4 mr-2" />
                                    <span>Capacity: {facility.capacity}</span>
                                </div>
                                <p className="text-gray-600 mb-6">{facility.description}</p>
                                <button
                                    onClick={() => handleBookClick(facility)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
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

                            <h2 className="text-2xl font-bold mb-6">Book {selectedFacility?.name}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={bookingData.start_time}
                                        onChange={(e) => setBookingData({ ...bookingData, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={bookingData.end_time}
                                        onChange={(e) => setBookingData({ ...bookingData, end_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={bookingData.purpose}
                                        onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
                                >
                                    Confirm Booking
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
