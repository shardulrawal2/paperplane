import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    const variants = {
        default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900',
        ghost: 'hover:bg-slate-100 text-slate-700',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
