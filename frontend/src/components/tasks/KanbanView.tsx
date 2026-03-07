import { motion } from 'framer-motion';
import type { Task } from '../../pages/TasksPage';
import { CheckCircle2, Clock, AlertCircle, MoreHorizontal, Paperclip } from 'lucide-react';
import api from '../../api/api';
import { useAuthStore } from '../../store/useAuthStore';

interface KanbanViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onStatusChange: () => void;
}

const KanbanView = ({ tasks, onTaskClick, onStatusChange }: KanbanViewProps) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const columns = [
        { id: 'pending', title: 'Pending', icon: <AlertCircle size={16} className="text-warning" />, color: 'warning' },
        { id: 'in-progress', title: 'In Progress', icon: <Clock size={16} className="text-neon-blue" />, color: 'neon-blue' },
        { id: 'completed', title: 'Completed', icon: <CheckCircle2 size={16} className="text-success" />, color: 'success' },
    ];

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        try {
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            onStatusChange();
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-danger/10 text-danger border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
            case 'medium': return 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_8px_rgba(250,204,21,0.2)]';
            default: return 'bg-success/10 text-success border-success/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]';
        }
    };

    return (
        <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 h-[70vh] min-h-[500px] overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {columns.map(col => {
                const columnTasks = tasks.filter(t => t.status === col.id);
                return (
                    <div
                        key={col.id}
                        className={`w-[85vw] shrink-0 md:w-auto snap-center glass-card p-4 rounded-3xl flex flex-col relative overflow-hidden group/board`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        {/* Hover Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${col.color}/5 rounded-full blur-[40px] opacity-0 group-hover/board:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="font-bold flex items-center gap-2 text-slate-100">
                                {col.icon} {col.title}
                            </h3>
                            <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide relative z-10">
                            {columnTasks.map(task => (
                                <motion.div
                                    layoutId={task.id}
                                    draggable={isAdmin || task.status !== 'completed'} // Simple permission mock
                                    onDragStart={(e: any) => handleDragStart(e, task.id)}
                                    key={task.id}
                                    onClick={() => onTaskClick(task)}
                                    className="bg-bg-secondary/60 border border-white/5 hover:border-white/20 p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all group/card"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <MoreHorizontal size={14} className="text-slate-500 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-200 mb-1 leading-tight group-hover/card:text-neon-blue transition-colors line-clamp-2">{task.title}</h4>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                        {task.attachments && task.attachments.length > 0 ? (
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Paperclip size={12} />
                                                <span className="text-[10px] font-semibold">{task.attachments.length}</span>
                                            </div>
                                        ) : <div />}
                                        <div className="text-[10px] text-slate-400 font-semibold truncate max-w-[100px]">
                                            Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {columnTasks.length === 0 && (
                                <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Drop Here</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanView;
