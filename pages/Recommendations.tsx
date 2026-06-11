import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Recommendation, Account, RecommendationStatus, User, QueryListItem, Warehouse } from '../types';
import { recommendationsData as initialData } from '../data/dummyData';
import { 
    TrendingUp, 
    Zap as LucideZap, 
    CheckCircle2, 
    UserPlus, 
    Sparkles as LucideSparkles,
    SlidersHorizontal,
    Search,
    ChevronDown,
    Shield,
    Bot,
    UserCheck,
    Clock,
    CheckCircle,
    ArrowUpDown,
    ArrowRight,
    ArrowLeft,
    Copy,
    RotateCcw,
    GitBranch,
    ChevronLeft,
    ChevronRight,
    Globe,
    Tag
} from 'lucide-react';
import { 
    IconSearch, 
    IconInfo, 
    IconChevronLeft, 
    IconClose, 
    IconCheck, 
    IconDatabase, 
    IconZap, 
    IconSparkles, 
    IconShieldCheck,
    IconTerminal,
    IconActivity,
    IconLockClosed
} from '../constants';
import Pagination from '../components/Pagination';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import OptimizationWorkspace from '../components/OptimizationWorkspace';
import InfoTooltip from '../components/InfoTooltip';
import { motion, AnimatePresence } from 'framer-motion';

// --- CLOUD ICONS ---
const IconAWS = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M15.186 16.532c-1.242.828-3.042 1.242-4.554 1.242-2.139 0-3.864-.69-5.106-2.07-.345-.345-.069-.69.276-.483 1.518.897 3.381 1.38 5.106 1.38 1.311 0 2.829-.345 4.002-1.035.345-.207.621.138.276.441v-.001-.004zm1.518-1.035c-.138-.207-.483-.138-.414.138.069.483.138 1.035.138 1.587 0 .276.276.414.483.207.207-.207.69-.69.897-1.104.138-.207-.069-.483-.345-.414-.276.069-.621.138-.759.138v-.552zm.897 3.104c-.207.207-.483.069-.414-.138.138-.552.414-1.587.414-2.139 0-.276.276-.414.483-.207.207.207.69.69.897 1.104.138.207-.069.483-.345.414-.276.069-.621.138-.759.138-.276.828-.276.828-.276.828zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
);

const IconAzure = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M5.42 19.5h5.36l2.9-4.92-2.9-4.92H5.42l2.9 4.92-2.9 4.92zm13.16 0h-5.36l-2.9-4.92 2.9-4.92h5.36l-2.9 4.92 2.9 4.92zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
);

const IconGCP = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/>
    </svg>
);

