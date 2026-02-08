import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, ShieldAlert, RefreshCw, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { issueCertificate } from '../api'; // Assuming reset-demo will be added to api.js

export default function SettingsTab({ isAdmin, setIsAdmin }) {
    const [isResetting, setIsResetting] = React.useState(false);

    const handleReset = async () => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure? This will wipe all certificates and registry data.")) return;

        setIsResetting(true);
        try {
            const response = await fetch('http://localhost:3000/reset-demo', { method: 'POST' });
            if (response.ok) {
                alert("System reset successfully.");
                window.location.reload(); // Simple way to refresh state
            } else {
                alert("Failed to reset system.");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server.");
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Role Management Section */}
            <Card className={cn("border-l-4 transition-all", isAdmin ? "border-l-primary bg-slate-50" : "border-l-slate-300")}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                {isAdmin ? <ShieldAlert className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-slate-500" />}
                                Active Role: {isAdmin ? "Administrator" : "Standard User"}
                            </CardTitle>
                            <CardDescription>
                                Toggle your role to experience the platform as different users.
                            </CardDescription>
                        </div>
                        <Badge variant={isAdmin ? "default" : "neutral"} className="text-sm px-3 py-1">
                            {isAdmin ? "ADMIN MODE" : "USER VIEW"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">Current Permissions</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {isAdmin
                                    ? "Full access: Issue, Verify, View Dashboard, Revoke Credentials."
                                    : "Restricted access: Verify Credentials only (Issuance is visible for demo)."}
                            </p>
                        </div>
                        <Button
                            variant={isAdmin ? "outline" : "default"}
                            onClick={() => setIsAdmin(!isAdmin)}
                        >
                            {isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Admin-Only Danger Zone */}
            {isAdmin && (
                <Card className="border-danger/30 bg-danger/5">
                    <CardHeader>
                        <CardTitle className="text-danger flex items-center gap-2">
                            <LogOut className="w-5 h-5" />
                            Demo Controls
                        </CardTitle>
                        <CardDescription className="text-danger/80">
                            Actions to manage the demo environment. Warning: destructive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between bg-white/50 p-4 rounded-lg border border-danger/10">
                            <div className="space-y-1">
                                <p className="font-medium text-slate-900">Reset System Data</p>
                                <p className="text-xs text-slate-500">Clears all issued certificates and resets the registry.</p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleReset}
                                isLoading={isResetting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <RefreshCw className="w-3 h-3 mr-2" />
                                Reset Demo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
