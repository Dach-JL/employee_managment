import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Megaphone, Bell, Calendar as CalendarIcon, User as UserIcon, ChevronDown, ChevronUp, X, Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { io, Socket } from 'socket.io-client';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: Date;
    isNew?: boolean;
}

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { user } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

        socketRef.current.on('receiveAnnouncement', (data: any) => {
            setAnnouncements((prev) => [{ ...data, id: Date.now().toString(), date: new Date(), isNew: true }, ...prev]);
        });

        // Initialize with some mock data if empty for demo purposes
        setAnnouncements([
            {
                id: '1',
                title: 'Q3 Financial Results & Townhall',
                content: 'We are thrilled to announce that we have exceeded our Q3 targets by 15%!\n\nJoin us this Friday at 10 AM EST for the All-Hands Townhall where the executive team will walk through the numbers, highlight key wins, and discuss our strategic objectives for Q4.\n\nPlease submit any questions you have beforehand via the Anonymous Reporting tool.',
                author: 'Admin',
                date: new Date(Date.now() - 86400000), // 1 day ago
                isNew: true
            },
            {
                id: '2',
                title: 'New Office Security Protocols',
                content: 'Starting next Monday, we will be rolling out a new badge access system for the main downtown office.\n\nAll employees must visit the security desk on the ground floor to receive their new NFC-enabled smart badges. The old badges will be deactivated on Friday at 5 PM local time. If you work remotely, this does not apply to you.\n\nThank you for your cooperation in keeping our workspace secure.',
                author: 'Admin',
                date: new Date(Date.now() - 3 * 86400000), // 3 days ago
            }
        ]);

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        const data = { title, content, author: user?.name || 'Admin', isNew: true };
        socketRef.current?.emit('sendAnnouncement', data);

        setIsAdding(false);
        setTitle('');
        setContent('');
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);

        // Remove 'new' badge when expanded
        setAnnouncements(prev => prev.map(a =>
            a.id === id ? { ...a, isNew: false } : a
        ));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(79,124,255,0.3)]">
                            <Megaphone size={20} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black gradient-text tracking-tight">Announcements</h1>
                    </div>
                    <p className="text-slate-400 font-medium ml-1">Official communications and company-wide updates.</p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isAdding
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-primary hover:bg-primary-hover text-white shadow-primary/30'
                            }`}
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                        {isAdding ? 'Cancel' : 'New Post'}
                    </button>
                )}
            </header>

            {/* Admin Add Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden relative z-20"
                    >
                        <form onSubmit={handlePost} className="glass-card p-6 md:p-8 rounded-3xl space-y-5 border border-primary/30 shadow-[0_10px_40px_-10px_rgba(79,124,255,0.2)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <h2 className="font-bold text-sm text-primary uppercase tracking-widest">Drafting New Announcement</h2>
                            </div>

                            <div>
                                <input
                                    required
                                    placeholder="Announcement Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none text-lg font-bold placeholder:font-normal placeholder:text-slate-500 transition-all font-inter"
                                />
                            </div>
                            <div>
                                <textarea
                                    required
                                    placeholder="Write your announcement content here. Markdown is fully supported in the next version."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-5 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none min-h-[160px] resize-y placeholder:text-slate-500 font-medium leading-relaxed transition-all"
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary-hover px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,124,255,0.4)] text-white"
                                >
                                    <Send size={16} />
                                    Publish Announcement
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Announcements Feed */}
            <div className="space-y-6 relative z-10">
                {announcements.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-3xl border border-white/5">
                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Megaphone className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">All caught up</h3>
                        <p className="text-slate-500 font-medium">There are no announcements to display right now.</p>
                    </div>
                ) : (
                    announcements.map((item, index) => {
                        const isExpanded = expandedId === item.id;
                        const contentPreview = item.content.length > 150 ? item.content.slice(0, 150) + '...' : item.content;
                        const needsExpansion = item.content.length > 150;

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-3xl relative group overflow-hidden border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* Neon left border indicator */}
                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${item.isNew ? 'bg-primary shadow-[0_0_15px_rgba(79,124,255,0.8)]' : 'bg-slate-700'}`} />

                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                                        <div className="space-y-1 pr-6 flex-1">
                                            {item.isNew && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 mb-2">
                                                    <Bell size={10} className="animate-pulse" /> New
                                                </span>
                                            )}
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight leading-snug">{item.title}</h3>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0 bg-bg-secondary/50 px-3 py-1.5 rounded-lg border border-white/5">
                                            <CalendarIcon size={12} />
                                            {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isExpanded ? 'auto' : 'auto' }}
                                            className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base"
                                        >
                                            {isExpanded ? item.content : contentPreview}
                                        </motion.div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs ring-2 ring-slate-800/50 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <UserIcon size={14} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-300 block">{item.author}</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Posted By</span>
                                            </div>
                                        </div>

                                        {needsExpansion && (
                                            <button
                                                onClick={() => toggleExpand(item.id)}
                                                className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10"
                                            >
                                                {isExpanded ? (
                                                    <>Show Less <ChevronUp size={14} /></>
                                                ) : (
                                                    <>Read More <ChevronDown size={14} /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
