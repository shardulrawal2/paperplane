import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, User, Shield } from 'lucide-react';
import { useToast } from '../hooks/useToast';

import { API_URL } from '../api';

export default function AdminLogin({ onLogin }) {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/institution`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId, password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Access granted');
                onLogin(data.admin);
            } else {
                setError(data.error || 'Identity verification failed');
                toast.error('Login failed');
            }
        } catch (err) {
            setError('System unreachable. Verify connection.');
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans bg-transparent">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Soulbound Skills</h1>
                    <p className="text-sm text-slate-300 font-medium">Institution Management Portal</p>
                </div>

                <Card className="border-0 ring-1 ring-slate-600/40 shadow-xl bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/90 text-slate-100">
                    <CardHeader className="text-center space-y-1 pb-6 border-b border-slate-600/40">
                        <CardTitle className="text-xl font-bold text-white">Sign In</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                            Enter your administrator credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Institution ID</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        value={adminId}
                                        onChange={(e) => setAdminId(e.target.value)}
                                        placeholder="INST_XXX"
                                        className="pl-10 h-11 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 transition-all font-mono text-sm text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Secure Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 h-11 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 transition-all text-sm text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-semibold mt-2"
                                isLoading={isLoading}
                            >
                                Authenticate
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[11px] text-slate-400 mt-8 leading-relaxed px-4">
                    Authorized access only. All actions are logged and cryptographically signed within the Soulbound Skills network.
                </p>
            </motion.div>
        </div>
    );
}
