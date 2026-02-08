import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import StatusPill from '../components/ui/StatusPill';
import Tooltip from '../components/ui/Tooltip';
import { Button } from '../components/ui/Button';
import { Search, History, Shield, ExternalLink, Clock } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { API_URL } from '../api';

export default function AdminDashboardTab({ adminId }) {
    const [certificates, setCertificates] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const fetchCertificates = async () => {
        try {
            const res = await fetch(`${API_URL}/certificates`);
            const data = await res.json();
            const myCerts = data.filter(c => c.adminId === adminId);
            setCertificates(myCerts);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
            toast.error("Failed to load certificates");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, [adminId]);

    const handleRevoke = async (id) => {
        if (!window.confirm("Confirm certificate revocation? This process is irreversible.")) return;

        try {
            const res = await fetch(`${API_URL}/certificate/revoke`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId: id, adminId })
            });

            if (res.ok) {
                toast.success('Certificate revoked');
                fetchCertificates();
            } else {
                toast.error("Revocation failed");
            }
        } catch (err) {
            console.error("Revocation error", err);
            toast.error("System error during revocation");
        }
    };

    const filtered = certificates.filter(c =>
        c.ownerId?.toLowerCase().includes(search.toLowerCase()) ||
        c.certificateId?.includes(search)
    );

    const stats = {
        total: certificates.length,
        active: certificates.filter(c => c.status === 'ACTIVE').length,
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Minimal Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-slate-200 shadow-sm bg-white border-0 ring-1 ring-slate-200">
                    <CardContent className="py-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Issued</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <History className="w-6 h-6 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white border-0 ring-1 ring-slate-200">
                    <CardContent className="py-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Active Credentials</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <Shield className="w-6 h-6 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Credential Log */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Credential Audit Log
                    </h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Filter by ID or Owner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-10 text-sm bg-white border-slate-200 focus:ring-slate-900/5 focus:border-slate-300"
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Identity</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Date</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Bitcoin Anchor</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Ethereum Anchor</th>
                                    <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No credentials found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((cert) => (
                                        <tr key={cert.certificateId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-900">{cert.ownerId}</div>
                                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{cert.certificateId}</div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-slate-600 font-medium">
                                                {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="inline-flex justify-center">
                                                    <StatusPill status={cert.status} size="sm" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {cert.ots?.enabled ? (
                                                    <div className="flex flex-col items-center gap-1 group">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                            {cert.ots.status === 'ANCHORED' ? (
                                                                <>
                                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                                    <span className="text-[10px] font-bold text-slate-700">ANCHORED</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Clock className="w-2.5 h-2.5 text-amber-500 animate-spin-slow" />
                                                                    <span className="text-[10px] font-bold text-slate-700">PENDING</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <Tooltip content="Bitcoin Immutability Proof (OpenTimestamps)">
                                                            <span className="text-[9px] text-slate-400 underline decoration-slate-200 cursor-help">Proof Available</span>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Unanchored</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {cert.ethereum?.enabled ? (
                                                    <div className="flex flex-col items-center gap-1 group">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                            <span className="text-[10px] font-bold text-slate-700">CONFIRMED</span>
                                                        </div>
                                                        <Tooltip content="Ethereum Anchoring (Sepolia Testnet - Simulated)">
                                                            <span className="text-[9px] text-slate-400 underline decoration-slate-200 cursor-help">Simulated (Demo)</span>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Unanchored</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {cert.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleRevoke(cert.certificateId)}
                                                        className="text-[11px] font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 transition-all"
                                                    >
                                                        REVOKE
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-300 px-3 py-1.5">REVOKED</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
