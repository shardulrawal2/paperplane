import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';
import { useToast } from '../hooks/useToast';

import { API_URL } from '../api';

export default function AdminManagementTab({ adminId }) {
    const [admins, setAdmins] = useState([]);
    const [newName, setNewName] = useState('');
    const [newAdminId, setNewAdminId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${API_URL}/admins`);
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            console.error("Failed to load admins", err);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/admin/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, newAdminId, password: newPassword, requestingAdminId: adminId })
            });

            if (res.ok) {
                toast.success('Administrator added');
                setNewName('');
                setNewAdminId('');
                setNewPassword('');
                fetchAdmins();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to add administrator");
            }
        } catch (err) {
            toast.error("System error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAdmin = async (adminIdToRemove) => {
        if (!window.confirm(`Revoke access for ${adminIdToRemove}?`)) return;

        try {
            const res = await fetch(`${API_URL}/admin/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetAdminId: adminIdToRemove, requestingAdminId: adminId })
            });

            if (res.ok) {
                toast.success('Administrator access revoked');
                fetchAdmins();
            } else {
                toast.error("Failed to remove administrator");
            }
        } catch (err) {
            toast.error("System error");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Admin Form */}
                <div className="lg:col-span-1">
                    <Card className="border-0 ring-1 ring-slate-600/40 shadow-xl bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/90 sticky top-24 text-slate-100">
                        <CardHeader className="pb-4 border-b border-slate-600/40">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                                <UserPlus className="w-4 h-4" />
                                Onboard Admin
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <Input
                                        placeholder="e.g. Dr. Jane Smith"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="h-10 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 text-sm text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ID</label>
                                    <Input
                                        placeholder="e.g. INST_003"
                                        value={newAdminId}
                                        onChange={(e) => setNewAdminId(e.target.value)}
                                        className="h-10 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 font-mono text-sm text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-10 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 text-sm text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold"
                                    type="submit"
                                    isLoading={isLoading}
                                >
                                    Authorize Access
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Institutional Council
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {admins.map((admin) => (
                            <Card key={admin.adminId} className="border-0 ring-1 ring-slate-600/40 shadow-sm bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/90 overflow-hidden group text-slate-100">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-100">{admin.name}</p>
                                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{admin.adminId}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAdmin(admin.adminId)}
                                        className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-900/40 rounded-lg transition-all border border-transparent hover:border-red-700/50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
