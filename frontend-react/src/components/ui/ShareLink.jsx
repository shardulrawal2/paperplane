import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../../hooks/useToast';

export default function ShareLink({ result, certificateId, ownerId }) {
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    const generateShareableText = () => {
        const timestamp = new Date().toLocaleString();
        return `Certificate Verification Result
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ${result.status}
Certificate ID: ${certificateId}
Owner ID: ${ownerId}
Issuer: ${result.issuer || 'N/A'}
Verified at: ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verified via Soulbound Skills Platform`;
    };

    const handleShare = () => {
        const shareText = generateShareableText();
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        toast.success('Verification result copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    Share Result
                </>
            )}
        </Button>
    );
}
