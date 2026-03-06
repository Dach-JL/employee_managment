import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, LayoutDashboard, CheckSquare, Users, Bell, FileText, ShieldAlert, MessageSquare, Mail, BarChart } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-slate-700 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold gradient-text">Workforce</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/')} />
                    <NavItem icon={<CheckSquare size={20} />} label="Tasks" onClick={() => navigate('/tasks')} />
                    <NavItem icon={<FileText size={20} />} label="Daily Report" onClick={() => navigate('/reports/daily')} />
                    <NavItem icon={<ShieldAlert size={20} />} label="Anonymous Report" onClick={() => navigate('/reports/anonymous')} />
                    {user?.role === 'admin' && (
                        <NavItem icon={<Users size={20} />} label="Employees" onClick={() => navigate('/employees')} />
                    )}
                    <NavItem icon={<MessageSquare size={20} />} label="Chat" onClick={() => navigate('/chat')} />
                    <NavItem icon={<Mail size={20} />} label="Messages" onClick={() => navigate('/messages')} />
                    <NavItem icon={<Bell size={20} />} label="Announcements" onClick={() => navigate('/announcements')} />
                    {user?.role === 'admin' && (
                        <NavItem icon={<BarChart size={20} />} label="Analytics" onClick={() => navigate('/analytics')} />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 p-2 mb-4 w-full hover:bg-slate-800 rounded-xl transition-all group"
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
                {children}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group"
    >
        <span className="text-slate-400 group-hover:text-primary transition-colors">{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);

export default Layout;
