import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateTaskModal = ({ isOpen, onClose, onCreate, defaultStatus, projectId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            setDueDate('');
        }
    }, [isOpen]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) { setProject(null); return; }
            try {
                const { data } = await api.get('/projects');
                const found = data.find(p => String(p.id) === String(projectId));
                setProject(found || null);
            } catch (err) {
                console.error('Failed to fetch projects for modal', err);
                setProject(null);
            }
        };
        fetchProject();
    }, [projectId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        if (!projectId) {
            alert('No project selected. Open a project board to create tasks for that project.');
            return;
        }

        setLoading(true);
        try {
            await onCreate({
                title,
                description,
                priority,
                dueDate: dueDate || null,
                status: defaultStatus,
                projectId
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white/95 rounded-2xl border border-slate-200 p-6 shadow-xl">
                <h3 className="text-lg font-black mb-2">Create Task</h3>
                <p className="text-sm text-slate-500 mb-4">Add a new task to the project{project ? ` — ${project.name}` : ''}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" placeholder="Task title" required />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" placeholder="Optional description" rows={3} />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-bold">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full mt-2 p-3 rounded-lg border">
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold">Due</label>
                            <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="mt-2 p-3 rounded-lg border" />
                        </div>
                    </div>

                    {!projectId && (
                        <div className="space-y-2">
                            <p className="text-sm text-red-500">No project selected — open a project board to create a task for that project.</p>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => { onClose(); navigate('/projects'); }} className="px-4 py-2 rounded-lg bg-brand text-white font-bold">Open Projects</button>
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">Close</button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading || !projectId} className="px-4 py-2 rounded-lg bg-brand text-white font-bold">
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
