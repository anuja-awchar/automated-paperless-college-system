import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden text-slate-200 font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <Navigation />

            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
