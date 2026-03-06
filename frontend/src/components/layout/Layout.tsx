import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, LayoutDashboard, CheckSquare, Users, Bell, FileText, ShieldAlert, MessageSquare, Mail, BarChart } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-slate-700 flex flex-col shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => navigate('/')}>Workforce</h1>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" path="/" currentPath={location.pathname} onClick={() => navigate('/')} />
                    <NavItem icon={<CheckSquare size={20} />} label="Tasks" path="/tasks" currentPath={location.pathname} onClick={() => navigate('/tasks')} />
                    <NavItem icon={<FileText size={20} />} label="Daily Report" path="/reports/daily" currentPath={location.pathname} onClick={() => navigate('/reports/daily')} />
                    <NavItem icon={<ShieldAlert size={20} />} label="Anonymous Report" path="/reports/anonymous" currentPath={location.pathname} onClick={() => navigate('/reports/anonymous')} />
                    {user?.role === 'admin' && (
                        <NavItem icon={<Users size={20} />} label="Employees" path="/employees" currentPath={location.pathname} onClick={() => navigate('/employees')} />
                    )}
                    <NavItem icon={<MessageSquare size={20} />} label="Chat" path="/chat" currentPath={location.pathname} onClick={() => navigate('/chat')} />
                    <NavItem icon={<Mail size={20} />} label="Messages" path="/messages" currentPath={location.pathname} onClick={() => navigate('/messages')} />
                    <NavItem icon={<Bell size={20} />} label="Announcements" path="/announcements" currentPath={location.pathname} onClick={() => navigate('/announcements')} />
                    {user?.role === 'admin' && (
                        <NavItem icon={<BarChart size={20} />} label="Analytics" path="/analytics" currentPath={location.pathname} onClick={() => navigate('/analytics')} />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => navigate('/profile')}
                        className={`flex items-center gap-3 p-2 mb-4 w-full rounded-xl transition-all group ${location.pathname === '/profile' ? 'bg-primary/10' : 'hover:bg-slate-800'}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0] || 'U'
                            )}
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="font-bold truncate group-hover:text-primary transition-colors">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user?.role || 'role'}</p>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-950 p-8">
                <div className="animate-page">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, path, currentPath, onClick }: { icon: React.ReactNode; label: string; path: string; currentPath: string; onClick: () => void }) => {
    const isActive = currentPath === path;
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-primary/5 hover:text-primary'
                }`}
        >
            {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            <span className={`transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
};

export default Layout;
