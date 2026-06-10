import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Account, SQLFile, BigScreenWidget, QueryListItem, PullRequest, User, QueryListFilters, SlowQueryFilters, BreadcrumbItem, Warehouse, AssignedQuery, CortexModel, AssignmentStatus } from '../types';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import { accountNavItems, IconChevronRight, IconChevronDown, IconList, IconSearch, IconSparkles, IconClock, IconChevronLeft, IconTrendingUp } from '../constants';
import Breadcrumb from '../components/Breadcrumb';
import QueryListView from './QueryListView';
import StorageSummaryView from './StorageSummaryView';
import DatabasesView from './DatabasesView';
import SchemasView from './SchemasView';
import TablesView from './TablesView';
import UnusedTablesView from './UnusedTablesView';
import QueriesOverview from './QueriesOverview';
import ExpensiveQueriesView from './ExpensiveQueriesView';
import QueryDetailView from './QueryDetailView';
import PullRequestsView from './PullRequestsView';
import PullRequestDetailView from './PullRequestDetailView';
import MyBranchesView from './Dashboard'; 
import QueryVersionsView from './QueryWorkspace'; 
import QueryAnalyzerView from './QueryAnalyzerView';
import QueryOptimizerView from './QueryOptimizerView';
import QuerySimulatorView from './QuerySimulatorView';
import QueryPromptGeneratorView from './QueryPromptGeneratorView';
import SlowQueriesView from './SlowQueriesView';
import AllWarehouses from './AllWarehouses';
import ComputeOverview from './ComputeOverview';
import WarehouseDetailView from './WarehouseDetailView';
import ContextualSidebar from '../components/ContextualSidebar';
import ApplicationsView from './ApplicationsView';
import WorkloadsListView from './WorkloadsListView';
import AccountServicesView from './AccountServicesView';
import AccountUsersListView from './AccountUsersListView';
import CreditTrendView from './CreditTrendView';
import Recommendations from './Recommendations';
import Reports from './Reports';
import AIAgent from './AIAgent';
import { cortexModelsData, storageSummaryData, connectionsData, queryListData } from '../data/dummyData';

interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
    onBackToAccounts: () => void;
    backLabel?: string;
    sqlFiles: SQLFile[];
    onSaveQueryClick: (tag: string) => void;
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onShareQueryClick: (query: QueryListItem) => void;
    onPreviewQuery: (query: QueryListItem) => void;
    selectedQuery: QueryListItem | null;
    setSelectedQuery: (query: QueryListItem | null) => void;
    analyzingQuery: QueryListItem | null;
    onAnalyzeQuery: (query: QueryListItem | null, source: string) => void;
    onOptimizeQuery: (query: QueryListItem | null, source: string) => void;
    onSimulateQuery: (query: QueryListItem | null, source: string) => void;
    pullRequests: PullRequest[];
    selectedPullRequest: PullRequest | null;
    setSelectedPullRequest: (pr: PullRequest | null) => void;
    users: User[];
    navigationSource: string | null;
    selectedWarehouse: Warehouse | null;
    setSelectedWarehouse: (warehouse: Warehouse | null) => void;
    warehouses: Warehouse[];
    assignment?: AssignedQuery;
    currentUser: User | null;
    onUpdateAssignmentStatus: (assignmentId: string, status: AssignmentStatus) => void;
    onAssignToEngineer: (query: QueryListItem) => void;
    onResolveAssignment: (assignmentId: string) => void;
    selectedApplicationId?: string | null;
    setSelectedApplicationId: (id: string | null) => void;
    breadcrumbItems: BreadcrumbItem[];
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    displayMode?: 'cost' | 'credits';
}

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[12px] text-text-secondary font-bold whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const MobileNav: React.FC<{
    activePage: string;
    onPageChange: (page: string) => void;
    accountNavItems: any[];
}> = ({ activePage, onPageChange, accountNavItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={navRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg bg-surface-nested border border-border-color">
                <span className="font-semibold text-text-primary">{activePage}</span>
                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface rounded-lg shadow-lg mt-1 z-20 border border-border-color">
                    <ul className="py-1">
                        {accountNavItems.map(item => (
                            <React.Fragment key={item.name}>
                                {item.children.length === 0 ? (
                                    <li>
                                        <button onClick={() => { onPageChange(item.name); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium ${activePage === item.name ? 'text-primary bg-primary/10' : 'text-text-strong'}`}>
                                            {item.name}
                                        </button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-text-muted">{item.name}</li>
                                        {item.children.map((child: any) => (
                                            <li key={child.name}>
                                                <button onClick={() => { onPageChange(child.name); setIsOpen(false); }} className={`w-full text-left pl-6 pr-4 py-2 text-sm ${activePage === child.name ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
                                                    {child.name}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CortexListView: React.FC<{
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}> = ({ onNavigateToRecommendations }) => {
    const [search, setSearch] = useState('');
    
    const filteredModels = useMemo(() => {
        return cortexModelsData.filter(m => 
            m.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const globalMetrics = useMemo(() => {
        const parseTokens = (t: string): number => {
            const val = parseFloat(t.replace(/[KM]/g, ''));
            if (t.includes('M')) return val * 1000000;
            if (t.includes('K')) return val * 1000;
            return val;
        };

        const formatTokens = (n: number): string => {
            if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return n.toString();
        };

        const totals = filteredModels.reduce((acc, m) => {
            acc.input += parseTokens(m.inputTokens);
            acc.output += parseTokens(m.outputTokens);
            acc.total += parseTokens(m.tokens);
            acc.credits += m.credits;
            acc.insights += m.insightCount;
            return acc;
        }, { input: 0, output: 0, total: 0, credits: 0, insights: 0 });

        return {
            ...totals,
            input: formatTokens(totals.input),
            output: formatTokens(totals.output),
            total: formatTokens(totals.total),
            credits: totals.credits.toFixed(1) + 'K',
            insights: totals.insights.toString(),
            modelCount: filteredModels.length.toString()
        };
    }, [filteredModels]);

    return (
        <div className="flex flex-col h-full bg-background p-4 pb-12 gap-4">
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Cortex models</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Manage and monitor Snowflake Cortex AI models active in this account.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar pb-1 flex-shrink-0">
                <KPILabel label="Models" value={globalMetrics.modelCount} />
                <KPILabel label="Total tokens" value={globalMetrics.total} />
                <KPILabel label="Input tokens" value={globalMetrics.input} />
                <KPILabel label="Output tokens" value={globalMetrics.output} />
                <KPILabel label="Total credits" value={globalMetrics.credits} />
                <KPILabel label="Insights" value={globalMetrics.insights} />
            </div>

            <div className="bg-white rounded-2xl flex flex-col flex-grow min-h-0 shadow-sm border border-border-light overflow-hidden">
                <div className="px-4 py-3 flex justify-end items-center border-b border-border-light bg-white flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search models..."
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-left uppercase tracking-widest">Model name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-left uppercase tracking-widest">Input tokens</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-left uppercase tracking-widest">Output tokens</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-left uppercase tracking-widest">Token usage</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-left uppercase tracking-widest">Credits</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right uppercase tracking-widest">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {filteredModels.length > 0 ? (
                                filteredModels.map(model => (
                                    <tr key={model.id} className="hover:bg-surface-nested transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                                    <IconSparkles className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{model.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-medium text-text-secondary">{model.inputTokens}</td>
                                        <td className="px-6 py-5 font-medium text-text-secondary">{model.outputTokens}</td>
                                        <td className="px-6 py-5 font-medium text-text-primary">{model.tokens}</td>
                                        <td className="px-6 py-5 font-black text-text-strong">{model.credits}K</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end">
                                                <button 
                                                    onClick={() => onNavigateToRecommendations?.({ search: model.name })}
                                                    className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                                >
                                                    <span className="text-[12px] font-black">{model.insightCount}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-text-muted italic">
                                        No models found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onSwitchAccount, onBackToAccounts, backLabel, sqlFiles, onSaveQueryClick, onSetBigScreenWidget, activePage, onPageChange, onShareQueryClick, onPreviewQuery, selectedQuery, setSelectedQuery, analyzingQuery, onAnalyzeQuery, onOptimizeQuery, onSimulateQuery, pullRequests, selectedPullRequest, setSelectedPullRequest, users, navigationSource, selectedWarehouse, setSelectedWarehouse, warehouses, assignment, currentUser, onUpdateAssignmentStatus, onAssignToEngineer, onResolveAssignment, selectedApplicationId, setSelectedApplicationId, breadcrumbItems, onNavigateToRecommendations, displayMode }) => {
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
    const [isQueryDrillDown, setIsQueryDrillDown] = useState(false);
    const [selectedRepeatedQueryHash, setSelectedRepeatedQueryHash] = useState<string | null>(null);
    const [warehouseHealthFilter, setWarehouseHealthFilter] = useState<string[] | undefined>(undefined);
    
    // Storage Filters
    const [storageTableTypeFilter, setStorageTableTypeFilter] = useState<string | null>(null);
    const [storageDatabaseFilter, setStorageDatabaseFilter] = useState<string | null>(null);
    const [storageSchemaFilter, setStorageSchemaFilter] = useState<string | null>(null);
    
    // State for All Queries filters
    const [showQueryPatternChart, setShowQueryPatternChart] = useState(true);
    const [allQueriesFilters, setAllQueriesFilters] = useState<QueryListFilters>({
        search: '',
        dateFilter: '7d',
        userFilter: [],
        statusFilter: [],
        warehouseFilter: [],
        queryTypeFilter: [],
        durationFilter: { min: null, max: null },
        currentPage: 1,
        itemsPerPage: 10,
        visibleColumns: ['queryId', 'user', 'warehouse', 'duration', 'bytesScanned', 'cost', 'startTime', 'actions'],
    });

    // State for Slow Queries filters
    const [slowQueriesFilters, setSlowQueriesFilters] = useState<SlowQueryFilters>({
        search: '',
        dateFilter: '7d',
        warehouseFilter: [],
        severityFilter: ['Medium', 'High'],
    });

    // Generate account-specific warehouses
    const generatedAccountWarehouses = useMemo(() => {
        const count = account.warehousesCount;
        const accountIdx = connectionsData.findIndex(c => c.id === account.id);
        const mockCredits = [4900, 4250, 3400, 2400, 1900, 1600, 1200, 800];
        const totalCreditsForAccount = mockCredits[accountIdx % mockCredits.length] || 1000;
        
        const generated: Warehouse[] = [];
        for (let i = 0; i < count; i++) {
            const share = 1 / count;
            const whCredits = Math.round(totalCreditsForAccount * (share * (0.8 + Math.random() * 0.4)));
            const sizes: Warehouse['size'][] = ['X-Small', 'Small', 'Medium', 'Large'];
            generated.push({
                id: `wh-${account.id}-${i}`,
                name: i === 0 ? 'COMPUTE_WH' : i === 1 ? 'ETL_WH' : `WH_CLUSTER_${i + 1}`,
                size: sizes[i % sizes.length],
                avgUtilization: Math.floor(Math.random() * 60) + 20,
                peakUtilization: Math.floor(Math.random() * 30) + 70,
                status: Math.random() > 0.3 ? 'Active' : 'Suspended',
                cost: whCredits * 2.5,
                tokens: whCredits,
                credits: whCredits,
                queriesExecuted: Math.floor(Math.random() * 1000) + 100,
                lastActive: 'Just now',
                health: Math.random() > 0.7 ? 'Optimized' : Math.random() > 0.5 ? 'Under-utilized' : 'Over-provisioned'
            });
        }
        return generated;
    }, [account]);

    const handleBackFromTool = () => {
        onPageChange(navigationSource || 'Queries overview');
        onAnalyzeQuery(null, ''); 
    };

    const handleSidebarPageChange = (newPage: string) => {
        if (selectedApplicationId) {
            setSelectedApplicationId(null);
        }
        setSelectedWarehouse(null);
        setSelectedQuery(null);
        setSelectedPullRequest(null);
        setSelectedDatabaseId(null);
        setSelectedRepeatedQueryHash(null);
        setWarehouseHealthFilter(undefined);
        
        // Reset storage filters when manually changing page from sidebar
        setStorageTableTypeFilter(null);
        setStorageDatabaseFilter(null);
        setStorageSchemaFilter(null);
        
        // Redirect parent categories to their respective overview pages
        let targetPage = newPage;
        if (newPage === 'Compute') targetPage = 'Compute overview';
        else if (newPage === 'Queries' || newPage === 'Query pattern') targetPage = 'Repeated queries';
        else if (newPage === 'Storage') targetPage = 'Storage overview';
        else if (newPage === 'Optimization') targetPage = 'Query analyzer';
        else if (newPage === 'Analysis') targetPage = 'Query list';
        
        onPageChange(targetPage);
    };

    const handleStorageNavigation = (page: string, filters?: { tableType?: string; database?: string; schema?: string }) => {
        if (filters?.tableType) setStorageTableTypeFilter(filters.tableType);
        if (filters?.database) setStorageDatabaseFilter(filters.database);
        if (filters?.schema) setStorageSchemaFilter(filters.schema);
        onPageChange(page);
    };

    const isDatabaseDetailView = !!selectedDatabaseId;
    const isDeepDrillDown = !!selectedWarehouse || !!selectedQuery || !!selectedPullRequest || isDatabaseDetailView || isQueryDrillDown;
    
    const computeTabs = [
        { name: 'Compute overview', label: 'Overview' },
        { name: 'Warehouse', label: 'Warehouse' },
        { name: 'Serverless', label: 'Serverless' },
        { name: 'Cortex', label: 'Cortex' }
    ];

    const analysisTabs = [
        { name: 'Query list', label: 'All queries' },
        { name: 'Repeated queries', label: 'Repeated query hash' },
        { name: 'Expensive queries', label: 'Repeated expensive queries' }
    ];

    const storageTabs = [
        { name: 'Storage overview', label: 'Overview' },
        { name: 'Databases', label: 'Databases' },
        { name: 'Schemas', label: 'Schemas' },
        { name: 'Schema objects', label: 'Schema objects' },
        { name: 'Unused tables', label: 'Unused tables' }
    ];

    const optimizationTabs = [
        { name: 'Query analyzer', label: 'Overview' },
        { name: 'Query optimizer', label: 'Optimizer' },
        { name: 'Query simulator', label: 'Simulator' },
        { name: 'Query prompt generator', label: 'Prompt generator' }
    ];

    const getActiveTabs = () => {
        if (['Compute', 'Compute overview', 'Warehouse', 'Serverless', 'Cortex'].includes(activePage)) return computeTabs;
        if (['Storage', 'Storage overview', 'Databases', 'Schemas', 'Schema objects', 'Unused tables'].includes(activePage)) return storageTabs;
        if (['Optimization', 'Query analyzer', 'Query optimizer', 'Query simulator'].includes(activePage)) return optimizationTabs;
        return null;
    };

    const activeTabs = getActiveTabs();

    const pageInfo: Record<string, { title: string; description: string }> = {
        'Compute': { title: 'Compute overview', description: 'Overview of compute resources and credit consumption.' },
        'Compute overview': { title: 'Compute overview', description: 'Overview of compute resources and credit consumption.' },
        'Warehouse': { title: 'Warehouses', description: 'Manage and monitor your virtual warehouses.' },
        'Serverless': { title: 'Serverless', description: 'Overview of serverless compute resources.' },
        'Queries': { title: 'Queries overview', description: 'Overview of query performance and execution patterns.' },
        'Queries overview': { title: 'Queries overview', description: 'Overview of query performance and execution patterns.' },
        'Analysis': { title: 'Query analysis', description: 'Detailed analysis of query performance and execution patterns.' },
        'Query list': { title: 'Query list', description: 'List of all queries executed in the account.' },
        'Repeated queries': { title: 'Query pattern', description: 'Identify and cluster similar query patterns with optimization metrics.' },
        'Expensive queries': { title: 'Expensive queries', description: 'Identify and analyze queries with high resource consumption.' },
        'Query analyzer': { title: 'Query analyzer', description: 'Get detailed performance insights and recommendations for a specific query.' },
        'Query optimizer': { title: 'Query optimizer', description: 'Use AI to automatically rewrite your query for better performance.' },
        'Query simulator': { title: 'Query simulator', description: 'Simulate your query with different parameters to estimate performance.' },
        'Query prompt generator': { title: 'Query prompt generator', description: 'Generate complex Snowflake queries using natural language prompts.' },
        'Storage': { title: 'Storage overview', description: 'Overview of storage metrics, database sizes, and growth trends.' },
        'Storage overview': { title: 'Storage overview', description: 'Overview of storage metrics, database sizes, and growth trends.' },
        'Databases': { title: 'Databases', description: 'Manage and monitor your account\'s databases.' },
        'Schemas': { title: 'Schemas', description: 'Manage and monitor your schemas.' },
        'Schema objects': { title: 'Schema objects', description: 'Detailed view of tables, materialized views, and tasks.' },
        'Unused tables': { title: 'Unused tables', description: 'Identify and manage tables that are not being used.' },
        'Optimization': { title: 'Optimization', description: 'Overview of optimization opportunities and recommendations.' },
        'Cortex': { title: 'Cortex', description: 'Overview of Cortex AI services and consumption.' },
    };

    const renderContent = () => {
        if (selectedWarehouse) {
            return <WarehouseDetailView 
                warehouse={selectedWarehouse} 
                onBack={() => setSelectedWarehouse(null)} 
                warehouses={generatedAccountWarehouses}
                onSelectWarehouse={setSelectedWarehouse}
                onNavigateToRecommendations={onNavigateToRecommendations}
            />;
        }
        if (selectedPullRequest) {
            return <PullRequestDetailView pullRequest={selectedPullRequest} onBack={() => setSelectedPullRequest(null)} users={users} />;
        }
        if (selectedQuery) {
            return <QueryDetailView 
                query={queryListData.find(q => q.id === selectedQuery.id) || selectedQuery} 
                onBack={() => setSelectedQuery(null)} 
                onAnalyzeQuery={onAnalyzeQuery}
                onOptimizeQuery={onOptimizeQuery}
                onSimulateQuery={onSimulateQuery}
                sourcePage={activePage}
                assignment={assignment}
                currentUser={currentUser}
                onUpdateAssignmentStatus={onUpdateAssignmentStatus}
                onAssignToEngineer={onAssignToEngineer}
                onResolveAssignment={onResolveAssignment}
            />;
        }

        const info = pageInfo[activePage];

        return (
            <div className="flex flex-col h-full overflow-hidden">
                {/* Screen Name for Pages with Tabs */}
                {['Analysis', 'Query list', 'Repeated queries', 'Expensive queries', 'Queries overview', 'Query pattern', 'Compute overview', 'Warehouse', 'Serverless', 'Cortex'].includes(activePage) && (
                    <div className="px-6 pt-6 pb-2 bg-background flex justify-between items-start">
                        <div>
                            <h1 className="text-[28px] font-bold text-text-strong tracking-tight">
                                {['Query list', 'Repeated queries', 'Expensive queries', 'Query pattern'].includes(activePage) ? 'Query pattern' : info.title}
                            </h1>
                            <p className="text-sm text-text-secondary font-medium mt-1">Feb 17 to Feb 23 2026 (Last 7 days)</p>
                        </div>
                        <div className="flex items-center gap-3 font-sans">
                            {/* Show Chart Toggle */}
                            {['Repeated queries', 'Query pattern'].includes(activePage) && !isDeepDrillDown && (
                                <div className="flex items-center gap-2 bg-white border border-border-light rounded-full px-4 py-1.5 shadow-sm h-[38px]">
                                    <button 
                                        onClick={() => setShowQueryPatternChart(!showQueryPatternChart)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showQueryPatternChart ? 'bg-primary' : 'bg-gray-200'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showQueryPatternChart ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                    <span className="text-xs font-bold text-text-secondary select-none">Show chart</span>
                                </div>
                            )}
                            <div className="bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm flex items-center h-[38px] gap-2 cursor-pointer hover:bg-surface-nested transition-colors">
                                <span className="text-sm font-bold text-text-strong">Last 7 days</span>
                                <IconChevronDown className="w-4 h-4 text-text-muted" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                {activeTabs && !isDeepDrillDown && (
                    <div className={`flex items-center gap-8 border-b border-border-light px-6 sticky top-0 z-30 ${
                        ['Analysis', 'Query list', 'Repeated queries', 'Expensive queries', 'Queries overview', 'Query pattern', 'Compute overview', 'Warehouse', 'Serverless', 'Cortex', 'Storage', 'Storage overview', 'Databases', 'Schemas', 'Schema objects', 'Unused tables'].includes(activePage) ? 'bg-background' : 'bg-white'
                    }`}>
                        {activeTabs.map((tab) => {
                            const isActive = activePage === tab.name || (activePage === tab.name.split(' ')[0] && tab.label === 'Overview');
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => onPageChange(tab.name)}
                                    className={`py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                                        isActive ? 'text-primary' : 'text-text-muted hover:text-text-strong'
                                    }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Page Content */}
                <div className={`flex-grow overflow-y-auto no-scrollbar ${['Storage', 'Storage overview', 'Databases', 'Schemas', 'Schema objects', 'Unused tables', 'Compute overview', 'Queries overview', 'Query pattern', 'Analysis', 'Query list', 'Repeated queries', 'Expensive queries', 'Slow queries', 'Warehouse', 'Serverless', 'Workloads', 'Services', 'Users'].includes(activePage) ? 'p-4 pb-12' : (isListView && !selectedWarehouse ? "" : "p-4 pb-12")}`}>
                    {(() => {
                        switch (activePage) {
            case 'Account overview':
                return <AccountOverviewDashboard 
                    account={account} 
                    onNavigate={handleSidebarPageChange} 
                    onSelectWarehouse={setSelectedWarehouse}
                    onSelectQuery={setSelectedQuery}
                    displayMode={displayMode}
                />;
            case 'Enforcement Desk':
                return <Recommendations 
                    accounts={accounts} 
                    currentUser={currentUser} 
                    onNavigateToQuery={(q) => { setSelectedQuery(q as QueryListItem); }} 
                    onNavigateToWarehouse={(wh) => { setSelectedWarehouse(wh as Warehouse); }} 
                    onAssignTask={onShareQueryClick}
                    onOptimizeRecommendation={() => {}}
                    selectedRecommendation={null}
                    onSelectRecommendation={() => {}}
                    onPreviewQuery={onPreviewQuery}
                    onBackToSource={() => handleSidebarPageChange('Account overview')}
                    returnContext={null}
                    displayMode={displayMode}
                />;
            case 'Ask Apex':
                return <AIAgent />;
            case 'Reports':
                return <Reports />;
            case 'Credit trend':
                return <CreditTrendView account={account} />;
            case 'Applications':
                return <ApplicationsView 
                    selectedAppId={selectedApplicationId} 
                    onSelectApp={setSelectedApplicationId} 
                    onNavigateToRecommendations={onNavigateToRecommendations} 
                />;
            case 'Compute':
            case 'Compute overview':
                return <ComputeOverview 
                    account={account} 
                    warehouses={generatedAccountWarehouses} 
                    onNavigate={(page, healthFilter) => {
                        if (healthFilter) {
                            setWarehouseHealthFilter([healthFilter]);
                        }
                        onPageChange(page);
                    }} 
                    onSelectWarehouse={setSelectedWarehouse} 
                />;
            case 'Warehouse':
            case 'Serverless':
                return <AllWarehouses 
                    warehouses={generatedAccountWarehouses} 
                    onSelectWarehouse={setSelectedWarehouse} 
                    onNavigateToRecommendations={onNavigateToRecommendations} 
                    initialHealthFilter={warehouseHealthFilter}
                />;
            case 'Queries':
            case 'Queries overview':
                return <QueriesOverview 
                    onNavigate={onPageChange} 
                    onSelectQuery={setSelectedQuery} 
                    onSelectRepeatedPattern={(hash) => {
                        setSelectedRepeatedQueryHash(hash);
                        onPageChange('Repeated queries');
                    }}
                />;
            case 'Analysis':
            case 'Query list':
                return <QueryListView 
                    onShareQueryClick={onShareQueryClick} 
                    onSelectQuery={setSelectedQuery} 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'Query list')} 
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'Query list')} 
                    onSimulateQuery={(q) => onSimulateQuery(q, 'Query list')} 
                    onNavigateToRecommendations={onNavigateToRecommendations}
                    filters={allQueriesFilters} 
                    setFilters={setAllQueriesFilters} 
                    onDrillDownChange={setIsQueryDrillDown}
                    mode="all"
                />;
            case 'Repeated queries':
                return <QueryListView 
                    onShareQueryClick={onShareQueryClick} 
                    onSelectQuery={setSelectedQuery} 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'Repeated queries')} 
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'Repeated queries')} 
                    onSimulateQuery={(q) => onSimulateQuery(q, 'Repeated queries')} 
                    onNavigateToRecommendations={onNavigateToRecommendations}
                    filters={allQueriesFilters} 
                    setFilters={setAllQueriesFilters} 
                    onDrillDownChange={setIsQueryDrillDown}
                    initialGroupId={selectedRepeatedQueryHash}
                    mode="repeated"
                    showChart={showQueryPatternChart}
                />;
            case 'Expensive queries':
                return <ExpensiveQueriesView 
                    onSelectQuery={setSelectedQuery}
                />;
            case 'Query analyzer':
                return <QueryAnalyzerView 
                    query={analyzingQuery} 
                    onBack={handleBackFromTool} 
                    onSaveClick={onSaveQueryClick} 
                    onBrowseQueries={() => handleSidebarPageChange('Queries')} 
                    onOptimizeQuery={(q) => onOptimizeQuery(q, activePage)} 
                />;
            case 'Query optimizer':
                return <QueryOptimizerView 
                    query={analyzingQuery} 
                    onBack={handleBackFromTool} 
                    onSaveClick={onSaveQueryClick} 
                    onSimulateQuery={(q) => onSimulateQuery(q, activePage)} 
                />;
            case 'Query simulator':
                return <QuerySimulatorView 
                    query={analyzingQuery} 
                    onBack={handleBackFromTool} 
                    onSaveClick={onSaveQueryClick} 
                />;
            case 'Query prompt generator':
                return <QueryPromptGeneratorView 
                    onBack={handleBackFromTool} 
                    onSaveClick={onSaveQueryClick} 
                />;
            case 'Storage':
            case 'Storage overview':
                return <StorageSummaryView 
                    onSelectDatabase={(id) => { handleSidebarPageChange('Databases'); setSelectedDatabaseId(id === '__view_all__' ? null : id); }} 
                    onSetBigScreenWidget={onSetBigScreenWidget} 
                    onNavigate={(page, filters) => handleStorageNavigation(page, filters)}
                />;
            case 'Databases':
                return <DatabasesView 
                    onNavigateToSchemas={(db) => handleStorageNavigation('Schemas', { database: db })}
                />;
            case 'Schemas':
                return <SchemasView 
                    initialDatabaseFilter={storageDatabaseFilter}
                    onNavigateToTables={(db, schema) => handleStorageNavigation('Schema objects', { database: db, schema: schema })}
                />;
            case 'Schema objects':
                return <TablesView 
                    initialTableTypeFilter={storageTableTypeFilter}
                    initialDatabaseFilter={storageDatabaseFilter}
                    initialSchemaFilter={storageSchemaFilter}
                />;
            case 'Unused tables':
                return <UnusedTablesView 
                    onNavigateToRecommendations={onNavigateToRecommendations} 
                    initialTableTypeFilter={storageTableTypeFilter}
                />;
            case 'Workloads':
                return <WorkloadsListView accountName={account.name} onNavigateToRecommendations={onNavigateToRecommendations} />;
            case 'Services':
                return <AccountServicesView accountName={account.name} onNavigateToRecommendations={onNavigateToRecommendations} />;
            case 'Users':
                return <AccountUsersListView accountName={account.name} onNavigateToRecommendations={onNavigateToRecommendations} />;
            case 'Optimization':
                return <QueryAnalyzerView 
                    query={analyzingQuery} 
                    onBack={handleBackFromTool} 
                    onSaveClick={onSaveQueryClick} 
                    onBrowseQueries={() => handleSidebarPageChange('Queries')} 
                    onOptimizeQuery={(q) => onOptimizeQuery(q, activePage)} 
                />;
            case 'Cortex':
                return <CortexListView onNavigateToRecommendations={onNavigateToRecommendations} />;
            default:
                return <AccountOverviewDashboard 
                    account={account} 
                    onNavigate={onPageChange} 
                    onSelectWarehouse={setSelectedWarehouse}
                    onSelectQuery={setSelectedQuery}
                    displayMode={displayMode}
                />;
                        }
                    })()}
                </div>
            </div>
        );
    };

    const isListView = ['Queries', 'Queries overview', 'Query pattern', 'Repeated queries', 'Expensive queries', 'Slow queries', 'Similar query patterns', 'Query analyzer', 'Query optimizer', 'Query simulator', 'Warehouse', 'Serverless', 'Applications', 'Cortex', 'Storage', 'Storage overview', 'Databases', 'Schemas', 'Schema objects', 'Unused tables', 'Workloads', 'Services', 'Users', 'Credit trend', 'Compute overview'].includes(activePage);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="flex flex-1 overflow-hidden">
                <ContextualSidebar 
                    account={account} 
                    accounts={accounts} 
                    onSwitchAccount={onSwitchAccount} 
                    activePage={activePage} 
                    onPageChange={handleSidebarPageChange} 
                    onBackToAccounts={onBackToAccounts} 
                    backLabel={backLabel}
                    selectedApplicationId={selectedApplicationId}
                    isDeepDrillDown={isDeepDrillDown}
                />
                <main className="flex-1 flex flex-col overflow-hidden relative bg-background">
                    <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="lg:hidden pt-2 px-4 pb-0 flex-shrink-0">
                             <MobileNav activePage={activePage} onPageChange={handleSidebarPageChange} accountNavItems={accountNavItems} />
                        </div>
                        {/* Consistent breadcrumbs at the top of all AccountView sub-screens */}
                        <div className="w-full max-w-[1440px] mx-auto px-4 h-9 flex items-center bg-[#F4F1F9]/80 dark:bg-[#1A112B]/80 backdrop-blur-[12px] border-b border-border-light/45 select-none flex-shrink-0">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="flex-grow overflow-hidden flex flex-col">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountView;
