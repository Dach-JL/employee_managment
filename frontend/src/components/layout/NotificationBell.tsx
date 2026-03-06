import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationBell = () => {
    const [unreadCount] = useState(3); // Mock unread count

    return (
        <button className="relative p-2 rounded-xl glass hover:border-primary/50 transition-all group">
            <Bell size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-[10px] font-bold text-white flex items-center justify-center rounded-full animate-pulse-glow">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;
