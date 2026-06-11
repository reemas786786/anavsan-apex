import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Maximize2, ArrowUpDown, Sparkles, ArrowRight, Check, Calendar } from 'lucide-react';
import { Page, Account } from '../types';
import { IconSparkles } from '../constants';
import InfoTooltip from './InfoTooltip';

interface OptimizationHealthItem {
    id: string;
    accountName: string;
    accountIdentifier: string;
    compute: number;
    computeTrend: { direction: 'up' | 'down'; percentage: number };
    storage: number;
    storageTrend: { direction: 'up' | 'down'; percentage: number };
    dataTransfer: number;
    dataTransferTrend: { direction: 'up' | 'down'; percentage: number };
    total: number;
    totalTrend: { direction: 'up' | 'down'; percentage: number };
    insights: number;
    savingPotential: number; // in USD or credits
}

interface OptimizationHealthWidgetProps {
    onNavigate: (page: Page, subPage?: string, state?: any) => void;
    accounts: Account[];
    onSelectAccount: (account: Account) => void;
    displayMode?: 'cost' | 'credits';
}

const mockHealthData: OptimizationHealthItem[] = [
    {
        id: '1',
        accountName: 'Finance Prod',
        accountIdentifier: 'ACC_ACC-1',
        compute: 98,
        computeTrend: { direction: 'down', percentage: 8 },
        storage: 15,
        storageTrend: { direction: 'down', percentage: 3 },
        dataTransfer: 4,
        dataTransferTrend: { direction: 'up', percentage: 2 },
        total: 125,
        totalTrend: { direction: 'down', percentage: 6 },
        insights: 2,
        savingPotential: 12400
    },
    {
        id: '2',
        accountName: 'Account B',
        accountIdentifier: 'ACC_ACC-2',
        compute: 85,
        computeTrend: { direction: 'up', percentage: 12 },
        storage: 13,
        storageTrend: { direction: 'up', percentage: 5 },
        dataTransfer: 3,
        dataTransferTrend: { direction: 'down', percentage: 1 },
        total: 108,
        totalTrend: { direction: 'up', percentage: 10 },
        insights: 2,
        savingPotential: 8500
    },
    {
        id: '3',
        accountName: 'Account C',
        accountIdentifier: 'ACC_ACC-3',
        compute: 68,
        computeTrend: { direction: 'down', percentage: 8 },
        storage: 10,
        storageTrend: { direction: 'up', percentage: 5 },
        dataTransfer: 3,
        dataTransferTrend: { direction: 'down', percentage: 1 },
        total: 86,
        totalTrend: { direction: 'down', percentage: 6 },
        insights: 2,
        savingPotential: 4200
    },
    {
        id: '4',
        accountName: 'Analytics Core',
        accountIdentifier: 'GFUPMBC_XF75172',
        compute: 178,
        computeTrend: { direction: 'up', percentage: 12 },
        storage: 27,
        storageTrend: { direction: 'down', percentage: 3 },
        dataTransfer: 7,
        dataTransferTrend: { direction: 'down', percentage: 1 },
        total: 226,
        totalTrend: { direction: 'up', percentage: 10 },
        insights: 2,
        savingPotential: 15600
    },
    {
        id: '5',
        accountName: 'Finance Prod',
        accountIdentifier: 'MSXFMOF_HU33642',
        compute: 310,
        computeTrend: { direction: 'down', percentage: 8 },
        storage: 47,
        storageTrend: { direction: 'up', percentage: 5 },
        dataTransfer: 12,
        dataTransferTrend: { direction: 'up', percentage: 2 },
        total: 394,
        totalTrend: { direction: 'down', percentage: 6 },
        insights: 2,
        savingPotential: 9720
    }
];

