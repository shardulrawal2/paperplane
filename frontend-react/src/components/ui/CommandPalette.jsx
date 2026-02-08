import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Upload, Settings, LogIn, X } from 'lucide-react';

const commands = [
    {
        id: 'verify',
        label: 'Verify Certificate',
        icon: ShieldCheck,
        action: 'verify',
    },
    {
        id: 'issue',
        label: 'Issue Certificate',
        icon: Upload,
        action: 'issue',
        adminOnly: true,
    },
    {
        id: 'admin',
        label: 'Admin Login',
        icon: LogIn,
        action: 'admin',
    },
];

export default function CommandPalette({ isOpen, onClose, onCommand }) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSearch('');
        }
    }, [isOpen]);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleCommand = (action) => {
        onCommand(action);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Palette */}
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-slate-600/50 text-slate-100"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-600/50">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Type a command..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                                autoFocus
                            />
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Commands List */}
                        <div className="max-h-[300px] overflow-y-auto">
                            {filteredCommands.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No commands found
                                </div>
                            ) : (
                                filteredCommands.map((cmd) => {
                                    const Icon = cmd.icon;
                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={() => handleCommand(cmd.action)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left"
                                        >
                                            <Icon className="w-5 h-5 text-slate-400" />
                                            <span className="flex-1 text-slate-100">{cmd.label}</span>
                                            {cmd.adminOnly && (
                                                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded border border-slate-600/50">
                                                    Admin
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-slate-800/60 border-t border-slate-600/50 text-xs text-slate-400 flex items-center justify-between">
                            <span>Press ESC to close</span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300">⌘</kbd>
                                <kbd className="px-1.5 py-0.5 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300">K</kbd>
                                <span className="ml-1">to open</span>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
