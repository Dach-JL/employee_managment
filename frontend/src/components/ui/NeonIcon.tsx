import type { LucideIcon } from 'lucide-react';

type NeonColor = 'primary' | 'purple' | 'cyan' | 'success' | 'warning' | 'danger';

interface NeonIconProps {
    icon: LucideIcon;
    color?: NeonColor;
    size?: number;
    pulse?: boolean;
    className?: string;
}

const colorMap: Record<NeonColor, { text: string; glow: string }> = {
    primary: { text: 'text-primary', glow: 'text-glow' },
    purple: { text: 'text-neon-purple', glow: 'text-glow-purple' },
    cyan: { text: 'text-accent-cyan', glow: 'text-glow-cyan' },
    success: { text: 'text-success', glow: 'text-glow-success' },
    warning: { text: 'text-warning', glow: 'text-glow-warning' },
    danger: { text: 'text-danger', glow: 'text-glow-danger' },
};

const NeonIcon = ({ icon: Icon, color = 'primary', size = 18, pulse = false, className = '' }: NeonIconProps) => {
    const { text, glow } = colorMap[color];

    return (
        <Icon
            size={size}
            className={`${text} ${glow} transition-all duration-300 ${pulse ? 'animate-pulse-glow' : ''} ${className}`}
        />
    );
};

export default NeonIcon;
