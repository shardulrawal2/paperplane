import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Shield, Lock, FileDigit, Database, ArrowRight } from 'lucide-react';

export default function TrustTab() {
    const steps = [
        {
            icon: FileDigit,
            title: "1. Digital Hashing",
            desc: "When a certificate is issued, the PDF content is processed through a SHA-256 cryptographic function. This creates a unique 'digital fingerprint' that changes if even a single pixel is altered."
        },
        {
            icon: Database,
            title: "2. Immutable Registry",
            desc: "The certificate fingerprint, along with the owner's identity, is recorded in our secure registry. This creates a permanent, tamper-proof record of issuance."
        },
        {
            icon: Lock,
            title: "3. Soulbound Ownership",
            desc: "Certificates are cryptographically bound to a specific Owner ID. They cannot be transferred, sold, or claimed by anyone else, ensuring 100% credibility."
        },
        {
            icon: Shield,
            title: "4. Instant Verification",
            desc: "Verifiers upload the candidate's PDF. The system re-hashes it and checks against the registry. If the hash matches and the owner is correct, the skill is verified."
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-white">How Soulbound Trust Works</h2>
                <p className="text-lg text-slate-300">
                    Our system replaces physical trust with cryptographic certainty. No third-party verification required—just math.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, i) => (
                    <Card key={i} className="border-slate-200 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-base leading-relaxed">
                                {step.desc}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-xl">
                <h3 className="text-2xl font-bold">Ready to issue your first certificate?</h3>
                <p className="text-slate-300 max-w-xl mx-auto">
                    Start issuing tamper-proof credentials in seconds. No blockchain knowledge required.
                </p>
                <div className="pt-2">
                    <div className="inline-flex items-center text-sm font-medium text-primary-foreground/80 bg-primary/20 px-4 py-2 rounded-full">
                        <Lock className="w-4 h-4 mr-2" />
                        Powered by SHA-256 Cryptography
                    </div>
                </div>
            </div>
        </div>
    );
}
