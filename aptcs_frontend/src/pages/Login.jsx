import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Lock, User, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const { loginUser, loginError } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate a small delay for the animation or wait for loginUser
        await loginUser(e);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4 z-10">

                {/* Left Side - Visual/Branding */}
                <div className="hidden md:flex flex-col justify-center space-y-8 p-8 animate-fade-in">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-extrabold text-white leading-tight">
                            Welcome to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">APTCS</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                            Automated Paperless College System. Experience the future of campus management today.
                        </p>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center space-x-3 text-slate-300">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-300">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span>Real-time Updates</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-300">
                            <div className="p-1 bg-green-500/20 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span>24/7 Access</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-b-full opacity-70"></div>

                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-2 md:hidden">Welcome to APTCS</h2>
                            <h3 className="text-xl font-semibold text-white">Sign In</h3>
                            <p className="text-slate-400 text-sm mt-1">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 transition-all duration-300"
                                        required
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>

                            <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-slate-600 transition-all duration-300"
                                        required
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-500 rounded border-slate-700 bg-slate-900/50 focus:ring-indigo-500/50 transition-all" />
                                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
