import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, MoreHorizontal, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import api from '../api';
import { Link } from 'react-router-dom';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';

const WorkspacesPage = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const fetchWorkspaces = async () => {
        try {
            const { data } = await api.get('/workspaces');
            setWorkspaces(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching workspaces:', err);
            setWorkspaces([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const handleCreateWorkspace = async (workspaceData) => {
        try {
            await api.post('/workspaces', workspaceData);
            fetchWorkspaces();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to create workspace');
        }
    };

    const handleUpdateWorkspace = async (id, workspaceData) => {
        try {
            await api.put(`/workspaces/${id}`, workspaceData);
            fetchWorkspaces();
            setEditingWorkspace(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update workspace');
        }
    };

    const handleDeleteWorkspace = async (id) => {
        if (!window.confirm('Are you sure you want to delete this workspace?')) return;
        try {
            await api.delete(`/workspaces/${id}`);
            fetchWorkspaces();
            setActiveDropdown(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete workspace');
        }
    };

    const openEditModal = (workspace) => {
        setEditingWorkspace(workspace);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setEditingWorkspace(null);
        setIsModalOpen(true);
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Workspaces</h2>
                    <p className="text-slate-500 mt-3 text-xl font-medium">Manage and organize your team's business units.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all flex items-center gap-2 group active:scale-[0.98] whitespace-nowrap"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                    New Workspace
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        placeholder="Search workspaces..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand bg-white/40 transition-all font-medium"
                    />
                </div>
                <div className="flex bg-slate-200/40 p-1.5 rounded-2xl backdrop-blur-sm self-stretch sm:self-auto">
                    <button className="p-3 bg-white rounded-xl shadow-sm text-brand"><LayoutGrid size={22} /></button>
                    <button className="p-3 text-slate-500 hover:text-slate-700 transition-colors"><List size={22} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {workspaces.map((ws, idx) => (
                    <div
                        key={ws.id}
                        className="group glass rounded-[2.5rem] p-8 border border-white/60 shadow-glass hover:shadow-premium transition-all hover:-translate-y-2 animate-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-brand/10 flex items-center justify-center text-brand shadow-sm border border-brand/5 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                                <Package size={32} />
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveDropdown(activeDropdown === ws.id ? null : ws.id);
                                    }}
                                    className="text-slate-300 hover:text-brand transition-all p-2 rounded-xl border border-transparent hover:border-brand/10 hover:bg-brand/5"
                                >
                                    <MoreHorizontal />
                                </button>

                                {activeDropdown === ws.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border border-white/60 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <button
                                            onClick={() => openEditModal(ws)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand/5 hover:text-brand rounded-xl transition-all"
                                        >
                                            Edit Workspace
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWorkspace(ws.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            Delete Workspace
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-brand transition-colors">{ws.name}</h3>
                        <p className="text-slate-500 text-base font-medium mb-8 leading-relaxed">
                            Includes <span className="text-slate-900 font-bold">{ws.projects?.length || 0}</span> active projects and collaborative team resources.
                        </p>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-100/50">
                            <div className="flex -space-x-3 items-center">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 ring-1 ring-slate-100/50 shadow-sm">
                                        JD
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-[3px] border-white bg-brand/10 flex items-center justify-center text-[10px] font-black text-brand shadow-sm">
                                    +5
                                </div>
                            </div>
                            <Link
                                to={`/workspaces/${ws.id}`}
                                className="flex items-center gap-2 text-brand font-black text-sm group/btn px-4 py-2 rounded-xl hover:bg-brand/5 transition-all"
                            >
                                Open
                                <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}

                {workspaces.length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center glass rounded-[3rem] border-4 border-dashed border-slate-200/50 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <Package size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">No workspaces yet</h3>
                        <p className="text-slate-500 mt-3 text-lg font-medium max-w-sm">Create your first workspace to start collaborating with your team.</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-10 bg-brand text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center gap-3 active:scale-[0.98]"
                        >
                            <Plus size={22} />
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingWorkspace(null);
                }}
                onCreate={handleCreateWorkspace}
                onUpdate={handleUpdateWorkspace}
                initialData={editingWorkspace}
            />
        </div>
    );
};

export default WorkspacesPage;
