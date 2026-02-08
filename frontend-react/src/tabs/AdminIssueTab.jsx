import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Shield, FileText, ArrowRight, Zap, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import CertificatePreviewCard from '../components/ui/CertificatePreviewCard';
import { issueCertificate } from '../api';
import { useToast } from '../hooks/useToast';

export default function IssueTab({ adminId }) {
    const [file, setFile] = useState(null);
    const [ownerId, setOwnerId] = useState('');
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [errorDetails, setErrorDetails] = useState('');
    const toast = useToast();

    const handleIssue = async () => {
        if (!file || !ownerId) return;

        setStatus('issuing');
        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('ownerId', ownerId);
        formData.append('adminId', adminId);

        try {
            const data = await issueCertificate(formData);
            setResult(data);
            setStatus('success');
            toast.success('Certificate Issued');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorDetails('System error during issuance.');
            toast.error('Issuance failed');
        }
    };

    const resetForm = () => {
        setFile(null);
        setOwnerId('');
        setStatus('idle');
        setResult(null);
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
            >
                <Card className="border-0 ring-1 ring-slate-200 shadow-2xl bg-white overflow-hidden">
                    <div className="bg-slate-900 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Success</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Credential Issued & Signed</p>
                    </div>

                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</p>
                                    <p className="font-mono text-xs text-slate-900 font-bold">{result?.certificateId}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result?.certificateId);
                                        toast.success('Copied to clipboard');
                                    }}
                                    className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                                >
                                    <Copy className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Blockchain Anchors</p>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ethereum (Sepolia)</p>
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100">
                                            <Shield className="w-2.5 h-2.5" /> CONFIRMED
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Status</span>
                                            <span className="text-slate-900 font-bold">Confirmed (On-chain)</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">TX Hash</span>
                                            <span className="text-slate-900 font-mono text-[10px] max-w-[120px] truncate" title={result?.ethereum?.txHash}>
                                                {result?.ethereum?.txHash}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Block</span>
                                            <span className="text-slate-900">#{result?.ethereum?.blockNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bitcoin Anchor</p>
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border",
                                            result?.ots?.status === 'ANCHORED'
                                                ? "bg-green-50 text-green-700 border-green-100"
                                                : result?.ots?.enabled
                                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                                    : "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            {result?.ots?.status === 'ANCHORED' ? <Shield className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                            {result?.ots?.status === 'ANCHORED' ? 'ANCHORED' : result?.ots?.enabled ? 'PENDING' : 'FAILED'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Network</span>
                                            <span className="text-slate-900">{result?.ots?.enabled ? 'Bitcoin (OTS)' : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Proof Status</span>
                                            <span className="text-slate-900">{result?.ots?.enabled ? 'Cryptographically Authenticated' : 'Disabled'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={resetForm}
                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold"
                        >
                            Issue New Credential
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <Card className="border-0 ring-1 ring-slate-200 shadow-xl bg-white">
                <CardHeader className="pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-900 text-white rounded-lg">
                            <Zap className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900">Issue Credential</CardTitle>
                    </div>
                    <CardDescription className="text-slate-500 text-sm">
                        Generate a cryptographically signed skill certificate
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient Identity</label>
                        <Input
                            placeholder="Unique identifier (e.g. USER_001)"
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}
                            className="h-11 bg-slate-50 border-transparent focus:bg-white focus:ring-slate-900/5 focus:border-slate-300 font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Certificate Document</label>
                        <FileUpload
                            onFileSelect={setFile}
                            accept=".pdf"
                            className="border-dashed border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 transition-all py-8"
                        />
                        {file && <CertificatePreviewCard file={file} className="mt-2" />}
                    </div>

                    {status === 'error' && (
                        <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-100 italic">
                            {errorDetails}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group"
                        onClick={handleIssue}
                        isLoading={status === 'issuing'}
                        disabled={!file || !ownerId || status === 'issuing'}
                    >
                        Sign & Anchor Credential
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
