import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Vote, Building, Calendar, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const cards = [
        {
            title: 'Election System',
            description: 'Vote for candidates or view results.',
            link: '/elections',
            icon: Vote,
            color: 'indigo'
        },
        {
            title: 'Facility Booking',
            description: 'Book auditorium, labs, or grounds.',
            link: '/facilities',
            icon: Building,
            color: 'blue'
        },
        {
            title: 'Leave Management',
            description: 'Apply for leave or check status.',
            link: '/leaves',
            icon: Calendar,
            color: 'green'
        },
        {
            title: 'Complaints',
            description: 'File anonymous complaints or suggestions.',
            link: '/complaints',
            icon: MessageSquare,
            color: 'red'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            <Navigation />
            <div className="flex-grow p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-slate-400 text-lg">Welcome to your APTCS control panel</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.title}
                                    to={card.link}
                                    className={`group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/70 hover:border-${card.color}-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-${card.color}-500/10 hover:-translate-y-1`}
                                >
                                    <div className={`w-12 h-12 bg-${card.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${card.color}-500/30 transition-colors`}>
                                        <Icon className={`w-6 h-6 text-${card.color}-400`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-slate-400 mb-4 leading-relaxed">
                                        {card.description}
                                    </p>
                                    <div className={`text-${card.color}-400 font-medium group-hover:text-${card.color}-300 transition-colors flex items-center`}>
                                        <span>Go to {card.title.split(' ')[0]}</span>
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
