import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Clock, CheckCircle, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold gradient-text">Hello, {user?.name || 'User'}</h1>
                <p className="text-slate-400 mt-2">Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<ListTodo className="text-primary" />} label="Active Tasks" value="12" />
                <StatCard icon={<Clock className="text-warning" />} label="In Progress" value="5" />
                <StatCard icon={<CheckCircle className="text-success" />} label="Completed" value="48" />
                <StatCard icon={<AlertCircle className="text-danger" />} label="Overdue" value="3" />
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
                    <div className="space-y-4">
                        <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center justify-between group">
                            <span>Submit Daily Report</span>
                            <span className="text-slate-500 group-hover:text-white">→</span>
                        </button>
                        <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center justify-between group">
                            <span>View All Tasks</span>
                            <span className="text-slate-500 group-hover:text-white">→</span>
                        </button>
                        <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center justify-between group">
                            <span>Anonymous Feedback</span>
                            <span className="text-slate-500 group-hover:text-white">→</span>
                        </button>
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
