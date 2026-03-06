import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../api/api';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsPage = () => {
    const [overview, setOverview] = useState<any>(null);
    const [taskStats, setTaskStats] = useState<any[]>([]);
    const [priorityStats, setPriorityStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ovRes, taskRes, prioRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/tasks'),
                    api.get('/analytics/priorities')
                ]);
                setOverview(ovRes.data);
                setTaskStats(taskRes.data);
                setPriorityStats(prioRes.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center">Loading Data...</div>;

    const stats = [
        { label: 'Total Employees', value: overview?.totalEmployees, icon: Users, color: 'text-blue-400' },
        { label: 'Active Tasks', value: overview?.totalTasks, icon: FileText, color: 'text-indigo-400' },
        { label: 'Reports Filed', value: overview?.totalReports, icon: CheckCircle, color: 'text-emerald-400' },
        { label: 'System Health', value: 'Optimal', icon: TrendingUp, color: 'text-orange-400' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-bold gradient-text">System Analytics</h1>
                <p className="text-slate-400 mt-2">Deeper insights into team performance and task cycles.</p>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-3xl"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Task Distribution</h3>
                        <Clock size={20} className="text-slate-500" />
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="status" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    cursor={{ fill: '#1e293b' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Priority Breakdown */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Priority Breakdown</h3>
                        <AlertTriangle size={20} className="text-slate-500" />
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="priority"
                                >
                                    {priorityStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {priorityStats.map((entry, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-xs text-slate-400 capitalize">{entry.priority}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
