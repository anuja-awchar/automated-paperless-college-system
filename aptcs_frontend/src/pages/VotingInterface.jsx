import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck } from 'lucide-react';

const VotingInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens } = useAuth();
    const [election, setElection] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElectionDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/election/elections/${id}/`, {
                    headers: { 'Authorization': `Bearer ${authTokens.access}` }
                });
                setElection(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching election details:", error);
                setLoading(false);
            }
        };
        fetchElectionDetails();
    }, [id, authTokens]);

    const handleVote = async () => {
        if (!selectedCandidate) return;
        try {
            await axios.post('http://127.0.0.1:8000/api/election/vote/', {
                election: parseInt(id),
                candidate: selectedCandidate
            }, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            alert('Vote cast successfully!');
            navigate('/');
        } catch (error) {
            console.error("Voting failed:", error);
            alert(error.response?.data?.non_field_errors || "Voting failed. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!election) return <div>Election not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Election Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-800 shadow-xl rounded-2xl overflow-hidden mb-8 animate-fade-in-up transform transition-all hover:scale-[1.01]">
                    <div className="px-8 py-8 md:flex md:justify-between md:items-center">
                        <div className="md:w-2/3">
                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white mb-3">
                                Official Ballot
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{election.title}</h1>
                            <p className="mt-2 text-indigo-100 text-lg opacity-90">{election.description}</p>
                        </div>
                        <div className="md:w-1/3 mt-6 md:mt-0 flex justify-end">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                                <span className="block text-3xl font-bold text-white mb-1">Live</span>
                                <span className="text-xs text-indigo-200 uppercase tracking-widest">Voting Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Candidate Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {election.candidates.map((candidate, index) => (
                        <div
                            key={candidate.id}
                            onClick={() => setSelectedCandidate(candidate.id)}
                            className={`group cursor-pointer relative bg-white rounded-2xl transition-all duration-300 animate-slide-up
                                ${selectedCandidate === candidate.id
                                    ? 'ring-4 ring-indigo-500 shadow-2xl transform scale-[1.03] z-10'
                                    : 'shadow-lg hover:shadow-xl hover:-translate-y-2 border border-gray-100'
                                }`}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {/* Selection Checkmark */}
                            {selectedCandidate === candidate.id && (
                                <div className="absolute top-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg z-20 animate-scale-in">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            )}

                            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
                                {candidate.photo ? (
                                    <img src={candidate.photo} alt={candidate.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <UserCheck className="h-24 w-24 text-gray-300" />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            </div>

                            <div className="p-6">
                                <h3 className={`text-2xl font-bold mb-2 transition-colors ${selectedCandidate === candidate.id ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                                    {candidate.name}
                                </h3>
                                <div className="h-1 w-12 bg-gray-200 mb-4 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-500 transition-all duration-500 ${selectedCandidate === candidate.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                                </div>
                                <div className="text-gray-600 text-sm h-24 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
                                    <p>{candidate.manifesto}</p>
                                </div>
                            </div>

                            <div className={`px-6 py-4 rounded-b-2xl transition-colors duration-300 border-t ${selectedCandidate === candidate.id ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className={`flex items-center justify-center space-x-2 font-bold ${selectedCandidate === candidate.id ? 'text-indigo-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    <span>{selectedCandidate === candidate.id ? 'Candidate Selected' : 'Tap to Select'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Action */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4 sm:p-6 shadow-lg transform transition-transform duration-500 z-50">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <div className="hidden sm:block">
                            <p className="text-gray-500 text-sm font-medium">
                                {selectedCandidate ? 'Ready to submit your vote?' : 'Please select a candidate to continue.'}
                            </p>
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={!selectedCandidate}
                            className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${selectedCandidate
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95 animate-pulse-glow'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span>Confirm Vote</span>
                            {selectedCandidate && <svg className="w-5 h-5 ml-2 animate-bounce-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        </button>
                    </div>
                </div>

                {/* Spacer for fixed bottom bar */}
                <div className="h-24"></div>
            </div>
        </div>
    );
};

export default VotingInterface;
