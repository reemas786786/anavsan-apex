import React, { useState, useMemo } from 'react';
import { Recommendation } from '../types';
import { 
    IconChevronLeft, 
    IconShieldCheck, 
    IconZap, 
    IconSparkles,
    IconTerminal,
    IconActivity,
    IconArrowRight,
    IconInfo
} from '../constants';
import { motion } from 'framer-motion';

interface OptimizationWorkspaceProps {
    recommendation: Recommendation;
    onBack: () => void;
    onExecute: () => void;
}

const OptimizationWorkspace: React.FC<OptimizationWorkspaceProps> = ({ recommendation, onBack, onExecute }) => {
    const [isExecuting, setIsExecuting] = useState(false);

    const sqlCommand = useMemo(() => {
        const commands: Record<string, string> = {
            'REC-SPEC-001': 'ALTER WAREHOUSE COMPUTE_WH SET WAREHOUSE_SIZE = LARGE;',
            'REC-SPEC-002': 'ALTER TABLE FACT_SALES CLUSTER BY (EVENT_DATE);',
            'REC-SPEC-003': 'ALTER WAREHOUSE COMPUTE_WH SET AUTO_SUSPEND = 60;',
            'REC-SPEC-005': 'ALTER TABLE CUSTOMER_ACTIVITY CLUSTER BY (ACTIVITY_TYPE);',
            'REC-SPEC-006': 'DROP TABLE LOG_TABLE_OLD;',
        };
        return commands[recommendation.id] || `-- AI Optimization Script for ${recommendation.affectedResource}\nALTER RESOURCE ${recommendation.affectedResource} SET OPTIMIZED = TRUE;`;
    }, [recommendation]);

    const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
            setIsExecuting(false);
            onExecute();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#F8F9FB] flex flex-col font-sans overflow-hidden">
            {/* HEADER BAR */}
            <header className="h-16 bg-white border-b border-border-light px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-black text-text-secondary hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        <IconChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="h-4 w-px bg-border-light"></div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-text-muted">
                        <span>Recommendations</span>
                        <IconChevronLeft className="w-3 h-3 rotate-180" />
                        <span className="text-text-strong">{recommendation.affectedResource}</span>
                        <IconChevronLeft className="w-3 h-3 rotate-180" />
                        <span className="text-primary">Optimization</span>
                    </nav>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 bg-status-success/5 border border-status-success/20 rounded-full">
                    <IconShieldCheck className="w-3.5 h-3.5 text-status-success" />
                    <span className="text-[9px] font-black text-status-success uppercase tracking-widest">
                        Verified Non-intrusive Execution
                    </span>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <main className="flex-1 overflow-hidden p-6">
                <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
                    {/* TOP SECTION: DIAGNOSTICS & BLUEPRINT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-[2] min-h-0">
                        {/* LEFT: AI DIAGNOSTICS (LARGE GRAPH) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-7 bg-white p-6 rounded-[32px] border border-border-light shadow-sm flex flex-col min-h-0"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <IconActivity className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-text-strong tracking-tight">AI Diagnostic Report</h3>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-status-error/10 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-status-error animate-pulse"></div>
                                    <span className="text-[10px] font-black text-status-error uppercase tracking-widest">Inefficiency Detected</span>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 flex flex-col min-h-0">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Technical Summary</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                        {recommendation.detailedExplanation || recommendation.message}
                                    </p>
                                </div>

                                <div className="flex-1 bg-surface-nested rounded-2xl border border-border-light relative overflow-hidden flex items-end px-6 gap-2 pb-6 min-h-[200px]">
                                    <div className="absolute top-4 left-6">
                                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Load vs. Capacity (Last 24h)</h4>
                                    </div>
                                    {[30, 45, 70, 90, 100, 95, 100, 85, 60, 40, 30, 25, 35, 50, 80, 100, 95, 80, 60, 40, 30, 20, 15, 10].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col justify-end gap-1.5">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.02, duration: 0.5 }}
                                                className={`w-full rounded-t-md transition-all duration-300 ${h >= 90 ? 'bg-status-error/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-primary/20'}`}
                                            ></motion.div>
                                            <div className="h-1 w-full bg-border-light rounded-full"></div>
                                        </div>
                                    ))}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-full h-px bg-status-error/30 border-t border-dashed border-status-error"></div>
                                    </div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-status-error"></div>
                                            <span className="text-[9px] font-bold text-text-muted uppercase">Peak Load</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                                            <span className="text-[9px] font-bold text-text-muted uppercase">Avg Load</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: BLUEPRINT & IMPACT */}
                        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 rounded-[32px] border border-border-light shadow-sm space-y-6 flex-1 flex flex-col min-h-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-status-success/10 rounded-xl">
                                        <IconSparkles className="w-5 h-5 text-status-success" />
                                    </div>
                                    <h3 className="text-xl font-black text-text-strong tracking-tight">The Blueprint</h3>
                                </div>

                                <div className="flex-1 flex flex-col justify-center gap-6">
                                    <div className="flex items-center gap-4 relative">
                                        <div className="flex-1 p-5 bg-surface-nested rounded-2xl border border-border-light space-y-3">
                                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Current State</span>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-text-secondary">Size</span>
                                                    <span className="text-text-strong">Large</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-text-secondary">Suspend</span>
                                                    <span className="text-text-strong">300s</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 w-8 h-8 bg-white border border-border-light rounded-full flex items-center justify-center shadow-sm z-10">
                                            <IconArrowRight className="w-4 h-4 text-text-muted" />
                                        </div>
                                        <div className="flex-1 p-5 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Optimized State</span>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-text-secondary">Size</span>
                                                    <span className="text-primary">Medium</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-text-secondary">Suspend</span>
                                                    <span className="text-primary">60s</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-status-success to-emerald-700 p-6 rounded-[28px] shadow-xl shadow-status-success/10 relative overflow-hidden group">
                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                                        <div className="space-y-1 relative z-10">
                                            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Projected Savings</span>
                                            <div className="flex items-baseline gap-2">
                                                <h2 className="text-3xl font-black text-white tracking-tighter">
                                                    ✨ ${ (recommendation.metrics?.estimatedSavings || 1420).toLocaleString() }
                                                </h2>
                                                <span className="text-white/80 font-bold text-sm">/ month</span>
                                            </div>
                                            <p className="text-white/90 font-bold text-[11px] mt-2 leading-tight">
                                                ROI: This fix covers 6 months of your Anavsan subscription.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION: SQL & ACTION */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-[32px] border border-border-light shadow-sm shrink-0"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 items-end">
                            <div className="flex-1 w-full space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <IconTerminal className="w-4 h-4 text-text-muted" />
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Snowflake SQL Command</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-status-success uppercase tracking-widest">
                                            <div className="w-1 h-1 rounded-full bg-status-success"></div>
                                            Syntax Verified
                                        </div>
                                        <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Copy Script</button>
                                    </div>
                                </div>
                                <div className="bg-[#0D1117] rounded-2xl p-5 font-mono text-xs text-gray-300 border border-white/5 shadow-2xl relative group overflow-hidden">
                                    <div className="max-h-[100px] overflow-y-auto custom-scrollbar pr-4">
                                        <code className="block whitespace-pre-wrap leading-relaxed">{sqlCommand}</code>
                                    </div>
                                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="px-2 py-1 bg-white/10 rounded text-[9px] text-white/50">READ ONLY</div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-80 flex flex-col gap-5">
                                <div className="p-4 bg-surface-nested rounded-2xl border border-border-light space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Execution Risk</span>
                                        <span className="text-[10px] font-black text-status-success uppercase tracking-widest">Very Low</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden border border-border-light p-0.5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '16.66%' }}
                                            className="h-full bg-status-success rounded-full shadow-[0_0_8px_rgba(22,163,74,0.4)]"
                                        ></motion.div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleExecute}
                                    disabled={isExecuting}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                                >
                                    {isExecuting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Executing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <IconZap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Activate Savings →</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default OptimizationWorkspace;
