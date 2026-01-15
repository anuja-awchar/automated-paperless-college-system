import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Building, Calendar, MessageSquare, TrendingUp, Users, Clock, CheckCircle, Sparkles, Zap, Heart, Star } from 'lucide-react';

const Dashboard = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [stats, setStats] = useState({
        activeElections: 1,
        totalFacilities: 5,
        pendingLeaves: 2,
        resolvedComplaints: 8
    });

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const cards = [
        {
            title: 'Election System',
            description: 'Vote for candidates or view results.',
            link: '/elections',
            icon: Vote,
            color: 'indigo',
            gradient: 'from-indigo-500 to-purple-600',
            bgGradient: 'from-indigo-500/10 to-purple-600/10',
            stats: `${stats.activeElections} Active`
        },
        {
            title: 'Facility Booking',
            description: 'Book auditorium, labs, or grounds.',
            link: '/facilities',
            icon: Building,
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-600',
            bgGradient: 'from-blue-500/10 to-cyan-600/10',
            stats: `${stats.totalFacilities} Available`
        },
        {
            title: 'Leave Management',
            description: 'Apply for leave or check status.',
            link: '/leaves',
            icon: Calendar,
            color: 'green',
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-500/10 to-emerald-600/10',
            stats: `${stats.pendingLeaves} Pending`
        },
        {
            title: 'Complaints',
            description: 'File anonymous complaints or suggestions.',
            link: '/complaints',
            icon: MessageSquare,
            color: 'red',
            gradient: 'from-red-500 to-pink-600',
            bgGradient: 'from-red-500/10 to-pink-600/10',
            stats: `${stats.resolvedComplaints} Resolved`
        }
    ];

    const statsCards = [
        { label: 'Active Elections', value: stats.activeElections, icon: Vote, color: 'indigo' },
        { label: 'Available Facilities', value: stats.totalFacilities, icon: Building, color: 'blue' },
        { label: 'Pending Leaves', value: stats.pendingLeaves, icon: Clock, color: 'yellow' },
        { label: 'Resolved Complaints', value: stats.resolvedComplaints, icon: CheckCircle, color: 'green' }
    ];

    return (
        <div className="relative flex-grow p-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className={`mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
                            <Sparkles className="w-8 h-8 animate-pulse" />
                            <h1 className="text-5xl font-bold">Welcome to APTCS</h1>
                            <Sparkles className="w-8 h-8 animate-pulse" />
                        </div>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            Your comprehensive campus management platform for transparent and efficient operations
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {statsCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-${stat.color}-500/20`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        </div>
                                        <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.title}
                                to={card.link}
                                className={`group bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-${card.color}-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-${card.color}-500/20 hover:-translate-y-2 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                style={{ animationDelay: `${(index + 4) * 150}ms` }}
                            >
                                <div className="relative mb-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${card.bgGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 text-${card.color}-400 group-hover:text-${card.color}-300 transition-colors`} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Star className="w-3 h-3 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                                    {card.title}
                                </h3>

                                <p className="text-slate-400 mb-4 leading-relaxed text-sm">
                                    {card.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className={`text-${card.color}-400 font-medium group-hover:text-${card.color}-300 transition-colors flex items-center text-sm`}>
                                        <span>Explore</span>
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <span className={`text-xs px-2 py-1 bg-${card.color}-500/20 text-${card.color}-300 rounded-full`}>
                                        {card.stats}
                                    </span>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                            </Link>
                        );
                    })}
                </div>

                {/* Motivational Footer */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-2 text-slate-400">
                        <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="text-sm">Made with passion for better campus management</span>
                        <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
