import React, { useCallback, useState } from 'react';
import { cn } from '../../lib/utils';
import { UploadCloud, File, X } from 'lucide-react';

const FileUpload = React.forwardRef(({ className, innerClassName, onFileSelect, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (onFileSelect) onFileSelect(null);
        // Reset input value
        if (ref && ref.current) ref.current.value = "";
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full min-h-32 rounded-lg border-2 border-dashed transition-colors cursor-pointer",
                    !innerClassName && "bg-gray-50/50 hover:bg-gray-100/50",
                    !innerClassName && (isDragOver ? "border-primary bg-blue-50/50" : "border-slate-300"),
                    !innerClassName && selectedFile && "border-success bg-green-50/30",
                    innerClassName
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
            >
                <input
                    id="file-upload-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />

                {selectedFile ? (
                    <div className="flex items-center space-x-2 text-primary animate-in fade-in zoom-in duration-300">
                        <File className="w-8 h-8 text-primary" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-700 max-w-[200px] truncate">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                        <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="mb-1 text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs">PDF Certificate (max 5MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
});

FileUpload.displayName = "FileUpload";

export { FileUpload };
