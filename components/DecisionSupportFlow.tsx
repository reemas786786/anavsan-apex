import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, User, Slack, ShieldCheck, Wallet, Sparkles, ArrowRight } from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    usagePercent: number;
    taskLoad: 'Low' | 'Medium' | 'High';
    isBestMatch?: boolean;
}

const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        usagePercent: 42,
        taskLoad: 'Low',
        isBestMatch: true
    },
    {
        id: '2',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        usagePercent: 28,
        taskLoad: 'Medium'
    },
    {
        id: '3',
        name: 'Jordan Smith',
        avatar: 'https://i.pravatar.cc/150?u=jordan',
        usagePercent: 15,
        taskLoad: 'High'
    }
];

const costData = [
    { name: 'Compute', value: 65, color: '#6A38EB' },
    { name: 'Storage', value: 25, color: '#A78BFA' },
    { name: 'Data Transfer', value: 10, color: '#DDD6FE' }
];

const DecisionSupportFlow: React.FC = () => {
    const [step, setStep] = useState<'analysis' | 'assignment' | 'success' | 'upsell'>('analysis');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(teamMembers[0]);
    const [isAssigning, setIsAssigning] = useState(false);

    const handleAssign = () => {
        setIsAssigning(true);
        setTimeout(() => {
            setStep('success');
            setIsAssigning(false);
            setTimeout(() => {
                setStep('upsell');
            }, 2000);
        }, 1200);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 font-sans text-[14px]">
            {/* 1. THE ANALYTICAL BUBBLE */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 border border-[#E2DDEB] shadow-sm"
            >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-3">
                        <p className="text-[#1E1E2D] leading-relaxed">
                            I've analyzed the recent cost spike. The primary driver is <strong className="text-[#6A38EB]">Account A</strong>, specifically the <strong className="text-[#6A38EB]">Fintech_Warehouse</strong>. 
                        </p>
                        <p className="text-[#5A5A72]">
                            The compute usage has increased by 45% over the last 48 hours due to unoptimized join patterns in the daily ETL jobs.
                        </p>
                    </div>
                    <div className="w-32 h-32 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costData}
                                    innerRadius={25}
                                    outerRadius={45}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {costData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* 2. THE TEAM ATTRIBUTION COMPONENT */}
            <AnimatePresence mode="wait">
                {(step === 'analysis' || step === 'assignment') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <h3 className="text-[#161616] font-bold uppercase tracking-widest text-[11px]">Suggested Owners</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {teamMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => setSelectedMember(member)}
                                    className={`relative p-4 rounded-xl border transition-all text-left group ${
                                        selectedMember?.id === member.id 
                                        ? 'border-[#6A38EB] bg-[#F5F2FF] ring-1 ring-[#6A38EB]' 
                                        : 'border-[#E2DDEB] bg-white hover:border-[#6A38EB]/50'
                                    }`}
                                >
                                    {member.isBestMatch && (
                                        <div className="absolute -top-2 -right-1 bg-[#6A38EB] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            Best Match
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border border-white shadow-sm" referrerPolicy="no-referrer" />
                                        <div>
                                            <p className="font-bold text-[#161616] truncate">{member.name}</p>
                                            <p className="text-[11px] text-[#5A5A72]">{member.usagePercent}% usage</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2DDEB]/50">
                                        <span className="text-[10px] text-[#9A9AB2] uppercase font-bold tracking-wider">Load</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            member.taskLoad === 'Low' ? 'bg-green-100 text-green-700' :
                                            member.taskLoad === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {member.taskLoad}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* 3. THE ASSIGNMENT CTA */}
                        <div className="pt-2">
                            <button
                                onClick={handleAssign}
                                disabled={!selectedMember || isAssigning}
                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6A38EB]/20 ${
                                    isAssigning ? 'bg-[#6A38EB]/70 cursor-wait' : 'bg-[#6A38EB] hover:bg-[#5829D6] active:scale-[0.98]'
                                }`}
                            >
                                {isAssigning ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Assign to {selectedMember?.name.split(' ')[0]} & Notify Slack
                                        <Slack className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm"
                    >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <h4 className="text-[#065F46] font-bold text-lg mb-1">Assignment Successful</h4>
                        <p className="text-[#047857] mb-4">Slack notification sent to #data-ops</p>
                        <div className="bg-white px-4 py-2 rounded-lg border border-[#D1FAE5] shadow-sm">
                            <span className="text-[12px] font-black text-[#065F46] tracking-widest">TASK-Q-102 CREATED</span>
                        </div>
                    </motion.div>
                )}

                {step === 'upsell' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F9F7FE] border border-[#E2DDEB] rounded-2xl p-6 space-y-4 shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E2DDEB] shrink-0">
                                <Sparkles className="w-5 h-5 text-[#6A38EB]" />
                            </div>
                            <div>
                                <h4 className="text-[#161616] font-bold mb-1">Proactive Prevention</h4>
                                <p className="text-[#5A5A72] leading-relaxed">
                                    To prevent similar spikes in <strong className="text-[#161616]">Fintech_Warehouse</strong>, would you like me to set up a guardrail?
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button className="flex items-center justify-between p-4 bg-white border border-[#E2DDEB] rounded-xl hover:border-[#6A38EB] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-[#6A38EB]" />
                                    <div className="text-left">
                                        <p className="font-bold text-[#161616]">Set a Policy</p>
                                        <p className="text-[11px] text-[#9A9AB2]">Auto-suspend on idle</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#9A9AB2] group-hover:text-[#6A38EB] transition-colors" />
                            </button>
                            <button className="flex items-center justify-between p-4 bg-white border border-[#E2DDEB] rounded-xl hover:border-[#6A38EB] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Wallet className="w-5 h-5 text-[#6A38EB]" />
                                    <div className="text-left">
                                        <p className="font-bold text-[#161616]">Create a Budget</p>
                                        <p className="text-[11px] text-[#9A9AB2]">Alert at $1,000/mo</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#9A9AB2] group-hover:text-[#6A38EB] transition-colors" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DecisionSupportFlow;
