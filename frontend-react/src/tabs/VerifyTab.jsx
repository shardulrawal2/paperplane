import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, ShieldAlert, CheckCircle2, FileSearch, Clock, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import StatusPill from '../components/ui/StatusPill';
import CertificatePreviewCard from '../components/ui/CertificatePreviewCard';
import { verifyCertificate } from '../api';
import { useToast } from '../hooks/useToast';

export default function VerifyTab() {
    const [file, setFile] = useState(null);
    const [certificateId, setCertificateId] = useState('');
    const [claimedOwnerId, setClaimedOwnerId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const toast = useToast();

    const handleVerify = async () => {
        if (!file || !certificateId || !claimedOwnerId) {
            toast.error("All verification fields are required");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('certificateId', certificateId);
        formData.append('claimedOwnerId', claimedOwnerId);

        try {
            const data = await verifyCertificate(formData);
            setResult(data);
            if (data.status === 'VALID') toast.success('Verification Passed');
            else toast.error('Verification Failed');
        } catch (err) {
            toast.error("System verification failure");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto py-8">
            <div className="text-center space-y-2 mb-12">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Verify Integrity</h1>
                <p className="text-slate-300 font-medium max-w-lg mx-auto"> Check the authenticity of any Soulbound Skills certificate against our immutable registry and Bitcoin anchors. </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Search Form */}
                <div className="w-full lg:w-[400px]">
                    <Card className="border-0 ring-1 ring-slate-600/40 shadow-xl bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/90 text-slate-100">
                        <CardHeader className="pb-4 border-b border-slate-600/40">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                                <FileSearch className="w-5 h-5" />
                                Credential Search
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Certificate ID</label>
                                <Input
                                    placeholder="Enter CID"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    className="h-11 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 font-mono text-sm text-white placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Owner Identity</label>
                                <Input
                                    placeholder="Claimed Identity"
                                    value={claimedOwnerId}
                                    onChange={(e) => setClaimedOwnerId(e.target.value)}
                                    className="h-11 bg-gradient-to-r from-slate-800/60 to-slate-900/70 border-slate-600/50 focus:border-slate-500 focus:ring-slate-500/30 text-sm font-bold text-white placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Original PDF</label>
                                <FileUpload
                                    onFileSelect={setFile}
                                    accept=".pdf"
                                    className="py-6"
                                    innerClassName="border-dashed border-2 border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/60 hover:border-slate-500/50 hover:bg-slate-700/40 transition-all text-slate-300"
                                />
                                {file && <CertificatePreviewCard file={file} variant="dark" className="mt-2" />}
                            </div>
                            <Button
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg"
                                onClick={handleVerify}
                                isLoading={isLoading}
                                disabled={!file || !certificateId || !claimedOwnerId}
                            >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Execute Verification
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Result Display */}
                <div className="w-full lg:flex-1">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className={cn(
                                    "border-0 ring-1 shadow-2xl bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/90 overflow-hidden text-slate-100",
                                    result.status === 'VALID' ? "ring-green-500/50" : "ring-red-500/50"
                                )}>
                                    <div className={cn(
                                        "p-10 text-center text-white",
                                        result.status === 'VALID' ? "bg-green-600" : "bg-red-600"
                                    )}>
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                                            {result.status === 'VALID' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1">{result.status === 'VALID' ? 'Verified Authentic' : 'Verification Failed'}</h3>
                                        <p className="text-white/80 text-xs font-medium uppercase tracking-widest">
                                            {result.status === 'VALID' ? 'Cryptography Integrity Confirmed' : result.message || 'Identity or Content Mismatch'}
                                        </p>
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/60 rounded-xl border border-slate-600/50">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution</p>
                                                <p className="text-sm font-bold text-slate-100">{result.issuer || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-1 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/60 rounded-xl border border-slate-600/50 font-mono">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                                <StatusPill status={result.status} size="sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Blockchain Anchors</p>

                                            {/* Ethereum Anchor */}
                                            {result.ethereum?.enabled && (
                                                <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/60 border border-slate-600/50 rounded-xl space-y-3 shadow-sm">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Ethereum Mainnet
                                                        </p>
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-900/40 text-blue-300 rounded border border-blue-700/50">Confirmed</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                        <div className="space-y-0.5">
                                                            <p className="text-slate-400 font-bold uppercase tracking-tighter">Transaction Hash</p>
                                                            <p className="font-mono text-slate-100 truncate" title={result.ethereum.txHash}>{result.ethereum.txHash}</p>
                                                        </div>
                                                        <div className="space-y-0.5 text-right">
                                                            <p className="text-slate-400 font-bold uppercase tracking-tighter">Status</p>
                                                            <p className="text-green-400 font-bold">SUCCESS</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bitcoin Anchor */}
                                            <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/60 border border-slate-600/50 rounded-xl space-y-3 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        {result.ots?.status === 'ANCHORED' ? (
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                        ) : (
                                                            <Clock className="w-3 h-3 text-amber-500" />
                                                        )}
                                                        Bitcoin Network
                                                    </p>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">OpenTimestamps</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        {result.ots?.status === 'ANCHORED' ? (
                                                            <>
                                                                <p className="text-xs font-bold text-slate-100 uppercase tracking-tight">Bitcoin Proof Verified</p>
                                                                <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">Cryptographic attestation confirmed on the Bitcoin network.</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-xs font-bold text-slate-100">Anchoring in Progress</p>
                                                                <p className="text-[10px] text-slate-400 font-medium">Authenticating with Bitcoin network nodes (est. 30s)...</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] border-2 border-dashed border-slate-600/50 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-4 bg-gradient-to-br from-slate-800/30 to-slate-900/40"
                            >
                                <ShieldCheck className="w-12 h-12 opacity-20" />
                                <div className="text-center">
                                    <p className="text-sm font-bold">Awaiting Input</p>
                                    <p className="text-xs font-medium">Scan or upload a certificate to begin</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
