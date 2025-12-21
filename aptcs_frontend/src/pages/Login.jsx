import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const { loginUser } = useContext(AuthContext);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/80">Sign in to access your account</p>
                </div>
                <form onSubmit={loginUser} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-indigo-200" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 backdrop-blur-sm transition-all"
                            required
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-indigo-200" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 backdrop-blur-sm transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transform hover:scale-[1.02] transition-all shadow-lg"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-white/80 hover:text-white underline decoration-dashed">
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
