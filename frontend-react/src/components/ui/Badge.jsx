import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const badgeVariants = {
    default: 'bg-primary text-white border-transparent',
    secondary: 'bg-secondary text-white border-transparent',
    destructive: 'bg-danger text-white border-transparent',
    outline: 'text-slate-100 border-slate-700 bg-slate-800/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const badgeIcons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    neutral: HelpCircle,
};

function Badge({ className, variant = "default", icon, children, ...props }) {
    const Icon = icon ? badgeIcons[variant] || HelpCircle : null;

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            badgeVariants[variant],
            className
        )} {...props}>
            {Icon && <Icon className="w-3 h-3 mr-1" />}
            {children}
        </div>
    );
}

export { Badge };
