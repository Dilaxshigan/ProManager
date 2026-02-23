import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Briefcase, CheckCircle2, TrendingUp, Clock, AlertCircle, Calendar } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0,
        teamMembers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data: workspaces } = await api.get('/workspaces');
            let projectsCount = 0;
            workspaces.forEach(ws => projectsCount += ws.projects.length);

            setStats({
                totalProjects: projectsCount,
                activeTasks: 12,
                completedTasks: 45,
                teamMembers: 4
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch dashboard data');
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <div className="glass p-8 rounded-[2rem] border border-white/60 shadow-glass flex flex-col gap-4 animate-in">
            <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-sm`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold ring-1 ring-emerald-100">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="dashboard-root bg-white text-slate-900 min-h-screen">
            <div className="p-10 max-w-7xl mx-auto space-y-12">
            <div className="animate-in">
                <div className="flex items-center gap-3 text-brand font-bold mb-2">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">System Overview</h2>
                <p className="text-slate-500 mt-3 text-xl font-medium max-w-2xl">Monitor your organization's performance, team velocity, and project health in real-time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                    trend="+2 new"
                    icon={<Briefcase className="text-brand" size={28} />}
                    color="bg-brand/10"
                />
                <StatCard
                    title="Active Tasks"
                    value={stats.activeTasks}
                    trend="In progress"
                    icon={<TrendingUp className="text-amber-500" size={28} />}
                    color="bg-amber-50"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedTasks}
                    trend="+12% growth"
                    icon={<CheckCircle2 className="text-emerald-500" size={28} />}
                    color="bg-emerald-50"
                />
                <StatCard
                    title="Team Members"
                    value={stats.teamMembers}
                    trend="Active now"
                    icon={<Users className="text-indigo-500" size={28} />}
                    color="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/60 shadow-glass animate-in [animation-delay:200ms]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Clock className="text-brand" size={28} />
                            Recent Activity
                        </h3>
                        <button className="text-brand font-bold text-sm bg-brand/10 px-4 py-2 rounded-xl hover:bg-brand/20 transition-all border border-brand/10">Show All</button>
                    </div>
                    <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-white/60 transition-all group border border-transparent hover:border-slate-100 hover:shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex-shrink-0 flex items-center justify-center font-bold text-lg group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                                    U{i}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-slate-900 font-bold text-lg">
                                            User {i} <span className="font-medium text-slate-500">updated task</span>
                                            <span className="text-brand ml-2">"Integrate Stripe API"</span>
                                        </p>
                                        <p className="text-slate-400 text-sm font-semibold">2h ago</p>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Modified priority from 'Medium' to 'High' • Backend Service</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-10 border border-white/60 shadow-glass animate-in [animation-delay:400ms]">
                    <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={28} />
                        Overdue
                    </h3>
                    <div className="space-y-6">
                        <div className="p-8 rounded-[2rem] bg-red-50/50 border border-red-100/50 flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 italic">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-slate-900 font-bold">All clear!</p>
                            <p className="text-slate-500 text-sm font-medium">No overdue tasks currently. Your team is on fire today! 🔥</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
