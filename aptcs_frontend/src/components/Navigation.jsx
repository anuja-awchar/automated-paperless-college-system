import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Vote, Building, Calendar, MessageSquare, LogOut, Menu, X } from 'lucide-react';

const Navigation = () => {
    const { user, logoutUser } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/elections', label: 'Elections', icon: Vote },
        { path: '/facilities', label: 'Facilities', icon: Building },
        { path: '/leaves', label: 'Leaves', icon: Calendar },
        { path: '/complaints', label: 'Complaints', icon: MessageSquare },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Vote className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">APTCS</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                        isActive(item.path)
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info & Logout */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-slate-300">
                            <span className="text-sm">Welcome,</span>
                            <span className="font-medium text-white">{user?.username}</span>
                            <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full text-white capitalize">
                                {user?.role}
                            </span>
                        </div>
                        <button
                            onClick={logoutUser}
                            className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-300 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-700/50">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                                            isActive(item.path)
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="border-t border-slate-700/50 pt-3 mt-3">
                                <div className="flex items-center space-x-2 px-3 py-2 text-slate-300">
                                    <span className="text-sm">Welcome,</span>
                                    <span className="font-medium text-white">{user?.username}</span>
                                    <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full text-white capitalize">
                                        {user?.role}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        logoutUser();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
