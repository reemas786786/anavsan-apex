
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    connectionsData, 
    recommendationsData,
    cortexModelsData,
    workloadsData,
    servicesData,
    databaseTablesData,
    unusedTablesData
} from '../data/dummyData';
import { calculateStorageMetrics, formatStorageSize } from '../utils/storageMetrics';
import { Account, ResourceType } from '../types';
import { DisplayMode } from '../App';
import { 
    IconSearch, 
    IconChevronDown,
    IconArrowUp,
    IconArrowDown
} from '../constants';
import Pagination from '../components/Pagination';
import InfoTooltip from '../components/InfoTooltip';

type ResourceCategory = 'Accounts' | 'Compute' | 'Storage' | 'Workloads' | 'Services' | 'Cortex' | 'User' | 'Queries';

const categories: { id: ResourceCategory; label: string }[] = [
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Compute', label: 'Compute' },
    { id: 'Storage', label: 'Storage' },
    { id: 'Workloads', label: 'Workloads' },
    { id: 'Services', label: 'Services' },
    { id: 'Cortex', label: 'Cortex' },
    { id: 'User', label: 'Users' },
    { id: 'Queries', label: 'Queries' }
];

/**
 * Format numeric values to shorthand 'K' or 'M' format for credits and high volume counts.
 */
const formatK = (val: any): string => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') {
        if (val >= 1000000) {
            return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (val >= 1000) {
            return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return Math.round(val).toLocaleString();
    }
    return String(val);
};

interface ResourceSummaryProps {
    initialTab?: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    onSelectAccount?: (account: Account, subPage?: string, sourceTab?: string) => void;
    onSelectApplication?: (applicationName: string) => void;
    displayMode?: DisplayMode;
}

const KPILabel: React.FC<{ label: string; value: string; variant?: 'default' | 'savings'; icon?: React.ReactNode }> = ({ label, value, variant = 'default', icon }) => (
    <div className={`px-5 py-2.5 rounded-full border shadow-sm flex items-center gap-2 flex-shrink-0 transition-all ${
        variant === 'savings' 
        ? 'bg-white border-[#E5E7EB] hover:border-[#10B981]/30' 
        : 'bg-white border-border-light hover:border-primary/30'
    }`}>
        {icon && <div className={variant === 'savings' ? 'text-[#10B981]' : 'text-primary'}>{icon}</div>}
        <span className={`text-[13px] font-normal whitespace-nowrap ${
            variant === 'savings' ? 'text-[#6B7280]' : 'text-text-secondary'
        }`}>{label}:</span>
        <span className={`text-[14px] font-bold whitespace-nowrap ${
            variant === 'savings' ? 'text-[#10B981]' : 'text-text-strong'
        }`}>{value}</span>
    </div>
);

