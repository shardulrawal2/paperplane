import { CheckCircle, XCircle, AlertTriangle, FileText, Database, UserCheck, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';

export default function VerificationExplanation({ result, claimedOwnerId }) {
    if (!result || result.status === 'ERROR') return null;

    const steps = [
        {
            id: 'registry',
            label: 'Registry Lookup',
            icon: Database,
            status: result.status === 'NOT_FOUND' ? 'failed' : 'success',
            text: result.status === 'NOT_FOUND' ? 'Certificate ID not found in ledger.' : 'Record found in immutable registry.'
        },
        {
            id: 'integrity',
            label: 'Cryptographic Hash',
            icon: FileText,
            status: result.status === 'TAMPERED' || result.status === 'NOT_FOUND' ? 'failed' : 'success',
            text: result.status === 'TAMPERED' ? 'File content has been altered.' : 'File hash matches registry record.'
        },
        {
            id: 'ownership',
            label: 'Soulbound Ownership',
            icon: UserCheck,
            status: result.status === 'OWNERSHIP_MISMATCH' || result.status === 'TAMPERED' || result.status === 'NOT_FOUND' ? 'failed' : 'success',
            text: result.status === 'OWNERSHIP_MISMATCH' ? `Belongs to different owner.` : `Linked to ${claimedOwnerId}.`
        },
        {
            id: 'status',
            label: 'Validity Status',
            icon: Shield,
            status: result.status === 'REVOKED' || result.status === 'NOT_FOUND' ? 'failed' : 'success',
            text: result.status === 'REVOKED' ? 'Certificate has been revoked.' : 'Certificate is active.'
        }
    ];

    return (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Verification Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-start p-3 rounded-lg border",
                            step.status === 'success' ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 mr-3 p-1 rounded-full",
                            step.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            {step.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className={cn("text-sm font-medium", step.status === 'success' ? "text-green-400" : "text-red-400")}>
                                {step.label}
                            </p>
                            <p className={cn("text-xs mt-0.5", step.status === 'success' ? "text-green-500/70" : "text-red-500/70")}>
                                {step.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
