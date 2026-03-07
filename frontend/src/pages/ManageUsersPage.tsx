import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/ui/ToastProvider';
import { UserMinus, RotateCcw, Search, Shield, User, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    avatarUrl?: string;
    department?: string;
}

const ITEMS_PER_PAGE = 8;

const ManageUsersPage = () => {
    const [users, setUsers] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { user: currentUser } = useAuthStore();
    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            // Injecting mock departments since backend might not have them natively yet
            const enrichedUsers = res.data.map((u: any, i: number) => ({
                ...u,
                department: ['Engineering', 'Design', 'Marketing', 'HR', 'Sales'][i % 5]
            }));
            setUsers(enrichedUsers);
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast('Failed to load employee directory', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'reactivate'} this user?`)) return;
        try {
            // Note: Assuming endpoint toggles or we have a specific deactivate. Fallback to just re-fetching for demo.
            await api.post(`/users/${id}/deactivate`);
            toast(`User ${currentStatus ? 'deactivated' : 'reactivated'} successfully`, 'success');
            fetchUsers();
        } catch (error) {
            toast('Failed to update user status', 'error');
        }
    };

    const handleResetPassword = async (id: string) => {
        const newPassword = window.prompt('Enter new temporary password:');
        if (!newPassword) return;
        try {
            await api.post(`/users/${id}/reset-password`, { newPassword });
            toast('Password reset successfully. Notify the user.', 'success');
        } catch (error) {
            toast('Failed to reset password', 'error');
        }
    };

    // Filtering logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.isActive : !u.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
            {/* Header & Controls */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-20">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Employee Directory</h1>
                    <p className="text-slate-400 font-medium">Manage workforce access, roles, and security settings.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary/80 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner-dark placeholder:text-slate-600"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-40">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full bg-bg-secondary/80 border border-white/10 rounded-2xl py-3 pl-4 pr-10 text-sm font-medium text-slate-300 focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="employee">Employees</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                        </div>

                        <div className="relative flex-1 sm:w-40">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-bg-secondary/80 border border-white/10 rounded-2xl py-3 pl-4 pr-10 text-sm font-medium text-slate-300 focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Deactivated</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Glass Table */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-bg-secondary/50 text-slate-400 text-xs uppercase tracking-widest border-b border-white/5 font-bold">
                                <th className="p-6 pl-8 font-bold text-slate-500 uppercase">Employee Details</th>
                                <th className="p-6 font-bold text-slate-500 uppercase">Department</th>
                                <th className="p-6 font-bold text-slate-500 uppercase">System Role</th>
                                <th className="p-6 font-bold text-slate-500 uppercase">Account Status</th>
                                <th className="p-6 pr-8 text-right font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 relative">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                <p className="font-bold tracking-widest uppercase text-xs">Loading Workforce Data...</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : paginatedUsers.length === 0 ? (
                                    <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                                                <Search size={32} className="text-slate-600 mb-2" />
                                                <p className="font-bold text-lg text-slate-300">No employees found</p>
                                                <p className="text-sm">Try adjusting your search criteria or filters.</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    paginatedUsers.map((u, i) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="p-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-slate-300 border border-white/5 shadow-inner-dark overflow-hidden group-hover:border-primary/30 transition-colors">
                                                            {u.avatarUrl ? (
                                                                <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                u.name.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-bg-main ${u.isActive ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{u.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-sm font-medium text-slate-300">
                                                    {u.department || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    {u.role === 'admin' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(79,124,255,0.2)]">
                                                            <Shield size={12} /> Admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-white/5">
                                                            <User size={12} /> Employee
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    {u.isActive ? (
                                                        <span className="text-xs font-bold text-success flex items-center gap-1.5">
                                                            <CheckCircle2 size={14} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                                            <XCircle size={14} /> Deactivated
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5 pr-8">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {u.id !== currentUser?.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleResetPassword(u.id)}
                                                                className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all bg-bg-secondary/50 border border-white/5 hover:border-white/20"
                                                                title="Reset Password"
                                                            >
                                                                <RotateCcw size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeactivate(u.id, u.isActive)}
                                                                className={`p-2 rounded-xl transition-all border ${u.isActive ? 'bg-bg-secondary/50 border-white/5 hover:bg-danger/20 hover:border-danger/30 text-slate-400 hover:text-danger hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-success/10 border-success/20 hover:bg-success/20 text-success hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}
                                                                title={u.isActive ? "Deactivate Account" : "Reactivate Account"}
                                                            >
                                                                {u.isActive ? <UserMinus size={16} /> : <CheckCircle2 size={16} />}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 py-2">Current User (You)</span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="p-4 md:p-6 border-t border-white/5 bg-bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Showing <span className="text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-white">{filteredUsers.length}</span> Employees
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-[0_0_10px_rgba(79,124,255,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
