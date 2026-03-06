import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
    LogOut,
    LayoutDashboard,
    CheckSquare,
    Users,
    FileText,
    ShieldAlert,
    MessageSquare,
    Mail,
    Bell,
    BarChart,
    ChevronRight
} from 'lucide-react';
import TopBar from './TopBar';
import ActivityPanel from './ActivityPanel';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-bg-main text-slate-200 selection:bg-primary/20 overflow-hidden">
            {/* Sidebar (Left Column - 260px) */}
            <aside className="w-[260px] glass-panel border-r border-white/5 flex flex-col z-40 hidden lg:flex shrink-0">
                <div className="h-20 flex items-center px-8">
                    <h1
                        className="text-2xl font-black gradient-text-glow cursor-pointer tracking-tighter"
                        onClick={() => navigate('/')}
                    >
                        WORKFORCE
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Core</p>
                    <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" path="/" currentPath={location.pathname} onClick={() => navigate('/')} />
                    <NavItem icon={<CheckSquare size={18} />} label="Tasks" path="/tasks" currentPath={location.pathname} onClick={() => navigate('/tasks')} />

                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 mt-8">Reporting</p>
                    <NavItem icon={<FileText size={18} />} label="Daily Report" path="/reports/daily" currentPath={location.pathname} onClick={() => navigate('/reports/daily')} />
                    <NavItem icon={<ShieldAlert size={18} />} label="Anonymous Report" path="/reports/anonymous" currentPath={location.pathname} onClick={() => navigate('/reports/anonymous')} />

                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 mt-8">Social</p>
                    <NavItem icon={<MessageSquare size={18} />} label="Chat" path="/chat" currentPath={location.pathname} onClick={() => navigate('/chat')} />
                    <NavItem icon={<Bell size={18} />} label="Announcements" path="/announcements" currentPath={location.pathname} onClick={() => navigate('/announcements')} />

                    {user?.role === 'admin' && (
                        <>
                            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 mt-8">Admin</p>
                            <NavItem icon={<Users size={18} />} label="Employees" path="/employees" currentPath={location.pathname} onClick={() => navigate('/employees')} />
                            <NavItem icon={<BarChart size={18} />} label="Analytics" path="/analytics" currentPath={location.pathname} onClick={() => navigate('/analytics')} />
                        </>
                    )}
                </nav>

                {/* User Card at Bottom */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <button
                        onClick={() => navigate('/profile')}
                        className={`flex items-center gap-3 p-3 w-full rounded-2xl transition-all group overflow-hidden relative ${location.pathname === '/profile' ? 'glass border-primary/20 glow-blue' : 'hover:bg-white/5'
                            }`}
                    >
                        <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-primary font-bold overflow-hidden border-primary/20 shrink-0">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0] || 'U'
                            )}
                        </div>
                        <div className="overflow-hidden text-left flex-1">
                            <p className="text-sm font-bold truncate text-slate-200 group-hover:text-primary transition-colors">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest">{user?.role || 'role'}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-xl text-slate-500 hover:text-danger hover:bg-danger/5 transition-all text-xs font-semibold"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Wrapper (Middle + Right Column) */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <TopBar />

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content (Middle Column) */}
                    <main className="flex-1 overflow-y-auto no-scrollbar p-8 bg-bg-main relative">
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative animate-page max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>

                    {/* Activity Panel (Right Column - 300px) */}
                    <ActivityPanel />
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, path, currentPath, onClick }: { icon: React.ReactNode; label: string; path: string; currentPath: string; onClick: () => void }) => {
    const isActive = currentPath === path;

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden ${isActive
                    ? 'glass border-primary/20 text-primary font-bold glow-blue'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
        >
            {isActive && (
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            )}
            <span className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}>
                {icon}
            </span>
            <span className="text-sm tracking-tight relative z-10">{label}</span>
            {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            )}
        </button>
    );
};

export default Layout;
