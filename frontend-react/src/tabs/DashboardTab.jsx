import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, Users, FileCheck, XCircle } from 'lucide-react';
import { API_URL } from '../api';

export default function DashboardTab({ isAdmin }) {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(`${API_URL}/certificates`);
            const data = await res.json();
            setCertificates(data);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/certificate/revoke`, {
                method: 'POST', // Changed from PUT to POST to match our new backend endpoint
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ certificateId: id })
            });

            if (res.ok) {
                fetchCertificates(); // Refresh list
            } else {
                alert("Failed to revoke certificate.");
            }
        } catch (err) {
            alert("Error connecting to server.");
        }
    };

    const activeCount = certificates.filter(c => c.status !== 'REVOKED').length;
    const revokedCount = certificates.filter(c => c.status === 'REVOKED').length;

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                <XCircle className="w-16 h-16 text-slate-300" />
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-slate-500">You must be in Admin Mode to view the Institution Dashboard.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary text-white border-primary-light">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{certificates.length}</div>
                        <p className="text-xs text-slate-400">Lifetime credentials</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Credentials</CardTitle>
                        <FileCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                        <p className="text-xs text-slate-500">Valid & verifiable</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revoked/Expired</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{revokedCount}</div>
                        <p className="text-xs text-slate-500">Tampered or removed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main List Info */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-white">Issued Certificates</h2>
                <Button variant="outline" size="sm" onClick={fetchCertificates}>
                    Refresh
                </Button>
            </div>

            {/* Certificate Table */}
            <Card>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100">
                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Certificate ID</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Owner</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Issued On</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-4 text-center">Loading registry...</td></tr>
                            ) : certificates.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center text-slate-500">No certificates issued yet.</td></tr>
                            ) : (
                                certificates.map((cert) => (
                                    <tr key={cert.certificateId} className="border-b transition-colors hover:bg-slate-50/50">
                                        <td className="p-4 align-middle font-mono text-xs">{cert.certificateId.substring(0, 8)}...</td>
                                        <td className="p-4 align-middle font-medium">{cert.ownerId}</td>
                                        <td className="p-4 align-middle text-slate-500">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={cert.status === 'REVOKED' ? 'destructive' : 'success'}>
                                                {cert.status || 'ACTIVE'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {cert.status !== 'REVOKED' && (
                                                <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRevoke(cert.certificateId)}>
                                                    Revoke
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
