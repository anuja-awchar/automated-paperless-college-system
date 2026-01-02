import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, ChevronRight, BarChart2 } from 'lucide-react';
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
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 animate-fade-in-up">Active Elections</h1>
                <p className="text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Participate in democracy using the secure digital voting system.</p>

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
        </div>
    );
};

export default ElectionList;
