import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Megaphone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { io, Socket } from 'socket.io-client';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: Date;
}

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

        socketRef.current.on('receiveAnnouncement', (data: any) => {
            setAnnouncements((prev) => [{ ...data, id: Date.now().toString(), date: new Date() }, ...prev]);
        });

        return () => socketRef.current?.disconnect();
    }, []);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        const data = { title, content, author: user?.name || 'Admin' };
        socketRef.current?.emit('sendAnnouncement', data);

        setIsAdding(false);
        setTitle('');
        setContent('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">Announcements</h1>
                    <p className="text-slate-400 mt-2">Latest updates from the company.</p>
                </div>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-primary-hover px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} /> New Post
                    </button>
                )}
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handlePost} className="glass p-8 rounded-3xl space-y-4 mb-8">
                            <input
                                required
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 px-4 text-white focus:border-primary outline-none"
                            />
                            <textarea
                                required
                                placeholder="Announcement content..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 px-4 text-white focus:border-primary outline-none min-h-[150px]"
                            />
                            <div className="flex gap-3">
                                <button type="submit" className="bg-primary px-8 py-3 rounded-xl font-bold">Post Now</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white px-4">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {announcements.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl">
                        <Megaphone className="mx-auto text-slate-700 mb-4" size={48} />
                        <p className="text-slate-500">No announcements yet.</p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-8 rounded-3xl relative group overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                <span className="text-xs text-slate-500 px-3 py-1 bg-slate-800 rounded-full">{item.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {item.author[0]}
                                    </div>
                                    <span className="text-sm font-medium text-slate-400">{item.author}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
