import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { UserMinus, RotateCcw, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    avatarUrl?: string;
}

const ManageUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: string) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        try {
            await api.post(`/users/${id}/deactivate`);
            fetchUsers();
        } catch (error) {
            alert('Failed to deactivate user');
        }
    };

    const handleResetPassword = async (id: string) => {
        const newPassword = window.prompt('Enter new password:');
        if (!newPassword) return;
        try {
            await api.post(`/users/${id}/reset-password`, { newPassword });
            alert('Password reset successfully');
        } catch (error) {
            alert('Failed to reset password');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Manage Employees</h1>
                    <p className="text-slate-400">Control system access and account settings.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </header>

            <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
                            <th className="p-6">Employee</th>
                            <th className="p-6">Role</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={4} className="p-10 text-center text-slate-500">Loading workforce...</td></tr>
                        ) : filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                                            {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : u.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <span className="text-sm">{u.isActive ? 'Active' : 'Deactivated'}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    {u.id !== currentUser?.id && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleResetPassword(u.id)}
                                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                                                title="Reset Password"
                                            >
                                                <RotateCcw size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeactivate(u.id)}
                                                className={`p-2 rounded-lg transition-all ${u.isActive ? 'hover:bg-rose-500/20 text-slate-400 hover:text-rose-500' : 'text-slate-600 cursor-not-allowed'
                                                    }`}
                                                disabled={!u.isActive}
                                                title="Deactivate"
                                            >
                                                <UserMinus size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;
