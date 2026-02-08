import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldCheck, XCircle, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const statusConfig = {
    VALID: {
        label: 'Verified',
        icon: ShieldCheck,
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    ACTIVE: {
        label: 'Active',
        icon: CheckCircle,
        className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    REVOKED: {
        label: 'Revoked',
        icon: AlertTriangle,
        className: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    TAMPERED: {
        label: 'Tampered',
        icon: XCircle,
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    OWNERSHIP_MISMATCH: {
        label: 'Ownership Mismatch',
        icon: AlertCircle,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    NOT_FOUND: {
        label: 'Not Found',
        icon: AlertCircle,
        className: 'bg-slate-50 text-slate-700 border-slate-200',
    },
};

export default function StatusPill({ status, size = 'md', className }) {
    const config = statusConfig[status] || statusConfig.NOT_FOUND;
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                config.className,
                sizeClasses[size],
                className
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}
