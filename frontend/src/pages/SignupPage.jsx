import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Mail, Lock, User, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organizationName: '',
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full flex glass rounded-[2.5rem] overflow-hidden shadow-premium animate-in border border-white/40">
                {/* Left Side: Brand/Info */}
                <div className="hidden md:flex md:w-5/12 bg-brand p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-2xl font-black mb-16 tracking-tighter">
                            <Briefcase size={28} />
                            PROMANAGER
                        </div>
                        <h2 className="text-4xl font-extrabold leading-[1.1] mb-8 tracking-tight">
                            Elevate your team's productivity.
                        </h2>
                        <ul className="space-y-5 text-indigo-100/90 font-medium">
                            <li className="flex items-center gap-4">
                                <CheckCircle2 size={22} className="text-emerald-400" />
                                Workspace Isolation
                            </li>
                            <li className="flex items-center gap-4">
                                <CheckCircle2 size={22} className="text-emerald-400" />
                                Interactive Kanban
                            </li>
                            <li className="flex items-center gap-4">
                                <CheckCircle2 size={22} className="text-emerald-400" />
                                Activity Tracking
                            </li>
                        </ul>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute top-1/2 -right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-[60px]"></div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-12 bg-white/30 backdrop-blur-xl">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 mt-2 font-medium">Join 500+ teams using ProManager</p>
                    </div>

                    {error && (
                        <div className="bg-red-50/50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-semibold border border-red-100/50">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                                <input
                                    name="firstName"
                                    placeholder="First Name"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/50"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    name="lastName"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/50"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                            <input
                                name="organizationName"
                                placeholder="Organization Name"
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/50"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/50"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all bg-white/50"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all flex items-center justify-center gap-3 group mt-6 active:scale-[0.98]"
                        >
                            Sign Up
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-600 font-semibold">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand font-bold hover:text-brand-dark transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
