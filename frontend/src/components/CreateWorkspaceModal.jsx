import React, { useState, useEffect } from 'react';
import { X, Package, Layout, Globe, Shield, Box, Layers, Plus } from 'lucide-react';

const CreateWorkspaceModal = ({ isOpen, onClose, onCreate, onUpdate, initialData }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'integrations'

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        if (initialData) {
            await onUpdate(initialData.id, { name });
        } else {
            await onCreate({ name });
        }
        setLoading(false);
        setName('');
        onClose();
    };

    const integrations = [
        { id: 'jira', name: 'Jira Software', icon: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg', color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'trello', name: 'Trello', icon: 'https://cdn.worldvectorlogo.com/logos/trello.svg', color: 'text-sky-500', bg: 'bg-sky-50' },
        { id: 'slack', name: 'Slack', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', color: 'text-purple-600', bg: 'bg-purple-50' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center p-8 border-b border-slate-100">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">
                            {initialData ? 'Edit Workspace' : 'Create Workspace'}
                        </h3>
                        <p className="text-slate-500 mt-2 font-medium">
                            {initialData ? 'Update your workspace details' : 'Set up a new workspace for your team'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900 active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex border-b border-slate-100 px-8">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-4 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'general' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        General Info
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={`py-4 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'integrations' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Integrations
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {activeTab === 'general' ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Workspace Name</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                                        <Package size={22} />
                                    </div>
                                    <input
                                        required
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Engineering, Marketing, HR"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand/20 focus:bg-white focus:ring-4 focus:ring-brand/5 rounded-3xl outline-none transition-all font-bold text-lg text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Globe size={20} />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Visibility</h4>
                                    <p className="text-xs text-slate-500 font-medium">Public within your organization</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <Shield size={20} />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Permissions</h4>
                                    <p className="text-xs text-slate-500 font-medium">Default role-based access</p>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-6 bg-brand/5 rounded-3xl border border-brand/10">
                                <h4 className="font-black text-brand flex items-center gap-2">
                                    <Layers size={18} />
                                    Dynamic Workspace
                                </h4>
                                <p className="text-sm text-brand/70 mt-1 font-medium">Connected workspaces sync data in real-time between platforms.</p>
                            </div>

                            <div className="space-y-4">
                                {integrations.map((app) => (
                                    <div key={app.id} className="group p-5 rounded-3xl bg-white border border-slate-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 ${app.bg} rounded-2xl p-3 transition-transform group-hover:scale-110`}>
                                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{app.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium tracking-tight">Sync projects and tasks automatically</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand hover:text-white transition-all">
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                        <Box size={16} />
                        ProManager Original
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !name}
                            className="bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-brand/20 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                initialData ? <Layers size={18} /> : <Plus size={18} />
                            )}
                            {initialData ? 'Update Workspace' : 'Create Workspace'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
