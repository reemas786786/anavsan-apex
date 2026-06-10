import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, User, CheckCircle2, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';

interface AgenticResponseProps {
    accountName: string;
    why: string;
    resource: string;
    ownerName: string;
    actionQuestion: string;
    policyType: string;
}

const AgenticResponse: React.FC<AgenticResponseProps> = ({
    accountName,
    why,
    resource,
    ownerName,
    actionQuestion,
    policyType
}) => {
    const [status, setStatus] = useState<'idle' | 'assigned' | 'drafted'>('idle');

    return (
        <div className="flex flex-col gap-6 font-sans text-[14px] leading-[1.6]">
            {/* SECTION 1: THE IDENTITY */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center text-[#6A38EB]">
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[#161616] text-[15px]">Warehouse optimization insight</span>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wider">Resource</span>
                        <code className="px-2 py-1 bg-button-secondary-bg/60 border border-border-color rounded-md text-[12px] font-mono text-primary font-bold w-fit">
                            {resource}
                        </code>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wider">Owner</span>
                        <span className="font-bold text-[#161616] text-[13px]">{ownerName}</span>
                    </div>
                </div>
            </div>

            {/* SECTION 2: THE LOGIC (THE "WHY") */}
            <div className="bg-[#F9FAFB] border-l-2 border-[#6A38EB] p-4 rounded-r-xl">
                <p className="text-[#374151] leading-relaxed">
                    {why}
                </p>
            </div>

            {/* SECTION 3: THE ACTIVE DECISION */}
            <div className="space-y-4">
                <div className="bg-[#F9F8FF] border border-[#E5E7EB] rounded-xl p-5 space-y-4 shadow-sm">
                    {actionQuestion && (
                        <p className="text-[13px] font-semibold text-[#1F2937] leading-relaxed select-none">
                            {actionQuestion}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <AnimatePresence mode="wait">
                            {status === 'assigned' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg text-[#065F46] font-bold text-[13px]"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Task assigned to {ownerName ? ownerName.split(' ')[0] : 'owner'}
                                </motion.div>
                            ) : (
                                <button 
                                    onClick={() => setStatus('assigned')}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6A38EB] hover:bg-[#5829D6] text-white rounded-lg font-bold text-[13px] transition-all active:scale-95 shadow-md shadow-[#6A38EB]/20"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    {ownerName ? `Assign to ${ownerName.split(' ')[0]}` : 'Assign task'}
                                </button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {status === 'drafted' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg text-[#065F46] font-bold text-[13px]"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Policy drafted
                                </motion.div>
                            ) : (
                                <button 
                                    onClick={() => setStatus('drafted')}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#6A38EB] text-[#6A38EB] hover:bg-[#F5F2FF] rounded-lg font-bold text-[13px] transition-all active:scale-95"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Draft policy
                                </button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgenticResponse;
