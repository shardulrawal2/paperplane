import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const walkthroughSteps = [
    {
        id: 1,
        title: 'Welcome to Soulbound Skills',
        description: 'A decentralized platform for issuing and verifying tamper-proof credentials.',
        position: 'center',
    },
    {
        id: 2,
        title: 'Verify Certificates',
        description: 'Upload any certificate to verify its authenticity against our immutable registry.',
        position: 'center',
        highlight: '[data-walkthrough="verify-tab"]',
    },
    {
        id: 3,
        title: 'Institution Access',
        description: 'Admins can log in to issue certificates and manage their institution.',
        position: 'center',
        highlight: '[data-walkthrough="admin-access"]',
    },
    {
        id: 4,
        title: 'Get Started!',
        description: 'You\'re all set. Start by verifying a certificate or logging in as an admin.',
        position: 'center',
    },
];

export default function WalkthroughOverlay() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if walkthrough has been completed
        const completed = localStorage.getItem('walkthrough_completed');
        if (!completed) {
            // Small delay before showing
            setTimeout(() => setIsVisible(true), 500);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < walkthroughSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        localStorage.setItem('walkthrough_completed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const step = walkthroughSteps[currentStep];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />

                {/* Walkthrough Card */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative z-10 bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-600/50 text-slate-100"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>Step {currentStep + 1} of {walkthroughSteps.length}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            {step.title}
                        </h2>

                        <p className="text-slate-300 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Progress Dots */}
                        <div className="flex gap-2 pt-2">
                            {walkthroughSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${index === currentStep
                                            ? 'w-8 bg-blue-500'
                                            : index < currentStep
                                                ? 'w-1.5 bg-blue-400'
                                                : 'w-1.5 bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Skip tour
                            </button>

                            <Button onClick={handleNext} className="gap-2">
                                {currentStep === walkthroughSteps.length - 1 ? 'Get Started' : 'Next'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
