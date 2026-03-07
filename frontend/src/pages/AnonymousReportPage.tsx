import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Send, CheckCircle2, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';
import api from '../api/api';

const MAX_CHARS = 2000;

const AnonymousReportPage = () => {
    const [category, setCategory] = useState('Suggestion');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
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
            <div className="h-full flex items-center justify-center -mt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass-card p-12 rounded-3xl text-center max-w-lg border border-success/20 shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden"
                >
                    {/* Background success glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-8 border border-success/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            >
                                <CheckCircle2 size={48} />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-black mb-4 gradient-text-glow text-white">Report Securely Transmitted</h2>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                            Your report has been encrypted and stored securely. Absolutely no identifying information was recorded.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="bg-bg-secondary hover:bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all"
                        >
                            Return to Form
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row items-start md:items-center gap-6 relative">
                {/* Shield glow effect */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-danger/20 rounded-2xl blur-xl group-hover:bg-danger/30 transition-colors duration-500" />
                    <div className="w-16 h-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center border border-danger/30 relative z-10 shadow-[inset_0_0_20px_rgba(244,63,94,0.2)]">
                        <motion.div animate={{ rotateY: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
                            <ShieldCheck size={32} />
                        </motion.div>
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Secure Anonymous Reporting</h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-danger/90 bg-danger/10 w-fit px-3 py-1.5 rounded-lg border border-danger/20">
                        <Lock size={14} className="animate-pulse" />
                        <span>End-to-End Encrypted. Zero Logs.</span>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 rounded-3xl space-y-8 border border-white/5 shadow-2xl relative overflow-hidden">
                {/* Subtle background gradient for form */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-danger/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-3 relative z-10">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        Classify Report
                        <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 flex-1 px-5 text-white focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger/50 transition-all appearance-none font-medium shadow-inner-dark"
                        >
                            <option value="Suggestion">General Suggestion</option>
                            <option value="Bug Report">System/Bug Report</option>
                            <option value="Safety">Workplace Safety Concern</option>
                            <option value="Misconduct">Policy Violation / Misconduct</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Discrimination">Discrimination</option>
                            <option value="Other">Other Serious Concern</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            Detailed Description
                            <span className="text-danger">*</span>
                        </label>
                        <span className={`text-xs font-bold ${content.length > MAX_CHARS * 0.9 ? 'text-danger' : 'text-slate-500'}`}>
                            {content.length} / {MAX_CHARS}
                        </span>
                    </div>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value.substring(0, MAX_CHARS))}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-5 px-5 text-white focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger/50 transition-all min-h-[280px] resize-y font-medium leading-relaxed shadow-inner-dark placeholder:text-slate-600"
                        placeholder="Please detail your concern, suggestion, or observation. Be as specific as possible. Do not include your name or identifying details if you wish to remain strictly anonymous."
                    />
                </div>

                {/* Important Disclaimer Card */}
                <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5 flex gap-4 items-start relative z-10">
                    <AlertTriangle className="text-danger shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-danger font-bold text-sm mb-1 uppercase tracking-wide">Strict Privacy Guarantee</h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            We use decentralized routing to ensure your IP address cannot be traced. Your browser fingerprint, session data, and account ID are stripped before this payload touches our servers.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 relative z-10">
                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="w-full md:w-auto bg-danger hover:bg-danger-hover text-white font-bold py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShieldAlert size={20} />
                                Submit Anonymously
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnonymousReportPage;
