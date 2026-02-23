import React, { useState, useEffect } from 'react';

const CompleteTaskModal = ({ isOpen, onClose, task, onCloseTask }) => {
    const [completedDate, setCompletedDate] = useState('');
    const [finalComments, setFinalComments] = useState('');
    const [totalTime, setTotalTime] = useState('');
    const [clientApproval, setClientApproval] = useState('No');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setCompletedDate(new Date().toISOString().slice(0,10));
            setFinalComments('');
            setTotalTime(task.totalTimeSpent || '');
            setClientApproval('No');
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                completedDate: completedDate ? new Date(completedDate).toISOString() : null,
                finalComments: finalComments || null,
                totalTimeSpent: totalTime ? Number(totalTime) : null,
                clientApproval: clientApproval === 'Yes'
            };
            await onCloseTask(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white/95 rounded-2xl border border-slate-200 p-6 shadow-xl">
                <h3 className="text-lg font-black mb-2">Complete Task</h3>
                <p className="text-sm text-slate-500 mb-4">Finalize details for <strong>{task.title}</strong></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold">Task</label>
                        <input value={task.title} readOnly className="w-full mt-2 p-3 rounded-lg border bg-slate-50" />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-bold">Completed Date</label>
                            <input type="date" value={completedDate} onChange={(e) => setCompletedDate(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                        </div>
                        <div className="w-1/3">
                            <label className="text-sm font-bold">Total Time (hours)</label>
                            <input type="number" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Final Comments</label>
                        <textarea value={finalComments} onChange={(e) => setFinalComments(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" rows={4} />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Client Approval</label>
                        <select value={clientApproval} onChange={(e) => setClientApproval(e.target.value)} className="w-full mt-2 p-3 rounded-lg border">
                            <option>No</option>
                            <option>Yes</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-white font-bold">{loading ? 'Closing...' : 'Close Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteTaskModal;
