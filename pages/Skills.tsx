import React, { useState } from 'react';
import { 
    Zap, 
    CheckCircle2, 
    Clock, 
    RefreshCw,
    GitBranch,
    Check
} from 'lucide-react';

interface PipelineItem {
    id: string;
    name: string;
    type: string;
    sourceSkill: string;
    savings: string;
    stage: 'Pending' | 'Verifying' | 'Enforced';
    prLink: string;
    prTitle: string;
    engineer: string;
    updatedAt: string;
    details: string;
}

const Skills: React.FC = () => {
    const [pipelineSubTab, setPipelineSubTab] = useState<'pending' | 'verifying' | 'enforced'>('pending');
    const [pipelineItems] = useState<PipelineItem[]>([
        {
            id: "op-1",
            name: "Eliminate Vampire Burn (Idle WH)",
            type: "Warehouse Suspension",
            sourceSkill: "Autonomous Warehouse Optimizer",
            savings: "$480/mo",
            stage: 'Pending',
            prLink: "github.com/org/dw-infra/pull/412",
            prTitle: "fix: configure auto-suspend = 300s on FINANCE_WH",
            engineer: "sindhuja.r",
            updatedAt: "3 mins ago",
            details: "Inactivity detected. Pull Request safely generated and dispatched to GitHub. Waiting for data engineer merge review."
        },
        {
            id: "op-2",
            name: "Bad Join Query Limit Rule",
            type: "Query Block Rule",
            sourceSkill: "Cortex Spend Guardrail",
            savings: "$1,200/mo",
            stage: 'Verifying',
            prLink: "github.com/org/dw-infra/pull/409",
            prTitle: "perf: add partition key constraints to daily_transaction scans",
            engineer: "hari.k",
            updatedAt: "12 mins ago",
            details: "Data engineer merged PR #409. Anavsan is actively scanning Snowflake metadata to verify the rule is safely compiled."
        },
        {
            id: "op-3",
            name: "Surgical Warehouse Rightsizing",
            type: "Compute Downsize",
            sourceSkill: "Surgical Rightsizing",
            savings: "$160/mo",
            stage: 'Enforced',
            prLink: "github.com/org/dw-infra/pull/395",
            prTitle: "chore: reduce scale DEV_ANALYTICS_WH Large to Medium",
            engineer: "alex.k",
            updatedAt: "June 08, 08:32 AM",
            details: "Verification completed. Downsize active in production Snowflake cluster. Savings started."
        },
        {
            id: "op-4",
            name: "Storage Compression Release",
            type: "Table Condense",
            sourceSkill: "Storage Lifecycle Cleanup",
            savings: "$85/mo",
            stage: 'Enforced',
            prLink: "github.com/org/dw-infra/pull/391",
            prTitle: "fix: migrate transient logs to cold compression storage tier",
            engineer: "sindhuja.r",
            updatedAt: "June 07, 04:12 PM",
            details: "Stale test backups securely moved to compressed archive tier. Compressed successfully."
        }
    ]);

    // Filter pipeline by search or stage
    const pendingPipeline = pipelineItems.filter(item => item.stage === 'Pending');
    const verifyingPipeline = pipelineItems.filter(item => item.stage === 'Verifying');
    const enforcedPipeline = pipelineItems.filter(item => item.stage === 'Enforced');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        Operations
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track execution delivery from the moment a decision is approved ("Inbox") to live enforcement inside Snowflake.
                    </p>
                </div>
            </div>

            {/* Metrics Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-[#6A38EB]/30 transition-all">
                    <div className="p-3 bg-[#F3F0FC] dark:bg-[#6A38EB]/10 text-[#5829D6] dark:text-purple-300 rounded-xl">
                        <GitBranch className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">Pending pull requests</div>
                        <div className="text-[20px] font-extrabold text-slate-800 dark:text-white-strong">
                            {pendingPipeline.length}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-blue-500/30 transition-all">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">Verifying live</div>
                        <div className="text-[20px] font-extrabold text-slate-800 dark:text-white-strong">
                            {verifyingPipeline.length}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-green-500/30 transition-all">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">Enforced success</div>
                        <div className="text-[20px] font-extrabold text-slate-800 dark:text-white-strong">
                            {enforcedPipeline.length}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-500/30 transition-all">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">Monthly saved</div>
                        <div className="text-[20px] font-extrabold text-[#10B981] font-sans">
                            $1,925/mo
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-6">
                {/* IBM Carbon Inspired tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 w-full overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setPipelineSubTab('pending')}
                        className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs font-bold tracking-wider transition-all duration-150 shrink-0 ${
                            pipelineSubTab === 'pending'
                                ? 'border-[#5829D6] dark:border-purple-500 text-slate-900 dark:text-white bg-slate-100/40 dark:bg-slate-900/40'
                                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-50/30 dark:hover:bg-slate-900/10'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${pipelineSubTab === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
                        <span>PENDING REVIEW</span>
                        <span className={`ml-1 px-2 py-0.5 text-[10px] rounded font-bold ${pipelineSubTab === 'pending' ? 'bg-[#5829D6] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {pendingPipeline.length}
                        </span>
                    </button>
                    
                    <button
                        onClick={() => setPipelineSubTab('verifying')}
                        className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs font-bold tracking-wider transition-all duration-150 shrink-0 ${
                            pipelineSubTab === 'verifying'
                                ? 'border-blue-600 dark:border-blue-500 text-slate-900 dark:text-white bg-slate-100/40 dark:bg-slate-900/40'
                                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-50/30 dark:hover:bg-slate-900/10'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${pipelineSubTab === 'verifying' ? 'bg-blue-500 animate-pulse' : 'bg-blue-400'}`} />
                        <span>VERIFYING METADATA</span>
                        <span className={`ml-1 px-2 py-0.5 text-[10px] rounded font-bold ${pipelineSubTab === 'verifying' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {verifyingPipeline.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setPipelineSubTab('enforced')}
                        className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs font-bold tracking-wider transition-all duration-150 shrink-0 ${
                            pipelineSubTab === 'enforced'
                                ? 'border-green-600 dark:border-green-500 text-slate-900 dark:text-white bg-slate-100/40 dark:bg-slate-900/40'
                                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-50/30 dark:hover:bg-slate-900/10'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${pipelineSubTab === 'enforced' ? 'bg-green-500' : 'bg-green-400'}`} />
                        <span>FULLY ENFORCED</span>
                        <span className={`ml-1 px-2 py-0.5 text-[10px] rounded font-bold ${pipelineSubTab === 'enforced' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {enforcedPipeline.length}
                        </span>
                    </button>
                </div>

                {/* Active Tab Content Area */}
                <div className="mt-4">
                    {pipelineSubTab === 'pending' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingPipeline.length === 0 ? (
                                <div className="col-span-full p-12 border border-dashed border-slate-200/80 dark:border-slate-800 text-center rounded-2xl text-slate-400 text-xs font-semibold">
                                    No pending pull requests.
                                </div>
                            ) : (
                                pendingPipeline.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all duration-250 flex flex-col justify-between text-left group">
                                        <div className="space-y-4">
                                            {/* Premium Top Line Tagging */}
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded inline-block border border-slate-200/40 dark:border-slate-700/40">
                                                    {item.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                    PR Open
                                                </span>
                                            </div>

                                            {/* Descriptive Title */}
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-[#5829D6] dark:group-hover:text-purple-400 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2 min-h-[3rem]">
                                                    {item.details}
                                                </p>
                                            </div>

                                            {/* High Fidelity PR/Git Box */}
                                            <div className="bg-slate-50/50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 font-mono text-xs leading-normal space-y-1.5">
                                                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden truncate">
                                                    <GitBranch className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                                                    <span className="truncate">{item.prLink}</span>
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-450 italic font-sans font-medium text-[11px] leading-tight">
                                                    "{item.prTitle}"
                                                </p>
                                            </div>

                                            {/* Metrics Stats Grid */}
                                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-left">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Owner</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">{item.engineer}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block text-right">Potential Savings</span>
                                                    <span className="text-xs font-black text-emerald-600 dark:text-[#10B981] block mt-1 text-right">{item.savings}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Double-Action Row echoing the AI Data Cloud card structure */}
                                        <div className="flex justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-5">
                                            <button className="text-xs font-bold text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors tracking-wide uppercase">
                                                Close PR
                                            </button>
                                            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#F3F0FC] dark:bg-purple-950/30 hover:bg-[#EAE5FA] dark:hover:bg-[#6A38EB]/20 text-[#6A38EB] dark:text-purple-300 text-[11px] font-black rounded-full border border-purple-100 dark:border-purple-900/60 shadow-sm transition-all uppercase tracking-widest">
                                                <span>▶ MERGE PR</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {pipelineSubTab === 'verifying' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {verifyingPipeline.length === 0 ? (
                                <div className="col-span-full p-12 border border-dashed border-slate-200/80 dark:border-slate-800 text-center rounded-2xl text-slate-400 text-xs font-semibold">
                                    No active execution scans in progress.
                                </div>
                            ) : (
                                verifyingPipeline.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all duration-250 flex flex-col justify-between text-left group">
                                        <div className="space-y-4">
                                            {/* Premium Top Line Tagging */}
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded inline-block border border-slate-200/40 dark:border-slate-700/40">
                                                    {item.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                                    Verifying
                                                </span>
                                            </div>

                                            {/* Descriptive Title */}
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-blue-605 dark:group-hover:text-blue-400 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2 min-h-[3rem]">
                                                    {item.details}
                                                </p>
                                            </div>

                                            {/* Scanning Status Bar */}
                                            <div className="bg-blue-50/20 dark:bg-blue-950/20 p-3.5 rounded-2xl border border-blue-100/30 dark:border-blue-900/30 font-mono text-xs leading-normal flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold">
                                                    <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-blue-500" />
                                                    <span>Scanning Snowflake...</span>
                                                </div>
                                                <span className="text-[10px] font-extrabold bg-blue-100/50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded uppercase">Active</span>
                                            </div>

                                            {/* Metrics Stats Grid */}
                                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-left">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Reviewer</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">{item.engineer}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block text-right">Target Savings</span>
                                                    <span className="text-xs font-black text-[#10B981] block mt-1 text-right">{item.savings}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Double-Action Row echoing the AI Data Cloud card structure */}
                                        <div className="flex justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-5">
                                            <button className="text-xs font-bold text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors tracking-wide uppercase">
                                                Inspect Logs
                                            </button>
                                            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[11px] font-black rounded-full border border-blue-200/55 dark:border-blue-900/60 shadow-sm transition-all uppercase tracking-widest animate-pulse">
                                                <span>↺ VERIFYING</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {pipelineSubTab === 'enforced' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enforcedPipeline.length === 0 ? (
                                <div className="col-span-full p-12 border border-dashed border-slate-200/80 dark:border-slate-800 text-center rounded-2xl text-slate-400 text-xs font-semibold">
                                    No enforced operations.
                                </div>
                            ) : (
                                enforcedPipeline.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all duration-250 flex flex-col justify-between text-left group">
                                        <div className="space-y-4">
                                            {/* Premium Top Line Tagging */}
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded inline-block border border-slate-200/40 dark:border-slate-700/40">
                                                    {item.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-600 dark:text-green-400">
                                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                                    Enforced Live
                                                </span>
                                            </div>

                                            {/* Descriptive Title */}
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-green-605 dark:group-hover:text-green-400 transition-colors inline-flex items-center gap-1.5 w-full">
                                                    <span className="truncate">{item.name}</span>
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2 min-h-[3rem]">
                                                    {item.details}
                                                </p>
                                            </div>

                                            {/* Block Verified Bar */}
                                            <div className="bg-green-50/20 dark:bg-[#064e40]/10 p-3.5 rounded-2xl border border-green-150 dark:border-green-800/30 font-mono text-xs leading-normal flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-bold">
                                                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                    <span>Active Snowflake Guard Verified</span>
                                                </div>
                                                <span className="text-[10px] font-extrabold bg-green-100 dark:bg-green-950/60 text-[#065f46] dark:text-green-300 px-2 py-0.5 rounded uppercase">Live</span>
                                            </div>

                                            {/* Metrics Stats Grid */}
                                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-left">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Deployer</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">{item.engineer}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest block text-right">Active Savings</span>
                                                    <span className="text-xs font-black text-emerald-600 dark:text-[#10B981] block mt-1 text-right">{item.savings}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Double-Action Row echoing the AI Data Cloud card structure */}
                                        <div className="flex justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-5">
                                            <button className="text-xs font-bold text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors tracking-wide uppercase">
                                                Decommission
                                            </button>
                                            <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/20 text-emerald-605 dark:text-emerald-300 text-[11px] font-black rounded-full border border-emerald-200 dark:border-emerald-900/60 shadow-sm transition-all uppercase tracking-widest">
                                                <span>▶ SIMULATE</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Skills;
