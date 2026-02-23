import React, { useState, useEffect } from 'react';

const InProgressModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [assignedTo, setAssignedTo] = useState(task?.assignedToId || '');
    const [startDate, setStartDate] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('');
    const [status, setStatus] = useState('IN_PROGRESS');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setAssignedTo(task.assignedToId || '');
            setStartDate(task.startDate ? new Date(task.startDate).toISOString().slice(0,10) : '');
            setEstimatedHours(task.estimatedHours || '');
            setStatus('IN_PROGRESS');
            setProgress(task.progress || 0);
            setNotes('');
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                assignedToId: assignedTo || null,
                startDate: startDate ? new Date(startDate).toISOString() : null,
                estimatedHours: estimatedHours ? Number(estimatedHours) : null,
                status,
                progress: Number(progress),
                notes
            };
            await onUpdate(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white/95 rounded-2xl border border-slate-200 p-6 shadow-xl">
                <h3 className="text-lg font-black mb-2">Move to In Progress</h3>
                <p className="text-sm text-slate-500 mb-4">Track work start and daily progress for <strong>{task.title}</strong></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold">Task</label>
                        <input value={task.title} readOnly className="w-full mt-2 p-3 rounded-lg border bg-slate-50" />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Assigned Developer (user id)</label>
                        <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" placeholder="User ID" />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-bold">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                        </div>
                        <div className="w-1/3">
                            <label className="text-sm font-bold">Est. Hours</label>
                            <input type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-2 p-3 rounded-lg border">
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="BLOCKED">Blocked</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Progress (%)</label>
                        <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} className="w-full mt-2" />
                        <div className="text-sm text-slate-500">{progress}%</div>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Notes / Work Log</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" rows={4} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-white font-bold">{loading ? 'Updating...' : 'Update'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InProgressModal;
