import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreVertical, Calendar, ListFilter, GripVertical, RefreshCw } from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';
import InProgressModal from './InProgressModal';
import ReviewModal from './ReviewModal';
import CompleteTaskModal from './CompleteTaskModal';
import api from '../api';
import { useSocket } from '../contexts/SocketContext';

const KanbanBoard = ({ projectId: propProjectId }) => {
    const [searchParams] = useSearchParams();
    const projectId = propProjectId || searchParams.get('project');
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState('TODO');
    const [modalType, setModalType] = useState(null); // 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    const [modalTask, setModalTask] = useState(null);
    const socket = useSocket();

    const columns = [
        { id: 'TODO', label: 'To Do', color: 'bg-indigo-500' },
        { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
        { id: 'REVIEW', label: 'Review', color: 'bg-brand' },
        { id: 'DONE', label: 'Completed', color: 'bg-emerald-500' }
    ];

    useEffect(() => {
        if (projectId) fetchTasks();

        if (socket && projectId) {
            socket.emit('join-project', projectId);

            socket.on('task-updated', ({ taskId, newStatus, newTasks }) => {
                if (newTasks) {
                    setTasks(newTasks);
                } else if (taskId && newStatus) {
                    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
                }
            });

            return () => {
                socket.emit('leave-project', projectId);
                socket.off('task-updated');
            };
        }
    }, [projectId, socket]);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get(`/projects/${projectId}/tasks`);
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragStart = (event) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        setActiveTask(task);
    };

    const onDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId !== overId) {
            const oldIndex = tasks.findIndex((t) => t.id === activeId);
            const newIndex = tasks.findIndex((t) => t.id === overId);
            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            setTasks(newTasks);

            if (socket) {
                socket.emit('task-moved', {
                    projectId,
                    taskId: activeId,
                    newTasks
                });
            }
        }
        setActiveTask(null);
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

    return (
        <div className="flex-1 flex gap-8 overflow-x-auto pb-10 scrollbar-hide select-none animate-in">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                {columns.map(col => (
                    <div key={col.id} className="w-[22rem] flex-shrink-0 flex flex-col gap-6 group/col">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${col.color} shadow-lg shadow-current/20 animate-pulse`} />
                                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                                    {col.label}
                                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black border border-slate-200">
                                        {getTasksByStatus(col.id).length}
                                    </span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-brand transition-all p-1.5 rounded-lg hover:bg-white saturate-200 shadow-sm border border-transparent hover:border-slate-100">
                                    <ListFilter size={14} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => { setCreateStatus(col.id); setIsCreateOpen(true); }}
                                    className="text-slate-400 hover:text-brand transition-all p-1.5 rounded-lg hover:bg-white saturate-200 shadow-sm border border-transparent hover:border-slate-100"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-200/30 backdrop-blur-[2px] rounded-[2.5rem] p-4 flex-1 overflow-y-auto space-y-4 min-h-[500px] border border-slate-200/40 shadow-inner group-hover/col:bg-slate-200/40 transition-colors">
                            <SortableContext items={getTasksByStatus(col.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
                                {getTasksByStatus(col.id).map((task, idx) => (
                                    <TaskCard key={task.id} task={task} openModal={(type) => { setModalType(type); setModalTask(task); }} />
                                ))}
                            </SortableContext>

                            {getTasksByStatus(col.id).length === 0 && (
                                <div className="h-32 border-2 border-dashed border-slate-300/50 rounded-[2rem] flex items-center justify-center text-slate-400 italic font-medium p-6 text-center text-sm">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                </DragOverlay>
            </DndContext>

            <CreateTaskModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                defaultStatus={createStatus}
                projectId={projectId}
                onCreate={async (data) => {
                    try {
                        const payload = { ...data };
                        if (payload.dueDate) {
                            // convert YYYY-MM-DD to ISO string for backend
                            const d = new Date(payload.dueDate);
                            if (!isNaN(d)) payload.dueDate = d.toISOString();
                        }

                        await api.post('/tasks', payload);
                        await fetchTasks();
                        if (socket && projectId) socket.emit('task-created', { projectId });
                    } catch (err) {
                        console.error('Failed to create task', err);
                        const msg = err?.response?.data?.message || err.message || 'Failed to create task';
                        alert(msg);
                    } finally {
                        setIsCreateOpen(false);
                    }
                }}
            />

            {modalType === 'IN_PROGRESS' && modalTask && (
                <InProgressModal
                    isOpen={true}
                    onClose={() => { setModalType(null); setModalTask(null); }}
                    task={modalTask}
                    onUpdate={async (updates) => {
                        try {
                            await api.put(`/tasks/${modalTask.id}`, updates);
                            await fetchTasks();
                            if (socket && projectId) socket.emit('task-updated', { projectId, taskId: modalTask.id, newTasks: null });
                        } catch (err) {
                            console.error('Failed to update task (in progress)', err);
                            alert(err?.response?.data?.message || 'Failed to update task');
                        } finally {
                            setModalType(null);
                            setModalTask(null);
                        }
                    }}
                />
            )}

            {modalType === 'REVIEW' && modalTask && (
                <ReviewModal
                    isOpen={true}
                    onClose={() => { setModalType(null); setModalTask(null); }}
                    task={modalTask}
                    onSubmit={async (payload) => {
                        try {
                            const updates = { ...payload };
                            if (payload.approvalStatus === 'Approved') updates.status = 'DONE';
                            else updates.status = 'IN_PROGRESS';
                            await api.put(`/tasks/${modalTask.id}`, updates);
                            await fetchTasks();
                            if (socket && projectId) socket.emit('task-updated', { projectId, taskId: modalTask.id, newTasks: null });
                        } catch (err) {
                            console.error('Failed to submit review', err);
                            alert(err?.response?.data?.message || 'Failed to submit review');
                        } finally {
                            setModalType(null);
                            setModalTask(null);
                        }
                    }}
                />
            )}

            {modalType === 'DONE' && modalTask && (
                <CompleteTaskModal
                    isOpen={true}
                    onClose={() => { setModalType(null); setModalTask(null); }}
                    task={modalTask}
                    onCloseTask={async (payload) => {
                        try {
                            const updates = { status: 'DONE', ...payload };
                            await api.put(`/tasks/${modalTask.id}`, updates);
                            await fetchTasks();
                            if (socket && projectId) socket.emit('task-updated', { projectId, taskId: modalTask.id, newTasks: null });
                        } catch (err) {
                            console.error('Failed to close task', err);
                            alert(err?.response?.data?.message || 'Failed to close task');
                        } finally {
                            setModalType(null);
                            setModalTask(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

const TaskCard = ({ task, isOverlay, openModal }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isOverlay ? 100 : 'auto',
    };

    const priorityColors = {
        HIGH: 'bg-red-50 text-red-600 border-red-100 ring-4 ring-red-500/10',
        MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100 ring-4 ring-amber-500/10',
        LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-500/10'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                glass-dark p-6 rounded-[2rem] border-white/60 shadow-glass cursor-grab group active:cursor-grabbing relative
                hover:shadow-premium hover:-translate-y-1 transition-all duration-300
                ${isOverlay ? 'shadow-premium ring-4 ring-brand/30 border-brand rotate-[2deg] scale-105 bg-white/90 z-50' : ''}
                ${isDragging ? 'opacity-0' : 'opacity-100'}
            `}
        >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                <GripVertical size={16} />
            </div>

            <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
                    {task.priority || 'MEDIUM'}
                </span>
                <div className="flex items-center gap-2">
                    {task.syncStatus === 'SYNCED' && (
                        <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                            <RefreshCw size={10} className="animate-pulse" /> Synced
                        </div>
                    )}
                    <button className="text-slate-400 hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-white/10 group-hover:rotate-90 transition-transform">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            <h4 className="font-bold text-white text-[17px] mb-4 leading-[1.3] group-hover:text-indigo-400 transition-colors">{task.title}</h4>

            <div className="flex gap-2 mb-4">
                {task.status !== 'IN_PROGRESS' && (
                    <button onClick={() => openModal && openModal('IN_PROGRESS')} className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">Start</button>
                )}
                {task.status !== 'REVIEW' && (
                    <button onClick={() => openModal && openModal('REVIEW')} className="text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-bold">Review</button>
                )}
                {task.status !== 'DONE' && (
                    <button onClick={() => openModal && openModal('DONE')} className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">Complete</button>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Calendar size={12} className="text-brand" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                    </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center text-xs font-black text-brand uppercase shadow-inner group-hover:bg-brand group-hover:text-white transition-all duration-500">
                    {task.assignedTo?.firstName?.[0] || 'U'}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
