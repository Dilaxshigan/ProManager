import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Settings, LogOut, Package, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
        { name: 'Workspaces', icon: <Package size={22} />, path: '/workspaces' },
        { name: 'Projects', icon: <Briefcase size={22} />, path: '/projects' },
        { name: 'Tasks', icon: <CheckSquare size={22} />, path: '/tasks' },
        { name: 'Settings', icon: <Settings size={22} />, path: '/settings' },
    ];

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 p-6 z-50">
            <div className="h-full glass rounded-[2.5rem] border border-white/60 shadow-glass flex flex-col overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/30 group-hover:scale-110 transition-transform duration-500">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                ProManager
                            </h1>
                            <span className="text-[10px] font-black text-brand uppercase tracking-widest mt-1 block">
                                Premium v1.0
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand/5 border border-brand/5 mb-8">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                            Organization
                        </p>
                        <p className="text-sm font-bold text-slate-700 truncate">
                            {user?.organization?.name || 'Main Workspace'}
                        </p>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center justify-between group px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${isActive
                                        ? 'bg-brand text-white shadow-xl shadow-brand/30 ring-1 ring-brand/50'
                                        : 'text-slate-500 hover:bg-brand/5 hover:text-brand'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <span className="transition-transform group-hover:scale-110 duration-300">{item.icon}</span>
                                    <span className="font-bold tracking-tight">{item.name}</span>
                                </div>
                                <ChevronRight
                                    size={16}
                                    className={`transition-all duration-300 ${'opacity-0 group-hover:opacity-100'
                                        }`}
                                />
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/40 bg-white/10">
                    <div className="flex items-center gap-4 mb-8 p-1">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 shadow-inner">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-black text-slate-900 truncate tracking-tight">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-400 font-bold truncate">Admin</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => {
                                const root = document.documentElement;
                                if (root.classList.contains('theme-light')) root.classList.remove('theme-light');
                                else root.classList.add('theme-light');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm font-black"
                        >
                            <Sun size={16} /> Light
                        </button>
                        <button
                            onClick={() => {
                                const root = document.documentElement;
                                if (root.classList.contains('theme-light')) root.classList.remove('theme-light');
                                else root.classList.add('theme-light');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm font-black"
                        >
                            <Moon size={16} /> Dark
                        </button>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
