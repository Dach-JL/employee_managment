import type { Task } from '../../pages/TasksPage';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface CalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const CalendarView = ({ tasks, onTaskClick }: CalendarViewProps) => {
    // Basic calendar logic for current month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)

    const days = useMemo(() => {
        const arr = [];
        // empty slots for padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            arr.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            arr.push(i);
        }
        return arr;
    }, [daysInMonth, firstDayOfMonth]);

    const getTasksForDay = (day: number) => {
        return tasks.filter(t => {
            const d = new Date(t.dueDate);
            return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    const monthName = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-[-100px] left-[50%] -translate-x-1/2 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-widest">{monthName}</h2>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-3 mb-2 relative z-10">
                {weekDays.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-2">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-3 relative z-10">
                {days.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="h-24 md:h-32 rounded-2xl bg-white/[0.02]" />;
                    }

                    const dayTasks = getTasksForDay(day);
                    const isToday = day === today.getDate();

                    return (
                        <div
                            key={day}
                            className={`h-24 md:h-32 rounded-2xl border transition-colors flex flex-col p-1.5 md:p-2 ${isToday ? 'border-neon-purple bg-neon-purple/5 shadow-[0_0_15px_rgba(122,92,255,0.2)]' : 'border-white/5 bg-bg-secondary/40 hover:border-white/20'}`}
                        >
                            <div className="flex justify-end">
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-neon-purple text-white' : 'text-slate-400'}`}>
                                    {day}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto mt-1 space-y-1 scrollbar-hide">
                                {dayTasks.map(task => (
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        key={task.id}
                                        onClick={() => onTaskClick(task)}
                                        className={`text-[9px] md:text-[10px] font-bold truncate px-1.5 py-1 rounded cursor-pointer ${task.status === 'completed' ? 'bg-success/20 text-success' :
                                            task.priority === 'high' ? 'bg-danger/20 text-danger' :
                                                'bg-neon-blue/20 text-neon-blue'
                                            }`}
                                    >
                                        {task.title}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
