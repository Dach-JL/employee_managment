import { Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

const activities = [
    {
        id: 1,
        type: 'task',
        title: 'Task Approved',
        description: 'Your task "Logo Design" has been approved.',
        time: '2h ago',
        icon: <CheckCircle2 size={16} className="text-success" />,
        color: 'success'
    },
    {
        id: 2,
        type: 'announcement',
        title: 'New Announcement',
        description: 'Quarterly review meeting on Friday.',
        time: '4h ago',
        icon: <MessageSquare size={16} className="text-neon-purple" />,
        color: 'neon-purple'
    },
    {
        id: 3,
        type: 'alert',
        title: 'Urgent Deadline',
        description: '"API Integration" is due in 3 hours.',
        time: '5h ago',
        icon: <AlertCircle size={16} className="text-danger" />,
        color: 'danger'
    }
];

const ActivityPanel = () => {
    return (
        <aside className="w-[300px] glass-panel border-l border-white/5 flex flex-col hidden xl:flex">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-glow">Recent Activity</h3>
                <span className="p-1 px-2 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">Live</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[1px] before:bg-white/5 last:before:display-none">
                        <div className="absolute left-[-8px] top-1.5 w-4 h-4 rounded-full glass border border-white/10 flex items-center justify-center bg-bg-main z-10">
                            <div className={`w-1.5 h-1.5 rounded-full bg-${activity.color}`} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activity.type}</span>
                                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                                    <Clock size={10} /> {activity.time}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-200">{activity.title}</p>
                            <p className="text-xs text-slate-400 line-clamp-2">{activity.description}</p>
                        </div>
                    </div>
                ))}

                <button className="w-full p-4 rounded-xl border border-dashed border-white/10 text-slate-500 text-xs font-semibold hover:border-primary/50 hover:text-primary transition-all">
                    View Full Feed
                </button>
            </div>

            <div className="p-6 border-t border-white/10">
                <div className="glass-card p-4 space-y-3 relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Tip of the day</p>
                    <p className="text-sm text-slate-300 leading-relaxed italic">"Productivity is never an accident. It is always the result of a commitment to excellence."</p>
                </div>
            </div>
        </aside>
    );
};

export default ActivityPanel;
