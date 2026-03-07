import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Hash, Search, Paperclip, Smile, MoreVertical } from 'lucide-react';
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
    const [isTyping, setIsTyping] = useState(false);
    const [activeChannel, setActiveChannel] = useState('general');
    const { user } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mock data for sidebars
    const channels = [
        { id: 'general', name: 'general', unread: 0 },
        { id: 'announcements', name: 'announcements', unread: 3 },
        { id: 'engineering', name: 'engineering', unread: 0 },
        { id: 'design', name: 'design', unread: 5 },
    ];

    const onlineUsers = [
        { id: '1', name: 'Alice Smith', role: 'admin', status: 'online' },
        { id: '2', name: 'Bob Jones', role: 'employee', status: 'online' },
        { id: '3', name: 'Charlie Brown', role: 'employee', status: 'away' },
    ];

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
        // Auto-scroll to bottom on new message
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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
        setIsTyping(false);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        if (!isTyping) setIsTyping(true); // Mocking typing state locally for visual effect

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4 max-w-[1600px] mx-auto">

            {/* Left Panel - Channels */}
            <div className="hidden md:flex w-64 glass-card rounded-3xl flex-col overflow-hidden border border-white/5 relative group">
                <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

                <div className="p-6 border-b border-white/5 relative z-10">
                    <h2 className="font-black text-lg gradient-text-glow tracking-tighter mix-blend-screen">Channels</h2>

                    <div className="mt-4 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find channel..."
                            className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scrollbar-hide">
                    {channels.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveChannel(c.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all group/btn ${activeChannel === c.id ? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--color-primary)] bg-gradient-to-r from-primary/5 to-transparent' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Hash size={16} className={activeChannel === c.id ? 'text-primary' : 'text-slate-500 group-hover/btn:text-slate-300'} />
                                {c.name}
                            </span>
                            {c.unread > 0 && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeChannel === c.id ? 'bg-primary text-white' : 'bg-neon-purple/20 text-neon-purple shadow-[0_0_10px_rgba(122,92,255,0.4)]'}`}>
                                    {c.unread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Middle Panel - Chat Area */}
            <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="px-6 py-4 border-b border-white/5 bg-bg-secondary/40 flex items-center justify-between z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(79,124,255,0.2)]">
                            <Hash size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-xl text-slate-100 tracking-tight">#{activeChannel}</h2>
                            <p className="text-xs text-slate-400 font-medium">{onlineUsers.length} members currently active</p>
                        </div>
                    </div>

                    <button className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </header>

                {/* Messages Array */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-bg-secondary/20"
                >
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                            <Hash size={48} className="text-slate-600" />
                            <p className="font-bold">This is the beginning of the #{activeChannel} channel.</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg, index) => {
                            const isMe = msg.user === user?.name;
                            const showAvatar = index === 0 || messages[index - 1].user !== msg.user;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar Column */}
                                    <div className="w-10 flex-shrink-0 flex justify-center">
                                        {showAvatar && (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isMe ? 'bg-primary text-white shadow-[0_0_10px_rgba(79,124,255,0.4)]' : 'bg-slate-700 text-slate-300'}`}>
                                                {msg.user.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Column */}
                                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {showAvatar && (
                                            <div className="flex items-baseline gap-2 mb-1 px-1">
                                                <span className="text-sm font-bold text-slate-300">{msg.user}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{msg.role}</span>
                                            </div>
                                        )}
                                        <div className={`px-4 py-3 rounded-2xl relative group ${isMe
                                            ? 'bg-primary text-white rounded-tr-sm shadow-[0_5px_15px_rgba(79,124,255,0.2)]'
                                            : 'bg-bg-secondary/80 text-slate-300 rounded-tl-sm border border-white/5'
                                            }`}>
                                            <p className="text-sm leading-relaxed font-medium">{msg.text}</p>

                                            {/* Timestamp (hover) */}
                                            <span className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? '-left-12' : '-right-12'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex gap-3"
                            >
                                <div className="w-10 flex-shrink-0" />
                                <div className="px-4 py-3 bg-bg-secondary/40 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1.5 w-fit">
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-white/5 bg-bg-secondary/40 z-10 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                        <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors hover:bg-white/5 rounded-xl hidden sm:block">
                            <Paperclip size={20} />
                        </button>

                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInput}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-slate-600 shadow-inner-dark"
                                placeholder={`Message #${activeChannel}...`}
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent-purple transition-colors">
                                <Smile size={20} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-12 h-12 flex-shrink-0 bg-primary hover:bg-primary-hover disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(79,124,255,0.4)] disabled:shadow-none"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Panel - Online Users */}
            <div className="hidden lg:flex w-64 glass-card rounded-3xl flex-col border border-white/5">
                <div className="p-6 border-b border-white/5">
                    <h2 className="font-bold text-sm text-slate-300 uppercase tracking-widest">Team</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Online — 2</h3>
                        <div className="space-y-1">
                            {onlineUsers.filter(u => u.status === 'online').map(u => (
                                <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-bg-main rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{u.name.split(' ')[0]}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">{u.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Away — 1</h3>
                        <div className="space-y-1">
                            {onlineUsers.filter(u => u.status === 'away').map(u => (
                                <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group opacity-60 hover:opacity-100">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-warning border-2 border-bg-main rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{u.name.split(' ')[0]}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">{u.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ChatPage;

