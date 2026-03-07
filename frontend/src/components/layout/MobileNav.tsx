import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, MessageSquare, FileText, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const MobileNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    if (!user) return null;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: MessageSquare, label: 'Chat', path: '/chat' },
        { icon: FileText, label: 'Reports', path: '/reports/daily' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`relative w-14 h-14 flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md" />
                        )}
                        <item.icon size={20} className={`relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`} />
                        <span className="text-[9px] font-bold tracking-wider relative z-10">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileNav;
