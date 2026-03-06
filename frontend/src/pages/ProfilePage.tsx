import { useState } from 'react';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/ui/ToastProvider';
import { Camera, Mail, Shield, User, Save, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { user, setUser } = useAuthStore();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const avatarUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${res.data.url}`;

            await api.patch('/users/avatar', { avatarUrl });
            setUser({ ...user!, avatarUrl });
            toast('Profile picture updated!', 'success');
        } catch (error) {
            console.error('Upload failed', error);
            toast('Failed to upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.patch(`/users/${user?.id}`, { name });
            setUser(res.data);
            toast('Profile updated successfully!', 'success');
        } catch (error) {
            toast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-4xl font-black tracking-tighter mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your identity and account settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Avatar Section */}
                <div className="space-y-6">
                    <div className="relative group">
                        <div className="w-full aspect-square rounded-3xl bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-700 group-hover:border-primary transition-all">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-slate-600" />
                            )}

                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                {uploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
                            </label>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm font-bold">Profile Picture</p>
                            <p className="text-xs text-slate-500">JPG, PNG or GIF. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateProfile} className="glass p-8 rounded-3xl space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2 opacity-60">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                <div className="w-full bg-slate-900/10 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 flex items-center gap-2">
                                    <Mail size={16} />
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Shield className="text-primary" size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Role: {user?.role}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="glass p-8 rounded-3xl border-rose-500/20">
                        <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
                        <p className="text-sm text-slate-400 mb-6">Once you deactivate your account, you will no longer be able to log in or access your data. Please contact an administrator for recovery.</p>
                        <button className="text-rose-500 font-bold text-sm bg-rose-500/10 px-6 py-3 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                            Request Deactivation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
