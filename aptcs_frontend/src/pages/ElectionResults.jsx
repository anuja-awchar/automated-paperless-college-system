import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, ArrowLeft, BarChart2, User } from 'lucide-react';

const ElectionResults = () => {
    const { id } = useParams();
    const { authTokens } = useAuth();
    const [election, setElection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/election/elections/${id}/`, {
                    headers: { 'Authorization': `Bearer ${authTokens.access}` }
                });
                setElection(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching results:", error);
                setLoading(false);
            }
        };
        fetchResults();
    }, [id, authTokens]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!election) return <div className="text-center mt-10">Election not found</div>;

    // Calculate total votes
    const totalVotes = election.candidates.reduce((acc, candidate) => acc + (candidate.vote_count || 0), 0);

    // Sort candidates by votes
    const sortedCandidates = [...election.candidates].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

    // Determine winner(s)
    const maxVotes = sortedCandidates[0]?.vote_count || 0;
    const winners = sortedCandidates.filter(c => c.vote_count === maxVotes && maxVotes > 0);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/elections" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors hover:translate-x-[-4px]">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Elections
                </Link>

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-8 animate-fade-in-up">
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-800 px-8 py-10 text-white overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-glow"></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight">{election.title} Results</h1>
                                <p className="text-indigo-100 mt-2 opacity-90 text-lg">{election.description}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <BarChart2 className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="mt-8 flex items-center space-x-6">
                            <div className="flex flex-col">
                                <span className="text-xs text-indigo-200 uppercase tracking-wider font-bold">Total Votes</span>
                                <span className="text-2xl font-bold">{totalVotes}</span>
                            </div>
                            <div className="w-px h-10 bg-indigo-400/50"></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-indigo-200 uppercase tracking-wider font-bold">Candidates</span>
                                <span className="text-2xl font-bold">{election.candidates.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {winners.length > 0 && (
                            <div className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 flex items-start space-x-6 animate-scale-in shadow-sm">
                                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-4 ring-8 ring-yellow-50">
                                    <Trophy className="h-10 w-10 text-yellow-600 animate-bounce-soft" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Winner Declared!</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {winners.length === 1
                                            ? <span className="font-bold text-indigo-700 text-xl">{winners[0].name}</span>
                                            : <span className="font-bold text-indigo-700 text-xl">{winners.map(w => w.name).join(' & ')}</span>
                                        } secured victory with <span className="font-black text-gray-900">{maxVotes}</span> votes
                                        ({totalVotes > 0 ? ((maxVotes / totalVotes) * 100).toFixed(1) : 0}% of total).
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            {sortedCandidates.map((candidate, index) => {
                                const percentage = totalVotes > 0 ? ((candidate.vote_count || 0) / totalVotes) * 100 : 0;
                                const isWinner = winners.some(w => w.id === candidate.id);

                                return (
                                    <div key={candidate.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="flex items-end justify-between mb-3">
                                            <div className="flex items-center space-x-4">
                                                <div className={`relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${isWinner ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'}`}>
                                                    {candidate.photo ? (
                                                        <img src={candidate.photo} alt={candidate.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-full w-full p-3 text-gray-400 bg-gray-100" />
                                                    )}
                                                    {isWinner && (
                                                        <div className="absolute inset-0 bg-yellow-400/20"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                                                        {candidate.name}
                                                        {isWinner && <Trophy className="h-5 w-5 text-yellow-500 ml-2 animate-pulse" />}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-3xl font-black ${isWinner ? 'text-indigo-600' : 'text-gray-700'}`}>{candidate.vote_count || 0}</span>
                                                <span className="text-sm text-gray-500 ml-1 font-medium">votes</span>
                                            </div>
                                        </div>

                                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                            {/* Striped background/shimmer effect */}
                                            <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2
                                                ${isWinner ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 animate-shimmer' : 'bg-gray-400'}`}
                                                style={{ width: `${percentage}%`, backgroundSize: '200% auto' }}
                                            >
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <span className="text-sm font-bold text-gray-500">{percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionResults;
