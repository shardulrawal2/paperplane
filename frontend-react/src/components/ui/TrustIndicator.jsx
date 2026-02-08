import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldCheck, XCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const trustStates = {
    VALID: {
        label: 'Verified',
        description: 'This certificate is authentic and valid',
        icon: ShieldCheck,
        ringColor: 'ring-green-500',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
    },
    TAMPERED: {
        label: 'Modified',
        description: 'The certificate content has been altered',
        icon: XCircle,
        ringColor: 'ring-red-500',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
    },
    REVOKED: {
        label: 'Revoked',
        description: 'This certificate has been revoked by the issuer',
        icon: AlertTriangle,
        ringColor: 'ring-orange-500',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
    },
    OWNERSHIP_MISMATCH: {
        label: 'Ownership Mismatch',
        description: 'The certificate belongs to a different owner',
        icon: AlertCircle,
        ringColor: 'ring-yellow-500',
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
    },
    NOT_FOUND: {
        label: 'Not Found',
        description: 'No certificate found with this ID',
        icon: AlertCircle,
        ringColor: 'ring-slate-400',
        bgColor: 'bg-slate-50',
        iconColor: 'text-slate-600',
    },
};

export default function TrustIndicator({ status, showDescription = true }) {
    const state = trustStates[status] || trustStates.NOT_FOUND;
    const Icon = state.icon;

    return (
        <div className="flex flex-col items-center gap-3 p-6">
            <div className={cn('relative', 'animate-in zoom-in duration-500')}>
                {/* Pulsing ring */}
                <div className={cn('absolute inset-0 rounded-full ring-4', state.ringColor, 'animate-pulse opacity-20')} />

                {/* Icon container */}
                <div className={cn('relative rounded-full p-4 ring-2', state.ringColor, state.bgColor)}>
                    <Icon className={cn('w-8 h-8', state.iconColor)} />
                </div>
            </div>

            <div className="text-center space-y-1">
                <div className={cn('text-lg font-semibold', state.iconColor)}>
                    {state.label}
                </div>
                {showDescription && (
                    <div className="text-sm text-slate-600">
                        {state.description}
                    </div>
                )}
            </div>
        </div>
    );
}