const ResourceSummary: React.FC<ResourceSummaryProps> = ({ initialTab, onNavigateToRecommendations, onSelectAccount, onSelectApplication, displayMode = 'credits' }) => {
    const normalizedInitialTab = useMemo(() => {
        if (!initialTab) return 'Accounts';
        const found = categories.find(c => c.id === initialTab || c.label === initialTab);
        return (found?.id || 'Accounts') as ResourceCategory;
    }, [initialTab]);

    const [activeCategory, setActiveCategory] = useState<ResourceCategory>(normalizedInitialTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setActiveCategory(normalizedInitialTab);
    }, [normalizedInitialTab]);

    const handleAccountClickByName = (accountName: string) => {
        const account = connectionsData.find(acc => acc.name === accountName);
        if (account && onSelectAccount) {
            const subPageMap: Record<ResourceCategory, string> = {
                'Accounts': 'Account overview',
                'Compute': 'Compute overview',
                'Storage': 'Storage overview',
                'Workloads': 'Workloads',
                'Services': 'Services',
                'Cortex': 'Cortex',
                'User': 'Users',
                'Queries': 'Queries overview'
            };
            
            onSelectAccount(account, subPageMap[activeCategory], activeCategory);
        }
    };

    const getInsightCount = (accountName: string, category: ResourceCategory, resourceName?: string) => {
        const typesForCategory: Record<ResourceCategory, ResourceType[]> = {
            'Accounts': ['Account', 'All'],
            'Compute': ['Query', 'Warehouse'],
            'Storage': ['Storage', 'Database'],
            'Workloads': ['Warehouse', 'Query'],
            'Services': ['Account'],
            'Cortex': ['Query'],
            'User': ['User'],
            'Queries': ['Query']
        };
        
        const relevantTypes = typesForCategory[category] || ['All'];

        const count = recommendationsData.filter(r => {
            const matchesAccount = r.accountName.toLowerCase().includes(accountName.toLowerCase()) || 
                                   r.affectedResource.toLowerCase().includes(accountName.toLowerCase());
            const matchesResource = resourceName ? r.affectedResource.toLowerCase().includes(resourceName.toLowerCase()) : true;
            const matchesType = relevantTypes.includes(r.resourceType) || r.resourceType === 'All';
            return matchesAccount && matchesType && matchesResource;
        }).length;

        return count > 0 ? count : Math.floor(Math.random() * 5) + 2;
    };

    const formatCurrency = (credits: number): string => {
        if (displayMode === 'cost') {
            const usd = credits * 3.0;
            if (usd >= 1000000) return '$' + (usd / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (usd >= 1000) return '$' + (usd / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return '$' + Math.round(usd).toLocaleString();
        }
        return formatK(credits);
    };

    const tableData = useMemo(() => {
        const prepareData = (): any[] => {
            switch (activeCategory) {
                case 'Workloads':
                    return workloadsData.map(wl => ({
                        ...wl,
                        accountName: wl.account, 
                        totalRaw: wl.credits,
                        savingsRaw: Math.round(wl.credits * 0.15),
                        savings: formatCurrency(Math.round(wl.credits * 0.15)),
                        workloadsRaw: wl.workloads,
                        queriesRaw: wl.queryCount,
                        serviceCredits: formatCurrency(wl.credits),
                        queriesFormatted: wl.queryCount.toLocaleString(),
                        insights: getInsightCount(wl.account, 'Workloads')
                    }));
                case 'Services':
                    return servicesData.map(svc => ({
                        ...svc,
                        accountName: svc.account,
                        totalRaw: svc.credits,
                        savingsRaw: Math.round(svc.credits * 0.08),
                        savings: formatCurrency(Math.round(svc.credits * 0.08)),
                        countRaw: svc.count,
                        queriesRaw: svc.queryCount,
                        serviceCredits: formatCurrency(svc.credits),
                        queries: svc.queryCount.toLocaleString(), 
                        insights: getInsightCount(svc.account, 'Services', svc.type)
                    }));
                case 'Accounts':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        accountName: acc.name,
                        accountIdentifier: acc.identifier,
                        totalRaw: acc.tokens,
                        savingsRaw: Math.round(acc.tokens * 0.12),
                        savings: formatCurrency(Math.round(acc.tokens * 0.12)),
                        computeRaw: Math.round(acc.tokens * 0.82),
                        storageRaw: Math.round(acc.tokens * 0.12),
                        serviceCreditsRaw: Math.round(acc.tokens * 0.06),
                        workloadsRaw: acc.warehousesCount,
                        usersRaw: acc.usersCount,
                        queriesRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                        total: formatCurrency(acc.tokens),
                        compute: formatCurrency(Math.round(acc.tokens * 0.82)),
                        storage: formatCurrency(Math.round(acc.tokens * 0.12)), 
                        serviceCredits: formatCurrency(Math.round(acc.tokens * 0.06)),
                        workloads: acc.warehousesCount.toString(),
                        users: acc.usersCount.toString(),
                        queries: acc.queriesCount,
                        insights: getInsightCount(acc.name, 'Accounts')
                    }));
                case 'Compute':
                    return connectionsData.map((acc, idx) => {
                        const mockCredits = [4900, 4250, 3400, 2400, 1900, 1600, 1200, 800];
                        const computeCredits = mockCredits[idx % mockCredits.length];
                        return {
                            id: acc.id,
                            accountName: acc.name,
                            accountIdentifier: acc.identifier,
                            computeRaw: computeCredits,
                            compute: formatCurrency(computeCredits),
                            savingsRaw: Math.round(computeCredits * 0.18),
                            savings: formatCurrency(Math.round(computeCredits * 0.18)),
                            workloadsRaw: acc.warehousesCount,
                            workloads: acc.warehousesCount.toString(),
                            queriesRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                            queries: acc.queriesCount,
                            insights: getInsightCount(acc.name, 'Compute')
                        };
                    });
                case 'Storage':
                    return connectionsData.map(acc => {
                        const storageCredits = Math.round(acc.tokens * 0.12);
                        
                        // Filter tables for this account
                        const accountTables = databaseTablesData.filter(t => t.accountId === acc.id || t.accountName === acc.name);
                        const accountUnusedTables = unusedTablesData.filter(t => t.accountId === acc.id || t.accountName === acc.name);
                        
                        const sizeGB = accountTables.reduce((sum, t) => sum + t.totalSizeGB, 0);
                        const unusedGB = accountUnusedTables.reduce((sum, t) => sum + t.sizeGB, 0);
                        const failsafeGB = accountTables.reduce((sum, t) => sum + t.failSafeSizeGB, 0);
                        const timeTravelGB = accountTables.reduce((sum, t) => sum + t.timeTravelSizeGB, 0);

                        return {
                            id: acc.id,
                            accountName: acc.name,
                            accountIdentifier: acc.identifier,
                            totalRaw: storageCredits,
                            storage: formatCurrency(storageCredits), 
                            savingsRaw: Math.round(storageCredits * 0.25),
                            savings: formatCurrency(Math.round(storageCredits * 0.25)),
                            sizeRaw: sizeGB,
                            size: formatStorageSize(sizeGB),
                            unusedRaw: unusedGB,
                            unused: formatStorageSize(unusedGB),
                            failsafeRaw: failsafeGB,
                            failsafe: formatStorageSize(failsafeGB),
                            timetravelRaw: timeTravelGB,
                            timetravel: formatStorageSize(timeTravelGB),
                            insights: getInsightCount(acc.name, 'Storage')
                        };
                    });
                case 'Cortex':
                    return [
                        {
                            id: 'c-1',
                            accountName: 'Finance Prod',
                            accountIdentifier: 'acme.us-east-1',
                            count: cortexModelsData.length.toString(),
                            countRaw: cortexModelsData.length,
                            tokens: '12.4M',
                            tokensRaw: 12400000,
                            creditsRaw: 1500,
                            credits: formatCurrency(1500),
                            savingsRaw: 225,
                            savings: formatCurrency(225),
                            insights: getInsightCount('Finance Prod', 'Cortex')
                        },
                        {
                            id: 'c-2',
                            accountName: 'Account B',
                            accountIdentifier: 'acme.us-east-2',
                            count: '4',
                            countRaw: 4,
                            tokens: '8.2M',
                            tokensRaw: 8200000,
                            creditsRaw: 900,
                            credits: formatCurrency(900),
                            savingsRaw: 135,
                            savings: formatCurrency(135),
                            insights: getInsightCount('Account B', 'Cortex')
                        },
                        {
                            id: 'c-3',
                            accountName: 'Account E',
                            accountIdentifier: 'acme.us-west-2',
                            count: '2',
                            countRaw: 2,
                            tokens: '4.1M',
                            tokensRaw: 4100000,
                            creditsRaw: 450,
                            credits: formatCurrency(450),
                            savingsRaw: 67,
                            savings: formatCurrency(67),
                            insights: getInsightCount('Account E', 'Cortex')
                        }
                    ];
                case 'User':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        accountName: acc.name,
                        accountIdentifier: acc.identifier,
                        userCountRaw: acc.usersCount,
                        userCount: acc.usersCount.toString(),
                        queriesRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                        queries: acc.queriesCount,
                        savingsRaw: Math.round(acc.tokens * 0.05),
                        savings: formatCurrency(Math.round(acc.tokens * 0.05)),
                        insights: getInsightCount(acc.name, 'User')
                    }));
                case 'Queries':
                    return connectionsData.map(acc => {
                        const highImpactCount = Math.floor(Math.random() * 150) + 50;
                        const repeatedCount = Math.floor(Math.random() * 80) + 20;
                        const expensiveCount = Math.floor(Math.random() * 40) + 10;
                        const credits = parseInt(acc.queriesCount.replace('K', '')) * 1000 * 0.01; // Mock credits for queries
                        return {
                            id: acc.id,
                            accountName: acc.name,
                            accountIdentifier: acc.identifier,
                            queriesCountRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                            queriesCount: acc.queriesCount,
                            highImpactQueriesRaw: highImpactCount,
                            highImpactQueries: highImpactCount.toString(),
                            repeatedQueriesCountRaw: repeatedCount,
                            repeatedQueriesCount: repeatedCount.toString(),
                            expensiveQueriesCountRaw: expensiveCount,
                            expensiveQueriesCount: expensiveCount.toString(),
                            savingsRaw: Math.round(credits * 0.3),
                            savings: formatCurrency(Math.round(credits * 0.3)),
                            insights: getInsightCount(acc.name, 'Queries')
                        };
                    });
                default:
                    return [];
            }
        };

        let rows: any[] = prepareData();

        rows = rows.filter((item: any) => {
            const searchField = (item.accountName || item.modelName || '').toLowerCase();
            return searchField.includes(searchTerm.toLowerCase());
        });

        if (sortConfig) {
            rows.sort((a: any, b: any) => {
                const key = sortConfig.key.toLowerCase().split(' ')[0];
                let valA = a[key + 'Raw'] !== undefined ? a[key + 'Raw'] : a[key];
                let valB = b[key + 'Raw'] !== undefined ? b[key + 'Raw'] : b[key];
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const headers = (() => {
            switch (activeCategory) {
                case 'Accounts': return ['Account name', 'Total credits', 'Potential savings', 'Compute credits', 'Storage credits', 'Service credits', 'Insights'];
                case 'Compute': return ['Account name', 'Compute credits', 'Potential savings', 'Warehouse', 'Queries', 'Insights'];
                case 'Storage': return ['Account name', 'Storage credits', 'Potential savings', 'Storage size', 'Unused table size', 'Failsafe Size', 'Time Travel Size', 'Insights'];
                case 'Cortex': return ['Account name', 'Model count', 'Tokens', 'Credits', 'Potential savings', 'Insights'];
                case 'User': return ['Account name', 'User count', 'Queries', 'Potential savings', 'Insights'];
                case 'Queries': return ['Account name', 'Queries count', 'Potential savings', 'Repeated queries', 'Insights'];
                case 'Workloads': return ['Account name', 'Workloads', 'Service credits', 'Potential savings', 'Insights'];
                case 'Services': return ['Account name', 'Service credits', 'Potential savings', 'Services used', 'Insights'];
                default: return ['Account name', 'Total credits', 'Potential savings', 'Insights'];
            }
        })();

        return { headers, rows };
    }, [activeCategory, searchTerm, sortConfig, displayMode]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return tableData.rows.slice(startIndex, startIndex + itemsPerPage);
    }, [tableData.rows, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(tableData.rows.length / itemsPerPage);

    const activePills = useMemo(() => {
        const rows = tableData.rows;
        
        switch (activeCategory) {
            case 'Accounts':
                return [
                    { label: 'Total accounts', value: rows.length.toString() },
                    { label: 'Total credits', value: formatCurrency(rows.reduce((s, r) => s + (r.totalRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total compute credits', value: formatCurrency(rows.reduce((s, r) => s + (r.computeRaw || 0), 0)) },
                    { label: 'Total storage credits', value: formatCurrency(rows.reduce((s, r) => s + (r.storageRaw || 0), 0)) },
                    { label: 'Total service credits', value: formatCurrency(rows.reduce((s, r) => s + (r.serviceCreditsRaw || 0), 0)) }
                ];
            case 'Compute':
                return [
                    { label: 'Total compute credits', value: formatCurrency(rows.reduce((s, r) => s + (r.computeRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total warehouses', value: rows.reduce((s, r) => s + (r.workloadsRaw || 0), 0).toLocaleString() },
                    { label: 'Total queries', value: formatK(rows.reduce((s, r) => s + (r.queriesRaw || 0), 0)) }
                ];
            case 'Storage':
                const storSize = rows.reduce((s, r) => s + (r.sizeRaw || 0), 0);
                const storUnused = rows.reduce((s, r) => s + (r.unusedRaw || 0), 0);
                return [
                    { label: 'Total storage credits', value: formatCurrency(rows.reduce((s, r) => s + (r.totalRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total storage size', value: formatStorageSize(storSize) },
                    { label: 'Total unused table size', value: formatStorageSize(storUnused) }
                ];
            case 'Workloads':
                return [
                    { label: 'Total workloads', value: rows.reduce((s, r) => s + (r.workloadsRaw || 0), 0).toLocaleString() },
                    { label: 'Total service credits', value: formatCurrency(rows.reduce((s, r) => s + (r.totalRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const }
                ];
            case 'Services':
                return [
                    { label: 'Total service credits', value: formatCurrency(rows.reduce((s, r) => s + (r.totalRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total services used', value: rows.reduce((s, r) => s + (r.countRaw || 0), 0).toLocaleString() },
                    { label: 'Total queries', value: formatK(rows.reduce((s, r) => s + (r.queriesRaw || 0), 0)) }
                ];
            case 'Cortex':
                return [
                    { label: 'Total credits', value: formatCurrency(rows.reduce((s, r) => s + (r.creditsRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total tokens', value: formatK(rows.reduce((s, r) => s + (r.tokensRaw || 0), 0)) },
                    { label: 'Total model count', value: rows.reduce((s, r) => s + (r.countRaw || 0), 0).toLocaleString() }
                ];
            case 'User':
                return [
                    { label: 'Total user count', value: rows.reduce((s, r) => s + (r.userCountRaw || 0), 0).toLocaleString() },
                    { label: 'Total queries', value: formatK(rows.reduce((s, r) => s + (r.queriesRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const }
                ];
            case 'Queries':
                return [
                    { label: 'Total queries count', value: formatK(rows.reduce((s, r) => s + (r.queriesCountRaw || 0), 0)) },
                    { label: 'Potential savings', value: formatCurrency(rows.reduce((s, r) => s + (r.savingsRaw || 0), 0)), variant: 'savings' as const },
                    { label: 'Total repeated queries', value: rows.reduce((s, r) => s + (r.highImpactQueriesRaw || 0), 0).toLocaleString() }
                ];
            default:
                return [];
        }
    }, [activeCategory, tableData.rows, displayMode]);

    const getColumnWidth = (header: string) => {
        if (header.includes('name') || header.includes('type') || header.includes('Account')) return 'w-auto min-w-[180px]';
        if (header === 'Insights') return 'w-[100px]';
        return 'w-[120px]';
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col h-full bg-background p-4 pb-12 overflow-y-auto no-scrollbar gap-4">
            <div className="flex flex-col flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Resource summary</h1>
                <div className="mt-4 border-b border-border-light flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                            className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
                                activeCategory === cat.id 
                                ? 'text-primary font-bold' 
                                : 'text-text-muted hover:text-text-secondary'
                            }`}
                        >
                            {cat.label}
                            {activeCategory === cat.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                {activePills.map((pill, idx) => (
                    <KPILabel key={idx} label={pill.label} value={pill.value} variant={pill.variant} />
                ))}
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0">
                <div className="px-4 py-3 flex justify-end items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                {tableData.headers.map((h) => (
                                    <th 
                                        key={h} 
                                        onClick={() => h !== 'Insights' ? requestSort(h) : undefined}
                                        className={`px-6 py-4 text-[12px] font-semibold text-text-muted border-b border-border-light ${h !== 'Insights' ? 'cursor-pointer' : ''} select-none hover:text-primary transition-colors group ${getColumnWidth(h)} ${h === 'Insights' ? 'text-right' : ''}`}
                                    >
                                        <div className={`flex items-center gap-1 ${h === 'Insights' ? 'justify-end' : ''}`}>
                                            <span className="whitespace-nowrap">{h}</span>
                                            {h === 'Unused table size' && (
                                                <InfoTooltip text="Total size of tables that have not been queried or modified in the last 90 days." position="bottom" />
                                            )}
                                            {h === 'Potential savings' && (
                                                <InfoTooltip text="Estimated monthly savings if all AI-suggested optimizations are applied." position="bottom" />
                                            )}
                                            {h === 'Service credits' && (
                                                <InfoTooltip text="Credits consumed by Snowflake cloud services like metadata and query compilation." position="bottom" />
                                            )}
                                            {h === 'Failsafe Size' && (
                                                <InfoTooltip text="Storage used by Snowflake Fail-safe for data recovery (7-day retention)." position="bottom" />
                                            )}
                                            {h === 'Time Travel Size' && (
                                                <InfoTooltip text="Storage used by Time Travel for historical data access." position="bottom" />
                                            )}
                                            {h !== 'Insights' && (
                                                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                                    {sortConfig?.key === h ? (
                                                        sortConfig.direction === 'asc' ? <IconArrowUp className="w-2.5 h-2.5" /> : <IconArrowDown className="w-2.5 h-2.5" />
                                                    ) : (
                                                        <IconChevronDown className="w-2.5 h-2.5 opacity-30" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedRows.map((row: any) => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <button 
                                                onClick={() => handleAccountClickByName(row.accountName)}
                                                className="text-sm font-bold text-link hover:underline text-left"
                                            >
                                                {row.accountName}
                                            </button>
                                            {row.accountIdentifier && (
                                                <span className="text-[10px] text-text-muted font-mono mt-0.5">{row.accountIdentifier}</span>
                                            )}
                                        </div>
                                    </td>
                                    {tableData.headers.slice(1).map((h) => {
                                        if (h === 'Insights') {
                                            return (
                                                <td key={h} className={`px-6 py-5 text-right ${getColumnWidth(h)}`}>
                                                    <div className="flex items-center justify-end">
                                                        <button 
                                                            onClick={() => onNavigateToRecommendations?.({ search: row.accountName || row.modelName })}
                                                            className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                                        >
                                                            <span className="text-[12px] font-black">{row.insights}</span>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const valKey = (() => {
                                            if (h === 'Total credits') return 'total';
                                            if (h === 'Potential savings') return 'savings';
                                            if (h === 'Compute credits') return 'compute';
                                            if (h === 'Storage credits') return 'storage';
                                            if (h === 'Service credits') return 'serviceCredits';
                                            if (h === 'Workloads') return 'workloads';
                                            if (h === 'Warehouse') return 'workloads';
                                            if (h === 'Users') return 'users';
                                            if (h === 'Queries') return 'queries';
                                            
                                            if (h === 'Credits') return 'credits';
                                            if (h === 'Trend %') return 'trend';
                                            if (h === 'Volume') return 'volume';
                                            if (h === 'Unit cost') return 'unitCost';
                                            if (h === 'Idle %') return 'idleTime';
                                            if (h === 'Queries count') return 'queriesCount';
                                            if (h === 'Repeated queries') return 'repeatedQueriesCount';
                                            if (h === 'Expensive queries') return 'expensiveQueriesCount';
                                            if (h === 'Queries') return 'highImpactQueries';
                                            if (h === 'Avg runtime') return 'avgRuntime';
                                            if (h === 'Services used') return 'count';
                                            if (h === 'Top service') return 'type';
                                            if (h === 'Model name') return 'modelName';
                                            if (h === 'Model count') return 'count';
                                            if (h === 'User count') return 'userCount';
                                            if (h === 'Storage size') return 'size';
                                            if (h === 'Unused table size') return 'unused';
                                            
                                            const keyMap: Record<string, string> = {
                                                'compute': 'compute',
                                                'storage': 'storage',
                                                'ai': 'ai',
                                                'auto': 'auto',
                                                'serverless': 'serverless',
                                                'data': 'ingest',
                                                'warehouse': 'compute',
                                                'search': 'search',
                                                'query': 'accelerate',
                                                'active': 'active',
                                                'staged': 'staged',
                                                'failsafe': 'failsafe',
                                                'hybrid': 'hybrid',
                                                'time': 'timetravel',
                                                'model': 'model'
                                            };
                                            const key = h.toLowerCase().split(' ')[0];
                                            return keyMap[key] || key;
                                        })();

                                        const val = row[valKey];
                                        
                                        return (
                                            <td key={h} className={`px-6 py-5 ${getColumnWidth(h)}`}>
                                                <span className={`text-[14px] font-medium ${
                                                    h === 'Trend %' && val?.includes('↑') ? 'text-status-error font-bold' : 
                                                    h === 'Trend %' && val?.includes('↓') ? 'text-status-success font-bold' : 
                                                    h === 'Potential savings' ? 'text-[#10B981] font-bold' :
                                                    'text-text-primary'
                                                }`}>
                                                    {val || '—'}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={tableData.rows.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResourceSummary;
