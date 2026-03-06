import { Shield } from 'lucide-react';

const Logo = () => {
    return (
        <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 shadow-glow-blue">
                <Shield className="text-primary z-10" size={24} />
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tight gradient-text-glow">
                Workforce
            </h1>
        </div>
    );
};

export default Logo;
