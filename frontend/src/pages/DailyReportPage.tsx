import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

const DailyReportPage = () => {
    const [content, setContent] = useState('');
    const [blockers, setBlockers] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/reports/daily', { content, blockers });
            setMessage({ type: 'success', text: 'Report submitted successfully!' });
            setContent('');
            setBlockers('');
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to submit report. You might have already submitted one today.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-bold gradient-text">Daily Report</h1>
                <p className="text-slate-400 mt-2">Document your progress and any obstacles you've encountered.</p>
            </header>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'
                        }`}
                >
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">What did you accomplish today?</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[200px]"
                        placeholder="Describe your tasks and achievements..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Any blockers or challenges?</label>
                    <textarea
                        value={blockers}
                        onChange={(e) => setBlockers(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
                        placeholder="Optional: Mention any issues slowing you down..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 transition-all transform active:scale-95"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> Submit Report</>}
                </button>
            </form>
        </div>
    );
};

export default DailyReportPage;
