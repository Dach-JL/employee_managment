import { Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationBell from './NotificationBell';

const TopBar = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
            {/* Global Search */}
            <div className="flex-1 max-w-xl relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search tasks, employees, or reports... (Ctrl+K)"
                    className="w-full glass-input pl-12 h-11 focus:border-primary/50"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <NotificationBell />

                <div className="h-8 w-[1px] bg-white/10" />

                <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-primary font-bold overflow-hidden border-primary/20">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.[0] || 'U'
                        )}
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-200">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Member'}</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
