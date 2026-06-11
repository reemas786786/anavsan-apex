import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Zap, ShieldAlert } from 'lucide-react';
import { IconAIAgent } from '../constants';

interface Directive {
    id: string;
    type: string;
    title: string;
    text: string;
    actionLabel: string;
    badge: string;
    badgeClass: string;
}

interface AICommandCenterProps {
    onNavigate?: (page: any) => void;
}

const DirectiveCard: React.FC<{
    directive: Directive;
    onClick: (directive: Directive) => void;
}> = ({ directive, onClick }) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const hoverGlowColor = 'rgba(106, 56, 235, 0.08)';
    const activeHoverBorderClass = 'hover:border-purple-500/40 dark:hover:border-purple-500/60 hover:shadow-[0_8px_30px_rgba(106, 56, 235, 0.06)]';

    const badgeClassClean = directive.badge === 'CRITICAL' 
        ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' 
        : directive.badgeClass;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onMouseMove={handleMouseMove}
            onClick={() => onClick(directive)}
            className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/85 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full relative cursor-pointer ${activeHoverBorderClass} transition-all duration-300 group active:scale-[0.99] overflow-hidden`}
        >
            {/* Enterprise Spotlight Cursor Tracker Overlay */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${hoverGlowColor}, transparent 80%)`,
                }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div>
                    <div className="flex justify-between items-start gap-3 mb-2.5">
                        <h3 className="text-[14px] font-extrabold text-[#111827] dark:text-white leading-snug tracking-tight">
                            {directive.title}
                        </h3>
                        <div className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 shrink-0 mt-0.5 ${badgeClassClean}`}>
                            {directive.badge === 'CRITICAL' ? (
                                <ShieldAlert className="w-2.5 h-2.5 text-red-500 dark:text-red-400" />
                            ) : (
                                <Zap className="w-2.5 h-2.5" />
                            )}
                            <span>{directive.badge}</span>
                        </div>
                    </div>

                    <p className="text-[12px] text-[#4F5B73] dark:text-gray-300 leading-normal mb-3 font-semibold truncate block w-full" title={directive.text}>
                        {directive.text}
                    </p>
                </div>

                <div className="text-[12px] font-bold text-[#6A38EB] dark:text-purple-400 flex items-center gap-1 mt-0.5 group-hover:translate-x-1 transition-all duration-200">
                    <span>Ask APEX</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </motion.div>
    );
};

const AICommandCenter: React.FC<AICommandCenterProps> = ({ onNavigate }) => {
    const [directives, setDirectives] = useState<Directive[]>([
        {
            id: '1',
            type: 'Cost Governance (Snowflake Credits)',
            title: 'Warehouse Credit Limit',
            text: 'Anavsan detected a 300% credit spike in MARKETING_WH. I’ve drafted a hard-stop limit of 50 credits/day to prevent budget overrun.',
            actionLabel: 'Enforce Limit',
            badge: 'HIGH IMPACT',
            badgeClass: 'bg-[#FFFEEB] dark:bg-amber-500/10 text-[#D97706] border-[#FEF3C7] dark:border-amber-500/20'
        },
        {
            id: '2',
            type: 'Resource Optimization (APEX Engine)',
            title: 'Warehouse Right-Sizing',
            text: "The SALES_ANALYTICS warehouse is currently 'Large' but utilization is under 15%. Suggesting a downsize to 'Small' to save $1,200/mo.",
            actionLabel: 'Apply Optimization',
            badge: 'OPTIMIZATION',
            badgeClass: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
        },
        {
            id: '3',
            type: 'Security & Compliance (Data Bodyguard)',
            title: 'PII Leak Detected',
            text: 'Found unmasked Email and SSN patterns in the LOGISTICS_DATA table. Suggesting an immediate Dynamic Data Masking policy.',
            actionLabel: 'Enforce Masking',
            badge: 'CRITICAL',
            badgeClass: 'bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 border-red-100 dark:border-red-500/20'
        }
    ]);

    const isOptimized = directives.length === 0;

    const handleCardClick = (directive: Directive) => {
        let promptText = '';
        if (directive.id === '1') {
            promptText = `I noticed a 300% credit spike in MARKETING_WH. Let's configure a hard-stop limit of 50 credits/day to prevent any budget overruns.`;
        } else if (directive.id === '2') {
            promptText = `SALES_ANALYTICS warehouse is currently Large but has low utilization. Let's apply warehouse right-sizing to downsize it to Small and save $1,200/month.`;
        } else {
            promptText = `Configure a Dynamic Data Masking policy on the unmasked Email and SSN columns detected in the LOGISTICS_DATA table to secure sensitive PII credentials immediately.`;
        }

        // Save trigger prompt securely so AIAgent can fetch it immediately on load
        localStorage.setItem('apex_initial_chat_prompt', promptText);
        
        if (onNavigate) {
            onNavigate('Ask Apex');
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!isOptimized ? (
                    <motion.div
                        key="active-directives"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        {/* Header Row */}
                        <div className="flex items-center gap-2 select-none">
                            <IconAIAgent className="w-5 h-5 text-[#6A38EB]" />
                            <h2 className="text-[14px] font-bold text-[#111827] dark:text-white">
                                AI directives
                            </h2>
                        </div>

                        {/* 3-Column Card Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <AnimatePresence>
                                {directives.map((directive) => (
                                    <DirectiveCard 
                                        key={directive.id} 
                                        directive={directive} 
                                        onClick={handleCardClick} 
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="fully-optimized"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#ECFDF5] border border-[#D1FAE5] rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
                                <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest">Active Monitoring</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#ECFDF5] rounded-2xl flex items-center justify-center border border-[#D1FAE5] shrink-0">
                                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                            </div>
                            
                            <div className="flex-grow">
                                <h3 className="text-[16px] font-black text-[#161616] mb-1">
                                    Environment fully optimized
                                </h3>
                                <p className="text-[13px] text-[#5A5A72] font-medium max-w-2xl leading-relaxed">
                                    I've analyzed your 8 accounts. No new waste or bottlenecks detected. Your active guardrails are maintaining peak efficiency.
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="text-[10px] font-bold text-[#9A9AB2] uppercase tracking-widest">
                                        Last full audit: 12 mins ago
                                    </span>
                                    <button className="text-[11px] font-black text-[#6A38EB] hover:underline flex items-center gap-1">
                                        View last scan report <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subtle background decoration */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#ECFDF5]/30 rounded-full blur-3xl pointer-events-none"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AICommandCenter;
