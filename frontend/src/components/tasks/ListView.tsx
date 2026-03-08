import type { Task } from '../../pages/TasksPage';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';

interface ListViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const ListView = ({ tasks, onTaskClick }: ListViewProps) => {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md"><CheckCircle2 size={12} /> COMPLETED</span>;
            case 'in-progress': return <span className="flex items-center gap-1.5 text-xs font-bold text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-md"><Clock size={12} /> IN PROGRESS</span>;
            case 'pending': return <span className="flex items-center gap-1.5 text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-md"><AlertCircle size={12} /> PENDING</span>;
            default: return <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-md">{status.toUpperCase()}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high': return <span className="text-[10px] font-bold text-danger uppercase tracking-widest bg-danger/10 px-2 py-0.5 rounded border border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]">HIGH</span>;
            case 'medium': return <span className="text-[10px] font-bold text-warning uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded border border-warning/20 shadow-[0_0_8px_rgba(250,204,21,0.2)]">MEDIUM</span>;
            default: return <span className="text-[10px] font-bold text-success uppercase tracking-widest bg-success/10 px-2 py-0.5 rounded border border-success/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]">LOW</span>;
        }
    };

    return (
        <div className="glass-card rounded-3xl overflow-hidden relative">
            <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="overflow-x-auto relative z-10 w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-widest">
                            <th className="py-4 px-6 font-bold w-[40%]">Task Title</th>
                            <th className="py-4 px-6 font-bold w-[15%]">Status</th>
                            <th className="py-4 px-6 font-bold w-[15%]">Priority</th>
                            <th className="py-4 px-6 font-bold w-[15%]">Progress</th>
                            <th className="py-4 px-6 font-bold w-[15%]">Due Date</th>
                            <th className="py-4 px-6 font-bold w-[10%] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <td className="py-4 px-6 font-bold text-slate-200 group-hover:text-neon-blue transition-colors">
                                    <div className="truncate max-w-[300px] lg:max-w-md">{task.title}</div>
                                </td>
                                <td className="py-4 px-6">{getStatusBadge(task.status)}</td>
                                <td className="py-4 px-6">{getPriorityBadge(task.priority)}</td>
                                <td className="py-4 px-6">
                                    <div className="w-full max-w-[120px] bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: task.status === 'completed' ? '100%' : (task.status === 'in-progress' ? '50%' : '10%') }}
                                            transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                                            className={`h-1.5 rounded-full relative ${task.status === 'completed' ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.8)]' : (task.status === 'in-progress' ? 'bg-neon-blue shadow-[0_0_10px_rgba(79,124,255,0.8)]' : 'bg-warning shadow-[0_0_10px_rgba(250,204,21,0.8)]')}`}
                                        >
                                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-400 font-semibold flex items-center gap-2">
                                    <CalendarIcon size={14} className="text-slate-500" />
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                    No tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListView;
