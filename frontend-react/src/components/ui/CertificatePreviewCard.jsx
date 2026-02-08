import React from 'react';
import { cn } from '../../lib/utils';
import { FileText, CheckCircle, Eye } from 'lucide-react';

export default function CertificatePreviewCard({ file, issuer = null, className, variant = 'default' }) {
    if (!file) return null;

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={cn(
            'border rounded-lg p-4 animate-in slide-in-from-bottom-2 fade-in duration-300',
            variant === 'dark'
                ? 'border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/60 text-slate-200'
                : 'border-slate-200 bg-slate-50',
            className
        )}>
            <div className="flex items-start gap-3">
                <div className={cn(
                "flex-shrink-0 p-2 rounded-lg",
                variant === 'dark' ? "bg-blue-900/40" : "bg-blue-50"
            )}>
                    <FileText className={cn("w-6 h-6", variant === 'dark' ? "text-blue-300" : "text-blue-600")} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-medium truncate", variant === 'dark' ? "text-slate-100" : "text-slate-900")}>
                                {file.name}
                            </p>
                            <p className={cn("text-xs mt-0.5", variant === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                {formatFileSize(file.size)}
                            </p>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const url = URL.createObjectURL(file);
                                    window.open(url, '_blank');
                                }}
                                className={cn(
                                "p-1.5 rounded-md transition-colors border border-transparent",
                                variant === 'dark'
                                    ? "hover:bg-slate-600/50 hover:border-slate-500 text-slate-400 hover:text-slate-200"
                                    : "hover:bg-white hover:border-slate-200 text-slate-400 hover:text-slate-600"
                            )}
                                title="Preview Document"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <CheckCircle className={cn("w-5 h-5", variant === 'dark' ? "text-green-400" : "text-green-600")} />
                        </div>
                    </div>

                    {issuer && (
                        <div className={cn(
                            "mt-2 pt-2 border-t text-xs",
                            variant === 'dark' ? "border-slate-600/50 text-slate-400" : "border-slate-200 text-slate-600"
                        )}>
                            <span className="font-medium">Issuer:</span> {issuer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
