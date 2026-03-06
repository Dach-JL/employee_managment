import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Hash, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    user: string;
    text: string;
    role: string;
    timestamp: Date;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const { user } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

        socketRef.current.on('receiveMessage', (data: any) => {
            setMessages((prev) => [...prev, { ...data, id: Math.random().toString(), timestamp: new Date() }]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            user: user?.name || 'Anonymous',
            text: inputText,
            role: user?.role || 'employee',
        };

        socketRef.current?.emit('sendMessage', messageData);
        setInputText('');
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col glass rounded-3xl overflow-hidden">
            <header className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                        <Hash size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl">Company Workspace</h2>
                        <p className="text-xs text-slate-400">Real-time collaboration</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.user === user?.name ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.user === user?.name ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] group ${msg.user === user?.name ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-xs font-bold text-slate-400">{msg.user}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{msg.role}</span>
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.user === user?.name
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-700 bg-slate-800/30">
                <div className="relative group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:bg-primary-hover rounded-xl flex items-center justify-center transition-all active:scale-90"
                    >
                        <Send size={18} className="text-white" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPage;
