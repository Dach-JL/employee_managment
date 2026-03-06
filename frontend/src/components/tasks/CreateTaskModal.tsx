import { useState, useEffect } from 'react';
import api from '../../api/api';
import { X, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onClose: () => void;
    onUpdate: () => void;
}

const CreateTaskModal = ({ onClose, onUpdate }: Props) => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        assigneeId: ''
    });

    useEffect(() => {
        api.get('/users/search').then(res => setEmployees(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/tasks', formData);
            alert('Task created successfully!');
            onUpdate();
        } catch (error) {
            alert('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={handleSubmit}
                    className="glass w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
                >
                    <header className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                        <h2 className="text-xl font-bold">New Task</h2>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </header>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="Task title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                placeholder="Describe the work..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assignee</label>
                            <select
                                required
                                value={formData.assigneeId}
                                onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            >
                                <option value="">Select an employee</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <footer className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-400">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Create Task
                        </button>
                    </footer>
                </motion.form>
            </div>
        </AnimatePresence>
    );
};

export default CreateTaskModal;
