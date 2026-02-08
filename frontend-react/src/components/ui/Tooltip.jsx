import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Tooltip({ children, content, disabled = false }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!content || disabled) {
        return children;
    }

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}
