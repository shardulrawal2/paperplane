import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { issueCertificate } from '../api';
import { CheckCircle, Copy, FileText, Hash } from 'lucide-react';
import { cn } from '../lib/utils';
import CertificatePreviewCard from '../components/ui/CertificatePreviewCard';

export default function IssueTab() {
    const [file, setFile] = useState(null);
    const [ownerId, setOwnerId] = useState('');
    const [issuer, setIssuer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!file || !ownerId || !issuer) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('ownerId', ownerId);
        formData.append('issuer', issuer);

        try {
            const data = await issueCertificate(formData);
            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Simple feedback could be added here
    };

    if (result) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Certificate Issued!</h2>
                    <p className="text-slate-400">The certificate has been cryptographically secured.</p>
                </div>

                <Card className="border-green-200 bg-green-50/30">
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Certificate ID</label>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-sm font-mono text-slate-300 truncate">
                                    {result.certificateId}
                                </code>
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(result.certificateId)}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Content Hash (SHA-256)</label>
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono text-slate-400 truncate">
                                    <Hash className="w-3 h-3 inline mr-1" />
                                    {result.hash}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center">
                            <Button onClick={() => { setResult(null); setFile(null); setOwnerId(''); setIssuer(''); }} variant="outline">
                                Issue Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-lg border-slate-200/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Issue New Certificate
                </CardTitle>
                <CardDescription>
                    Upload a PDF and assign it to an owner. The document will be hashed and registered.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Certificate Document (PDF)
                    </label>
                    <FileUpload onFileSelect={setFile} />
                    {file && <CertificatePreviewCard file={file} className="mt-2" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Owner Identity</label>
                        <Input
                            placeholder="e.g. USER_123"
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-slate-500">The recipient's unique ID.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Issuer Name</label>
                        <Input
                            placeholder="e.g. Paper Plane Academy"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-slate-500">Organization issuing the credential.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit} isLoading={isLoading}>
                    Issue Certificate
                </Button>
            </CardFooter>
        </Card>
    );
}
