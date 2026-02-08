import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { LogOut, LayoutDashboard, FileUp, Users, Shield } from 'lucide-react';

export default function AdminLayout({ children, activeTab, setActiveTab, onLogout, adminName }) {
    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'issue', label: 'Issue', icon: FileUp },
        { id: 'admins', label: 'Management', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-transparent font-sans antialiased text-slate-100">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-700 text-white p-1.5 rounded-lg shadow-sm">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            Soulbound Skills
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 ml-2">
                            Institution
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-semibold text-white">{adminName}</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Administrator</div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-full transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sub-nav for Tabs */}
            <div className="bg-slate-900/50 border-b border-slate-700">
                <div className="container mx-auto px-4 max-w-5xl">
                    <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative py-4 text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400 hover:text-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Centered Content */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="py-8 border-t border-slate-700 mt-auto">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <p className="text-sm text-slate-500">&copy; 2026 Soulbound Skills &bull; Secure Institution Infrastructure</p>
                </div>
            </footer>
        </div>
    );
}
