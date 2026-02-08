import React from 'react';
import { cn } from '../../lib/utils';
import { FileText, CheckCircle, Upload } from 'lucide-react';

export default function CertificatePreviewCard({ file, issuer = null, className }) {
    if (!file) return null;

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={cn(
            'border border-slate-200 rounded-lg p-4 bg-slate-50',
            'animate-in slide-in-from-bottom-2 fade-in duration-300',
            className
        )}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {formatFileSize(file.size)}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>

                    {issuer && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-600">
                                <span className="font-medium">Issuer:</span> {issuer}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
