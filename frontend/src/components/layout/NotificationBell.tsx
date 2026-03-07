import { useState, useRef, useEffect } from 'react';
import { Bell, Check, MessageSquare, AlertCircle, Calendar, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Notification Data
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'New Announcement',
        description: 'Q3 Town Hall meeting scheduled for this Friday.',
        time: '5m ago',
        isRead: false,
        type: 'announcement', // announcement, message, task, alert
    },
    {
        id: '2',
        title: 'Task Approved',
        description: 'Your submission for "Homepage Redesign" was approved.',
        time: '2h ago',
        isRead: false,
        type: 'task',
    },
    {
        id: '3',
        title: 'Direct Message',
        description: 'Sarah Johnson: Can you check the latest Figma?',
        time: '4h ago',
        isRead: true,
        type: 'message',
    },
    {
        id: '4',
        title: 'System Alert',
        description: 'Server maintenance scheduled for 1AM EST tonight.',
        time: '1d ago',
        isRead: true,
        type: 'alert',
    }
];

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const markAsRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const removeNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'announcement': return <Star size={16} className="text-warning" />;
            case 'task': return <Check size={16} className="text-success" />;
            case 'message': return <MessageSquare size={16} className="text-primary" />;
            case 'alert': return <AlertCircle size={16} className="text-danger" />;
            default: return <Bell size={16} className="text-slate-400" />;
        }
    };

    const getGlowColor = (type: string) => {
        switch (type) {
            case 'announcement': return 'rgba(250,204,21,0.2)'; // warning
            case 'task': return 'rgba(34,197,94,0.2)'; // success
            case 'message': return 'rgba(79,124,255,0.2)'; // primary
            case 'alert': return 'rgba(244,63,94,0.2)'; // danger
            default: return 'rgba(255,255,255,0.1)';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all group ${isOpen ? 'bg-bg-secondary/80 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] border' : 'bg-transparent border border-transparent hover:border-white/10 hover:bg-bg-secondary/50'}`}
            >
                <Bell size={20} className={`transition-colors ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                {/* Unread Badge Glow */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-[10px] font-black tracking-tighter text-white flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] border border-bg-main"
                        >
                            {unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute right-0 top-full mt-4 w-80 sm:w-96 glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-bg-secondary/50 flex items-center justify-between z-10 relative">
                            <h3 className="font-bold text-white tracking-wide">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/20"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide flex flex-col relative z-10 bg-black/20">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center flex flex-col items-center justify-center text-slate-500">
                                    <Bell size={32} className="mb-3 opacity-20" />
                                    <p className="font-bold text-slate-400">All caught up!</p>
                                    <p className="text-xs mt-1">Check back later for new alerts.</p>
                                </div>
                            ) : (
                                notifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`group relative p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer flex gap-4 ${!notification.isRead ? 'bg-primary/[0.02]' : ''}`}
                                    >
                                        {/* Unread Indicator Line */}
                                        {!notification.isRead && (
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-1"
                                                style={{ backgroundColor: getGlowColor(notification.type).replace(',0.2)', ',1)'), boxShadow: `0 0 10px ${getGlowColor(notification.type)}` }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-inner-dark"
                                            style={{ backgroundColor: getGlowColor(notification.type), borderColor: getGlowColor(notification.type).replace(',0.2)', ',0.5)') }}
                                        >
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold truncate ${!notification.isRead ? 'text-white' : 'text-slate-300'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap ml-2">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className={`text-xs line-clamp-2 ${!notification.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {notification.description}
                                            </p>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => markAsRead(notification.id, e)}
                                                    className="w-6 h-6 rounded-full bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary flex items-center justify-center border border-white/10 hover:border-primary/50 transition-all"
                                                    title="Mark as read"
                                                >
                                                    <Check size={12} strokeWidth={3} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => removeNotification(notification.id, e)}
                                                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-danger/20 text-slate-400 hover:text-danger flex items-center justify-center border border-white/10 hover:border-danger/50 transition-all"
                                                title="Remove"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-white/5 bg-bg-secondary/80 text-center relative z-10 w-full hover:bg-white/5 transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">View Archives</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
