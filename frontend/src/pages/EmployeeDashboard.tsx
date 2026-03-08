import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import NeonIcon from '../components/ui/NeonIcon';
import { useAuthStore } from '../store/useAuthStore';
import {
    Clock, CheckCircle2, AlertCircle, ListTodo, FileText,
    MessageSquare, ShieldAlert, Calendar
} from 'lucide-react';
import api from '../api/api';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
}

const EmployeeDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [reportStatus, setReportStatus] = useState({ submitted: false, time: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch assigned tasks
                const taskRes = await api.get('/tasks/my-tasks');
                setTasks(taskRes.data);

                // Fetch report status (mock logic for now, replace with actual API call)
                // const reportRes = await api.get('/reports/daily/my-status');
                setReportStatus({ submitted: false, time: '' });

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const completedToday = tasks.filter(t => t.status === 'completed').length; // Mock, should check date
    const overdueTasks = activeTasks.filter(t => new Date(t.dueDate) < new Date()).length;

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-10 max-w-7xl mx-auto"
        >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-black gradient-text-glow tracking-tight">
                        Welcome Back, {user?.name?.split(' ')[0] || 'User'}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-slate-400 mt-1 font-medium text-sm">
                        Here is your personal overview for today.
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex gap-3">
                    <button onClick={() => navigate('/tasks')} className="btn-ghost text-xs py-2 flex items-center gap-2">
                        <ListTodo size={14} />
                        My Tasks
                    </button>
                    <button
                        onClick={() => navigate('/reports/daily')}
                        className={`text-xs py-2 flex items-center gap-2 px-4 rounded-xl font-bold transition-all shadow-lg ${reportStatus.submitted
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'btn-primary shadow-glow-blue'
                            }`}
                    >
                        {reportStatus.submitted ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                        {reportStatus.submitted ? 'Report Submitted' : 'Submit Daily Report'}
                    </button>
                </motion.div>
            </header>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<NeonIcon icon={ListTodo} color="primary" size={22} />}
                    label="Active Tasks"
                    value={loading ? '-' : activeTasks.length.toString()}
                    glowColor="neon-blue"
                />
                <StatCard
                    icon={<NeonIcon icon={AlertCircle} color="danger" size={22} />}
                    label="Overdue / Urgent"
                    value={loading ? '-' : overdueTasks.toString()}
                    glowColor="danger"
                />
                <StatCard
                    icon={<NeonIcon icon={CheckCircle2} color="success" size={22} />}
                    label="Completed Today"
                    value={loading ? '-' : completedToday.toString()}
                    glowColor="success"
                />
                <StatCard
                    icon={<NeonIcon icon={MessageSquare} color="purple" size={22} />}
                    label="Unread Messages"
                    value="3" // Mock data
                    glowColor="neon-purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Task List */}
                <motion.section variants={itemVariants} className="lg:col-span-2 glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-700" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            <Clock size={18} className="text-primary" /> Current Focus
                        </h2>
                        <button onClick={() => navigate('/tasks')} className="text-xs text-primary hover:text-neon-blue transition-colors font-semibold">View All →</button>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
                            </div>
                        ) : activeTasks.length > 0 ? (
                            activeTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="p-4 rounded-xl bg-bg-secondary/50 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between group/task">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <ListTodo size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-200 group-hover/task:text-primary transition-colors">{task.title}</h3>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                                <Calendar size={12} /> Due {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                                <CheckCircle2 size={32} className="text-success/50 mx-auto mb-3" />
                                <p className="text-sm font-medium text-slate-400">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Right Side Column */}
                <div className="space-y-6">
                    {/* Daily Status Card */}
                    <motion.section variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-warning/10 rounded-full blur-[50px] group-hover:bg-warning/20 transition-all duration-700" />
                        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4 relative z-10">
                            <FileText size={18} className="text-warning" /> Daily Status
                        </h2>

                        <div className="p-4 rounded-xl bg-bg-secondary/80 border border-white/5 relative z-10 flex flex-col items-center justify-center text-center">
                            {reportStatus.submitted ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-3 text-success shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <p className="font-bold text-slate-200">Report Submitted</p>
                                    <p className="text-xs text-slate-400 mt-1">Great job! You're done for the day.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-3 text-warning shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                        <AlertCircle size={24} />
                                    </div>
                                    <p className="font-bold text-slate-200">Report Pending</p>
                                    <p className="text-xs text-slate-400 mt-1 mb-4">Don't forget to submit your daily progress.</p>
                                    <button onClick={() => navigate('/reports/daily')} className="w-full py-2.5 rounded-lg bg-warning hover:bg-warning/90 text-bg-main font-bold text-xs transition-colors shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                        Draft Report Now
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.section>

                    {/* Quick Tools */}
                    <motion.section variants={itemVariants} className="glass-card p-6 relative overflow-hidden">
                        <h2 className="text-lg font-bold text-slate-100 mb-4">Quick Tools</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => navigate('/chat')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white border border-white/5 hover:border-white/10">
                                <MessageSquare size={20} className="text-neon-purple" />
                                <span className="text-xs font-semibold">Team Chat</span>
                            </button>
                            <button onClick={() => navigate('/reports/anonymous')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white border border-white/5 hover:border-white/10">
                                <ShieldAlert size={20} className="text-accent-cyan" />
                                <span className="text-xs font-semibold">Anonymous</span>
                            </button>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, glowColor }: any) => {
    const cardVariants: Variants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };
    return (
        <motion.div variants={cardVariants} className="glass-card p-5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${glowColor}/10 rounded-full blur-[25px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/3 -translate-y-1/3`} />
            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center border-${glowColor}/20 group-hover:border-${glowColor}/50 transition-colors shadow-glow-[var(--color-${glowColor})] shrink-0`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-black text-slate-100 tracking-tight">{value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        high: 'bg-danger/10 text-danger border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
        medium: 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_8px_rgba(250,204,21,0.2)]',
        low: 'bg-success/10 text-success border-success/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
    };
    const colorClass = colors[priority as keyof typeof colors] || colors.medium;

    return (
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${colorClass}`}>
            {priority}
        </span>
    );
};

export default EmployeeDashboard;