// --- TRENDY CUSTOM DROPDOWN COMPONENT ---
const CustomFilterDropdown: React.FC<{
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}> = ({ label, value, options, onChange, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-xs">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200/85 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-xs font-bold text-slate-700 focus:outline-none transition-colors duration-150 select-none cursor-pointer"
            >
                {icon && <span className="text-slate-400 select-none shrink-0 flex items-center">{icon}</span>}
                <span className="text-slate-400 font-medium">{label}:</span>
                <span className="text-violet-600 font-extrabold">{options.find(o => o.value === value)?.label || value}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-1 shrink-0 ${isOpen ? 'rotate-180 text-violet-600' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to dismiss dropdown seamlessly */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    
                    {/* Dropdown Card */}
                    <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 min-w-[200px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 transform origin-top-left">
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                        isSelected 
                                            ? 'bg-purple-50/70 text-purple-700 font-black' 
                                            : 'text-[#374151] hover:bg-slate-50 hover:text-[#111827]'
                                    }`}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

// --- COMPACT BENTO KPI CARDS ---
const EnforcementKpiCard: React.FC<{
    title: string;
    value: string;
    desc: string;
    icon: React.ReactNode;
    colorClasses: { bg: string; text: string; border: string; accent: string };
    pulse?: boolean;
    sparklineData?: number[];
}> = ({ title, value, desc, icon, colorClasses, pulse = false, sparklineData }) => (
    <div className={`bg-white rounded-xl p-4 border border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 relative overflow-hidden flex-1 min-w-[210px] group`}>
        {/* Glowing Ambient Light */}
        <div className={`absolute -right-6 -top-6 w-20 h-20 bg-gradient-to-br ${colorClasses.accent} opacity-10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500`}></div>
        
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.14em]">{title}</span>
                <span className="text-xl font-extrabold text-[#111827] mt-1 tracking-tight leading-none">{value}</span>
            </div>
            <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border} shrink-0 transition-all duration-300 group-hover:scale-105 shadow-sm`}>
                {icon}
            </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/60">
            <span className="text-[11px] text-text-secondary leading-tight font-medium flex items-center gap-1">
                {pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>}
                {desc}
            </span>
            {sparklineData && (
                <div className="flex items-end gap-0.5 h-4 w-12 pb-0.5">
                    {sparklineData.map((val, i) => (
                        <div 
                            key={i} 
                            style={{ height: `${val}%` }} 
                            className={`w-1 rounded-t-full ${pulse ? 'bg-emerald-500/30 group-hover:bg-emerald-500/60' : 'bg-[#6A38EB]/20 group-hover:bg-[#6A38EB]/50'} transition-all duration-300`}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// --- SPOTLIGHT HIERARCHY CARD COMPONENT FOR ENFORCEMENT DESK ---
const RobustRecommendationCard: React.FC<{
    rec: Recommendation;
    onSelectRecommendation: (rec: Recommendation) => void;
    accountCode: string;
    recTitle: string;
    whName: string;
    estSavings: number;
    platform: any;
    getPriorityBadgeCustom: (severity: string) => React.ReactNode;
    getStatusTextBadgeCustom: (status: string) => React.ReactNode;
    displayMode: 'cost' | 'credits';
    onToggleStatus?: (rec: Recommendation) => void;
    hideAccountDetails?: boolean;
}> = ({
    rec,
    onSelectRecommendation,
    accountCode,
    recTitle,
    whName,
    estSavings,
    platform,
    getPriorityBadgeCustom,
    getStatusTextBadgeCustom,
    displayMode,
    onToggleStatus,
    hideAccountDetails,
}) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const severityKey = rec.severity.toLowerCase();
    const hoverGlowColor = 'rgba(106, 56, 235, 0.08)';

    const activeHoverBorderClass = 'hover:border-purple-500/40 dark:hover:border-purple-500/60 hover:shadow-[0_8px_30px_rgba(106,56,235,0.06)]';

    const formattedSavings = displayMode === 'cost' 
        ? `$${estSavings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        : `${Math.round(estSavings / 3.0).toLocaleString()} cr`;

    return (
        <motion.div 
            onClick={() => onSelectRecommendation(rec)}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`group relative bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] ${activeHoverBorderClass} cursor-pointer flex flex-col justify-between overflow-hidden transition-all text-left h-full`}
        >
            {/* Enterprise Spotlight Cursor Tracker Overlay */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${hoverGlowColor}, transparent 80%)`,
                }}
            />

            <div className="p-5 pb-4 relative z-10 flex-grow">
                {/* Top Metadata: provider, account title, status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs overflow-hidden pb-0.5">
                            {platform.icon}
                        </div>
                        {!hideAccountDetails && (
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 leading-tight">
                                    {rec.accountName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold font-mono leading-none mt-0.5">
                                    {accountCode}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Hover Action Button with Tooltip */}
                        {onToggleStatus && (
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center relative mr-0.5">
                                <div className="relative group/tooltip">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleStatus(rec);
                                        }}
                                        className="h-7 w-7 rounded-lg border border-slate-200/80 hover:border-indigo-200 bg-white hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                                    >
                                        {rec.status === 'New' ? (
                                            <IconCheck className="w-3.5 h-3.5 text-indigo-500" />
                                        ) : (
                                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                                        )}
                                    </button>
                                    
                                    {/* Tooltip on Hover */}
                                    <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden group-hover/tooltip:block bg-slate-900 border border-slate-800 text-white text-[9px] font-black uppercase tracking-wider py-1 px-2 rounded-md shadow-lg whitespace-nowrap z-50">
                                        {rec.status === 'New' ? 'Acknowledge' : 'Mark as New'}
                                    </div>
                                </div>
                            </div>
                        )}
                        {getStatusTextBadgeCustom(rec.status)}
                    </div>
                </div>

                {/* Middle Details: resource type, warehouse name, recommendation title and suggestion */}
                <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                            {rec.resourceType || 'Warehouse'}
                        </span>
                        <span className="text-slate-350 select-none">•</span>
                        <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50/60 px-2.5 py-0.5 rounded border border-purple-100/60 uppercase">
                            {whName}
                        </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-650 transition-colors leading-snug">
                        {recTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2 leading-relaxed">
                        {rec.suggestion || rec.message}
                    </p>
                </div>
            </div>

            {/* Bottom block: metrics and priority details */}
            <div className="px-5 py-4 bg-slate-50/40 border-t border-slate-100/80 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {displayMode === 'cost' ? 'Est. Monthly Savings' : 'Est. Monthly Savings (Credits)'}
                    </span>
                    <span className="text-base font-black text-[#10B981] mt-1.5 leading-none">
                        {formattedSavings}
                    </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    {getPriorityBadgeCustom(rec.severity)}
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-150 flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 group-hover:border-purple-150 transition-all shadow-xs">
                        <IconInfo className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
const Recommendations: React.FC<{ 
    accounts: Account[];
    currentUser: User | null;
    initialFilters?: { search?: string; account?: string; status?: string; selectedId?: string };
    onNavigateToQuery: (query: Partial<QueryListItem>) => void;
    onNavigateToWarehouse: (warehouse: Partial<Warehouse>) => void;
    onAssignTask?: (recommendation: Recommendation) => void;
    onOptimizeRecommendation?: (recommendation: Recommendation) => void;
    selectedRecommendation: Recommendation | null;
    onSelectRecommendation: (rec: Recommendation | null) => void;
    onPreviewQuery?: (query: Partial<QueryListItem>) => void;
    onBackToSource?: () => void;
    returnContext?: { account: Account; page: string; warehouse?: Warehouse | null } | null;
    displayMode?: 'cost' | 'credits';
    onNavigate?: (page: any) => void;
    isAccountLevel?: boolean;
    currentAccountName?: string;
}> = ({ accounts, currentUser, initialFilters, onNavigateToQuery, onNavigateToWarehouse, onAssignTask, onOptimizeRecommendation, selectedRecommendation, onSelectRecommendation, onPreviewQuery, onBackToSource, returnContext, displayMode = 'cost', onNavigate, isAccountLevel = false, currentAccountName }) => {
    
    const [data, setData] = useState<Recommendation[]>(() => {
        return initialData.map(rec => {
            // map some items to Acknowledged initially so both labs have active mocked data!
            if (rec.status !== 'New' && rec.status !== 'Resolved') {
                return { ...rec, status: 'Acknowledged' as const };
            }
            return rec;
        });
    });
    const [search, setSearch] = useState('');
    const [isContextual, setIsContextual] = useState(false);
    const [resourceTypeFilter, setResourceTypeFilter] = useState<string[]>([]);
    const [accountFilter, setAccountFilter] = useState<string[]>([]);
    const [insightTypeFilter, setInsightTypeFilter] = useState<string[]>([]);
    
    // Default sorting in Enforcement Desk
    const [sortOption, setSortOption] = useState<'savings' | 'severity' | 'resource_name' | 'age'>('savings');
    
    const [activeTab, setActiveTab] = useState<'New' | 'Acknowledged'>('New');
    
    // Undo mechanism state
    const [undoState, setUndoState] = useState<{
        recId: string;
        previousStatus: RecommendationStatus;
        newStatus: RecommendationStatus;
        message: string;
    } | null>(null);
    
    const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
            }
        };
    }, []);

    const [workspaceRec, setWorkspaceRec] = useState<Recommendation | null>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [isPkgContextExpanded, setIsPkgContextExpanded] = useState(false);
    const [isSimulatingLink, setIsSimulatingLink] = useState(false);

    // Reset step states when a different recommendation is chosen
    useEffect(() => {
        setCurrentStep(0);
        setIsPkgContextExpanded(false);
        setIsSimulatingLink(false);
    }, [selectedRecommendation?.id]);

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.search || initialFilters.account || initialFilters.status) {
                if (initialFilters.search) setSearch(initialFilters.search);
                if (initialFilters.account) setAccountFilter([initialFilters.account]);
                if (initialFilters.status) {
                    if (initialFilters.status === 'New') {
                        setActiveTab('New');
                    } else if (initialFilters.status === 'Acknowledged' || initialFilters.status === 'In Progress' || initialFilters.status === 'Read') {
                        setActiveTab('Acknowledged');
                    }
                }
                
                setIsContextual(true);
            }

            if (initialFilters.selectedId) {
                const rec = initialData.find(r => r.id === initialFilters.selectedId);
                if (rec) {
                    onSelectRecommendation(rec);
                }
            }
        }
    }, [initialFilters, onSelectRecommendation]);

    const handleClearContext = () => {
        setSearch('');
        setAccountFilter([]);
        setInsightTypeFilter([]);
        setResourceTypeFilter([]);
        setIsContextual(false);
    };

    const handleToggleStatus = (rec: Recommendation) => {
        const previousStatus = rec.status;
        const newStatus: RecommendationStatus = previousStatus === 'New' ? 'Acknowledged' : 'New';
        
        setData(prev => prev.map(item => item.id === rec.id ? { ...item, status: newStatus } : item));
        if (selectedRecommendation?.id === rec.id) {
            onSelectRecommendation({ ...selectedRecommendation, status: newStatus });
        }

        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }

        const message = newStatus === 'Acknowledged'
            ? `Optimization marked as Acknowledged`
            : `Optimization moved back to New`;

        setUndoState({
            recId: rec.id,
            previousStatus,
            newStatus,
            message
        });

        undoTimeoutRef.current = setTimeout(() => {
            setUndoState(null);
        }, 3000); // 3 seconds timeout
    };

    const handleAcknowledgeAll = () => {
        setData(prev => prev.map(item => item.status === 'New' ? { ...item, status: 'Acknowledged' as const } : item));
        
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }

        setUndoState({
            recId: 'all',
            previousStatus: 'New',
            newStatus: 'Acknowledged',
            message: 'All new optimizations marked as Acknowledged'
        });

        undoTimeoutRef.current = setTimeout(() => {
            setUndoState(null);
        }, 3000); // 3 seconds timeout
    };

    const handleUndo = () => {
        if (!undoState) return;

        if (undoState.recId === 'all') {
            setData(prev => prev.map(item => item.status === 'Acknowledged' ? { ...item, status: 'New' as const } : item));
        } else {
            setData(prev => prev.map(item => item.id === undoState.recId ? { ...item, status: undoState.previousStatus } : item));
            if (selectedRecommendation?.id === undoState.recId) {
                onSelectRecommendation({ ...selectedRecommendation, status: undoState.previousStatus });
            }
        }

        setUndoState(null);
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }
    };

    // Sorting algorithm based on selector
    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(rec => {
            // First check tab filter
            if (activeTab === 'New' && rec.status !== 'New') return false;
            if (activeTab === 'Acknowledged' && rec.status !== 'Acknowledged') return false;

            const searchLower = search.toLowerCase();
            
            if (isContextual && search) {
                const matchesResource = rec.affectedResource.toLowerCase().includes(searchLower);
                const matchesAccount = rec.accountName.toLowerCase().includes(searchLower);
                if (!matchesResource && !matchesAccount) return false;
            } else if (search && !(
                rec.affectedResource.toLowerCase().includes(searchLower) ||
                rec.message.toLowerCase().includes(searchLower) ||
                rec.insightType.toLowerCase().includes(searchLower) ||
                rec.resourceType.toLowerCase().includes(searchLower) ||
                rec.accountName.toLowerCase().includes(searchLower)
            )) return false;

            if (isAccountLevel && currentAccountName) {
                if (rec.accountName !== currentAccountName) return false;
            }

            if (resourceTypeFilter.length > 0 && !resourceTypeFilter.includes(rec.resourceType)) return false;
            if (accountFilter.length > 0 && !accountFilter.includes(rec.accountName)) return false;
            if (insightTypeFilter.length > 0 && !insightTypeFilter.includes(rec.insightType)) return false;

            return true;
        });

        // Apply Sorting based on modern drop-down
        if (sortOption === 'savings') {
            filtered.sort((a, b) => {
                const savingsA = a.metrics?.estimatedSavings || 0;
                const savingsB = b.metrics?.estimatedSavings || 0;
                return savingsB - savingsA;
            });
        } else if (sortOption === 'severity') {
            const severityWeights = { 'High': 3, 'High Cost': 3, 'Medium': 2, 'Low': 1, 'Cost Saving': 2, 'Performance Boost': 2 };
            filtered.sort((a, b) => (severityWeights[b.severity] || 0) - (severityWeights[a.severity] || 0));
        } else if (sortOption === 'resource_name') {
            filtered.sort((a, b) => a.affectedResource.localeCompare(b.affectedResource));
        } else if (sortOption === 'age') {
            filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }

        return filtered;
    }, [data, search, resourceTypeFilter, accountFilter, insightTypeFilter, sortOption, isContextual, activeTab, isAccountLevel, currentAccountName]);

    const handleUpdateStatus = (id: string, status: RecommendationStatus) => {
        setData(prev => prev.map(rec => rec.id === id ? { ...rec, status } : rec));
        if (selectedRecommendation?.id === id) {
            onSelectRecommendation({ ...selectedRecommendation, status });
        }
    };

    const handleExecuteFix = (id: string) => {
        setData(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'Resolved' } : rec));
        setWorkspaceRec(null);
    };

    const handleSearchChange = (val: string) => {
        setSearch(val);
    };

    const insightTypeOptions = useMemo(() => [...new Set(initialData.map(d => d.insightType))], []);

    const getCloudPlatform = (accountName: string) => {
        if (accountName.toLowerCase().includes('finance')) return { icon: <IconAzure className="w-3.5 h-3.5 text-[#0089D6]" />, provider: 'Azure' };
        if (accountName.toLowerCase().includes('account b')) return { icon: <IconAWS className="w-3.5 h-3.5 text-[#FF9900]" />, provider: 'AWS' };
        return { icon: <IconGCP className="w-3.5 h-3.5 text-[#4285F4]" />, provider: 'GCP' };
    };

    // Severity styling helpers
    const getSeverityDetails = (severity: string) => {
        if (severity.toLowerCase().includes('high')) {
            return { bg: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' };
        }
        if (severity.toLowerCase().includes('medium')) {
            return { bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
        }
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    };

    const getAccountCode = (id: string, name: string) => {
        if (name.includes("Finance")) return "ZHDNZF-RCC91942 ...";
        if (name.includes("Marketing")) return "FBLPISN-UMC02429 ...";
        if (name.includes("Data Science")) return "HNWSRGZ-YP83017 ...";
        if (name.includes("Analytics")) return "MASUQXM-FU09744 ...";
        if (name.includes("Supply")) return "GCSYNDB-AG59084 ...";
        // fallback hash
        const cleanId = id.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        const first = cleanId.substring(0, 6) || "ZHDNZF";
        const second = cleanId.substring(6, 12) || "RCC919";
        return `${first}-${second} ...`;
    };

    const getRecommendationTitle = (rec: Recommendation) => {
        const type = rec.insightType.toLowerCase();
        if (type.includes("under")) return "Under-utilized";
        if (type.includes("over")) return "Over-utilized";
        if (type.includes("cleanup")) return "Cleanup-needed";
        if (type.includes("rightsiz")) return "Over-utilized";
        if (type.includes("scan")) return "Under-utilized";
        return "Under-utilized";
    };

    const handleCardClick = (rec: Recommendation) => {
        const whName = rec.warehouseName || (rec.affectedResource && rec.affectedResource.endsWith('_WH') ? rec.affectedResource : 'DAILY_ETL_WH');
        const estSavings = rec.metrics?.estimatedSavings || 1200;
        const recTitle = getRecommendationTitle(rec) || "Full Table Scan Anomaly";
        const userContext = rec.userName || "MANJU";
        
        const promptText = `[diagnostic-wizard-flow:${rec.id}|${recTitle}|${rec.affectedResource}|${rec.accountName}|${rec.severity}|${estSavings.toLocaleString()}|${userContext}]`;

        localStorage.setItem('apex_initial_chat_prompt', promptText);
        if (onNavigate) {
            onNavigate('Ask Apex');
        } else {
            onSelectRecommendation(rec);
        }
    };

    const getPriorityBadgeCustom = (severity: string) => {
        const s = severity?.toLowerCase() || '';
        if (s.includes('high')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0F2] text-[#FF4D5A] border border-[#FFE0E4]">
                    High
                </span>
            );
        }
        if (s.includes('medium')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]">
                    Medium
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6FFFA] text-[#0D9488] border border-[#CCFBF1]">
                Low
            </span>
        );
    };

    const getStatusTextBadgeCustom = (status: string) => {
        if (status === 'New') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-[#EBF8FF] text-[#2B6CB0]">
                    New
                </span>
            );
        }
        if (status === 'Acknowledged') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-[#EEF2F6] text-[#475569] border border-slate-200">
                    Acknowledged
                </span>
            );
        }
        if (status === 'In Progress' || status === 'Pending' || status === 'Read') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-[#FFFDF2] text-[#B7791F]">
                    Pending
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-[#DEF7EC] text-[#03543F]">
                Resolved
            </span>
        );
    };

    if (selectedRecommendation) {
        const platform = getCloudPlatform(selectedRecommendation.accountName);
        const seqId = selectedRecommendation.affectedResource.startsWith('q-')
            ? `${selectedRecommendation.affectedResource}-0004-c17e-9482`
            : selectedRecommendation.id;

        return (
            <div className="flex flex-col h-full bg-[#F4F1F9] gap-4 p-5 pb-12 overflow-y-auto no-scrollbar font-sans">
                {/* Header of diagnostic view */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onSelectRecommendation(null)}
                            className="p-1.5 hover:bg-slate-200/60 rounded-full text-text-secondary transition-all flex items-center justify-center border border-transparent hover:border-slate-300"
                            title="Back to list"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-800 font-bold" />
                        </button>
                        <div>
                            <span className="text-[10px] font-black tracking-wider text-text-muted uppercase">Query recommendation</span>
                            <h1 className="text-xl font-black text-text-strong tracking-tight flex items-center gap-2">
                                <span>{seqId}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-text-secondary border border-slate-250 font-bold uppercase tracking-tight">
                                    {selectedRecommendation.resourceType}
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left Column: Detected Inefficiency - 5cols width */}
                    <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
                        <div className="space-y-2">
                            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded border border-purple-100 mb-1">
                                Detected Inefficiency
                            </span>
                            <h2 className="text-sm font-black text-[#111827] leading-snug">
                                Anomaly: Query on {selectedRecommendation.warehouseName || 'DATE_DIM'} ({selectedRecommendation.resourceType === 'Query' ? '2.04MB' : '1.5GB'}, 138 unused days) performs a full table scan with no DATE_COLUMN predicate. Micro-partition pruning is disabled because the WHERE clause filters on a derived column.
                            </h2>
                            <p className="text-xs text-text-secondary font-medium leading-relaxed">
                                {selectedRecommendation.detailedExplanation || selectedRecommendation.message}
                            </p>
                        </div>

                        {/* Metrics Table / Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div>
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">Credits / Run</span>
                                <span className="text-sm font-extrabold text-[#111827] mt-0.5 block">
                                    {selectedRecommendation.metrics?.creditsBefore || '89.0'} cr
                                </span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">Runs / Week</span>
                                <span className="text-sm font-extrabold text-[#111827] mt-0.5 block">5x</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">Monthly Cost Leak</span>
                                <span className="text-sm font-extrabold text-[#10B981] mt-0.5 block">
                                    ${(selectedRecommendation.metrics?.estimatedSavings || 2100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                                </span>
                            </div>
                            <div className="pt-2">
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">User Context</span>
                                <span className="text-sm font-extrabold text-[#111827] mt-0.5 block">
                                    {selectedRecommendation.userName || 'Alex.K'}
                                </span>
                            </div>
                        </div>

                        {/* Dynamic Step-Based Left Call-to-action */}
                        <div className="pt-4 border-t border-slate-100">
                            {currentStep === 0 ? (
                                <button
                                    onClick={() => {
                                        setIsSimulatingLink(true);
                                        setTimeout(() => {
                                            setIsSimulatingLink(false);
                                            setCurrentStep(1);
                                        }, 900);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-[#6A38EB] hover:bg-[#5829D6] text-white py-3 rounded-full font-bold transition-all shadow-[0_4px_12px_rgba(106,56,235,0.2)] active:scale-[0.98] group"
                                >
                                    {isSimulatingLink ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Running static analyzer...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Start diagnosis</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-extrabold text-[#065F46] leading-none">Diagnostic Completed</p>
                                        <p className="text-[11px] text-[#047857] font-semibold mt-1 leading-normal">
                                            Anomaly classified. Organizational intelligence block compiled and made available for Cortex prompt tuning.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Progressive Walkthrough Sections - 7cols width */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* 1. DIAGNOSTIC CONTEXT */}
                        <div className={`bg-white rounded-xl border transition-all duration-300 ${currentStep >= 1 ? 'border-purple-200/80 shadow-[0_4px_12px_rgba(106,56,235,0.03)]' : 'border-slate-200 opacity-60'}`}>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider ${currentStep >= 1 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        01
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-extrabold text-[#111827]">Diagnostic context</h3>
                                        <p className="text-[10px] text-text-secondary font-medium">Review the execution patterns and historical metadata used to identify optimization.</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                                    currentStep === 1 ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                                    currentStep > 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                    {currentStep === 1 ? 'In Progress' : currentStep > 1 ? 'Completed' : 'Pending'}
                                </span>
                            </div>

                            {currentStep >= 1 && (
                                <div className="p-4 space-y-3">
                                    <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                                        APEX matched this full table scan with an established pattern in your peer repository. This scan matches 2 prior PRs on similar query constructs.
                                    </p>

                                    {/* Collapsible Accordion Context Block */}
                                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                        <button
                                            onClick={() => setIsPkgContextExpanded(!isPkgContextExpanded)}
                                            className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-700 hover:bg-slate-100/60 transition-colors"
                                        >
                                            <span className="flex items-center gap-1.5 text-left">
                                                <Bot className="w-3.5 h-3.5 text-purple-600 animate-pulse shrink-0" />
                                                <span>PKG context block (structured organizational intelligence - passed to Cortex. Under 420 tokens.)</span>
                                            </span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform shrink-0 ${isPkgContextExpanded ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isPkgContextExpanded && (
                                            <div className="px-4 pb-4 pt-3 border-t border-slate-200/60 font-mono text-[11px] leading-relaxed min-h-[100px] max-h-[220px] bg-[#1E293B] overflow-y-auto">
                                                <pre className="text-[#38BDF8] select-all whitespace-pre-wrap leading-normal">
{`# APEX PKG Context - APX-214 - fblpisn_umc02429 - ~420 tokens
apex_pkg_context = {
   "enforcement_id": "APX-214",
   "warehouse": "WH_TRANSFORM",
   "assigned_engineer": "sindhuja.r",
   "tier": "T2_accountable",
   # -- Anomaly classification --------
   "anomaly_classified": {
      "anomaly_type": "redundant_group_by_unique_key",
      "cost_projection": "$2,100/month",
      "frequency_index": "2.1 runs/day",
      "target_patterns": ["SELECT DISTINCT", "GROUP BY unique_key"]
   },
   "recent_remedies": {
      "ref": "hari.k's commit to order_history_dw",
      "method": "remove redundant SELECT DISTINCT under ORDER BY",
      "reductive_impact": "68% credit reduction"
   }
}`}
                                                </pre>
                                            </div>
                                        )}
                                    </div>

                                    {/* Step 1 Action button */}
                                    {currentStep === 1 && (
                                        <button
                                            onClick={() => {
                                                setIsSimulatingLink(true);
                                                setTimeout(() => {
                                                    setIsSimulatingLink(false);
                                                    setCurrentStep(2);
                                                }, 1000);
                                            }}
                                            className="inline-flex items-center gap-1.5 bg-[#6A38EB] hover:bg-[#5829D6] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-[0.98] group"
                                        >
                                            {isSimulatingLink ? (
                                                <>
                                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    <span>Compiling prompt template...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Generate Cortex prompt</span>
                                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. AI OPTIMIZATION */}
                        <div className={`bg-white rounded-xl border transition-all duration-300 ${currentStep >= 2 ? 'border-purple-200/80 shadow-[0_4px_12px_rgba(106,56,235,0.03)]' : 'border-slate-200 opacity-60'}`}>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider ${currentStep >= 2 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        02
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-extrabold text-[#111827]">AI optimization</h3>
                                        <p className="text-[10px] text-text-secondary font-medium">Generate a structured prompt to refactor your code or configuration based on this audit.</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                                    currentStep === 2 ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                                    currentStep > 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                    {currentStep === 2 ? 'In Progress' : currentStep > 2 ? 'Completed' : 'Locked'}
                                </span>
                            </div>

                            {currentStep >= 2 && (
                                <div className="p-4 space-y-3">
                                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                        <div className="px-3 py-1.5 border-b border-slate-200 bg-slate-100/70 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                Cortex prompt - generated by APEX (Single structured call to customer's Cortex. APEX makes zero LLM calls.)
                                            </span>
                                            <div className="flex gap-1.5">
                                                <button className="text-slate-400 hover:text-slate-600 p-0.5" title="Copy prompt">
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                                <button className="text-slate-400 hover:text-slate-600 p-0.5" title="Regenerate">
                                                    <RotateCcw className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-[#0F172A] font-mono text-[12px] text-slate-200 space-y-4 min-h-[100px] max-h-[220px] overflow-y-auto leading-relaxed select-all selection:bg-purple-500/30">
                                            <div>
                                                <p className="text-[#38BDF8] font-black font-sans text-[11px] uppercase tracking-wider">{"## Anomaly classification"}</p>
                                                <p className="text-slate-300 ml-2">{"type: redundant_group_by_unique_key"}</p>
                                                <p className="text-slate-300 ml-2">{"Cost: $2,100/month"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#38BDF8] font-black font-sans text-[11px] uppercase tracking-wider">{"## Prior fix from your organisation's PKG"}</p>
                                                <p className="text-slate-300 ml-2">{"hari.k fixed similar scan pattern on PRODUCT table (2026-01-28) -> added YEAR_MONTH predicate > -71%"}</p>
                                                <p className="text-slate-300 ml-2">{"Use this as a validated reference. Apply the same class of fix."}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#38BDF8] font-black font-sans text-[11px] uppercase tracking-wider">{"## Hard constraints - SATISFY ALL OF THESE"}</p>
                                                <p className="text-slate-300 ml-2">{"- add partition pruning predicate on ORDER_DATE"}</p>
                                                <p className="text-slate-300 ml-2">{"- retain same schema semantics and results"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2 Action button */}
                                    {currentStep === 2 && (
                                        <button
                                            onClick={() => {
                                                setIsSimulatingLink(true);
                                                setTimeout(() => {
                                                    setIsSimulatingLink(false);
                                                    setCurrentStep(3);
                                                    handleUpdateStatus(selectedRecommendation.id, 'Resolved');
                                                }, 1200);
                                            }}
                                            className="inline-flex items-center gap-1.5 bg-[#6A38EB] hover:bg-[#5829D6] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-[0.98] group"
                                        >
                                            {isSimulatingLink ? (
                                                <>
                                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    <span>Pushing branch to GitHub...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Push fix to engineer's GitHub branch</span>
                                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. GITHUB INTEGRATION */}
                        <div className={`bg-white rounded-xl border transition-all duration-300 ${currentStep >= 3 ? 'border-purple-200/80 shadow-[0_4px_12px_rgba(106,56,235,0.03)]' : 'border-slate-200 opacity-60'}`}>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border uppercase tracking-wider ${currentStep >= 3 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        03
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-extrabold text-[#111827]">GitHub integration</h3>
                                        <p className="text-[10px] text-text-secondary font-medium">Push the analysis and recommended fix to a GitHub branch for peer reviews.</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                                    currentStep === 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                    {currentStep === 3 ? 'Completed' : 'Locked'}
                                </span>
                            </div>

                            {currentStep >= 3 && (
                                <div className="p-4 space-y-4">
                                    {/* Branch panel info */}
                                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-indigo-900">
                                        <div className="flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-[#4F46E5] shrink-0" />
                                            <span>Target Branch:</span>
                                            <span className="font-mono bg-indigo-100 text-[#4338CA] px-2 py-0.5 rounded text-[11px] font-bold">
                                                apex/fix/date-dim-scan
                                            </span>
                                        </div>
                                    </div>

                                    {/* Checklist timeline */}
                                    <div className="space-y-2.5 pl-1.5">
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Open draft pull-request on GitHub</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Commit Cortex-generated SQL file to branch</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Promote PR to ready-for-review</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Notify engineer via GitHub + Slack/APEX integration</span>
                                        </div>
                                    </div>

                                    {/* Green simulation banner */}
                                    <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                        <span className="text-xs font-bold text-[#065F46] leading-none">
                                            Credit Simulator confirmed -71% savings - hari.commit notified
                                        </span>
                                    </div>

                                    {/* Exit button */}
                                    <button
                                        onClick={() => {
                                            onSelectRecommendation(null);
                                            setCurrentStep(0);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#1F2937] text-white py-3 rounded-full font-bold transition-all shadow-md active:scale-[0.98]"
                                    >
                                        <span>Back to recommendation list</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F4F1F9] overflow-y-auto no-scrollbar font-sans relative">
            {workspaceRec && (
                <OptimizationWorkspace 
                    recommendation={workspaceRec}
                    onBack={() => setWorkspaceRec(null)}
                    onExecute={() => handleExecuteFix(workspaceRec.id)}
                />
            )}

            <div className="max-w-[1000px] w-full mx-auto flex flex-col gap-5 px-6 md:px-14 py-8 flex-1">
                {/* HEADER BLOCK */}
            <div className="flex justify-between items-start flex-shrink-0">
                <div className="space-y-1.5">
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight leading-none">
                        Enforcement desk
                    </h1>
                </div>
            </div>

            {/* TABS FOR NEW & ACKNOWLEDGED */}
            <div className="flex border-b border-slate-200/80 mt-1 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('New')}
                    className={`px-6 py-3 text-sm font-extrabold tracking-tight relative transition-all cursor-pointer ${
                        activeTab === 'New' 
                            ? 'text-[#6A38EB]' 
                            : 'text-slate-500 hover:text-[#6A38EB]/80'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span>New Optimizations</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            activeTab === 'New' 
                                ? 'bg-[#6A38EB]/10 text-[#6A38EB]' 
                                : 'bg-slate-100 text-slate-500'
                        }`}>
                            {data.filter(d => d.status === 'New').length}
                        </span>
                    </div>
                    {activeTab === 'New' && (
                        <motion.div 
                            layoutId="activeEnforcementTab" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6A38EB]" 
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('Acknowledged')}
                    className={`px-6 py-3 text-sm font-extrabold tracking-tight relative transition-all cursor-pointer ${
                        activeTab === 'Acknowledged' 
                            ? 'text-indigo-600' 
                            : 'text-slate-500 hover:text-indigo-600/80'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span>Acknowledged</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            activeTab === 'Acknowledged' 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'bg-slate-100 text-slate-500'
                        }`}>
                            {data.filter(d => d.status === 'Acknowledged').length}
                        </span>
                    </div>
                    {activeTab === 'Acknowledged' && (
                        <motion.div 
                            layoutId="activeEnforcementTab" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" 
                        />
                    )}
                </button>
            </div>

            {/* UNGROUPED ADVANCED FILTERS */}
            <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center flex-wrap gap-3 text-xs w-full sm:w-auto">
                    {/* Account option with separate container */}
                    {!isAccountLevel && (
                        <CustomFilterDropdown
                            label="Account"
                            value={accountFilter[0] || 'All'}
                            icon={<Globe className="w-3.5 h-3.5" />}
                            options={[
                                { label: 'All', value: 'All' },
                                { label: 'Finance Prod', value: 'Finance Prod' },
                                { label: 'Marketing Dev', value: 'Marketing Dev' },
                                { label: 'Data Science', value: 'Data Science' },
                                { label: 'Analytics Core', value: 'Analytics Core' },
                                { label: 'Supply Chain', value: 'Supply Chain' },
                                ...accounts.filter(a => !['Finance Prod', 'Marketing Dev', 'Data Science', 'Analytics Core', 'Supply Chain'].includes(a.name)).map(acc => ({
                                    label: acc.name, value: acc.name
                                }))
                            ]}
                            onChange={(val) => {
                                setAccountFilter(val === 'All' ? [] : [val]);
                            }}
                        />
                    )}

                    {/* Type option with separate container */}
                    <CustomFilterDropdown
                        label="Type"
                        value={resourceTypeFilter[0] || 'All'}
                        icon={<Tag className="w-3.5 h-3.5" />}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Query', value: 'Query' },
                            { label: 'Warehouse', value: 'Warehouse' },
                            { label: 'Storage', value: 'Storage' },
                            { label: 'Database', value: 'Database' },
                            { label: 'User', value: 'User' }
                        ]}
                        onChange={(val) => {
                            setResourceTypeFilter(val === 'All' ? [] : [val]);
                        }}
                    />

                    {/* Priority option with separate container */}
                    <CustomFilterDropdown
                        label="Priority"
                        value={sortOption === 'severity' ? 'High' : 'All'}
                        icon={<Shield className="w-3.5 h-3.5" />}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'High', value: 'High' },
                            { label: 'Low', value: 'Low' }
                        ]}
                        onChange={(val) => {
                            if (val === 'High') {
                                setSortOption('severity');
                            } else {
                                setSortOption('savings');
                            }
                        }}
                    />
                </div>

                {/* Search field separately */}
                <div className="relative flex items-center w-full sm:w-auto sm:ml-auto">
                    <div className="relative flex items-center w-full">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => handleSearchChange(e.target.value)} 
                            placeholder="Search optimizations..." 
                            className="bg-white border border-slate-200/80 shadow-[0_1px_2.5px_rgba(0,0,0,0.02)] rounded-full outline-none text-xs font-semibold focus:ring-1 focus:ring-purple-500/20 focus:border-purple-500/80 placeholder:text-[#9CA3AF] pl-9 pr-4 py-2 w-full sm:w-56 h-9 transition-all cursor-pointer hover:bg-slate-50"
                        />
                        <Search className="h-3.5 w-3.5 text-[#9CA3AF] absolute left-3 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* HIGH-DENSITY STANDALONE CARD GRID (SINGLE COLUMN) */}
            {activeTab === 'New' && (
                <div className="flex justify-between items-center px-2 py-1.5 text-xs text-slate-500 font-semibold select-none flex-shrink-0">
                    <span className="text-slate-600 font-bold">{data.filter(d => d.status === 'New').length} pending</span>
                    {data.filter(d => d.status === 'New').length > 0 && (
                        <button 
                            onClick={handleAcknowledgeAll}
                            className="flex items-center gap-1.5 text-[#6A38EB] hover:text-[#5829D6] transition-colors font-bold cursor-pointer hover:underline"
                        >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Acknowledge all</span>
                        </button>
                    )}
                </div>
            )}
            {activeTab === 'Acknowledged' && (
                <div className="flex justify-between items-center px-2 py-1.5 text-xs text-slate-500 font-semibold select-none flex-shrink-0">
                    <span className="text-slate-600 font-bold">{data.filter(d => d.status === 'Acknowledged').length} acknowledged</span>
                </div>
            )}
            
            <div className="min-h-[400px] overflow-y-auto max-h-[640px] no-scrollbar">
                {filteredAndSortedData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 py-1">
                        {filteredAndSortedData.map((rec) => {
                            const accountCode = getAccountCode(rec.id, rec.accountName);
                            const recTitle = getRecommendationTitle(rec);
                            
                            // Clean warehouse name formatter
                            let whName = rec.warehouseName || (rec.affectedResource && rec.affectedResource.endsWith('_WH') ? rec.affectedResource : '');
                            if (!whName) {
                                if (rec.accountName.includes('Finance')) whName = 'WH_TRANSFORM';
                                else if (rec.accountName.includes('Marketing')) whName = 'CAMPAIGN_WH';
                                else if (rec.accountName.includes('Data Science')) whName = 'RESEARCH_WH';
                                else if (rec.accountName.includes('Analytics')) whName = 'DASHBOARD_WH';
                                else whName = 'DAILY_ETL_WH';
                            }

                            const estSavings = rec.metrics?.estimatedSavings || (Math.floor(Math.random() * 3000) + 800);
                            const platform = getCloudPlatform(rec.accountName);

                            return (
                                <RobustRecommendationCard 
                                    key={rec.id}
                                    rec={rec}
                                    onSelectRecommendation={handleCardClick}
                                    accountCode={accountCode}
                                    recTitle={recTitle}
                                    whName={whName}
                                    estSavings={estSavings}
                                    platform={platform}
                                    getPriorityBadgeCustom={getPriorityBadgeCustom}
                                    getStatusTextBadgeCustom={getStatusTextBadgeCustom}
                                    displayMode={displayMode}
                                    onToggleStatus={handleToggleStatus}
                                    hideAccountDetails={isAccountLevel}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-2xl border border-slate-200">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200/80 shadow-xs">
                                <Search className="w-6 h-6 text-text-muted" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-base font-extrabold text-[#111827]">No optimizations found</h3>
                                <p className="text-xs text-slate-500 font-medium">Try adjusting query filters to locate unresolved anomalies.</p>
                            </div>
                            <button 
                                onClick={handleClearContext}
                                className="mt-2 text-xs font-black text-[#6A38EB] hover:underline"
                            >
                                Clear search filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            </div>

            {/* Beautiful accidental click Undo notifier toast */}
            <AnimatePresence>
                {undoState && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-slate-800 text-white px-5 py-3.5 rounded-xl shadow-[0_12px_44px_rgba(0,0,0,0.3)] flex items-center gap-5 z-50 text-[11px] min-w-[340px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                            <span className="font-extrabold text-slate-100">{undoState.message}</span>
                        </div>
                        <button 
                            onClick={handleUndo} 
                            className="text-violet-400 hover:text-violet-350 hover:underline font-black uppercase tracking-wider text-[10px] cursor-pointer"
                        >
                            Undo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Recommendations;
