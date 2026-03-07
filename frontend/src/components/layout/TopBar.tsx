import { Search, ChevronDown, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationBell from './NotificationBell';

interface TopBarProps {
    onMenuClick?: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const { user } = useAuthStore();

    return (
        <header className="h-16 lg:h-20 glass-panel border-b border-white/5 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
            {/* Mobile Menu Toggle & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-xl relative">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors lg:hidden"
                >
                    <Menu size={24} />
                </button>

                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search... (Ctrl+K)"
                        className="w-full glass-input pl-12 h-10 lg:h-11 focus:border-primary/50 text-sm"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-6 ml-4">
                <NotificationBell />

                <div className="hidden sm:block h-8 w-[1px] bg-white/10" />

                <button className="flex items-center gap-2 lg:gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl glass-card flex items-center justify-center text-primary font-bold overflow-hidden border-primary/20 shrink-0">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.[0] || 'U'
                        )}
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-200 truncate max-w-[100px] xl:max-w-none">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Member'}</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors hidden sm:block" />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
