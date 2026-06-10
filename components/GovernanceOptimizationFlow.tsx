import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, ShieldCheck, UserPlus, CheckCircle2, ArrowRight, Wallet, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const forecastData = [
    { day: '1', spend: 120 },
    { day: '5', spend: 650 },
    { day: '10', spend: 1400 },
    { day: '15', spend: 2100 },
    { day: '20', spend: 3200 },
    { day: '25', spend: 4800 },
    { day: '30', spend: 5900 }, // Forecasted to exceed $5k
];

interface GovernanceOptimizationFlowProps {
    accountName: string;
    requestedBudget: number;
    leadAdmin: string;
    inefficientWarehouse: string;
    idleTimePercent: number;
}

const GovernanceOptimizationFlow: React.FC<GovernanceOptimizationFlowProps> = ({
    accountName,
    requestedBudget,
    leadAdmin,
    inefficientWarehouse,
    idleTimePercent
}) => {
    const [step, setStep] = useState<'forecast' | 'pivot' | 'success'>('forecast');
    const [isApplying, setIsApplying] = useState(false);

    const handleSetBudget = () => {
        setIsApplying(true);
        setTimeout(() => {
            setStep('pivot');
            setIsApplying(false);
        }, 1000);
    };

    const handleApplyPolicy = () => {
        setIsApplying(true);
        setTimeout(() => {
            setStep('success');
            setIsApplying(false);
        }, 1000);
    };

    return (
        <div className="w-full space-y-6 font-sans text-[14px]">
            <AnimatePresence mode="wait">
                {step === 'forecast' && (
                    <motion.div
                        key="forecast"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border border-[#E2DDEB] rounded-2xl overflow-hidden shadow-sm"
                    >
                        <div className="p-5 border-b border-[#F1EDF9] flex items-center justify-between bg-[#F9F7FE]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#6A38EB] flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#161616]">Spend Velocity Analysis</h4>
                                    <p className="text-[11px] text-[#5A5A72] uppercase tracking-wider font-bold">Account: {accountName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-[#9A9AB2] uppercase font-black">Lead Admin</p>
                                <p className="text-[12px] font-bold text-[#161616]">{leadAdmin}</p>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-800 font-bold">Budget at Risk</p>
                                    <p className="text-red-700 text-[13px]">
                                        Based on current velocity, you are forecasted to hit <span className="font-black">$5,900</span> by EOM. Your ${requestedBudget.toLocaleString()} limit is <span className="font-black">highly realistic</span> but requires active optimization.
                                    </p>
                                </div>
                            </div>

                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={forecastData}>
                                        <defs>
                                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6A38EB" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#6A38EB" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide domain={[0, 7000]} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                            formatter={(value: number) => [`$${value}`, 'Spend']}
                                        />
                                        <Area type="monotone" dataKey="spend" stroke="#6A38EB" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                                        {/* Budget Line */}
                                        <Line type="monotone" dataKey={() => requestedBudget} stroke="#EF4444" strokeDasharray="5 5" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <button
                                onClick={handleSetBudget}
                                disabled={isApplying}
                                className="w-full py-3 bg-[#6A38EB] hover:bg-[#5829D6] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6A38EB]/20"
                            >
                                {isApplying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm & Set $5,000 Budget"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'pivot' && (
                    <motion.div
                        key="pivot"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-[#10B981] font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Budget active for {accountName}.</span>
                        </div>

                        <div className="bg-[#F9F7FE] border border-[#E2DDEB] rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E2DDEB] shrink-0">
                                    <Zap className="w-5 h-5 text-[#6A38EB]" />
                                </div>
                                <div>
                                    <h4 className="text-[#161616] font-bold mb-1">Budget-Saving Action</h4>
                                    <p className="text-[#5A5A72] leading-relaxed">
                                        To protect this budget, we should look at <strong className="text-[#161616]">{inefficientWarehouse}</strong>. It currently has <strong className="text-red-500">{idleTimePercent}% Idle Time</strong>, wasting ~$450/month.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button 
                                    onClick={handleApplyPolicy}
                                    disabled={isApplying}
                                    className="flex items-center justify-between p-4 bg-white border border-[#E2DDEB] rounded-xl hover:border-[#6A38EB] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-[#6A38EB]" />
                                        <div className="text-left">
                                            <p className="font-bold text-[#161616]">Apply Policy</p>
                                            <p className="text-[11px] text-[#9A9AB2]">60s Auto-suspend</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#9A9AB2] group-hover:text-[#6A38EB] transition-colors" />
                                </button>
                                <button className="flex items-center justify-between p-4 bg-white border border-[#E2DDEB] rounded-xl hover:border-[#6A38EB] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="w-5 h-5 text-[#6A38EB]" />
                                        <div className="text-left">
                                            <p className="font-bold text-[#161616]">Assign to Engineer</p>
                                            <p className="text-[11px] text-[#9A9AB2]">Notify {leadAdmin}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#9A9AB2] group-hover:text-[#6A38EB] transition-colors" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl p-6 flex items-center gap-4 shadow-sm"
                    >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <div>
                            <h4 className="text-[#065F46] font-bold">Optimization Applied</h4>
                            <p className="text-[#047857] text-[13px]">
                                60s Auto-suspend policy is now active on {inefficientWarehouse}. Estimated monthly savings: <span className="font-black">$450</span>.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GovernanceOptimizationFlow;
