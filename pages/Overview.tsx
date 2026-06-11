
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, CheckCircle2, CreditCard, Sparkles, ArrowRight, Target, Lightbulb, TrendingUp as TrendIcon, Calendar, Percent, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { 
    usageCreditsData, 
    resourceSnapshotData, 
    recommendationsData, 
    connectionsData, 
    warehousesData, 
    spendTrendsData,
} from '../data/dummyData';
import { Account, User, BigScreenWidget, Page, Recommendation } from '../types';
import { DisplayMode } from '../App';
import { IconDotsVertical, IconChevronDown, IconAdd, IconList, IconInfo, IconSearch, IconCheck, IconSparkles } from '../constants';
import InfoTooltip from '../components/InfoTooltip';
import AICommandCenter from '../components/AICommandCenter';
import OptimizationHealthWidget from '../components/OptimizationHealthWidget';

interface OverviewProps {
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
    accounts: Account[];
    users: User[];
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    currentUser: User | null;
    onNavigate: (page: Page, subPage?: string, state?: any) => void;
    onAddAccountClick?: () => void;
    displayMode?: DisplayMode;
}

const WidgetCard: React.FC<{ 
    children: React.ReactNode, 
    title: string, 
    hasMenu?: boolean, 
    infoText?: string, 
    headerActions?: React.ReactNode,
    onTableView?: () => void,
    className?: string
}> = ({ children, title, hasMenu = true, infoText, headerActions, onTableView, className = "" }) => (
    <div className={`bg-surface p-6 rounded-[24px] shadow-sm flex flex-col border border-border-light ${className}`}>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-bold text-text-strong tracking-wider uppercase">{title}</h4>
                {infoText && <InfoTooltip text={infoText} />}
            </div>
            <div className="flex items-center gap-2">
                {headerActions}
                {onTableView && (
                    <button 
                        onClick={onTableView}
                        className="text-text-muted hover:text-primary transition-colors p-1"
                        title="View as table"
                    >
                        <IconList className="h-4 w-4" />
                    </button>
                )}
                {hasMenu && (
                    <button className="text-text-muted hover:text-text-primary transition-colors p-1">
                        <IconDotsVertical className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

const SummaryMetricCard: React.FC<{ 
    label: string; 
    value: string; 
    subValue?: string; 
    savings?: string;
    tooltip?: string;
    onClick?: () => void 
}> = ({ label, value, subValue, savings, tooltip, onClick }) => {
    // Parse savings to separate value
    const savingsValue = savings ? savings.split(' ')[0] : null;

    return (
        <div 
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[100px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full relative cursor-pointer"
        >
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-1">
                    <p className="text-[12px] font-normal text-[#6B7280] transition-colors">{label}</p>
                    {tooltip && <InfoTooltip text={tooltip} />}
                </div>
                {savingsValue && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E5E7EB] bg-transparent">
                        <span className="text-[14px] font-bold text-[#10B981]">{savingsValue}</span>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <p className="text-[18px] font-bold text-[#111827] tracking-tight leading-none">{value}</p>
                {subValue && <p className="text-[12px] font-normal text-[#6B7280] mt-1 tracking-tight">{subValue}</p>}
            </div>
        </div>
    );
};

const BudgetStatusWidget: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const budgetItems = [
        { 
            label: 'TOTAL BUDGETS', 
            value: '3', 
            tag: 'TOTAL', 
            tagClass: 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40', 
            desc: 'Active monitoring guardrails',
            icon: <Target className="w-6 h-6 stroke-[1.25]" />
        },
        { 
            label: 'HEALTHY', 
            value: '1', 
            tag: 'STABLE', 
            tagClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40', 
            desc: 'Operating within thresholds',
            icon: <CheckCircle2 className="w-6 h-6 stroke-[1.25]" />
        },
        { 
            label: 'AT RISK', 
            value: '2', 
            tag: 'WARNING', 
            tagClass: 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/45 dark:text-amber-400 dark:border-amber-900/40', 
            desc: 'Exceeding 80% of budget',
            icon: <AlertTriangle className="w-6 h-6 stroke-[1.25]" />
        },
        { 
            label: 'AI OPTIMIZATIONS', 
            value: '2', 
            tag: 'SMART', 
            tagClass: 'bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40', 
            desc: 'Potential credit savings',
            icon: <Lightbulb className="w-6 h-6 stroke-[1.25]" />
        }
    ];

    return (
        <div className="bg-surface rounded-[24px] shadow-sm flex flex-col border border-border-light w-full overflow-hidden">
            {/* Header section with horizontal divider */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-border-light bg-white dark:bg-[#1F2937]">
                <div className="flex items-center gap-1.5">
                    <h4 className="text-[14px] font-bold text-text-strong">Budget status</h4>
                    <InfoTooltip text="Aggregate spend across all budgets vs. total organization limit." position="bottom" />
                </div>
                <div>
                    <button 
                        onClick={() => onNavigate('Budgets & alerts')} 
                        className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-all"
                    >
                        View all
                    </button>
                </div>
            </div>

            {/* Column cards grid with responsive vertical divider borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border-light dark:divide-white/5 bg-transparent">
                {budgetItems.map((item) => (
                    <div
                        key={item.label}
                        role="button"
                        tabIndex={0}
                        onClick={() => onNavigate('Budgets & alerts')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onNavigate('Budgets & alerts');
                            }
                        }}
                        className="flex justify-between items-center p-5 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 group text-left w-full cursor-pointer relative"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">
                                    {item.label}
                                </span>
                                <span className={`px-1.5 py-0.5 text-[8px] font-black tracking-wider rounded-md uppercase scale-90 origin-left ${item.tagClass}`}>
                                    {item.tag}
                                </span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-[#111827] dark:text-slate-100 tracking-tight leading-none">
                                    {item.value}
                                </span>
                                <p className="text-[9.5px] font-medium text-text-muted mt-1 leading-tight">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                        <div className="text-slate-300 dark:text-slate-600 opacity-20 pr-1 group-hover:scale-105 group-hover:opacity-40 transition-all duration-300">
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const generateForecast = (historicalData: any[], daysAhead: number, multiplier: number) => {
    if (historicalData.length === 0) return [];
    
    const lastPoint = historicalData[historicalData.length - 1];
    const parts = lastPoint.date.split(' ');
    const lastMonthStr = parts[0];
    const lastDayNum = parseInt(parts[1], 10);
    
    const monthMap: { [key: string]: number } = { 
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 
    };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const lastMonthIndex = monthMap[lastMonthStr] !== undefined ? monthMap[lastMonthStr] : 10;
    const lastYear = 2023; // standard for our dummy data dates aligned to Nov 2023
    
    const startDate = new Date(lastYear, lastMonthIndex, lastDayNum);
    const forecastPoints = [];
    
    // First element connects to the last historical point
    forecastPoints.push({
        date: lastPoint.date,
        actualTotal: Math.round(lastPoint.total * multiplier),
        forecastTotal: Math.round(lastPoint.total * multiplier),
        warehouse: Math.round(lastPoint.warehouse * multiplier),
        storage: Math.round(lastPoint.storage * multiplier),
        cloud: Math.round(lastPoint.cloud * multiplier),
        isForecast: false
    });
    
    // Simple average of recent totals to establish base trend values
    const recentPoints = historicalData.slice(-7);
    const avgTotal = recentPoints.reduce((sum, p) => sum + p.total, 0) / recentPoints.length;
    let currentTrendValue = avgTotal;
    
    for (let i = 1; i <= daysAhead; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i);
        const dateStr = `${monthNames[nextDate.getMonth()]} ${nextDate.getDate()}`;
        
        // Sine wave for cyclic warehouse query load + small random noise
        const cycle = Math.sin(i * 1.3) * 0.05; 
        const randOffset = Math.random() * 0.02 - 0.01;
        const multiplierFactor = 1 + cycle + randOffset;
        
        // stable trend over target range
        currentTrendValue = currentTrendValue * 1.002;
        const predictedVal = currentTrendValue * multiplierFactor;
        
        forecastPoints.push({
            date: dateStr,
            actualTotal: null,
            forecastTotal: Math.round(predictedVal * multiplier),
            warehouse: Math.round(predictedVal * 0.78 * multiplier),
            storage: Math.round(predictedVal * 0.14 * multiplier),
            cloud: Math.round(predictedVal * 0.08 * multiplier),
            isForecast: true
        });
    }
    
    return forecastPoints;
};

const SpendTrendForecastWidget: React.FC<{
    displayMode?: DisplayMode;
    onNavigate: (page: Page) => void;
    accounts: Account[];
}> = ({ displayMode = 'credits', onNavigate, accounts }) => {
    const [forecastDays, setForecastDays] = useState<7 | 14>(14);
    const [hoveredDataKey, setHoveredDataKey] = useState<string | null>(null);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<'7' | '14' | '30' | 'custom'>('14');
    const [customDays, setCustomDays] = useState<number>(20);
    const dateDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
                setIsDateDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedAccount = useMemo(() => {
        return accounts.find(a => a.id === selectedAccountId);
    }, [accounts, selectedAccountId]);

    const scaleFactor = useMemo(() => {
        if (selectedAccountId === 'all' || accounts.length === 0) return 1.0;
        const total = accounts.reduce((sum, a) => sum + (a.cost || 0), 0);
        if (total === 0) return 1.0;
        return (selectedAccount?.cost || 0) / total;
    }, [accounts, selectedAccountId, selectedAccount]);

    const historicalDays = useMemo(() => {
        if (dateFilter === '7') return 7;
        if (dateFilter === '14') return 14;
        if (dateFilter === '30') return 30;
        return customDays;
    }, [dateFilter, customDays]);

    const historicalData = useMemo(() => {
        return spendTrendsData.slice(-historicalDays);
    }, [historicalDays]);

    const multiplier = displayMode === 'cost' ? 3.0 : 1;
    const effectiveMultiplier = useMemo(() => {
        return multiplier * scaleFactor;
    }, [multiplier, scaleFactor]);

    const mergedChartData = useMemo(() => {
        const actualPoints = historicalData.map(pt => ({
            date: pt.date,
            actualTotal: Math.round(pt.total * effectiveMultiplier),
            forecastTotal: null,
            warehouse: Math.round(pt.warehouse * effectiveMultiplier),
            storage: Math.round(pt.storage * effectiveMultiplier),
            cloud: Math.round(pt.cloud * effectiveMultiplier),
            isForecast: false
        }));

        const forecastPoints = generateForecast(historicalData, forecastDays, effectiveMultiplier);
        
        if (actualPoints.length > 0 && forecastPoints.length > 0) {
            // Overlapping connector point
            actualPoints[actualPoints.length - 1].forecastTotal = actualPoints[actualPoints.length - 1].actualTotal;
        }

        const finalForecastPoints = forecastPoints.slice(1);
        return [...actualPoints, ...finalForecastPoints];
    }, [forecastDays, displayMode, historicalData, effectiveMultiplier]);

    const formatValue = (val: number | null): string => {
        if (val === null || val === undefined) return '';
        if (displayMode === 'cost') {
            return '$' + Math.round(val).toLocaleString();
        }
        return Math.round(val).toLocaleString() + ' cr';
    };

    // Calculate sum for last 14 days of actual data
    const mtdValue = useMemo(() => {
        return Math.round(historicalData.reduce((sum, p) => sum + p.total, 0) * effectiveMultiplier);
    }, [historicalData, effectiveMultiplier]);

    // Calculate sum of forecasts
    const forecastSum = useMemo(() => {
        const fPoints = generateForecast(historicalData, forecastDays, effectiveMultiplier).slice(1);
        return Math.round(fPoints.reduce((sum, p) => sum + (p.forecastTotal || 0), 0));
    }, [forecastDays, historicalData, effectiveMultiplier]);

    const projectedEOM = useMemo(() => {
        // Project to a 30-day billing cycle based on historical actual + forecast trend
        const remainingDays = Math.max(30 - historicalDays, 0);
        return Math.round(mtdValue + (remainingDays === 0 ? 0 : forecastSum * (remainingDays / forecastDays)));
    }, [mtdValue, forecastSum, forecastDays, historicalDays]);

    const budgetLimit = useMemo(() => {
        const baseLimit = displayMode === 'cost' ? 180000 : 60000;
        return Math.round(baseLimit * scaleFactor);
    }, [displayMode, scaleFactor]);

    const budgetPct = Math.min(Math.round((projectedEOM / budgetLimit) * 100), 150);

    const SpendForecastTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const actualItem = payload.find((p: any) => p.name === 'Actual' || p.dataKey === 'actualTotal');
            const forecastItem = payload.find((p: any) => p.name === 'Forecast' || p.dataKey === 'forecastTotal');
            const isForecastPoint = payload[0]?.payload?.isForecast;
            
            return (
                <div id="spend-forecast-tooltip" className="bg-white dark:bg-[#1A1820] p-4 rounded-xl shadow-xl border border-border-light dark:border-white/10 min-w-[200px] flex flex-col gap-2 z-50">
                    <div className="flex justify-between items-center pb-2 border-b border-border-light dark:border-white/5">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            {label}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase ${
                            isForecastPoint 
                                ? 'bg-purple-100/70 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' 
                                : 'bg-blue-100/70 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        }`}>
                            {isForecastPoint ? 'Forecast' : 'Actual'}
                        </span>
                    </div>
                    
                    {actualItem && actualItem.value !== null && (
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-medium text-[#6B7280] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#6932D5]" />
                                Actual Trend:
                            </span>
                            <span className="text-xs font-bold text-text-strong font-sans">
                                {formatValue(actualItem.value)}
                            </span>
                        </div>
                    )}
                    
                    {forecastItem && forecastItem.value !== null && (
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-medium text-[#6B7280] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#A78BFA] border border-dashed" />
                                Predicted Forecast:
                            </span>
                            <span className="text-xs font-bold text-text-strong font-sans">
                                {formatValue(forecastItem.value)}
                            </span>
                        </div>
                    )}
                    
                    {/* Component-level credit breakdown */}
                    <div className="mt-1 pt-2 border-t border-border-light dark:border-white/5 flex flex-col gap-1.5">
                        <span className="text-[14px] font-bold text-text-muted tracking-tight">Resource breakdown</span>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                                Warehouse
                            </span>
                            <span className="font-semibold font-sans">{formatValue(payload[0]?.payload?.warehouse)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F472B6]" />
                                Storage
                            </span>
                            <span className="font-semibold font-sans">{formatValue(payload[0]?.payload?.storage)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                                Cloud Services
                            </span>
                            <span className="font-semibold font-sans">{formatValue(payload[0]?.payload?.cloud)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div id="spend-trend-forecast-widget" className="bg-surface rounded-[24px] shadow-sm flex flex-col border border-border-light w-full overflow-hidden">
            {/* Header section with actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-border-light gap-3 bg-white dark:bg-[#1F2937]">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 leading-none">
                        <h4 className="text-[14px] font-bold text-text-strong">Spend trend with forecast</h4>
                        <InfoTooltip text="AI-driven cost projection models & budget drift forecast" position="bottom" />
                    </div>
                </div>
                
                {/* Switch Controls */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Account Switcher */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-border-light hover:border-primary/40 focus:outline-none rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-text-primary transition-all duration-200"
                        >
                            <span className="text-text-secondary font-normal text-[11px]">Account:</span>
                            <span className="max-w-[120px] truncate">{selectedAccountId === 'all' ? 'All Accounts' : selectedAccount?.name}</span>
                            <IconChevronDown className={`h-3 w-3 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#1F2937] border border-border-color dark:border-white/10 rounded-lg shadow-lg z-30 py-1">
                                <button
                                    onClick={() => {
                                        setSelectedAccountId('all');
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                                        selectedAccountId === 'all' 
                                            ? 'bg-primary/10 text-primary font-bold' 
                                            : 'text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <span>All Accounts</span>
                                    {selectedAccountId === 'all' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </button>
                                {accounts.map(acc => (
                                    <button
                                        key={acc.id}
                                        onClick={() => {
                                            setSelectedAccountId(acc.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                                            selectedAccountId === acc.id 
                                                ? 'bg-primary/10 text-primary font-bold' 
                                                : 'text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <span className="truncate">{acc.name}</span>
                                        {selectedAccountId === acc.id && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date filter dropdown */}
                    <div className="relative" ref={dateDropdownRef}>
                        <button
                            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                            className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-border-light hover:border-primary/40 focus:outline-none rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-text-primary transition-all duration-200"
                        >
                            <Calendar className="h-3.5 w-3.5 text-text-muted" />
                            <span className="text-text-secondary font-normal text-[11px]">Range:</span>
                            <span className="max-w-[124px] truncate">
                                {dateFilter === '7' && 'Last 7 Days'}
                                {dateFilter === '14' && 'Last 14 Days'}
                                {dateFilter === '30' && 'Last 30 Days'}
                                {dateFilter === 'custom' && `Custom (${customDays}d)`}
                            </span>
                            <IconChevronDown className={`h-3 w-3 text-text-muted transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDateDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#1F2937] border border-border-color dark:border-white/10 rounded-lg shadow-lg z-30 py-1.5">
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
                                        className={`w-full text-left flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                                            dateFilter === opt.value 
                                                ? 'bg-primary/10 text-primary font-bold' 
                                                : 'text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {dateFilter === opt.value && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => {
                                        setDateFilter('custom');
                                    }}
                                    className={`w-full text-left flex items-center justify-between px-3 py-2 text-xs border-t border-border-light dark:border-white/5 transition-colors ${
                                        dateFilter === 'custom' 
                                            ? 'bg-primary/10 text-primary font-bold' 
                                            : 'text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <span>Custom Range</span>
                                    {dateFilter === 'custom' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </button>

                                {dateFilter === 'custom' && (
                                    <div className="px-3 py-2 bg-[#FFF8F8] dark:bg-rose-950/20 mx-1 rounded-md mt-1 border border-rose-100 dark:border-rose-900/30 space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase">
                                            <span>Days (2 - 31)</span>
                                            <span className="text-primary">{customDays} Days</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="range"
                                                min="2"
                                                max="31"
                                                value={customDays}
                                                onChange={(e) => setCustomDays(Number(e.target.value))}
                                                className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 justify-center">
                                            <button
                                                onClick={() => setCustomDays(prev => Math.max(2, prev - 1))}
                                                className="bg-white dark:bg-[#111827] border border-border-light dark:border-white/10 hover:bg-slate-100 p-1 rounded font-black text-xs w-6 h-6 flex items-center justify-center text-text-primary shadow-2xs"
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
                                                className="w-12 h-6 px-1 text-center bg-white dark:bg-[#111827] border border-border-light dark:border-white/10 rounded text-xs font-bold text-text-strong"
                                            />
                                            <button
                                                onClick={() => setCustomDays(prev => Math.min(31, prev + 1))}
                                                className="bg-white dark:bg-[#111827] border border-border-light dark:border-white/10 hover:bg-slate-100 p-1 rounded font-black text-xs w-6 h-6 flex items-center justify-center text-text-primary shadow-2xs"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-light dark:divide-white/5 bg-transparent">
                {/* Left Graph Part */}
                <div className="lg:col-span-8 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider pb-1">
                        <span>Daily consumption curve ({displayMode === 'cost' ? 'USD' : 'Credits'})</span>
                        <div className="flex items-center gap-4">
                            <span 
                                className="flex items-center gap-1 cursor-pointer transition-opacity"
                                onMouseEnter={() => setHoveredDataKey('actualTotal')}
                                onMouseLeave={() => setHoveredDataKey(null)}
                                style={{ opacity: hoveredDataKey && hoveredDataKey !== 'actualTotal' ? 0.3 : 1 }}
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-[#6932D5]" />
                                Actual
                            </span>
                            <span 
                                className="flex items-center gap-1 cursor-pointer transition-opacity"
                                onMouseEnter={() => setHoveredDataKey('forecastTotal')}
                                onMouseLeave={() => setHoveredDataKey(null)}
                                style={{ opacity: hoveredDataKey && hoveredDataKey !== 'forecastTotal' ? 0.3 : 1 }}
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] border border-dashed border-[#818CF8]" />
                                AI Forecast
                            </span>
                        </div>
                    </div>
                    <div className="h-[260px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mergedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.12}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.06}/>
                                        <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.3} />
                                <XAxis 
                                    dataKey="date" 
                                    fontSize={9} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9A9AB2', fontWeight: 600}} 
                                    dy={8}
                                />
                                <YAxis 
                                    fontSize={9} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9A9AB2', fontWeight: 600}}
                                    tickFormatter={(v) => displayMode === 'cost' ? '$' + Math.round(v).toLocaleString() : Math.round(v).toLocaleString()}
                                    dx={-5}
                                />
                                <Tooltip content={<SpendForecastTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="actualTotal" 
                                    stroke="#6932D5" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorActual)" 
                                    name="Actual"
                                    activeDot={{ r: 5, strokeWidth: 1.5 }}
                                    hide={hoveredDataKey === 'forecastTotal'}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="forecastTotal" 
                                    stroke="#A78BFA" 
                                    strokeWidth={2.5} 
                                    strokeDasharray="5 5"
                                    fillOpacity={1} 
                                    fill="url(#colorForecast)" 
                                    name="Forecast"
                                    activeDot={{ r: 5, strokeWidth: 1 }}
                                    hide={hoveredDataKey === 'actualTotal'}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Forecast Info Bento Column */}
                <div className="lg:col-span-4 p-5 flex flex-col justify-between gap-5 bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="space-y-4">
                        <span className="text-[14px] font-bold text-text-muted block">Predictive metrics</span>
                        
                        {/* Sub Metric List */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center group">
                                <span className="text-xs text-text-secondary font-medium">MTD Spend (Last {historicalDays}D)</span>
                                <span className="text-sm font-bold text-text-strong group-hover:text-primary transition-colors font-sans">{formatValue(mtdValue)}</span>
                            </div>
                            <div className="flex justify-between items-center group border-t border-border-light dark:border-white/5 pt-2.5">
                                <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                                    Projected End-of-Month
                                    <div className="p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded scale-90 text-[8px] font-black uppercase">AI</div>
                                </span>
                                <span className="text-sm font-extrabold text-[#6A32D5] dark:text-[#C084FC] font-sans">{formatValue(projectedEOM)}</span>
                            </div>
                            <div className="border-t border-border-light dark:border-white/5 pt-2.5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-text-secondary font-medium">Predicted Budget Utilization</span>
                                    <span className="text-xs font-bold text-text-strong font-sans">{budgetPct}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            budgetPct < 80 
                                                ? 'bg-emerald-500' 
                                                : budgetPct < 95 
                                                ? 'bg-amber-500' 
                                                : 'bg-rose-500'
                                        }`} 
                                        style={{ width: `${Math.min(budgetPct, 100)}%` }} 
                                    />
                                </div>
                                <p className="text-[9.5px] text-text-muted mt-1 leading-tight font-medium uppercase tracking-tight">
                                    Organization limit: <strong className="text-text-secondary font-bold">{formatValue(budgetLimit)}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Operations / Data Engineer Status Box */}
                    <div 
                        onClick={() => onNavigate('Operations')}
                        className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-border-light dark:border-white/5 rounded-xl space-y-2 hover:bg-slate-100 hover:border-[#6366F1]/30 dark:hover:bg-slate-800/20 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Active Operations</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary group-hover:underline flex items-center gap-0.5">
                                View operations <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </div>
                        
                        <div className="space-y-2 pt-0.5">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-text-strong block truncate max-w-[140px]">Vampire Burn (Idle WH)</span>
                                <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded uppercase tracking-wider">
                                    Pending Review
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-[11px] border-t border-border-light/50 dark:border-white/5 pt-2">
                                <span className="font-bold text-text-strong block truncate max-w-[140px]">Bad Join Query Rule</span>
                                <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-[#34D399] rounded uppercase tracking-wider">
                                    Merged & verifying
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3.5 bg-purple-500/[0.04] border border-purple-500/10 rounded-xl space-y-1.5 hover:bg-purple-500/[0.07] transition-all duration-300">
                        <div className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#6A32D5] dark:text-[#A78BFA] animate-pulse" />
                            <span className="text-[9px] font-black text-[#5829D6] dark:text-[#C084FC] uppercase tracking-wider">Predictive Advisor</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                            {selectedAccountId === 'all' ? (
                                `"Remaining ${forecastDays} days are expected to track stable. Optimization recommendations on warehouse suspend times will save ~${forecastDays === 7 ? '940' : '1,880'} credits if applied."`
                            ) : (
                                `"Remaining ${forecastDays} days for ${selectedAccount?.name || 'this account'} are expected to track stable. Active recommendations will save ~${Math.round((forecastDays === 7 ? 450 : 900) * scaleFactor * 2.5)} credits."`
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WavyGridBackground = () => (
    <div className="absolute bottom-0 left-0 right-0 h-[600px] pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 450 Q 360 250 720 450 T 1440 450" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            <path d="M0 480 Q 360 280 720 480 T 1440 480" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            <path d="M0 510 Q 360 310 720 510 T 1440 510" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            <path d="M0 540 Q 360 340 720 540 T 1440 540" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            <path d="M0 570 Q 360 370 720 570 T 1440 570" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
             <path d="M0 600 Q 360 400 720 600 T 1440 600" stroke="#6932D5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            {/* Grid lines vertical */}
            {Array.from({ length: 40 }).map((_, i) => (
                <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke="#6932D5" strokeWidth="0.2" opacity="0.1" />
            ))}
        </svg>
    </div>
);

const WelcomeIllustration = () => (
    <div className="absolute top-10 right-10 w-[300px] h-[180px] pointer-events-none select-none animate-in fade-in zoom-in duration-1000">
        <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cloud 1 */}
            <path d="M220 100c0-15 12-28 27-28 3 0 5 0 8 1 5-10 16-17 28-17 19 0 35 16 35 35 0 2-1 4-1 6 12 5 20 17 20 31 0 19-15 34-34 34H238c-10 0-18-8-18-18s8-18 18-18" fill="#E0E7FF" opacity="0.6"/>
            {/* Progress Circles */}
            <circle cx="210" cy="70" r="30" stroke="#3B82F6" strokeWidth="6" strokeDasharray="140 50" opacity="0.8"/>
            <circle cx="245" cy="45" r="25" stroke="#6366F1" strokeWidth="5" strokeDasharray="100 60" opacity="0.6"/>
            <circle cx="270" cy="85" r="20" stroke="#A78BFA" strokeWidth="4" strokeDasharray="80 40" opacity="0.4"/>
            {/* Cloud 2 */}
            <path d="M160 140c0-10 8-18 18-18 2 0 4 0 6 1 3-7 11-12 19-12 13 0 23 10 23 23 0 1-1 3-1 4 8 3 14 11 14 20 0 13-10 23-23 23H173c-7 0-13-6-13-13z" fill="#DBEAFE" opacity="0.8"/>
        </svg>
    </div>
);


const ScopeItem: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <div className="flex gap-4 items-start">
        <div className="w-6 h-6 rounded-full bg-[#EEF4FF] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#6366F1]/10">
            <IconCheck className="w-4 h-4 text-[#6366F1]" />
        </div>
        <div className="space-y-1">
            <h4 className="text-sm font-bold text-text-strong">{title}</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

const AIOptimizationCard: React.FC<{ 
    displayMode: 'cost' | 'credits'; 
    onNavigate: (page: Page) => void 
}> = ({ displayMode, onNavigate }) => {
    const isCost = displayMode === 'cost';
    const savingsValue = isCost ? '$50,420' : '16,807 cr';
    const subLabel = isCost ? 'USD saved / year' : 'credits saved / year';

    return (
        <div 
            id="ai-organization-optimization-card"
            className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl border border-purple-100 dark:border-purple-900/40 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 dark:to-purple-950/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => onNavigate('Enforcement Desk')}
        >
            {/* Background sparkle icon */}
            <IconSparkles className="absolute right-0 bottom-0 w-32 h-32 text-purple-600 dark:text-purple-400 opacity-5 pointer-events-none -mr-4 -mb-4" />

            {/* Left Portion: Value Stats */}
            <div className="md:col-span-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-purple-100/50 dark:border-purple-900/20 pb-4 md:pb-0 md:pr-6 h-full">
                <div className="flex items-center gap-1.5 mb-2">
                    <IconSparkles className="w-4 h-4 text-[#6A32D5] dark:text-[#818CF8]" />
                    <span className="text-[14px] font-black text-purple-600 dark:text-purple-400 tracking-tight">Ai optimization</span>
                    <div className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-[8px] font-bold text-purple-700 dark:text-purple-300 rounded uppercase tracking-wider font-sans">AGENT ACTIVE</div>
                </div>
                <div className="mt-1">
                    <span className="text-3xl font-black text-[#5829D6] dark:text-[#818CF8] tracking-tight leading-none font-sans">
                        {savingsValue}
                    </span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        {subLabel}
                    </p>
                </div>
            </div>

            {/* Right Portion: AI Intelligent Message & CTA */}
            <div className="md:col-span-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                    <span className="text-[14px] font-black font-sans text-purple-600 dark:text-indigo-400 tracking-tight flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Anavsan ai recommendation
                    </span>
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        "Your Finance Prod account currently leaks 2,400+ weekly credits due to over-allocated 10-minute idle warehouse suspend times. Let's auto-enforce standard 60-second policies to recoup cost immediately."
                    </p>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('Enforcement Desk');
                    }}
                    className="bg-[#6A32D5] hover:bg-[#5829D6] text-white font-black py-2.5 px-5 rounded-full text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-md shadow-purple-600/10 flex items-center gap-1.5 whitespace-nowrap"
                >
                    <span>View Actions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

const Overview: React.FC<OverviewProps> = ({ accounts, onSelectAccount, onSelectUser, onAddAccountClick, onNavigate, displayMode = 'credits' }) => {
    const formatCurrency = (credits: number): string => {
        if (displayMode === 'cost') {
            const usd = credits * 3.0;
            if (usd >= 1000000) return '$' + (usd / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (usd >= 1000) return '$' + (usd / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return '$' + Math.round(usd).toLocaleString();
        }
        if (credits >= 1000000) return (credits / 1000000).toFixed(1).replace(/\.0$/, '') + 'M cr';
        if (credits >= 1000) return (credits / 1000).toFixed(1).replace(/\.0$/, '') + 'K cr';
        return Math.round(credits).toLocaleString() + ' cr';
    };

    if (accounts.length === 0) {
        return (
            <div className="relative h-full w-full bg-white overflow-hidden flex flex-col p-10 md:p-16">
                <WavyGridBackground />
                <WelcomeIllustration />
                
                <div className="relative z-10 max-w-7xl w-full">
                    <div className="space-y-2 mb-20">
                        <h1 className="text-[48px] font-normal text-[#161616] tracking-tight">Welcome to <strong className="font-black text-primary">Anavsan</strong></h1>
                        <p className="text-xl text-[#5A5A72] font-medium">Your smart advisor for Snowflake cost optimization.</p>
                    </div>

                    <div className="max-w-5xl animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="bg-white border border-[#E2DDEB] rounded-[32px] overflow-hidden shadow-2xl shadow-[#6932D5]/5 flex flex-col md:flex-row">
                            {/* Left Side: Get Started */}
                            <div className="p-12 flex-1 space-y-8 flex flex-col">
                                <div>
                                    <h2 className="text-[28px] font-black text-[#161616] tracking-tight">Get started with Snowflake</h2>
                                    <p className="text-[15px] text-[#5A5A72] mt-4 leading-relaxed font-medium">
                                        Anavsan helps you optimize Snowflake. Connect your account to see detailed analysis of your query spend, warehouse usage, and performance.
                                    </p>
                                </div>
                                <div className="mt-auto pt-10">
                                    <button 
                                        onClick={onAddAccountClick}
                                        className="bg-primary hover:bg-primary-hover text-white font-black py-4 px-10 rounded-full shadow-xl shadow-primary/20 flex items-center gap-3 transition-all active:scale-[0.98] group"
                                    >
                                        <span className="text-sm uppercase tracking-widest">Connect account</span>
                                        <IconAdd className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Optimization Scope */}
                            <div className="bg-[#F8F9FA] p-12 w-full md:w-[420px] flex flex-col border-l border-border-light">
                                <h3 className="text-[14px] font-black text-text-muted tracking-tight mb-8">Optimization scope</h3>
                                <div className="space-y-8 flex-grow">
                                    <ScopeItem 
                                        title="Metadata only" 
                                        desc="Analyzes account and organization usage" 
                                    />
                                    <ScopeItem 
                                        title="Zero data access" 
                                        desc="Raw table data is never read or stored" 
                                    />
                                    <ScopeItem 
                                        title="Non-Intrusive" 
                                        desc="No production query execution" 
                                    />
                                    <ScopeItem 
                                        title="Resource efficient" 
                                        desc="Runs on an X-SMALL warehouse" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background gap-4 p-4 pb-20 max-w-[1440px] mx-auto overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Cost Intelligence</h1>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <OptimizationHealthWidget onNavigate={onNavigate} accounts={accounts} onSelectAccount={onSelectAccount} displayMode={displayMode} />
                <SpendTrendForecastWidget onNavigate={onNavigate} displayMode={displayMode} accounts={accounts} />
                <BudgetStatusWidget onNavigate={onNavigate} />
                <AICommandCenter onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default Overview;
