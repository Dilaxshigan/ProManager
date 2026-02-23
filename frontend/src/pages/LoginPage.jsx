import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-premium animate-in">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-brand/10 text-brand rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand/5">
                        <Briefcase size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 font-medium">Sign in to manage your projects</p>
                </div>

                {error && (
                    <div className="bg-red-50/50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-semibold border border-red-100/50 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/40 backdrop-blur-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/40 backdrop-blur-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-[1.25rem] font-bold shadow-xl shadow-brand/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                        Sign In
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand font-bold hover:text-brand-dark transition-colors">
                        Create organization
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
