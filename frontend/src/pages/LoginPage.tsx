import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import Logo from '../components/common/Logo';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            setAuth(data.user, data.access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-main font-sans selection:bg-primary/30">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-neon-blue rounded-full mix-blend-screen filter blur-[120px] opacity-15"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-neon-purple rounded-full mix-blend-screen filter blur-[120px] opacity-15"
                />
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-accent-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-10"
                />
            </div>

            {/* Ambient Particle layer for depth */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsMC4wMSknLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-0 opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md px-4 sm:px-0 z-10"
            >
                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 -left-4 p-3 glass-card border-neon-blue/20 hidden md:flex items-center justify-center shadow-glow-blue pointer-events-none"
                    style={{ background: 'rgba(15, 23, 42, 0.8)' }}
                >
                    <ShieldCheck size={28} className="text-neon-blue drop-shadow-[0_0_8px_rgba(79,124,255,0.8)]" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-8 -right-4 p-3 glass-card border-neon-purple/20 hidden md:flex items-center justify-center shadow-glow-purple pointer-events-none"
                    style={{ background: 'rgba(15, 23, 42, 0.8)' }}
                >
                    <Sparkles size={28} className="text-neon-purple drop-shadow-[0_0_8px_rgba(122,92,255,0.8)]" />
                </motion.div>

                <div className="glass-card p-8 sm:p-10 relative overflow-hidden group">
                    {/* Inner glowing border effect */}
                    <div className="absolute inset-[-1px] bg-gradient-to-br from-neon-blue/40 via-transparent to-neon-purple/40 rounded-[inherit] -z-10 group-hover:from-neon-blue/60 group-hover:to-neon-purple/60 transition-colors duration-500"></div>

                    <div className="flex flex-col items-center mb-10 space-y-4">
                        <Logo />
                        <div className="text-center space-y-3 mt-4">
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-1">
                                Welcome Back
                            </h2>
                            <p className="text-text-secondary text-sm font-medium">
                                Enter your credentials to access the portal
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                    className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm font-medium flex items-start gap-3 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.15)] mb-6"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-5 w-full">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                                    Email Address
                                </label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-neon-blue transition-colors duration-300 z-10" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full glass-input py-3 pl-12 pr-4 bg-bg-secondary/60 border-border-soft text-text-primary focus:bg-bg-secondary/80 focus:border-neon-blue/50 focus:shadow-[0_0_0_1px_rgba(79,124,255,0.3)] placeholder:text-text-muted transition-all font-medium"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Password
                                    </label>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-neon-blue transition-colors duration-300 z-10" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full glass-input py-3 pl-12 pr-4 bg-bg-secondary/60 border-border-soft text-text-primary focus:bg-bg-secondary/80 focus:border-neon-blue/50 focus:shadow-[0_0_0_1px_rgba(79,124,255,0.3)] placeholder:text-text-muted transition-all font-medium font-mono text-lg tracking-[0.3em]"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4 h-14 bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(79,124,255,0.3)] hover:shadow-[0_0_30px_rgba(79,124,255,0.5)] border border-white/10"
                        >
                            {/* Hover shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

                            <span className="relative z-10 font-bold text-white tracking-wide text-[15px]">
                                {isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}
                            </span>
                            {!isLoading && <LogIn size={20} className="relative z-10 text-white drop-shadow-md group-hover:translate-x-1 transition-transform" />}

                            {isLoading && (
                                <div className="absolute right-6 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin z-10" />
                            )}
                        </motion.button>

                    </form>

                    <div className="mt-10 pt-6 border-t border-border-soft/50 text-center">
                        <p className="text-[11px] text-text-muted font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 tracking-wide">
                            <span>INTERNAL SYSTEM ACCESS ONLY</span>
                            <span className="hidden sm:inline text-border-soft">•</span>
                            <span>CONTACT IT FOR ASSISTANCE</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
