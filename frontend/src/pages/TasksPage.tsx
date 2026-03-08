import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, LayoutGrid, List, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

// Views
import KanbanView from '../components/tasks/KanbanView';
import ListView from '../components/tasks/ListView';
import CalendarView from '../components/tasks/CalendarView';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    attachments?: { name: string; url: string; size: number; type: string }[];
}

type ViewMode = 'kanban' | 'list' | 'calendar';

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');

    const navigate = useNavigate();
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

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black gradient-text-glow tracking-tighter mb-1 uppercase">Operations</h1>
                    <p className="text-slate-400 font-medium text-sm">Manage, track, and execute your operational assignments.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    {/* View Toggles */}
                    <div className="glass p-1 rounded-xl flex items-center shadow-inner-dark border-white/5">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-primary shadow-[0_0_15px_rgba(79,124,255,0.4)] text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <LayoutGrid size={14} /> Kanban
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-primary shadow-[0_0_15px_rgba(79,124,255,0.4)] text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <List size={14} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-primary shadow-[0_0_15px_rgba(79,124,255,0.4)] text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <CalendarIcon size={14} /> Calendar
                        </button>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary px-6 py-2.5 flex items-center gap-2 shadow-glow-blue"
                        >
                            <Plus size={18} />
                            <span>New Task</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 w-full mt-4">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={viewMode}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                            variants={containerVariants}
                            className="w-full"
                        >
                            {viewMode === 'kanban' && <KanbanView tasks={tasks} onTaskClick={(t) => navigate(`/tasks/${t.id}`)} onStatusChange={fetchTasks} />}
                            {viewMode === 'list' && <ListView tasks={tasks} onTaskClick={(t) => navigate(`/tasks/${t.id}`)} />}
                            {viewMode === 'calendar' && <CalendarView tasks={tasks} onTaskClick={(t) => navigate(`/tasks/${t.id}`)} />}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

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
