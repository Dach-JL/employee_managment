import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../api/api';
import { Users, FileText, CheckCircle, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import NeonIcon from '../components/ui/NeonIcon';

const PIE_COLORS = ['#4F7CFF', '#00E5FF', '#FACC15', '#F43F5E', '#7A5CFF'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-4 rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                        <span className="text-slate-400 text-sm font-medium">{entry.name}:</span>
                        <span className="text-white font-bold">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsPage = () => {
    const [overview, setOverview] = useState<any>(null);
    const [taskStats, setTaskStats] = useState<any[]>([]);
    const [priorityStats, setPriorityStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for new charts where backend might lack endpoints
    const [completionTrend] = useState([
        { date: 'Mon', completed: 12, new: 18 },
        { date: 'Tue', completed: 19, new: 15 },
        { date: 'Wed', completed: 15, new: 22 },
        { date: 'Thu', completed: 25, new: 14 },
        { date: 'Fri', completed: 32, new: 20 },
        { date: 'Sat', completed: 14, new: 5 },
        { date: 'Sun', completed: 8, new: 3 },
    ]);

    const [reportRates] = useState([
        { day: 'Mon', rate: 85 },
        { day: 'Tue', rate: 92 },
        { day: 'Wed', rate: 88 },
        { day: 'Thu', rate: 95 },
        { day: 'Fri', rate: 98 },
    ]);

    const [workloadByDept] = useState([
        { dept: 'Engineering', tasks: 145 },
        { dept: 'Design', tasks: 85 },
        { dept: 'Marketing', tasks: 110 },
        { dept: 'Sales', tasks: 64 },
        { dept: 'HR', tasks: 32 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ovRes, taskRes, prioRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/tasks'),
                    api.get('/analytics/priorities')
                ]);
                setOverview(ovRes.data);

                // Format task distribution data
                const formattedTaskStats = taskRes.data.map((item: any) => ({
                    ...item,
                    status: item.status.replace('_', ' ').toUpperCase()
                }));
                setTaskStats(formattedTaskStats);

                setPriorityStats(prioRes.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_30px_rgba(79,124,255,0.5)]" />
                <p className="text-primary font-bold tracking-widest uppercase text-sm animate-pulse">Initializing Data Core...</p>
            </div>
        );
    }

    const metrics = [
        { label: 'Total Employees', value: overview?.totalEmployees || 0, icon: Users, color: 'text-primary', glow: 'shadow-[0_0_20px_rgba(79,124,255,0.3)]', bg: 'bg-primary/10 border-primary/20' },
        { label: 'Active Tasks', value: overview?.totalTasks || 0, icon: FileText, color: 'text-accent-cyan', glow: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]', bg: 'bg-accent-cyan/10 border-accent-cyan/20' },
        { label: 'Pending Approvals', value: taskStats.find(t => t.status === 'PENDING APPROVAL')?.count || 0, icon: CheckCircle, color: 'text-warning', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]', bg: 'bg-warning/10 border-warning/20' },
        { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-success', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]', bg: 'bg-success/10 border-success/20' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Systems Intelligence</h1>
                    <p className="text-slate-400 font-medium">Real-time telemetry and organizational performance metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-bg-secondary/80 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-inner-dark">
                        Export Report
                    </button>
                    <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(79,124,255,0.3)] transition-all flex items-center gap-2">
                        Refresh <Activity size={16} />
                    </button>
                </div>
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        {/* Background subtle glow */}
                        <div className={`absolute -right-10 -top-10 w-40 h-40 ${metric.color.replace('text-', 'bg-')}/10 rounded-full blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-700`} />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${metric.bg} ${metric.glow}`}>
                                <NeonIcon icon={metric.icon} color={metric.color === 'text-primary' ? 'primary' : metric.color === 'text-accent-cyan' ? 'cyan' : metric.color === 'text-warning' ? 'warning' : 'success'} size={26} />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md border border-success/20">
                                +4.2%
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{metric.label}</p>
                            <h3 className="text-4xl font-black text-white">{metric.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Task Completion Trends (Line Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white">Task Velocity</h3>
                            <p className="text-sm font-medium text-slate-400 mt-1">Completed vs New tasks over 7 days</p>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-bg-secondary/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="completed" name="Completed Tasks" stroke="#00E5FF" strokeWidth={4} dot={{ r: 4, fill: '#0B0F1A', strokeWidth: 2 }} activeDot={{ r: 8, stroke: '#00E5FF', strokeWidth: 2, fill: '#0B0F1A' }} />
                                <Line type="monotone" dataKey="new" name="New Tasks" stroke="#7A5CFF" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 0 }} activeDot={{ r: 6, stroke: '#7A5CFF', strokeWidth: 2, fill: '#0B0F1A' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 2. Priority Breakdown (Donut Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-xl font-black text-white">Priority Distribution</h3>
                            <p className="text-sm font-medium text-slate-400 mt-1">Current active tasks by tier</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full relative">
                        {/* Center glowing element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                    data={priorityStats.length > 0 ? priorityStats : [{ priority: 'No Data', count: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="priority"
                                    stroke="transparent"
                                >
                                    {priorityStats.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} style={{ filter: `drop-shadow(0px 0px 8px ${PIE_COLORS[index % PIE_COLORS.length]}80)` }} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-4xl font-black text-white">{taskStats.reduce((acc, curr) => acc + curr.count, 0)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6">
                        {priorityStats.map((entry, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary/50 border border-white/5">
                                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length], color: PIE_COLORS[i % PIE_COLORS.length] }} />
                                <span className="text-xs font-bold text-slate-300 capitalize">{entry.priority}</span>
                                <span className="text-xs font-black text-white ml-1">{entry.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 3. Workload by Department (Bar Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white">Department Workload</h3>
                            <p className="text-sm font-medium text-slate-400 mt-1">Cross-functional task assignments</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workloadByDept} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="dept" stroke="#64748b" fontSize={12} fontWeight="600" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                <Bar dataKey="tasks" name="Active Tasks" fill="#4F7CFF" radius={[6, 6, 0, 0]}>
                                    {workloadByDept.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 4. Daily Report Rate (Area Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col relative overflow-hidden"
                >
                    {/* Decorative glow */}
                    <div className="absolute bottom-0 right-0 w-full h-1/2 bg-success/5 blur-[80px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-white">Report Compliance</h3>
                            <p className="text-sm font-medium text-slate-400 mt-1">Daily standup submission rates (%)</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reportRates} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="rate" name="Submission Rate (%)" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
