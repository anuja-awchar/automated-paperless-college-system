import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ElectionList = () => {
    const [elections, setElections] = useState([]);
    const { authTokens } = useAuth();

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/election/elections/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setElections(response.data);
            } catch (error) {
                console.error("Error fetching elections:", error);
            }
        };
        fetchElections();
    }, [authTokens]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Active Elections</h1>
                <div className="space-y-6">
                    {elections.length === 0 ? (
                        <p className="text-gray-500 text-center">No active elections found.</p>
                    ) : (
                        elections.map((election) => (
                            <div key={election.id} className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow">
                                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{election.title}</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{election.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {election.is_voted ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Voted
                                            </span>
                                        ) : election.is_open ? (
                                            <Link to={`/election/${election.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                                Vote Now <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <div className="flex space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            Start: {new Date(election.start_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                            End: {new Date(election.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ElectionList;
