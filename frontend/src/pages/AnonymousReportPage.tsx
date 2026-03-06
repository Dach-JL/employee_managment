import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

const AnonymousReportPage = () => {
    const [category, setCategory] = useState('Suggestion');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/reports/anonymous', { category, content });
            setSubmitted(true);
            setContent('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="h-full flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-3xl text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
                    <p className="text-slate-400 mb-8">Your report has been stored securely and anonymously.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary hover:underline font-medium"
                    >
                        Submit another report
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center">
                    <ShieldAlert size={28} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white">Anonymous Reporting</h1>
                    <p className="text-slate-400 mt-1">Feedback that stays strictly anonymous. No logs recorded.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                    >
                        <option>Suggestion</option>
                        <option>Bug Report</option>
                        <option>Harassment</option>
                        <option>Discrimination</option>
                        <option>Other Concern</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[250px]"
                        placeholder="Please detail your concern or suggestion..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-danger hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-danger/20 disabled:opacity-50 flex items-center gap-2 transition-all transform active:scale-95"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> Submit Anonymously</>}
                </button>
            </form>
        </div>
    );
};

export default AnonymousReportPage;
