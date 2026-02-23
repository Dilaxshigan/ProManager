import React, { useState, useEffect } from 'react';
import { X, Briefcase, Box, Layers, Plus, RefreshCw, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import api from '../api';

const CreateProjectModal = ({ isOpen, onClose, onCreate, onUpdate, initialData }) => {
    // Basic fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [workspaceId, setWorkspaceId] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'integrations'
    const [workspaces, setWorkspaces] = useState([]);

    // Integration State
    const [connectedApps, setConnectedApps] = useState([]); // List of types ['JIRA', 'TRELLO']
    const [externalBoards, setExternalBoards] = useState([]);
    const [fetchingBoards, setFetchingBoards] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Dynamic Credentials for Integration Setup
    const [jiraCreds, setJiraCreds] = useState({ domain: '', email: '', apiToken: '' });
    const [trelloCreds, setTrelloCreds] = useState({ apiKey: '', token: '' });

    useEffect(() => {
        if (isOpen) {
            fetchWorkspaces();
            fetchIntegrations();
        }
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setWorkspaceId(initialData.workspaceId || '');
        } else {
            setName('');
            setDescription('');
            setWorkspaceId('');
            setSelectedBoard(null);
        }
    }, [initialData, isOpen]);

    const fetchWorkspaces = async () => {
        try {
            const { data } = await api.get('/workspaces');
            setWorkspaces(Array.isArray(data) ? data : []);
            if (data.length > 0 && !workspaceId) {
                setWorkspaceId(data[0].id);
            }
        } catch (err) { console.error(err); }
    };

    const fetchIntegrations = async () => {
        try {
            const { data } = await api.get('/integrations');
            setConnectedApps(data.filter(i => i.isActive).map(i => i.type));
        } catch (err) { console.error(err); }
    };

    const handleConnect = async (type) => {
        setIsConnecting(true);
        try {
            let res;
            if (type === 'TRELLO') {
                res = await api.post('/integrations/trello', trelloCreds);
                setExternalBoards(res.data.boards);
            } else if (type === 'JIRA') {
                res = await api.post('/integrations/jira', jiraCreds);
                setExternalBoards(res.data.projects);
            }
            setConnectedApps(prev => [...prev, type]);
        } catch (err) {
            alert('Connection failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsConnecting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !workspaceId) return;

        setLoading(true);
        const projectData = {
            name,
            description,
            workspaceId,
            externalSource: selectedBoard?.source || null,
            externalId: selectedBoard?.id || null
        };

        if (initialData) {
            await onUpdate(initialData.id, projectData);
        } else {
            await onCreate(projectData);
        }
        setLoading(false);
        onClose();
    };

    const selectBoard = (board, source) => {
        setSelectedBoard({ ...board, source });
        setName(board.name);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center p-8 border-b border-slate-100">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">
                            {initialData ? 'Edit Asset' : 'Launch Project'}
                        </h3>
                        <p className="text-slate-500 mt-2 font-medium">
                            {selectedBoard ? `Linking with ${selectedBoard.name}` : 'Setup your strategic dashboard'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
                </div>

                <div className="flex border-b border-slate-100 px-8">
                    {['general', 'integrations'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-6 font-bold text-sm transition-all border-b-2 capitalize ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab} configuration
                        </button>
                    ))}
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {activeTab === 'general' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest px-1">Project Identifier</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors"><Briefcase size={20} /></div>
                                    <input
                                        required autoFocus value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand/20 focus:bg-white focus:ring-4 focus:ring-brand/5 rounded-2xl outline-none transition-all font-bold text-slate-900"
                                        placeholder="Project X..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest px-1">Assign to Workspace</label>
                                <select
                                    disabled={initialData} value={workspaceId}
                                    onChange={(e) => setWorkspaceId(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-brand/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 appearance-none"
                                >
                                    {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest px-1">Project Brief</label>
                                <textarea
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-brand/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 min-h-[100px] resize-none"
                                    placeholder="Mission objectives..."
                                />
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8">
                            {/* Jira Integration Section */}
                            <div className={`p-6 rounded-[2rem] border transition-all ${connectedApps.includes('JIRA') ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl p-2.5 shadow-sm">
                                            <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900">Atlassian Jira</h4>
                                            <p className="text-xs text-slate-500 font-bold">Sync issues and sprint progress</p>
                                        </div>
                                    </div>
                                    {connectedApps.includes('JIRA') ? (
                                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                            <CheckCircle2 size={14} /> Ready
                                        </div>
                                    ) : (
                                        <button onClick={() => handleConnect('JIRA')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">Link Jira</button>
                                    )}
                                </div>

                                {!connectedApps.includes('JIRA') && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <input placeholder="Domain" className="p-3 bg-slate-50 rounded-xl font-bold text-xs" value={jiraCreds.domain} onChange={e => setJiraCreds({ ...jiraCreds, domain: e.target.value })} />
                                        <input placeholder="Email" className="p-3 bg-slate-50 rounded-xl font-bold text-xs" value={jiraCreds.email} onChange={e => setJiraCreds({ ...jiraCreds, email: e.target.value })} />
                                        <input placeholder="API Token" type="password" className="p-3 bg-slate-50 rounded-xl font-bold text-xs" value={jiraCreds.apiToken} onChange={e => setJiraCreds({ ...jiraCreds, apiToken: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            {/* Trello Integration Section */}
                            <div className={`p-6 rounded-[2rem] border transition-all ${connectedApps.includes('TRELLO') ? 'bg-sky-50/50 border-sky-200' : 'bg-white border-slate-100 hover:border-sky-100'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-sky-50 rounded-xl p-2.5 shadow-sm">
                                            <img src="https://cdn.worldvectorlogo.com/logos/trello.svg" alt="Trello" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900">Trello</h4>
                                            <p className="text-xs text-slate-500 font-bold">Import cards and checklists</p>
                                        </div>
                                    </div>
                                    {connectedApps.includes('TRELLO') ? (
                                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                            <CheckCircle2 size={14} /> Ready
                                        </div>
                                    ) : (
                                        <button onClick={() => handleConnect('TRELLO')} className="px-5 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-black hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 active:scale-95">Link Trello</button>
                                    )}
                                </div>

                                {!connectedApps.includes('TRELLO') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <input placeholder="API Key" className="p-3 bg-slate-50 rounded-xl font-bold text-xs" value={trelloCreds.apiKey} onChange={e => setTrelloCreds({ ...trelloCreds, apiKey: e.target.value })} />
                                        <input placeholder="Token" type="password" className="p-3 bg-slate-50 rounded-xl font-bold text-xs" value={trelloCreds.token} onChange={e => setTrelloCreds({ ...trelloCreds, token: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            {/* Available Boards List */}
                            {externalBoards.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-slate-100 animate-in fade-in zoom-in">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select a board to link with this project</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {externalBoards.map(board => (
                                            <button
                                                key={board.id}
                                                onClick={() => selectBoard(board, connectedApps.includes('JIRA') ? 'JIRA' : 'TRELLO')}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedBoard?.id === board.id ? 'bg-brand/5 border-brand ring-4 ring-brand/5' : 'bg-white border-transparent hover:border-brand/10'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Box size={18} className={selectedBoard?.id === board.id ? 'text-brand' : 'text-slate-300'} />
                                                    <span className="font-bold text-slate-700">{board.name}</span>
                                                </div>
                                                <ChevronRight size={18} className="text-slate-300" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} /> Mission Isolation Active
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
                        <button
                            onClick={handleSubmit} disabled={loading || !name || !workspaceId}
                            className={`bg-brand text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-brand/20 transition-all flex items-center gap-2 active:scale-95 ${loading ? 'opacity-50' : 'hover:bg-brand-dark'}`}
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : (initialData ? <RefreshCw size={18} /> : <Plus size={18} />)}
                            {initialData ? 'Update Asset' : 'Launch Project'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
