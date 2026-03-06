import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/api';
import { Send, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivateMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    senderName: string;
    createdAt: Date;
}

interface User {
    id: string;
    name: string;
    role: string;
}

const PrivateMessagingPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user: currentUser } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch users for the sidebar
        api.get('/users/search').then(res => {
            setUsers(res.data.filter((u: User) => u.id !== currentUser?.id));
        });

        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
            query: { userId: currentUser?.id }
        });

        socketRef.current.on('receivePrivateMessage', (data: any) => {
            if (
                (data.senderId === selectedUser?.id && data.receiverId === currentUser?.id) ||
                (data.senderId === currentUser?.id && data.receiverId === selectedUser?.id)
            ) {
                setMessages(prev => [...prev, { ...data, createdAt: new Date() }]);
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [currentUser, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            api.get(`/messages/conversation/${selectedUser.id}`).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUser) return;

        const messageData = {
            senderId: currentUser?.id,
            receiverId: selectedUser.id,
            content: inputText,
            senderName: currentUser?.name || 'Me'
        };

        socketRef.current?.emit('sendPrivateMessage', messageData);
        setInputText('');
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] flex gap-6">
            {/* Users Sidebar */}
            <div className="w-80 glass rounded-3xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredUsers.map(u => (
                        <button
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${selectedUser?.id === u.id ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selectedUser?.id === u.id ? 'bg-white/20' : 'bg-slate-700'
                                }`}>
                                {u.name[0]}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">{u.name}</p>
                                <p className="text-[10px] uppercase tracking-tighter opacity-60">{u.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden">
                {selectedUser ? (
                    <>
                        <header className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                                {selectedUser.name[0]}
                            </div>
                            <div>
                                <h2 className="font-bold">{selectedUser.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-400">Online</span>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl ${msg.senderId === currentUser?.id
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-[10px] mt-1 opacity-50">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-6 border-t border-slate-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Write a message..."
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:scale-105 transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <MessageSquare size={64} className="mb-4 opacity-20" />
                        <p className="text-xl font-medium">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrivateMessagingPage;