const OptimizationHealthWidget: React.FC<OptimizationHealthWidgetProps> = ({ onNavigate, accounts, onSelectAccount, displayMode = 'credits' }) => {
    const [sortBy, setSortBy] = useState<'total_credits' | 'percent_changes' | 'saving_potential'>('total_credits');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<'7' | '14' | '30' | 'custom'>('14');
    const [customDays, setCustomDays] = useState<number>(20);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

    const daysMultiplier = useMemo(() => {
        if (dateFilter === '7') return 7 / 30;
        if (dateFilter === '14') return 14 / 30;
        if (dateFilter === '30') return 1.0;
        return customDays / 30;
    }, [dateFilter, customDays]);

    const convertedHealthData = useMemo(() => {
        return mockHealthData.map(item => ({
            ...item,
            compute: Math.round(item.compute * daysMultiplier * 10) / 10,
            storage: Math.round(item.storage * daysMultiplier * 10) / 10,
            dataTransfer: Math.round(item.dataTransfer * daysMultiplier * 10) / 10,
            total: Math.round(item.total * daysMultiplier * 10) / 10,
            savingPotential: Math.round(item.savingPotential * daysMultiplier)
        }));
    }, [daysMultiplier]);

    const handleAccountClick = (accountName: string) => {
        const matchedAccount = accounts.find(
            (acc) => acc.name.toLowerCase() === accountName.toLowerCase()
        );
        if (matchedAccount) {
            onSelectAccount(matchedAccount);
        } else {
            // Fallback: if we can't find by exact name match (e.g. Analytics Core which might not be connected directly), navigate to first account
            if (accounts.length > 0) {
                onSelectAccount(accounts[0]);
            }
        }
    };

    const handleInsightsClick = (accountName: string) => {
        onNavigate('Enforcement Desk', undefined, { filters: { search: accountName } });
    };

    const formatValue = (val: number): string => {
        if (displayMode === 'cost') {
            return '$' + Math.round(val * 3.0).toLocaleString();
        }
        return val.toLocaleString() + ' cr';
    };

    const formatSaving = (usdVal: number): string => {
        if (displayMode === 'cost') {
            return '$' + Math.round(usdVal).toLocaleString();
        }
        return Math.round(usdVal / 3.0).toLocaleString() + ' cr';
    };

    const getMaxChange = (row: OptimizationHealthItem) => {
        return Math.max(
            row.computeTrend.percentage,
            row.storageTrend.percentage,
            row.dataTransferTrend.percentage,
            row.totalTrend.percentage
        );
    };

    const sortedData = useMemo(() => {
        let items = [...convertedHealthData];
        if (sortBy === 'total_credits') {
            return items.sort((a, b) => b.total - a.total);
        } else if (sortBy === 'percent_changes') {
            return items.sort((a, b) => getMaxChange(b) - getMaxChange(a));
        } else if (sortBy === 'saving_potential') {
            return items.sort((a, b) => b.savingPotential - a.savingPotential);
        }
        return items;
    }, [convertedHealthData, sortBy]);

    const renderTrend = (trend: { direction: 'up' | 'down'; percentage: number }) => {
        const isDown = trend.direction === 'down';
        const ColorClass = isDown ? 'text-emerald-500' : 'text-rose-500';
        const Icon = isDown ? ChevronDown : ChevronUp;

        return (
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${ColorClass} ml-2`}>
                <Icon className="w-3 h-3" />
                {trend.percentage}%
            </span>
        );
    };

    const stats = useMemo(() => {
        const totalCredits = convertedHealthData.reduce((sum, item) => sum + item.total, 0);
        const monthlyCredits = totalCredits;
        const ytdCredits = totalCredits * 8.5; // Represents Year-to-Date cumulative spend
        const accCount = accounts.length > 0 ? accounts.length : convertedHealthData.length;
        const totalSavingPot = convertedHealthData.reduce((sum, item) => sum + item.savingPotential, 0);
        const totalRecommendCount = convertedHealthData.reduce((sum, item) => sum + item.insights, 0);

        const formatValueStat = (val: number): string => {
            if (displayMode === 'cost') {
                return '$' + Math.round(val * 3.0).toLocaleString();
            }
            return Math.round(val).toLocaleString() + ' cr';
        };

        const formatSavingStat = (usdVal: number): string => {
            if (displayMode === 'cost') {
                return '$' + Math.round(usdVal).toLocaleString();
            }
            return Math.round(usdVal / 3.0).toLocaleString() + ' cr';
        };

        return {
            totalSpend: formatValueStat(ytdCredits),
            averageMonthlySpend: formatValueStat(monthlyCredits),
            accountsCount: accCount.toString(),
            totalSavings: formatSavingStat(totalSavingPot),
            recommendationsCount: totalRecommendCount.toString()
        };
    }, [accounts, displayMode, convertedHealthData]);

    return (
        <div id="optimization-health-widget-container" className="bg-white rounded-[24px] border border-border-light shadow-sm flex flex-col overflow-hidden">
            {/* Header with Sort Selector */}
            <div className="p-5 pb-3 bg-white border-b border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-text-strong flex items-center gap-1.5 leading-none">
                        <span>Optimization summary</span>
                        <InfoTooltip text="A consolidated view of optimization metrics, credit usage, and saving potentials across virtual organization accounts." position="bottom" />
                    </h3>
                </div>

                <div className="flex items-center gap-4 self-stretch sm:self-auto justify-end">
                    {/* Date filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                            className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 border border-slate-200 dark:border-slate-700/80 focus:outline-none rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-slate-705 transition-all duration-250 cursor-pointer shadow-xs min-w-[145px]"
                        >
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-400 font-normal text-[11px] uppercase tracking-wider">Range:</span>
                            <span className="truncate text-slate-705 dark:text-slate-205 font-bold">
                                {dateFilter === '7' && 'Last 7 Days'}
                                {dateFilter === '14' && 'Last 14 Days'}
                                {dateFilter === '30' && 'Last 30 Days'}
                                {dateFilter === 'custom' && `Custom (${customDays}d)`}
                            </span>
                            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDateDropdownOpen && (
                            <>
                                {/* Invisible overlay to close dropdown on click outside */}
                                <div className="fixed inset-0 z-10" onClick={() => setIsDateDropdownOpen(false)} />
                                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg z-20 py-1.5 overflow-hidden">
                                    {[
                                        { value: '7', label: 'Last 7 Days' },
                                        { value: '14', label: 'Last 14 Days' },
                                        { value: '30', label: 'Last 30 Days' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setDateFilter(opt.value as any);
                                                setIsDateDropdownOpen(false);
                                            }}
                                            className={`w-full text-left flex items-center justify-between px-4 py-2 text-xs transition-colors ${
                                                dateFilter === opt.value 
                                                    ? 'bg-[#5829D6]/10 text-[#5829D6] dark:text-purple-400 font-bold' 
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/35'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {dateFilter === opt.value && (
                                                <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => {
                                            setDateFilter('custom');
                                        }}
                                        className={`w-full text-left flex items-center justify-between px-4 py-2 text-xs border-t border-slate-100 dark:border-slate-800 transition-colors ${
                                            dateFilter === 'custom' 
                                                ? 'bg-[#5829D6]/10 text-[#5829D6] dark:text-purple-400 font-bold' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/35'
                                        }`}
                                    >
                                        <span>Custom Range</span>
                                        {dateFilter === 'custom' && (
                                            <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />
                                        )}
                                    </button>

                                    {dateFilter === 'custom' && (
                                        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 mx-1.5 rounded-lg mt-1.5 border border-slate-100 dark:border-slate-800 space-y-2">
                                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span>Days (2 - 31)</span>
                                                <span className="text-[#5829D6] dark:text-purple-400">{customDays} Days</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="range"
                                                    min="2"
                                                    max="31"
                                                    value={customDays}
                                                    onChange={(e) => setCustomDays(Number(e.target.value))}
                                                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-[#5829D6]"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 justify-center">
                                                <button
                                                    onClick={() => setCustomDays(prev => Math.max(2, prev - 1))}
                                                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded font-black text-xs w-6 h-6 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="2"
                                                    max="31"
                                                    value={customDays}
                                                    onChange={(e) => {
                                                        const val = Math.min(31, Math.max(2, Number(e.target.value) || 2));
                                                        setCustomDays(val);
                                                    }}
                                                    className="w-12 h-6 px-1 text-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded text-xs font-bold text-slate-805 dark:text-slate-105"
                                                />
                                                <button
                                                    onClick={() => setCustomDays(prev => Math.min(31, prev + 1))}
                                                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded font-black text-xs w-6 h-6 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Sort by:</span>
                        
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center justify-between gap-2 text-xs font-bold text-slate-705 dark:text-slate-205 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5829D6] dark:focus:ring-purple-500 cursor-pointer shadow-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-750 text-left min-w-[145px]"
                            >
                                <span>{sortBy === 'total_credits' ? 'Total spend' : sortBy === 'percent_changes' ? 'Trend changes %' : 'Saving potential'}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {dropdownOpen && (
                                <>
                                    {/* Invisible overlay to close dropdown on click outside */}
                                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                    
                                    <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                                        {[
                                            { value: 'total_credits', label: 'Total spend' },
                                            { value: 'percent_changes', label: 'Trend changes %' },
                                            { value: 'saving_potential', label: 'Saving potential' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value as any);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                                                    sortBy === option.value
                                                        ? 'bg-slate-100/50 dark:bg-slate-800/50 text-[#5829D6] dark:text-purple-400 font-bold'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/35'
                                                }`}
                                            >
                                                <span>{option.label}</span>
                                                {sortBy === option.value && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <button className="text-text-muted hover:text-primary transition-colors p-1" title="Fullscreen">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Org Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border-light dark:divide-white/5 bg-slate-50/40 border-b border-border-light">
                <div className="p-5 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">Total spend of the Snowflake org</span>
                        <span className="text-xl font-bold text-[#111827] dark:text-slate-100 mt-1 block font-sans tracking-tight">{stats.totalSpend}</span>
                    </div>
                    <span className="text-[9.5px] text-text-muted mt-2 block leading-snug">Year-to-date cumulative organization spend</span>
                </div>
                <div className="p-5 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">Average monthly spend</span>
                        <span className="text-xl font-bold text-[#111827] dark:text-slate-100 mt-1 block font-sans tracking-tight">{stats.averageMonthlySpend}</span>
                    </div>
                    <span className="text-[9.5px] text-text-muted mt-2 block leading-snug">Rolling average monthly standard cost pool</span>
                </div>
                <div className="p-5 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">Accounts</span>
                        <span className="text-xl font-bold text-[#111827] dark:text-slate-100 mt-1 block font-sans tracking-tight">{stats.accountsCount}</span>
                    </div>
                    <span className="text-[9.5px] text-text-muted mt-2 block leading-snug">Active Snowflake virtual organization accounts</span>
                </div>
                <div 
                    onClick={() => onNavigate('Enforcement Desk')}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/10 transition-colors group relative overflow-hidden"
                >
                    <div className="flex flex-col h-full justify-between z-10 pr-2">
                        <div>
                            <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase group-hover:text-[#5829D6] dark:group-hover:text-[#818CF8] transition-colors inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <span>Total est. savings & recs</span>
                                <InfoTooltip text="Potential annual savings and total active recommendation triggers" position="bottom" />
                            </span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-xl font-bold text-[#5829D6] dark:text-[#818CF8] font-sans tracking-tight">{stats.totalSavings}</span>
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-sans">({stats.recommendationsCount} recs)</span>
                            </div>
                        </div>
                        
                        <div className="mt-3.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5829D6] text-white dark:bg-[#818CF8] dark:text-slate-950 font-extrabold text-[11px] rounded-full hover:bg-[#4d22bd] dark:hover:bg-[#727cf5] transition-all duration-200 select-none shadow-[0_2px_4px_rgba(88,41,214,0.15)] dark:shadow-[0_2px_4px_rgba(129,140,248,0.15)]">
                                View Enforcement Desk
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>
                    <div className="text-[#5829D6] dark:text-[#818CF8] opacity-20 pr-1 group-hover:scale-105 group-hover:opacity-40 transition-all duration-300 shrink-0">
                        <IconSparkles className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50/50 border-y border-border-light">
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                ACCOUNT NAME
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                COMPUTE ({displayMode === 'cost' ? 'USD' : 'CREDITS'})
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                STORAGE ({displayMode === 'cost' ? 'USD' : 'CREDITS'})
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                DATA TRANSFER ({displayMode === 'cost' ? 'USD' : 'CREDITS'})
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                TOTAL ({displayMode === 'cost' ? 'USD' : 'CREDITS'})
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                EST. SAVINGS ({displayMode === 'cost' ? 'USD' : 'CREDITS'})
                            </th>
                            <th className="px-4 py-2.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider text-right">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light bg-white">
                        {sortedData.map((row) => (
                            <tr 
                                key={row.id} 
                                onClick={() => handleInsightsClick(row.accountName)}
                                className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                            >
                                {/* Account Name Column */}
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAccountClick(row.accountName);
                                            }}
                                            className="text-[13px] font-black text-[#5829D6] hover:underline hover:text-[#4F46E5] text-left transition-colors leading-tight relative z-10"
                                        >
                                            {row.accountName}
                                        </button>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="bg-slate-100 text-slate-500 text-[9px] font-mono leading-none px-1.5 py-0.5 rounded border border-slate-200">
                                                {row.accountIdentifier}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Compute Column */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <span className="text-[13px] font-bold text-slate-800">{formatValue(row.compute)}</span>
                                        {renderTrend(row.computeTrend)}
                                    </div>
                                </td>

                                {/* Storage Column */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <span className="text-[13px] font-bold text-slate-800">{formatValue(row.storage)}</span>
                                        {renderTrend(row.storageTrend)}
                                    </div>
                                </td>

                                {/* Data Transfer Column */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <span className="text-[13px] font-bold text-slate-800">{formatValue(row.dataTransfer)}</span>
                                        {renderTrend(row.dataTransferTrend)}
                                    </div>
                                </td>

                                {/* Total Column */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <span className="text-[13px] font-bold text-slate-800">{formatValue(row.total)}</span>
                                        {renderTrend(row.totalTrend)}
                                    </div>
                                </td>

                                {/* Estimated Savings Column */}
                                <td className="px-4 py-3">
                                    {row.savingPotential > 0 ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-sans text-[13px]">
                                            <span>{formatSaving(row.savingPotential)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[13px] text-slate-400 dark:text-slate-550 font-medium font-sans">—</span>
                                    )}
                                </td>

                                {/* Action Column */}
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInsightsClick(row.accountName);
                                        }}
                                        className="text-[#5829D6] hover:text-[#4F46E5] hover:underline text-[13px] font-bold transition-all relative z-10 bg-transparent border-0 p-0 cursor-pointer outline-none"
                                    >
                                        {row.insights} insights
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OptimizationHealthWidget;
