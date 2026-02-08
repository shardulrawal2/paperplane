import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const badgeVariants = {
    default: 'bg-primary text-white border-transparent',
    secondary: 'bg-secondary text-white border-transparent',
    destructive: 'bg-danger text-white border-transparent',
    outline: 'text-slate-950 border-slate-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
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
