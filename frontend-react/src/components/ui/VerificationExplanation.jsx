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
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Verification Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-start p-3 rounded-lg border",
                            step.status === 'success' ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 mr-3 p-1 rounded-full",
                            step.status === 'success' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                            {step.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className={cn("text-sm font-medium", step.status === 'success' ? "text-green-900" : "text-red-900")}>
                                {step.label}
                            </p>
                            <p className={cn("text-xs mt-0.5", step.status === 'success' ? "text-green-700" : "text-red-700")}>
                                {step.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
