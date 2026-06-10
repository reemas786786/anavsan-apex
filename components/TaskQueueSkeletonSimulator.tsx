import React, { useState } from 'react';

interface SkeletonCardProps {
    delay: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ delay }) => {
    return (
        <div 
            className="w-full bg-[#FFFFFF] border border-[#ECEFF3] dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.015)] transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_4px_16px_rgba(0,0,0,0.025)] p-5 flex flex-col"
            style={{ animationDelay: delay }}
        >
            {/* Top header row bar */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#F5F7FA] dark:border-slate-800/50">
                {/* Simulated table name/category */}
                <div className="h-4 bg-[#EDF0F4] dark:bg-slate-800 rounded-[4px] w-28 animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.1}s` }} />
                {/* Right utility or date badge */}
                <div className="h-4 bg-[#EDF0F4] dark:bg-slate-800 rounded-[4px] w-12 animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.2}s` }} />
            </div>

            {/* Inner description rows and image icon */}
            <div className="flex gap-4 items-start">
                {/* Rounded square thumbnail image */}
                <div 
                    className="w-[42px] h-[42px] bg-[#EDF0F4] dark:bg-slate-800 rounded-xl flex-shrink-0 animate-pulse"
                    style={{ animationDelay: `${parseFloat(delay) + 0.15}s` }}
                />
                
                {/* Title & subtitle rows */}
                <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-[#EDF0F4] dark:bg-slate-800 rounded-[4px] w-52 animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.2}s` }} />
                    <div className="h-3 bg-[#E2E8F0] dark:bg-slate-800/80 rounded-[4px] w-24 animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.25}s` }} />
                </div>
            </div>

            {/* Simulated descriptions / Wide code query text templates */}
            <div className="mt-4 space-y-2">
                <div className="h-3 bg-[#EEF1F6] dark:bg-slate-800/60 rounded-[4px] w-full animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.3}s` }} />
                <div className="h-3 bg-[#EEF1F6] dark:bg-slate-800/60 rounded-[4px] w-[75%] animate-pulse" style={{ animationDelay: `${parseFloat(delay) + 0.35}s` }} />
            </div>

            {/* Bottom action button element */}
            <div className="flex justify-end mt-4">
                <div 
                    className="h-8 bg-[#EDF0F4] dark:bg-slate-800 rounded-lg w-20 animate-pulse"
                    style={{ animationDelay: `${parseFloat(delay) + 0.4}s` }}
                />
            </div>
        </div>
    );
};

export const TaskQueueSkeletonSimulator: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'my' | 'all' | 'activity'>('all');
    const [hasTag, setHasTag] = useState(true);

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-16 bg-[#FAFAFC] dark:bg-[#0B0813] rounded-[40px] border border-[#EEECF2] dark:border-slate-900 shadow-xl shadow-slate-100/50 dark:shadow-none my-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-[10px] bg-[#6932D5]/5 dark:bg-[#A78BFA]/5 text-[#6932D5] dark:text-[#A78BFA] border border-[#6932D5]/10 dark:border-purple-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest text-[11px]">
                        Review Console Simulator
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#161616] dark:text-white tracking-tight mt-3">
                        Reviewing your tasks inside AI Console
                    </h3>
                    <p className="text-sm text-[#5A5A72] dark:text-slate-400 mt-2 max-w-lg mx-auto">
                        A realistic, highly polished preview of Anavsan Tasks. Filter, investigate and optimize with human-in-the-loop control.
                    </p>
                </div>

                {/* Subheader Toolbar section: Tabs and Filter Tags */}
                <div className="bg-[#FFFFFF] dark:bg-[#120E21] rounded-2xl p-5 border border-[#ECEFF3] dark:border-slate-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col gap-4 mb-6">
                    {/* Main Tabs */}
                    <div className="flex items-center gap-6 border-b border-[#F4FDFF]/5 hover:border-slate-100 pb-3">
                        <button 
                            onClick={() => setSelectedTab('my')}
                            className={`text-sm font-bold tracking-tight pb-1 relative transition-colors ${selectedTab === 'my' ? 'text-[#1E293B] dark:text-white' : 'text-[#8A8B9A] hover:text-[#1E293B] dark:hover:text-white'}`}
                        >
                            My tasks
                            {selectedTab === 'my' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6932D5] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setSelectedTab('all')}
                            className={`text-sm font-bold tracking-tight pb-1 relative transition-colors ${selectedTab === 'all' ? 'text-[#1E293B] dark:text-white' : 'text-[#8A8B9A] hover:text-[#1E293B] dark:hover:text-white'}`}
                        >
                            All tasks
                            {selectedTab === 'all' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6932D5] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setSelectedTab('activity')}
                            className={`text-sm font-bold tracking-tight pb-1 relative transition-colors ${selectedTab === 'activity' ? 'text-[#1E293B] dark:text-white' : 'text-[#8A8B9A] hover:text-[#1E293B] dark:hover:text-white'}`}
                        >
                            Activity
                            {selectedTab === 'activity' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6932D5] rounded-full" />}
                        </button>
                    </div>

                    {/* Filter Tags row */}
                    <div className="flex items-center gap-3">
                        {hasTag && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-[#CBD5E1]/60 dark:border-slate-800 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-50">
                                <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-slate-700 bg-transparent flex-shrink-0" />
                                <span>Needs Review</span>
                                <button 
                                    onClick={() => setHasTag(false)} 
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm ml-0.5"
                                    title="Clear filter text"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => setHasTag(true)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:border-slate-400 transition-colors"
                            title="Add filter parameter"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Skeletons list vertical layout wrapper matching exactly the user prompt design */}
                <div className="space-y-4">
                    {selectedTab === 'all' ? (
                        <>
                            <SkeletonCard delay="0s" />
                            <SkeletonCard delay="0.15s" />
                            <SkeletonCard delay="0.3s" />
                        </>
                    ) : selectedTab === 'my' ? (
                        <>
                            <SkeletonCard delay="0.05s" />
                            <div className="py-12 text-center text-xs text-[#8A8B9A] font-medium uppercase tracking-widest border border-dashed border-[#ECEFF3] rounded-2xl bg-white dark:bg-slate-950/20">
                                No assigned tasks in your personal review queue
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-[#ECEFF3] dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">QUERY-74F2: Optimized to cost savings tier</span>
                                </div>
                                <span className="text-xs text-[#8A8B9A]">2m ago</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-[#ECEFF3] dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">WAREHOUSE_DEV: Hard limit threshold guardrail applied</span>
                                </div>
                                <span className="text-xs text-[#8A8B9A]">15m ago</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-[#ECEFF3] dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ANALYSTS_POOL: Vampire queries identified of zero business value</span>
                                </div>
                                <span className="text-xs text-[#8A8B9A]">Running...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
