import React, { useState, useEffect } from 'react';

const ReviewModal = ({ isOpen, onClose, task, onSubmit }) => {
    const [submittedBy, setSubmittedBy] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [comments, setComments] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('Changes Required');
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setSubmittedBy(task.assignedToId || '');
            setReviewerName('');
            setComments('');
            setApprovalStatus('Changes Required');
            setAttachment(null);
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        setAttachment(f || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // For simplicity we won't actually upload file here; frontend could send multipart if needed
            const payload = {
                submittedBy: submittedBy || null,
                reviewerName: reviewerName || null,
                reviewComments: comments || null,
                approvalStatus
            };
            await onSubmit(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white/95 rounded-2xl border border-slate-200 p-6 shadow-xl">
                <h3 className="text-lg font-black mb-2">Submit for Review</h3>
                <p className="text-sm text-slate-500 mb-4">Review details for <strong>{task.title}</strong></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold">Task</label>
                        <input value={task.title} readOnly className="w-full mt-2 p-3 rounded-lg border bg-slate-50" />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Submitted By (user id)</label>
                        <input value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Reviewer Name</label>
                        <input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Review Comments</label>
                        <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="w-full mt-2 p-3 rounded-lg border" rows={4} />
                    </div>

                    <div>
                        <label className="text-sm font-bold">Approval Status</label>
                        <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)} className="w-full mt-2 p-3 rounded-lg border">
                            <option>Approved</option>
                            <option>Changes Required</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-bold">Attachment (optional)</label>
                        <input type="file" onChange={handleFile} className="w-full mt-2" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-brand text-white font-bold">{loading ? 'Submitting...' : 'Submit Review'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
