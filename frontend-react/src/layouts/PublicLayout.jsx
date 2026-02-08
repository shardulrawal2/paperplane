import React from 'react';
import { cn } from '../lib/utils';
import { Info, ShieldCheck, Send, Lock } from 'lucide-react';
import RegistrySyncIndicator from '../components/ui/RegistrySyncIndicator';

export default function PublicLayout({ children, activeTab, setActiveTab, onAdminLoginClick }) {
    return (
        <div className="min-h-screen bg-transparent text-slate-100 font-sans flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
                            <Send className="w-5 h-5 -rotate-45 relative left-[1px] top-[1px]" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Soulbound Skills</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <button
                            onClick={onAdminLoginClick}
                            className="text-sm font-medium text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors"
                            data-walkthrough="admin-access"
                        >
                            <Lock className="w-3 h-3" />
                            Institution Access
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">

                {/* Navigation Tabs */}
                <div className="text-center mb-10 space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">
                        Verify Credential Authenticity
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Inspect unforgeable, owner-bound certificates securely on the local chain.
                    </p>

                    <div className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-800/80 p-1 text-slate-400 shadow-inner border border-slate-700">
                        <button
                            onClick={() => setActiveTab('verify')}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                activeTab === 'verify' ? "bg-slate-700 text-slate-100 shadow-sm" : "hover:text-slate-100 hover:bg-slate-700/50"
                            )}
                            data-walkthrough="verify-tab"
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Verify
                        </button>
                        <button
                            onClick={() => setActiveTab('trust')}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                activeTab === 'trust' ? "bg-slate-700 text-slate-100 shadow-sm" : "hover:text-slate-100 hover:bg-slate-700/50"
                            )}
                        >
                            <Info className="w-4 h-4 mr-2" />
                            Learn
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {children}
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700 bg-slate-900/50 py-8 mt-auto">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm">&copy; 2026 Soulbound Skills. Public Verification Portal.</p>
                        <RegistrySyncIndicator />
                    </div>
                </div>
            </footer>
        </div>
    );
}
