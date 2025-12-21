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
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 bg-indigo-600">
                        <h1 className="text-2xl font-bold text-white">{election.title}</h1>
                        <p className="text-indigo-100">{election.description}</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {election.candidates.map((candidate) => (
                        <div
                            key={candidate.id}
                            onClick={() => setSelectedCandidate(candidate.id)}
                            className={`cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 overflow-hidden ${selectedCandidate === candidate.id ? 'border-indigo-600 transform scale-[1.02]' : 'border-transparent'}`}
                        >
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                {candidate.photo ? (
                                    <img src={candidate.photo} alt={candidate.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserCheck className="h-20 w-20 text-gray-400" />
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
                                <div className="text-gray-600 text-sm h-24 overflow-y-auto">
                                    <p>{candidate.manifesto}</p>
                                </div>
                            </div>
                            <div className={`px-6 py-3 ${selectedCandidate === candidate.id ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-500'}`}>
                                <div className="text-center font-semibold">
                                    {selectedCandidate === candidate.id ? 'Selected' : 'Select Candidate'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleVote}
                        disabled={!selectedCandidate}
                        className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all ${selectedCandidate
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Cast My Vote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VotingInterface;
