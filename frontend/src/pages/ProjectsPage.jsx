import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, MoreHorizontal, LayoutGrid, List, ArrowUpRight, RefreshCw } from 'lucide-react';
import api from '../api';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [syncingProjects, setSyncingProjects] = useState({}); // { projectId: true/false }

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjects([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (projectData) => {
        try {
            const { data } = await api.post('/projects', projectData);
            // If it's a linked project, trigger initial sync
            if (data.externalSource) {
                handleSync(data.id);
            }
            fetchProjects();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to launch project');
        }
    };

    const handleUpdateProject = async (id, projectData) => {
        try {
            await api.put(`/projects/${id}`, projectData);
            fetchProjects();
            setEditingProject(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update project');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Terminate this project asset?')) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
            setActiveDropdown(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete project');
        }
    };

    const handleSync = async (id) => {
        setSyncingProjects(prev => ({ ...prev, [id]: true }));
        try {
            const { data } = await api.post(`/projects/${id}/sync`);
            alert(`Sync Successful! ${data.count} items updated.`);
            fetchProjects();
        } catch (err) {
            alert('Sync failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setSyncingProjects(prev => ({ ...prev, [id]: false }));
        }
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.workspace?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSourceIcon = (source) => {
        if (source === 'JIRA') return "https://cdn.worldvectorlogo.com/logos/jira-1.svg";
        if (source === 'TRELLO') return "https://cdn.worldvectorlogo.com/logos/trello.svg";
        return null;
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Project Dashboard</h2>
                    <p className="text-slate-500 mt-3 text-xl font-medium italic">"Centralized command for all strategic initiatives."</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all flex items-center gap-2 group active:scale-[0.98] whitespace-nowrap"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                    Launch Project
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects by name or workspace..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand bg-white/40 transition-all font-medium"
                    />
                </div>
                <div className="flex bg-slate-200/40 p-1.5 rounded-2xl backdrop-blur-sm">
                    <button className="p-3 bg-white rounded-xl shadow-sm text-brand"><LayoutGrid size={22} /></button>
                    <button className="p-3 text-slate-500 hover:text-slate-700 transition-colors"><List size={22} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProjects.map((project, idx) => (
                    <div
                        key={project.id}
                        className="group glass rounded-[2.5rem] p-8 border border-white/60 shadow-glass hover:shadow-premium transition-all hover:-translate-y-2 animate-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/10 w-fit">
                                    {project.workspace?.name}
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-brand transition-colors line-clamp-1">{project.name}</h3>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveDropdown(activeDropdown === project.id ? null : project.id);
                                    }}
                                    className="text-slate-300 hover:text-brand transition-all p-2 rounded-xl border border-transparent hover:border-brand/10 hover:bg-brand/5"
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                {activeDropdown === project.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border border-white/60 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <button onClick={() => openEditModal(project)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand/5 hover:text-brand rounded-xl">Modify Project</button>
                                        {project.externalSource && (
                                            <button onClick={() => handleSync(project.id)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl">Force Sync</button>
                                        )}
                                        <button onClick={() => handleDeleteProject(project.id)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl">Terminate Asset</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {project.externalSource && (
                            <div className="mb-6 flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center">
                                    <img src={getSourceIcon(project.externalSource)} alt={project.externalSource} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Sync Active</p>
                                    <p className="text-xs font-bold text-slate-700 mt-1">ID: {project.externalId}</p>
                                </div>
                                <button
                                    onClick={() => handleSync(project.id)}
                                    disabled={syncingProjects[project.id]}
                                    className="p-2 hover:bg-white rounded-xl transition-all text-brand disabled:opacity-50"
                                >
                                    <RefreshCw size={16} className={syncingProjects[project.id] ? "animate-spin" : ""} />
                                </button>
                            </div>
                        )}

                        <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed h-[2.8rem]">
                            {project.description || 'No description provided for this mission-critical initiative.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Tasks</p>
                                <p className="text-lg font-black text-slate-900">{project._count?.tasks || 0}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Last Sync</p>
                                <p className="text-[10px] font-black text-slate-900 truncate">
                                    {project.lastSyncedAt ? new Date(project.lastSyncedAt).toLocaleTimeString() : 'Never'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
                            <div className="flex -space-x-2">
                                {project.members?.map((m, i) => (
                                    <div key={i} title={m.firstName} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                                        {m.firstName?.[0] || 'U'}
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-brand text-white flex items-center justify-center text-[10px] font-black shadow-sm">+</div>
                            </div>
                            <Link
                                to={`/tasks?project=${project.id}`}
                                className="flex items-center gap-2 text-brand font-black text-xs group/btn px-4 py-2 rounded-xl hover:bg-brand/5 transition-all"
                            >
                                View Board
                                <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center glass rounded-[3rem] border-4 border-dashed border-slate-200/50 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6 transition-transform">
                            <Briefcase size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">Mission area empty</h3>
                        <p className="text-slate-500 mt-3 text-lg font-medium max-w-sm">Launch your first project or sync from an external source.</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-10 bg-brand text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center gap-3 active:scale-[0.98]"
                        >
                            <Plus size={22} />
                            Launch Your First Project
                        </button>
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                }}
                onCreate={handleCreateProject}
                onUpdate={handleUpdateProject}
                initialData={editingProject}
            />
        </div>
    );
};

export default ProjectsPage;
