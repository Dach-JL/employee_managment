import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, CheckCircle2, Clock, AlertCircle, Paperclip, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    attachments?: { name: string; url: string; size: number; type: string }[];
}

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'in-progress': return <Clock className="text-blue-500" size={18} />;
            case 'pending': return <AlertCircle className="text-amber-500" size={18} />;
            default: return <AlertCircle className="text-slate-500" size={18} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-rose-500/20 text-rose-500';
            case 'medium': return 'bg-amber-500/20 text-amber-500';
            default: return 'bg-emerald-500/20 text-emerald-500';
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Tasks</h1>
                    <p className="text-slate-400">Manage and track your operational assignments.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Plus size={20} />
                        New Task
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="glass h-48 rounded-3xl animate-pulse bg-slate-800/20" />
                    ))
                ) : tasks.map(task => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedTask(task)}
                        className="glass p-6 rounded-3xl hover:border-primary/50 transition-all group flex flex-col cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{task.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(task.status)}
                                <span className="text-xs font-bold uppercase tracking-tighter text-slate-300">{task.status.replace('-', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {task.attachments && task.attachments.length > 0 && (
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Paperclip size={14} />
                                        <span className="text-[10px]">{task.attachments.length}</span>
                                    </div>
                                )}
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase">Due</p>
                                    <p className="text-xs font-bold">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => {
                        fetchTasks();
                        setSelectedTask(null);
                    }}
                />
            )}

            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onUpdate={() => {
                        fetchTasks();
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default TasksPage;
