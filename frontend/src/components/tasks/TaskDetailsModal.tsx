import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, Download, Upload, Loader2, Clock } from 'lucide-react';
import api from '../../api/api';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    attachments?: { name: string; url: string; size: number; type: string }[];
}

interface Props {
    task: Task;
    onClose: () => void;
    onUpdate: () => void;
}

const TaskDetailsModal = ({ task, onClose, onUpdate }: Props) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

            onUpdate();
            alert('File attached successfully!');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to attach file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <header className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                                }`}>
                                {task.priority}
                            </span>
                            <h2 className="text-xl font-bold">{task.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</h3>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                {task.description}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attachments</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {task.attachments?.map((file, i) => (
                                    <div key={i} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Paperclip size={18} className="text-primary flex-shrink-0" />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold truncate">{file.name}</p>
                                                <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-slate-700 hover:bg-primary hover:text-white rounded-lg transition-all"
                                        >
                                            <Download size={16} />
                                        </a>
                                    </div>
                                ))}

                                <label className="border-2 border-dashed border-slate-700 hover:border-primary rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-primary/5 min-h-[80px]">
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                    {uploading ? (
                                        <Loader2 className="animate-spin text-primary" size={20} />
                                    ) : (
                                        <>
                                            <Upload size={20} className="text-slate-500" />
                                            <span className="text-xs font-bold text-slate-400">Add Attachment</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </section>
                    </div>

                    <footer className="p-6 border-t border-slate-700 flex justify-between items-center bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-500" />
                            <span className="text-xs text-slate-400">
                                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                            </span>
                        </div>
                        <button onClick={onClose} className="bg-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-600 transition-all">
                            Close
                        </button>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TaskDetailsModal;
