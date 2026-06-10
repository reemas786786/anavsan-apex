import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertTriangle, 
    CheckCircle2, 
    ArrowRight, 
    ChevronDown, 
    ChevronUp, 
    GitBranch, 
    Sparkles, 
    Copy, 
    RotateCcw, 
    Loader2, 
    Check, 
    Terminal, 
    ExternalLink 
} from 'lucide-react';

interface DiagnosticWizardFlowProps {
    recId: string;
    recTitle: string;
    affectedResource: string;
    accountName: string;
    severity: string;
    savings: string;
    userContext: string;
    onNavigate?: (page: string) => void;
}

export const DiagnosticWizardFlow: React.FC<DiagnosticWizardFlowProps> = ({
    recId,
    recTitle,
    affectedResource,
    accountName,
    severity,
    savings,
    userContext,
    onNavigate
}) => {
    // Local states for the recommendation properties to enable dynamic switching to other high-priority cards
    const [activeRecId, setActiveRecId] = useState<string>(recId);
    const [activeRecTitle, setActiveRecTitle] = useState<string>(recTitle);
    const [activeResource, setActiveResource] = useState<string>(affectedResource);
    const [activeAccountName, setActiveAccountName] = useState<string>(accountName);
    const [activeSeverity, setActiveSeverity] = useState<string>(severity);
    const [activeSavings, setActiveSavings] = useState<string>(savings);
    const [activeUserContext, setActiveUserContext] = useState<string>(userContext);

    // Current step in the interactive walkthrough:
    // 0: Detected Inefficiency (Idle)
    // 1: Diagnostic Context (In Progress / Completed)
    // 2: Cortex Prompt (In Progress / Completed)
    // 3: Push to GitHub (In Progress / Completed)
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isPkgExpanded, setIsPkgExpanded] = useState<boolean>(true);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [ghChecklist, setGhChecklist] = useState<number>(0);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    // Sync from props if they change deep-linked
    useEffect(() => {
        setActiveRecId(recId);
        setActiveRecTitle(recTitle);
        setActiveResource(affectedResource);
        setActiveAccountName(accountName);
        setActiveSeverity(severity);
        setActiveSavings(savings);
        setActiveUserContext(userContext);
        setCurrentStep(0);
        setGhChecklist(0);
    }, [recId, recTitle, affectedResource, accountName, severity, savings, userContext]);

    // Dispatch custom window events to inform the parent chat view (AIAgent) for the dynamic stepper layout on the right
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('apex-diagnostic-active', {
            detail: {
                recId: activeRecId,
                recTitle: activeRecTitle,
                affectedResource: activeResource,
                accountName: activeAccountName,
                severity: activeSeverity,
                savings: activeSavings,
                userContext: activeUserContext,
                currentStep
            }
        }));

        return () => {
            window.dispatchEvent(new CustomEvent('apex-diagnostic-inactive'));
        };
    }, [activeRecId, activeRecTitle, activeResource, activeAccountName, activeSeverity, activeSavings, activeUserContext]);

    // Monitor stepping and dispatch to the stepper layout
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('apex-diagnostic-step', {
            detail: { currentStep }
        }));
    }, [currentStep]);

    // Simulated action trigger
    const handleNextStep = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setCurrentStep(prev => prev + 1);
        }, 1200);
    };

    // Trigger checklist animations in Step 3
    useEffect(() => {
        if (currentStep === 3) {
            setGhChecklist(0);
            const intervals = [800, 1600, 2400, 3200];
            intervals.forEach((delay, index) => {
                setTimeout(() => {
                    setGhChecklist(index + 1);
                }, delay);
            });
        }
    }, [currentStep]);

    // Dispatch completed event when checklist resolves to step 4
    useEffect(() => {
        if (ghChecklist === 4) {
            window.dispatchEvent(new CustomEvent('apex-diagnostic-completed', {
                detail: {
                    recId: activeRecId || recId,
                    recTitle: activeRecTitle || recTitle,
                    affectedResource: activeResource || affectedResource,
                    savings: activeSavings || savings,
                    userContext: activeUserContext || userContext
                }
            }));
        }
    }, [ghChecklist, activeRecId, recId, activeRecTitle, recTitle, activeResource, affectedResource, activeSavings, savings, activeUserContext, userContext]);

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const isHigh = activeSeverity.toLowerCase().includes('high');
    const displayUser = activeUserContext || 'MANJU';
    const displayResource = activeResource || 'STORE_SALES';
    const displaySavings = activeSavings || '2,100';

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 font-sans text-[14px]">
            {/* CARD HEADER: APEX AI Live diagnostic */}
            <div className="bg-[#6A38EB]/5 border border-[#6A38EB]/20 rounded-2xl px-4 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#6A38EB] flex items-center justify-center text-white shrink-0 shadow-[0_2px_8px_rgba(106,56,235,0.25)]">
                        <Sparkles className="w-4 h-4 animate-[pulse_2s_infinite]" />
                    </div>
                    <div>
                        <h4 className="text-xs font-extrabold text-[#111827] flex items-center gap-1.5 leading-none">
                            <span>APEX AI Assistant</span>
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#6A38EB]/10 text-[#6A38EB] font-black">
                                Diagnostic Mode
                            </span>
                        </h4>
                        <p className="text-[10px] text-gray-500 font-semibold leading-none mt-1">
                            Interactive diagnostic sequence • ID: {activeRecId || 'APX-214'}
                        </p>
                    </div>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Anavsan Engine
                </div>
            </div>

            {/* STEP 0: DETECTED INEFFICIENCY */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4 relative overflow-hidden"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-black">
                                Detected Inefficiency
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold font-mono">
                                Severity: {activeSeverity || 'HIGH'}
                            </span>
                        </div>
                        <h3 className="font-extrabold text-[#111827] text-[15px] leading-snug">
                            Query Anomaly: {activeRecTitle || 'Pruning Disabled on ' + displayResource}
                        </h3>
                    </div>
                </div>

                {/* Warning Alert Box */}
                <div className="bg-[#FFF8F8] border border-rose-100/50 rounded-xl p-3.5 text-rose-900 font-semibold leading-relaxed text-xs">
                    ⚠️ A SELECT statement in this query has no WHERE clause, which results in a scan of the entire large table <strong className="text-rose-700 font-extrabold">{displayResource}</strong>. Adding a WHERE clause could speed up this query by reducing the amount of data that it scans.
                </div>

                {/* Metrics Table Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-slate-100">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Credits / Run</span>
                        <span className="text-sm font-extrabold text-slate-800 mt-1 block">0.172 cr</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Runs</span>
                        <span className="text-sm font-extrabold text-slate-800 mt-1 block">1</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Credits</span>
                        <span className="text-sm font-extrabold text-slate-800 mt-1 block">0.1720 cr</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">User Context</span>
                        <span className="text-sm font-extrabold text-purple-700 mt-1 block">{displayUser}</span>
                    </div>
                </div>

                {/* Interactive CTA to trigger Step 1 */}
                {currentStep === 0 && (
                    <button
                        onClick={handleNextStep}
                        disabled={isSimulating}
                        className="w-full flex items-center justify-center gap-2 bg-[#6A38EB] hover:bg-[#5829D6] text-white py-3 rounded-full font-bold transition-all shadow-[0_4px_12px_rgba(106,56,235,0.2)] active:scale-[0.98] group mt-1"
                    >
                        {isSimulating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Evaluating runtime footprint...</span>
                            </>
                        ) : (
                            <>
                                <span>Start diagnosis</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                )}
            </motion.div>

            {/* STEP 1: DIAGNOSTIC CONTEXT */}
            <AnimatePresence>
                {currentStep >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                            currentStep === 1 
                            ? 'border-purple-200/80 shadow-[0_4px_12px_rgba(106,56,235,0.03)]' 
                            : 'border-slate-200 opacity-70'
                        }`}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider ${
                                    currentStep === 1 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                    01
                                </span>
                                <div>
                                    <h3 className="text-xs font-extrabold text-[#111827]">Diagnostic context</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Review the execution patterns and historical metadata used to identify optimization.</p>
                                </div>
                            </div>
                            <span className={`text-[9.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                currentStep === 1 ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                                {currentStep === 1 ? 'In Progress' : 'Completed'}
                            </span>
                        </div>

                        <div className="p-4 space-y-3.5">
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                                APEX matched this full table scan with an established pattern in your peer repository. This scan matches 2 prior PRs on similar query constructs.
                            </p>

                            {/* Collapsible Accordion Context Block */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#0F172A]">
                                <button
                                    onClick={() => setIsPkgExpanded(!isPkgExpanded)}
                                    className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-300 bg-[#1E293B] hover:bg-[#2A374E] transition-colors border-b border-slate-700"
                                >
                                    <span className="flex items-center gap-1.5 text-left">
                                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
                                        <span>PKG context block (structured organizational intelligence - passed to Cortex. Under 420 tokens.)</span>
                                    </span>
                                    {isPkgExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {isPkgExpanded && (
                                    <div className="p-4 font-mono text-[11px] leading-relaxed min-h-[100px] max-h-[220px] overflow-y-auto">
                                        <pre className="text-[#38BDF8] select-all whitespace-pre-wrap leading-normal font-medium">
{`# APEX PKG Context - APX-214 - fblpisn_umc02429 - ~420 tokens
apex_pkg_context = {
   "enforcement_id": "${activeRecId || 'APX-214'}",
   "warehouse": "DAILY_ETL_WH",
   "assigned_engineer": "${displayUser.toLowerCase()}",
   "tier": "T2_accountable",
   # -- Anomaly classification --------
   "anomaly_classified": {
      "anomaly_type": "full_table_scan_no_where_clause",
      "cost_projection": "$${displaySavings}/month",
      "frequency_index": "1.0 runs/day",
      "target_patterns": ["SELECT", "FROM ${displayResource}"]
   },
   "recent_remedies": {
      "ref": "${displayUser.toLowerCase()}.k's commit to sales_dw",
      "method": "add partition pruning predicate on SALE_DATE",
      "reductive_impact": "71% credit reduction"
   }
}`}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* Step 1 Action Button */}
                            {currentStep === 1 && (
                                <button
                                    onClick={handleNextStep}
                                    disabled={isSimulating}
                                    className="inline-flex items-center gap-1.5 bg-[#6A38EB] hover:bg-[#5829D6] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-[0.98] group"
                                >
                                    {isSimulating ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Compiling intelligence prompt...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate Cortex prompt</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STEP 2: AI OPTIMIZATION (CORTEX PROMPT) */}
            <AnimatePresence>
                {currentStep >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                            currentStep === 2 
                            ? 'border-purple-200/80 shadow-[0_4px_12px_rgba(106,56,235,0.03)]' 
                            : 'border-slate-200 opacity-70'
                        }`}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider ${
                                    currentStep === 2 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                    02
                                </span>
                                <div>
                                    <h3 className="text-xs font-extrabold text-[#111827]">Cortex prompt — generated by APEX</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">A structured, execution-ready prompt generated to optimize outcomes (~400 tokens).</p>
                                </div>
                            </div>
                            <span className={`text-[9.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                currentStep === 2 ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                                {currentStep === 2 ? 'In Progress' : 'Completed'}
                            </span>
                        </div>

                        <div className="p-4 space-y-3.5">
                            {/* Prompt Code Block */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                                    <span className="font-semibold text-[10.5px]">Generated Prompt Blueprint</span>
                                    <button 
                                        onClick={() => handleCopyText(`## Anomaly classification\ntype: full_table_scan_no_where_clause\nCost: $${displaySavings}/month`)}
                                        className="flex items-center gap-1 text-[11px] hover:text-[#6A38EB] transition-colors"
                                    >
                                        {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                                <div className="p-4 bg-[#0F172A] font-mono text-[11.5px] text-slate-200 leading-relaxed space-y-4 select-all min-h-[100px] max-h-[220px] overflow-y-auto">
                                    <div>
                                        <p className="text-[#38BDF8] font-extrabold">{"## Anomaly classification"}</p>
                                        <p className="text-slate-300 ml-2">{"type: full_table_scan_no_where_clause"}</p>
                                        <p className="text-slate-300 ml-2">{"cost_leak: $" + displaySavings + "/month"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#38BDF8] font-extrabold">{"## Prior fix from organization's PKG"}</p>
                                        <p className="text-slate-300 ml-2">{`${displayUser.toLowerCase()}.k fixed similar scan pattern on ${displayResource} table (24 hours ago)`}</p>
                                        <p className="text-slate-300 ml-2">{"Use this as a validated reference. Apply the same class of fix."}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#38BDF8] font-extrabold">{"## Hard constraints - SATISFY ALL OF THESE"}</p>
                                        <p className="text-slate-300 ml-2">{"- add partition pruning predicate on SALE_DATE (range: last 30 days)"}</p>
                                        <p className="text-slate-300 ml-2">{"- retain same schema semantics and results"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 Action Button */}
                            {currentStep === 2 && (
                                <button
                                    onClick={handleNextStep}
                                    disabled={isSimulating}
                                    className="inline-flex items-center gap-1.5 bg-[#6A38EB] hover:bg-[#5829D6] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-[0.98] group"
                                >
                                    {isSimulating ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Deploying branch fix to GitHub...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Push fix to engineer's GitHub branch</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STEP 3: GITHUB INTEGRATION */}
            <AnimatePresence>
                {currentStep >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-[0_4px_16px_rgba(106,56,235,0.04)]"
                    >
                        <div className="p-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/20">
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider bg-purple-50 text-purple-700 border-purple-100">
                                    03
                                </span>
                                <div>
                                    <h3 className="text-xs font-extrabold text-[#111827]">GitHub integration</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Push the analysis and recommended fix to a GitHub branch for peer reviews.</p>
                                </div>
                            </div>
                            <span className="text-[9.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100 border">
                                Completed
                            </span>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Branch panel info */}
                            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-xs font-semibold text-indigo-900">
                                <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-[#4F46E5] shrink-0" />
                                    <span>Target Branch:</span>
                                    <span className="font-mono bg-indigo-100 text-[#4338CA] px-2.5 py-0.5 rounded text-[11.5px] font-bold">
                                        {`apex/fix/${displayResource.toLowerCase().replace(/_/g, '-')}-scan`}
                                    </span>
                                </div>
                            </div>

                            {/* Checklist timeline */}
                            <div className="space-y-3 pl-1 font-semibold text-xs">
                                <div className="flex items-center gap-2.5 transition-all">
                                    {ghChecklist >= 1 ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                                    )}
                                    <span className={ghChecklist >= 1 ? 'text-slate-800' : 'text-slate-400'}>Open draft pull-request on GitHub</span>
                                </div>
                                <div className="flex items-center gap-2.5 transition-all">
                                    {ghChecklist >= 2 ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : ghChecklist >= 1 ? (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                                    )}
                                    <span className={ghChecklist >= 2 ? 'text-slate-800' : 'text-slate-400'}>Commit Cortex-generated SQL file to branch</span>
                                </div>
                                <div className="flex items-center gap-2.5 transition-all">
                                    {ghChecklist >= 3 ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : ghChecklist >= 2 ? (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                                    )}
                                    <span className={ghChecklist >= 3 ? 'text-slate-800' : 'text-slate-400'}>Promote PR to ready-for-review</span>
                                </div>
                                <div className="flex items-center gap-2.5 transition-all">
                                    {ghChecklist >= 4 ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : ghChecklist >= 3 ? (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                                    )}
                                    <span className={ghChecklist >= 4 ? 'text-slate-800' : 'text-slate-400'}>{`Notify engineer via GitHub + Slack/APEX integration`}</span>
                                </div>
                            </div>

                            {/* Green simulation banner */}
                            {ghChecklist >= 4 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-3.5 flex items-center gap-2.5"
                                >
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                    <span className="text-xs font-bold text-[#065F46] leading-none">
                                        {`Credit Simulator confirmed -71% savings - ${displayUser.toLowerCase()}.commit notified`}
                                    </span>
                                </motion.div>
                            )}

                            {/* Done back button */}
                            {ghChecklist >= 4 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-2"
                                >
                                    <div className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5 justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Diagnosis and enforcement successfully routed!</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task delivery status from Operations panel - placed OUTSIDE the GitHub integration card */}
            <AnimatePresence>
                {currentStep >= 3 && ghChecklist >= 4 && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="bg-white dark:bg-[#111827] rounded-2xl border border-amber-200/60 dark:border-amber-500/20 overflow-hidden shadow-[0_4px_16px_rgba(245,158,11,0.05)] mt-4"
                    >
                        <div className="p-4 border-b border-amber-100 dark:border-amber-500/10 flex items-center justify-between bg-amber-50/20 dark:bg-amber-500/[0.02]">
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                                    04
                                </span>
                                <div>
                                    <h3 className="text-xs font-extrabold text-[#111827] dark:text-white">Task delivery status</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Verify execution & alignment on operations pipeline.</p>
                                </div>
                            </div>
                            <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded">
                                Pending Merge
                            </span>
                        </div>

                        <div className="p-4 space-y-3">
                            <p className="text-[11.5px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                                Data engineer <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{displayUser.toLowerCase()}</strong> has been notified and is assigned to the pull request. The task is currently pending review. You can track peer reviews and compile verification in the operations section.
                            </p>

                            {onNavigate && (
                                <button 
                                    onClick={() => onNavigate('Operations')}
                                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#6A38EB]/10 hover:bg-[#6A38EB]/25 text-[#6A38EB] dark:text-[#A78BFA] border border-[#6A38EB]/20 py-2.5 rounded-lg font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <span>View updates on Operations section</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RECOMMEND ANOTHER HIGH PRIORITY CARD AND GO BACK TO DESK (Separate Card) Removed duplicate to prevent double cards */}
        </div>
    );
};

export default DiagnosticWizardFlow;
