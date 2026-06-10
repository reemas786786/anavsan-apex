import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface IntelligenceDecisionCardProps {
    name: string;
    policyType: string;
}

const IntelligenceDecisionCard: React.FC<IntelligenceDecisionCardProps> = ({ name, policyType }) => {
    const [status, setStatus] = useState<'idle' | 'assigned' | 'drafted'>('idle');

    return (
        <div className="my-4 bg-white border border-[#E2DDEB] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F1EDF9]">
                <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#6A38EB]" />
                </div>
                <h4 className="font-bold text-[#161616] text-[13px] uppercase tracking-wider">Intelligence Decision</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                    onClick={() => setStatus('assigned')}
                    disabled={status !== 'idle'}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-[13px] transition-all ${
                        status === 'assigned' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-[#6A38EB] text-white hover:bg-[#5829D6] active:scale-95'
                    }`}
                >
                    {status === 'assigned' ? (
                        <><CheckCircle2 className="w-4 h-4" /> Assigned</>
                    ) : (
                        <><UserPlus className="w-4 h-4" /> Assign to {name}</>
                    )}
                </button>
                
                <button 
                    onClick={() => setStatus('drafted')}
                    disabled={status !== 'idle'}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-[13px] transition-all ${
                        status === 'drafted' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-white text-[#6A38EB] border border-[#6A38EB] hover:bg-[#F5F2FF] active:scale-95'
                    }`}
                >
                    {status === 'drafted' ? (
                        <><CheckCircle2 className="w-4 h-4" /> Drafted</>
                    ) : (
                        <><ShieldCheck className="w-4 h-4" /> Draft {policyType}</>
                    )}
                </button>
            </div>
            
            {status !== 'idle' && (
                <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12px] text-center text-[#5A5A72] font-medium"
                >
                    {status === 'assigned' ? `Task created and assigned to ${name}.` : `${policyType} drafted and ready for review.`}
                </motion.p>
            )}
        </div>
    );
};

export default IntelligenceDecisionCard;
