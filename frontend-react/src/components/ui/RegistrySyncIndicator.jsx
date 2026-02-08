import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function RegistrySyncIndicator() {
    const lastSynced = new Date().toLocaleString();

    return (
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="w-3 h-3" />
            <span>Registry last synced: {lastSynced}</span>
        </div>
    );
}
