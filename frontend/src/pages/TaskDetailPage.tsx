import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import api from '../api/api';
import {
    ArrowLeft, Clock, AlertCircle, CheckCircle2, Paperclip,
    Download, Upload, Loader2, MessageSquare, Send, User as UserIcon
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    assignee?: { id: string; name: string; email: string };
    attachments?: { name: string; url: string; size: number; type: string }[];
}

const TaskDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Mock comments since backend doesn't have a comments entity yet
    const [comments, setComments] = useState<any[]>([
        { id: '1', user: 'System', text: 'Task created.', time: '2 days ago', isSystem: true },
    ]);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTask = async () => {
        try {
            const res = await api.get(`/tasks/${id}`);
            setTask(res.data);
        } catch (error) {
            console.error('Failed to fetch task details', error);
            navigate('/tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !task) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newAttachment = {
                name: res.data.originalname,
                url: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${res.data.url}`,
                size: res.data.size,
                type: res.data.mimetype
            };

            await api.post(`/tasks/${task.id}/attachments`, {
                attachments: [newAttachment]
            });

            fetchTask();
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!task) return;
        try {
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            fetchTask();
            setComments(prev => [...prev, { id: Date.now().toString(), user: user?.name, text: `Changed status to ${newStatus}`, time: 'Just now', isSystem: true }]);
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setComments(prev => [...prev, {
            id: Date.now().toString(),
            user: user?.name || 'Unknown',
            text: commentText,
            time: 'Just now',
            isSystem: false
        }]);
        setCommentText('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!task) return null;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-danger/10 text-danger border-danger/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
            case 'medium': return 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
            default: return 'bg-success/10 text-success border-success/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-success" size={20} />;
            case 'in-progress': return <Clock className="text-neon-blue" size={20} />;
            case 'pending': return <AlertCircle className="text-warning" size={20} />;
            default: return <AlertCircle className="text-slate-500" size={20} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6 pb-20"
        >
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/tasks')}
                        className="p-2 glass rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                            {task.priority} Priority
                        </span>
                        <h1 className="text-2xl font-bold text-slate-100">{task.title}</h1>
                    </div>
                </div>

                {isAdmin && task.status !== 'completed' && (
                    <div className="flex gap-3 relative z-10">
                        <button
                            onClick={() => handleStatusUpdate('completed')}
                            className="bg-success/20 hover:bg-success/30 border border-success/50 text-success px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                        >
                            <CheckCircle2 size={16} /> Approve & Close
                        </button>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <section className="glass-card p-6 md:p-8 relative overflow-hidden group">
                        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-700" />
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                            Description
                        </h2>
                        <div className="text-slate-300 leading-relaxed font-medium bg-bg-secondary/40 p-6 rounded-2xl border border-white/5 relative z-10">
                            {task.description}
                        </div>
                    </section>

                    {/* Attachments */}
                    <section className="glass-card p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Paperclip size={14} /> Attachments
                            </h2>
                            <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">{task.attachments?.length || 0}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {task.attachments?.map((file, i) => (
                                <div key={i} className="bg-bg-secondary/60 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Paperclip size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-slate-200 truncate pr-2">{file.name}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-white/5 hover:bg-primary text-slate-400 hover:text-white rounded-xl transition-all hover:shadow-[0_0_10px_rgba(79,124,255,0.4)] flex-shrink-0"
                                    >
                                        <Download size={16} />
                                    </a>
                                </div>
                            ))}

                            <label className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-primary/5 min-h-[90px] group">
                                <input type="file" className="hidden" onChange={handleFileUpload} />
                                {uploading ? (
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                ) : (
                                    <>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Upload size={14} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload File</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </section>

                    {/* Comments Thread */}
                    <section className="glass-card p-6 md:p-8 flex flex-col h-[500px]">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MessageSquare size={14} /> Discussion Thread
                        </h2>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 scrollbar-hide">
                            {comments.map((comment) => (
                                <div key={comment.id} className={`flex gap-4 ${comment.isSystem ? 'opacity-60 justify-center' : ''}`}>
                                    {!comment.isSystem && (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                            {comment.user.charAt(0)}
                                        </div>
                                    )}
                                    <div className={comment.isSystem ? 'text-center' : 'flex-1'}>
                                        {!comment.isSystem && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-300">{comment.user}</span>
                                                <span className="text-[10px] text-slate-500">{comment.time}</span>
                                            </div>
                                        )}
                                        <div className={`text-sm ${comment.isSystem ? 'text-[10px] uppercase tracking-widest font-bold text-slate-500' : 'bg-bg-secondary/60 border border-white/5 p-4 rounded-2xl rounded-tl-sm text-slate-300'}`}>
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddComment} className="relative mt-auto">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-bg-secondary/80 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </section>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <section className="glass-card p-6 relative overflow-hidden">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Current Status</h2>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${task.status === 'completed' ? 'bg-success/10 text-success' :
                                    task.status === 'in-progress' ? 'bg-neon-blue/10 text-neon-blue' :
                                        'bg-warning/10 text-warning'
                                }`}>
                                {getStatusIcon(task.status)}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white uppercase tracking-wider">{task.status.replace('-', ' ')}</p>
                                <p className="text-xs text-slate-400">Task Stage</p>
                            </div>
                        </div>

                        {/* Status Actions */}
                        {!isAdmin && task.status !== 'completed' && (
                            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                {task.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate('in-progress')}
                                        className="w-full py-2.5 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/30 rounded-xl text-xs font-bold transition-all"
                                    >
                                        Start Work
                                    </button>
                                )}
                                {task.status === 'in-progress' && (
                                    <button
                                        onClick={() => handleStatusUpdate('completed')}
                                        className="w-full py-2.5 bg-success/20 hover:bg-success/30 text-success border border-success/30 rounded-xl text-xs font-bold transition-all shadow-glow-[var(--color-success)]"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Metadata Card */}
                    <section className="glass-card p-6 space-y-6">
                        <div>
                            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><UserIcon size={12} /> Assignee</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
                                    {task.assignee?.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200">{task.assignee?.name || 'Unassigned'}</p>
                                    <p className="text-[10px] text-slate-500">{task.assignee?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12} /> Due Date</h2>
                            <p className="text-sm font-bold text-slate-200">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No strict deadline'}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskDetailPage;
