import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Clock, CheckCircle, AlertCircle, ListTodo, FileText, ShieldAlert, MessageSquare } from 'lucide-react';
import api from '../api/api';

interface TaskStats {
    active: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

const Dashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState<TaskStats>({ active: 0, inProgress: 0, completed: 0, overdue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks');
                const tasks = res.data;
                const now = new Date();
                setStats({
                    active: tasks.filter((t: any) => t.status === 'pending').length,
                    inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
                    completed: tasks.filter((t: any) => t.status === 'completed').length,
                    overdue: tasks.filter((t: any) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length,
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { label: 'Submit Daily Report', path: '/reports/daily', icon: <FileText size={18} className="text-primary" /> },
        { label: 'View All Tasks', path: '/tasks', icon: <ListTodo size={18} className="text-primary" /> },
        { label: 'Anonymous Feedback', path: '/reports/anonymous', icon: <ShieldAlert size={18} className="text-primary" /> },
        { label: 'Open Chat', path: '/chat', icon: <MessageSquare size={18} className="text-primary" /> },
    ];

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold gradient-text">Hello, {user?.name || 'User'}</h1>
                <p className="text-slate-400 mt-2">Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<ListTodo className="text-primary" />} label="Active Tasks" value={loading ? '—' : String(stats.active)} />
                <StatCard icon={<Clock className="text-warning" />} label="In Progress" value={loading ? '—' : String(stats.inProgress)} />
                <StatCard icon={<CheckCircle className="text-success" />} label="Completed" value={loading ? '—' : String(stats.completed)} />
                <StatCard icon={<AlertCircle className="text-danger" />} label="Overdue" value={loading ? '—' : String(stats.overdue)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 glass rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
                    <div className="space-y-6">
                        <ActivityItem title="Task Updated" desc="Review design system documentation" time="2h ago" />
                        <ActivityItem title="Report Submitted" desc="Daily progress report for March 6" time="4h ago" />
                        <ActivityItem title="Announcement" desc="New company policy update" time="1d ago" />
                    </div>
                </section>

                <section className="glass rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map(action => (
                            <button
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-primary/10 text-left transition-all flex items-center gap-3 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                    {action.icon}
                                </div>
                                <span className="font-medium flex-1">{action.label}</span>
                                <span className="text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all">→</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass p-6 rounded-3xl"
    >
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            {icon}
        </div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </motion.div>
);

const ActivityItem = ({ title, desc, time }: { title: string; desc: string; time: string }) => (
    <div className="flex items-start gap-4">
        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
        <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-slate-400 text-sm">{desc}</p>
        </div>
        <span className="text-xs text-slate-500">{time}</span>
    </div>
);

export default Dashboard;
