import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import NeonIcon from '../components/ui/NeonIcon';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import {
    Clock, CheckCircle2, AlertCircle, Users, Activity,
    TrendingUp, TrendingDown, FileText, ShieldAlert
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import api from '../api/api';

interface TaskStats {
    active: number;
    inProgress: number;
    completed: number;
    overdue: number;
    totalEmployees: number;
    reports: number;
}

// Mock Data for Charts (Replace with actual API data later)
const completionData = [
    { name: 'Mon', completed: 12, new: 18 },
    { name: 'Tue', completed: 19, new: 15 },
    { name: 'Wed', completed: 15, new: 22 },
    { name: 'Thu', completed: 25, new: 14 },
    { name: 'Fri', completed: 22, new: 20 },
    { name: 'Sat', completed: 8, new: 5 },
    { name: 'Sun', completed: 10, new: 8 },
];

const departmentData = [
    { name: 'Engineering', Tasks: 45 },
    { name: 'Design', Tasks: 25 },
    { name: 'Marketing', Tasks: 30 },
    { name: 'HR', Tasks: 15 },
    { name: 'Sales', Tasks: 35 },
];

const priorityData = [
    { name: 'High', value: 30, color: '#EF4444' }, // danger
    { name: 'Medium', value: 50, color: '#FACC15' }, // warning
    { name: 'Low', value: 20, color: '#22C55E' }, // success
];

const Dashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState<TaskStats>({
        active: 0, inProgress: 0, completed: 0, overdue: 0, totalEmployees: 124, reports: 3
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks');
                const tasks = res.data;
                const now = new Date();
                setStats(prev => ({
                    ...prev,
                    active: tasks.filter((t: any) => t.status === 'pending').length,
                    inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
                    completed: tasks.filter((t: any) => t.status === 'completed').length,
                    overdue: tasks.filter((t: any) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length,
                }));
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
            className="space-y-8 pb-10"
        >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-black gradient-text-glow tracking-tight uppercase">
                        Command Center
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-slate-400 mt-1 font-medium text-sm">
                        System overview and analytics for <span className="text-primary">{user?.name}</span>
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex gap-3">
                    <button onClick={() => navigate('/reports/daily')} className="btn-ghost text-xs py-2 group flex items-center gap-2">
                        <FileText size={14} className="group-hover:text-primary transition-colors" />
                        Daily Report
                    </button>
                    <button onClick={() => navigate('/tasks')} className="btn-primary text-xs py-2 flex items-center gap-2 shadow-glow-blue">
                        <Activity size={14} />
                        View Tasks
                    </button>
                </motion.div>
            </header>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />) : (
                    <>
                        <StatCard
                            icon={<NeonIcon icon={Users} color="primary" size={22} />}
                            label="Total Employees"
                            value={stats.totalEmployees.toString()}
                            trend="+12% this month"
                            trendUp={true}
                            glowColor="neon-blue"
                        />
                        <StatCard
                            icon={<NeonIcon icon={Clock} color="warning" size={22} />}
                            label="Tasks In Progress"
                            value={loading ? '-' : stats.inProgress.toString()}
                            trend="Active bandwidth"
                            glowColor="warning"
                        />
                        <StatCard
                            icon={<NeonIcon icon={CheckCircle2} color="success" size={22} />}
                            label="Completed Tasks"
                            value={loading ? '-' : stats.completed.toString()}
                            trend="+5% from last week"
                            trendUp={true}
                            glowColor="success"
                        />
                        <StatCard
                            icon={<NeonIcon icon={AlertCircle} color="danger" size={22} />}
                            label="Overdue Tasks"
                            value={loading ? '-' : stats.overdue.toString()}
                            trend="-2% from last week"
                            trendUp={false}
                            glowColor="danger"
                        />
                        <StatCard
                            icon={<NeonIcon icon={ShieldAlert} color="purple" size={22} />}
                            label="Anonymous Reports"
                            value={stats.reports.toString()}
                            trend="Requires attention"
                            glowColor="neon-purple"
                        />
                    </>
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-700" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <Activity size={18} className="text-primary" /> Task Velocity
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Completed vs New Tasks (7 Days)</p>
                        </div>
                        <div className="flex gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-2 text-primary"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(79,124,255,0.8)]" /> Completed</span>
                            <span className="flex items-center gap-2 text-neon-purple"><div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(122,92,255,0.8)]" /> New</span>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F7CFF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4F7CFF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7A5CFF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7A5CFF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="completed" stroke="#4F7CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 6, fill: '#4F7CFF', stroke: '#fff', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="new" stroke="#7A5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" activeDot={{ r: 6, fill: '#7A5CFF', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Priority Breakdown (Pie Chart) */}
                <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-warning/10 rounded-full blur-[50px] group-hover:bg-warning/20 transition-all duration-700" />
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 relative z-10">
                        <AlertCircle size={18} className="text-warning" /> Priority Dist.
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold relative z-10">Active tasks by urgency</p>

                    <div className="h-[200px] w-full mt-4 flex items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text for Donut chart */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                            <span className="text-2xl font-bold text-white">100</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Total</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-2 relative z-10">
                        {priorityData.map(item => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
                                <span className="text-[10px] text-slate-400 uppercase font-bold">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Workload (Bar Chart) */}
                <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-accent-cyan/10 rounded-full blur-[50px] group-hover:bg-accent-cyan/20 transition-all duration-700" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <Users size={18} className="text-accent-cyan" /> Department Load
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Tasks assigned by team</p>
                        </div>
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="Tasks" fill="#00E5FF" radius={[4, 4, 0, 0]}>
                                    {departmentData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                                    ))}
                                </Bar>
                                <defs>
                                    {departmentData.map((_, index) => (
                                        <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#00E5FF" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#4F7CFF" stopOpacity={0.6} />
                                        </linearGradient>
                                    ))}
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Team Status / Timeline */}
                <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                    {/* Replace with more detailed activity or team status if desired, here I'll put a sleek task timeline representing active deployments/reviews */}
                    <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-neon-purple/10 rounded-full blur-[50px] group-hover:bg-neon-purple/20 transition-all duration-700" />
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 relative z-10 mb-6">
                        <Clock size={18} className="text-neon-purple" /> Active Operations
                    </h2>

                    <div className="space-y-6 relative z-10 pl-2">
                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-white/10 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(79,124,255,0.8)]" />
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-sm text-slate-200">Q1 Infrastructure Migration</p>
                                <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest bg-neon-blue/10 px-2 py-0.5 rounded-sm">In Progress</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">DevOps Team • ETA: 2h</p>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-neon-blue h-1.5 rounded-full w-[65%] relative">
                                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>

                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-white/10 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-warning shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-sm text-slate-200">Client Portal v2 Deployment</p>
                                <span className="text-[10px] font-bold text-warning uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded-sm">Review</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">Frontend Team • Pending QA Approval</p>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-warning h-1.5 rounded-full w-[90%] relative">
                                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>

                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-white/10 last:before:hidden">
                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-sm text-slate-200">Database Optimization</p>
                                <span className="text-[10px] font-bold text-success uppercase tracking-widest bg-success/10 px-2 py-0.5 rounded-sm">Complete</span>
                            </div>
                            <p className="text-xs text-slate-400">Backend Team • Completed 1h ago</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, trend, trendUp, glowColor }: any) => {
    return (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card p-5 relative overflow-hidden group">
            {/* Hover Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${glowColor}/10 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/3 -translate-y-1/3`} />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl glass flex items-center justify-center border-${glowColor}/20 group-hover:border-${glowColor}/50 transition-colors shadow-glow-[var(--color-${glowColor})]`}>
                    {icon}
                </div>
                {trendUp !== undefined && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-${trendUp ? 'success' : 'danger'}/10 text-${trendUp ? 'success' : 'danger'}`}>
                        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-3xl font-black text-slate-100 tracking-tighter mb-1">{value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                {trend && <p className="text-[10px] text-slate-400 font-medium">{trend}</p>}
            </div>
        </motion.div>
    );
};

export default Dashboard;
