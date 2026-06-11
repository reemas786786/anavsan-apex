import React, { useState, useMemo } from 'react';
import { Account, Warehouse, QueryListItem } from '../types';
import { queryListData } from '../data/dummyData';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid, Cell } from 'recharts';
import { Sparkles, Info, Calendar, ChevronDown, RefreshCw, Layers, Slack, Github, MessageSquare, Network, Clock, Shield, Tag, Search, X, Check, Server, Database, Boxes, Table, Cloud, Cpu, Edit3, ArrowUpDown, Maximize2 } from 'lucide-react';
import { IconAIAgent, IconSparkles } from '../constants';
import InfoTooltip from '../components/InfoTooltip';

// --- TS types and interfaces ---
interface AccountOverviewDashboardProps {
    account: Account;
    onNavigate: (page: string) => void;
    onSelectWarehouse: (warehouse: Warehouse) => void;
    onSelectQuery: (query: QueryListItem) => void;
    displayMode?: 'cost' | 'credits';
    activePageTab?: 'Account overview' | 'Consumption';
}

// category dataset lookup matching screenshot
const categorySpendData: Record<string, {
    totalShown: string;
    items: { name: string; credits: number; rank: string; percentage: number; color: string }[];
}> = {
    'WAREHOUSE': {
        totalShown: '8,800 cr',
        items: [
            { name: 'ETL_WH', credits: 3800, rank: 'RANK #1', percentage: 43, color: '#5829D6' },
            { name: 'COMPUTE_WH', credits: 1800, rank: 'RANK #2', percentage: 20, color: '#7C3AED' },
            { name: 'BI_REPORTING_WH', credits: 1400, rank: 'RANK #3', percentage: 16, color: '#905CF7' },
            { name: 'TRANSFORM_WH', credits: 950, rank: 'RANK #4', percentage: 11, color: '#A78BFA' },
            { name: 'ANALYTICS_WH', credits: 850, rank: 'RANK #5', percentage: 10, color: '#C4B5FD' }
        ]
    },
    'QUERY PATTERN': {
        totalShown: '9,400 cr',
        items: [
            { name: 'SELECT INSERTS', credits: 4200, rank: 'RANK #1', percentage: 45, color: '#5829D6' },
            { name: 'MERGE SESSIONS', credits: 2100, rank: 'RANK #2', percentage: 22, color: '#7C3AED' },
            { name: 'JOIN TELEMETRY', credits: 1500, rank: 'RANK #3', percentage: 16, color: '#905CF7' },
            { name: 'AGGREGATE LOGS', credits: 1000, rank: 'RANK #4', percentage: 11, color: '#A78BFA' },
            { name: 'DAILY MATERIALIZE', credits: 600, rank: 'RANK #5', percentage: 6, color: '#C4B5FD' }
        ]
    },
    'DATABASE': {
        totalShown: '10,650 cr',
        items: [
            { name: 'ANALYTICS_DB', credits: 5100, rank: 'RANK #1', percentage: 48, color: '#5829D6' },
            { name: 'RAW_DATA_DB', credits: 2400, rank: 'RANK #2', percentage: 23, color: '#7C3AED' },
            { name: 'FINANCE_STG_DB', credits: 1600, rank: 'RANK #3', percentage: 15, color: '#905CF7' },
            { name: 'SECURITY_LOGS', credits: 1100, rank: 'RANK #4', percentage: 10, color: '#A78BFA' },
            { name: 'CORE_FACT_DB', credits: 450, rank: 'RANK #5', percentage: 4, color: '#C4B5FD' }
        ]
    },
    'TAGS': {
        totalShown: '8,930 cr',
        items: [
            { name: 'env:production', credits: 4850, rank: 'RANK #1', percentage: 55, color: '#5829D6' },
            { name: 'team:data-eng', credits: 2150, rank: 'RANK #2', percentage: 24, color: '#7C3AED' },
            { name: 'dept:finance', credits: 1100, rank: 'RANK #3', percentage: 12, color: '#905CF7' },
            { name: 'proj:cust-360', credits: 550, rank: 'RANK #4', percentage: 6, color: '#A78BFA' },
            { name: 'team:data-sci', credits: 280, rank: 'RANK #5', percentage: 3, color: '#C4B5FD' }
        ]
    },
    'USERS': {
        totalShown: '9,450 cr',
        items: [
            { name: 'system_etl_proc', credits: 4600, rank: 'RANK #1', percentage: 49, color: '#5829D6' },
            { name: 'mike_data_eng', credits: 2300, rank: 'RANK #2', percentage: 24, color: '#7C3AED' },
            { name: 'jane_data_analyst', credits: 1450, rank: 'RANK #3', percentage: 15, color: '#905CF7' },
            { name: 'alex_data_sci', credits: 820, rank: 'RANK #4', percentage: 9, color: '#A78BFA' },
            { name: 'reporter_bi', credits: 280, rank: 'RANK #5', percentage: 3, color: '#C4B5FD' }
        ]
    }
};

// --- CUSTOM TOOLTIPS ---
const CategoryCustomTooltip = ({ active, payload, displayMode }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isCost = displayMode === 'cost';
        const formattedValue = isCost ? `$${Math.round(data.credits * 3.0).toLocaleString()}` : `${data.credits.toLocaleString()} cr`;
        return (
            <div className="bg-white dark:bg-[#1F2937] px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 min-w-[150px] flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{data.name}</span>
                <div className="flex justify-between items-baseline mt-2 gap-6">
                    <span className="text-xs text-slate-500 dark:text-slate-400">value</span>
                    <span className="text-xs font-black text-[#5829D6] dark:text-[#818CF8]">{formattedValue}</span>
                </div>
            </div>
        );
    }
    return null;
};

const SpendTrendsCustomTooltip = ({ active, payload, activeTrendTab, displayMode }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        let unit = 'cr';
        let label = 'spend';
        const isCost = displayMode === 'cost';
        if (activeTrendTab === 'STORAGE GROWTH') {
            unit = 'GB';
            label = 'capacity';
        } else if (activeTrendTab === 'DATA TRANSFER') {
            unit = 'GB';
            label = 'transfer';
        } else if (activeTrendTab === 'WAREHOUSE SPEND') {
            unit = 'cr';
            label = 'spend';
        }

        const isForecast = data.value === null || data.value === undefined;
        const displayValue = isForecast ? data.forecast : data.value;
        const displayLabel = isForecast ? `${label} (forecast)` : label;

        let formattedValue = displayValue !== null && displayValue !== undefined ? displayValue.toLocaleString() : 'N/A';
        if (displayValue !== null && displayValue !== undefined && (activeTrendTab === 'SPEND TREND' || activeTrendTab === 'WAREHOUSE SPEND')) {
            if (isCost) {
                formattedValue = `$${Math.round(displayValue * 3.0).toLocaleString()}`;
                unit = '';
            } else {
                formattedValue = `${displayValue.toLocaleString()} cr`;
                unit = '';
            }
        } else if (displayValue !== null && displayValue !== undefined) {
            formattedValue = `${displayValue.toLocaleString()} ${unit}`;
        }

        return (
            <div className="bg-white dark:bg-[#1F2937] px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 min-w-[160px] text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">{data.name}</span>
                <div className="flex justify-between items-baseline mt-2 gap-6">
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{displayLabel}</span>
                    <span className="text-xs font-black text-[#5829D6] dark:text-[#818CF8]">
                        {formattedValue}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// --- SNOWFLAKE FILTER OPTIONS CONSTANTS ---
const DATE_PERIODS = ['Last 12 months', 'Last 6 months', 'Last 30 days', 'Last 7 days'];
const TAG_LIST = ['All Tags', 'COST_CENTER: retail', 'COST_CENTER: supply_chain', 'env:production', 'team:data-eng', 'dept:finance'];
const USAGE_TYPES = ['Compute', 'All', 'Storage', 'Data Transfer'];
const SERVICE_TYPES = [
    'All', 'Warehouse', 'Serverless', 'Cloud Services'
];
const REGIONS_LIST = ['All Regions', 'us-east-1'];
const OBJECTS_LIST = ['All Objects', 'Database', 'Table', 'Stage', 'Fail-safe'];
const RESOURCES_LIST = [
    { name: 'All Resources', type: 'All', color: '#5829D6' },
    { name: 'AI_OBSERVABILITY_EVENTS', type: 'AI Event', color: '#10B981' },
    { name: 'ANAVSAN_WH', type: 'Warehouse', color: '#EF4444' },
    { name: 'beae6571-f091-42d0-ad90-c5802e0a1083', type: 'Table', color: '#8B5CF6' },
    { name: 'CLOUD_SERVICES_ONLY', type: 'Services', color: '#F97316' },
    { name: 'COMPUTE_WH', type: 'Warehouse', color: '#0EA5E9' },
    { name: 'CORTEX_CODE_SNOWSIGHT', type: 'AI Service', color: '#A855F7' },
    { name: 'DBT_TPCDS_WH', type: 'Warehouse', color: '#6366F1' },
    { name: 'DBT_TPCH_WH', type: 'Warehouse', color: '#F59E0B' },
    { name: 'DIM_CUSTOMERS', type: 'Table', color: '#EC4899' },
    { name: 'DIM_ITEMS', type: 'Table', color: '#D946EF' },
    { name: 'DIM_ITEMS_PERMANENT', type: 'Table', color: '#F43F5E' },
    { name: 'DIM_SUPPLIERS', type: 'Table', color: '#8B5CF6' },
    { name: 'FCT_LINEITEM_INCREMENTAL', type: 'Table', color: '#F97316' },
    { name: 'FCT_LINEITEM_PERMANENT', type: 'Table', color: '#10B981' },
    { name: 'FCT_ORDERS_INCREMENTAL', type: 'Table', color: '#EF4444' }
];

// --- MAIN DASHBOARD IMPLEMENTATION ---
const AccountOverviewDashboard: React.FC<AccountOverviewDashboardProps> = ({ account, onNavigate, onSelectWarehouse, onSelectQuery, displayMode, activePageTab = 'Account overview' }) => {
    const isCost = displayMode === 'cost';
    
    // --- Snowflake Dynamic Filters State ---
    const [selectedDate, setSelectedDate] = useState<string>('Last 12 months');
    const [selectedAccount, setSelectedAccount] = useState<string | null>('EVC54287');
    const [selectedTag, setSelectedTag] = useState<string>('All Tags');
    const [selectedUsageType, setSelectedUsageType] = useState<string>('All');
    const [selectedServiceType, setSelectedServiceType] = useState<string>('All');
    const [selectedResource, setSelectedResource] = useState<string>('All Resources');
    const [selectedObject, setSelectedObject] = useState<string>('All Objects');
    const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
    
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [serviceSearch, setServiceSearch] = useState<string>('');
    const [resourceSearch, setResourceSearch] = useState<string>('');
    const [objectSearch, setObjectSearch] = useState<string>('');
    const [regionSearch, setRegionSearch] = useState<string>('');
    const [isSimulatingFetch, setIsSimulatingFetch] = useState<boolean>(false);

    // Dynamic table search input
    const [tableSearchText, setTableSearchText] = useState<string>('');
    const [tableDropdownOpen, setTableDropdownOpen] = useState<'resource' | 'tag' | 'service' | 'object' | 'region' | null>(null);

    // Optimization summary widget states
    const [optimizationRange, setOptimizationRange] = useState<string>('Last 14 Days');
    const [optimizationSort, setOptimizationSort] = useState<string>('Total spend');
    const [optRangeDropdownOpen, setOptRangeDropdownOpen] = useState<boolean>(false);
    const [optSortDropdownOpen, setOptSortDropdownOpen] = useState<boolean>(false);

    // New Cost & Consumption Widget interactive states
    const [budgetActivated, setBudgetActivated] = useState<boolean>(false);
    const [budgetLimit, setBudgetLimit] = useState<number>(30);
    const [aiTipMessage, setAiTipMessage] = useState<string | null>(null);
    const [rolesExplanationOpen, setRolesExplanationOpen] = useState<boolean>(false);

    const optimizationData = useMemo(() => {
        if (optimizationRange === 'Last 7 Days') {
            return {
                totalSpend: '$5,480',
                avgMonthly: '$1,150',
                accounts: '3',
                savings: '$11,210',
                recsCount: 6,
            };
        } else if (optimizationRange === 'Last 30 Days') {
            return {
                totalSpend: '$24,960',
                avgMonthly: '$1,820',
                accounts: '3',
                savings: '$48,600',
                recsCount: 19,
            };
        }
        // Default Last 14 Days
        return {
            totalSpend: '$11,174',
            avgMonthly: '$1,315',
            accounts: '3',
            savings: '$23,530',
            recsCount: 10,
        };
    }, [optimizationRange]);

    const handleUsageTypeChange = (type: string) => {
        setSelectedUsageType(type);
        setTableSearchText('');
        setSelectedServiceType('All');
        setSelectedResource('All Resources');
        setSelectedObject('All Objects');
        setSelectedRegion('All Regions');
        setActiveDropdown(null);
        setIsSimulatingFetch(true);
        setTimeout(() => {
            setIsSimulatingFetch(false);
        }, 400);
    };

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
        setter(value);
        setActiveDropdown(null);
        setIsSimulatingFetch(true);
        setTimeout(() => {
            setIsSimulatingFetch(false);
        }, 400); // 400ms professional query execution simulation
    };

    const handleRefresh = () => {
        setIsSimulatingFetch(true);
        setTimeout(() => {
            setIsSimulatingFetch(false);
        }, 600);
    };

    const [activeSpendTab, setActiveSpendTab] = useState<'WAREHOUSE' | 'QUERY PATTERN' | 'DATABASE' | 'TAGS' | 'USERS'>('WAREHOUSE');
    const [activeTrendTab, setActiveTrendTab] = useState<'SPEND TREND' | 'WAREHOUSE SPEND' | 'DATA TRANSFER' | 'STORAGE GROWTH'>('SPEND TREND');
    const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});
    
    const [showForecast, setShowForecast] = useState<boolean>(true);

    // --- State variables for the beautiful customized warehouse detail panel ---
    const [showWarehouseDetailsPanel, setShowWarehouseDetailsPanel] = useState(true);
    const [warehouseTimeframe, setWarehouseTimeframe] = useState('2 Weeks');
    const [warehouseStatusFilter, setWarehouseStatusFilter] = useState('All');
    const [warehouseUserFilter, setWarehouseUserFilter] = useState('MANJU');
    const [warehouseDescription, setWarehouseDescription] = useState('Warehouse utilized for data warehousing, heavy analytical transformations, and ingestion pipelines.');
    const [isEditingWarehouseDescription, setIsEditingWarehouseDescription] = useState(false);
    const [tempWarehouseDescription, setTempWarehouseDescription] = useState('Warehouse utilized for data warehousing, heavy analytical transformations, and ingestion pipelines.');
    const [warehouseActiveDropdown, setWarehouseActiveDropdown] = useState<'status' | 'user' | 'timeframe' | null>(null);

    // Chart mock dataset for Top category spend Horizontal Bars
    const activeSpendData = useMemo(() => categorySpendData[activeSpendTab], [activeSpendTab]);

    // DYNAMIC WORKLOAD CHART DATA MAPPED BY USAGE TYPE
    const activeWorkloadChartData = useMemo(() => {
        if (selectedUsageType === 'Compute') {
            return [
                { name: 'Jun 4', compute: 850, cloudServices: 120 },
                { name: 'Jun 5', compute: 920, cloudServices: 130 },
                { name: 'Jun 6', compute: 780, cloudServices: 110 },
                { name: 'Jun 7', compute: 1050, cloudServices: 140 },
                { name: 'Jun 8', compute: 890, cloudServices: 125 },
                { name: 'Jun 9', compute: 940, cloudServices: 135 },
                { name: 'Jun 10', compute: 1020, cloudServices: 145 }
            ];
        } else if (selectedUsageType === 'Storage') {
            return [
                { name: 'Jun 4', databases: 580, stages: 120, failsafe: 62 },
                { name: 'Jun 5', databases: 590, stages: 122, failsafe: 63 },
                { name: 'Jun 6', databases: 605, stages: 125, failsafe: 64 },
                { name: 'Jun 7', databases: 620, stages: 127, failsafe: 65 },
                { name: 'Jun 8', databases: 635, stages: 130, failsafe: 66 },
                { name: 'Jun 9', databases: 640, stages: 132, failsafe: 68 },
                { name: 'Jun 10', databases: 655, stages: 135, failsafe: 70 }
            ];
        } else if (selectedUsageType === 'Data Transfer') {
            // Empty state helper check
            if (selectedRegion !== 'All Regions' && selectedRegion !== 'us-east-1') {
                return [];
            }
            if (tableSearchText.trim().toLowerCase() === 'no data' || tableSearchText.trim().toLowerCase() === 'empty') {
                return [];
            }
            return [
                { name: 'Jun 4', usEast1: 120, euWest1: 45, apSoutheast1: 25 },
                { name: 'Jun 5', usEast1: 135, euWest1: 52, apSoutheast1: 28 },
                { name: 'Jun 6', usEast1: 110, euWest1: 38, apSoutheast1: 22 },
                { name: 'Jun 7', usEast1: 145, euWest1: 58, apSoutheast1: 32 },
                { name: 'Jun 8', usEast1: 130, euWest1: 48, apSoutheast1: 27 },
                { name: 'Jun 9', usEast1: 155, euWest1: 62, apSoutheast1: 35 },
                { name: 'Jun 10', usEast1: 162, euWest1: 65, apSoutheast1: 38 }
            ];
        } else {
            // Usage type: "All"
            return [
                { name: 'Jun 4', spend: 3200 },
                { name: 'Jun 5', spend: 3450 },
                { name: 'Jun 6', spend: 2980 },
                { name: 'Jun 7', spend: 3950 },
                { name: 'Jun 8', spend: 3410 },
                { name: 'Jun 9', spend: 3620 },
                { name: 'Jun 10', spend: 3870 }
            ];
        }
    }, [selectedUsageType, selectedRegion, tableSearchText]);

    // WORKLOAD GRAPH LABELS, CREDENTIALS AND COLOR CONFIGURATION
    const workloadChartConfig = useMemo(() => {
        switch (selectedUsageType) {
            case 'Compute':
                return {
                    yAxisLabel: 'Credits',
                    domain: [0, 1300] as [number, number],
                    ticks: [0, 325, 650, 975, 1300],
                    bars: [
                        { key: 'compute', name: 'Compute', color: '#5829D6' },
                        { key: 'cloudServices', name: 'Cloud Services', color: '#22D3EE' }
                    ]
                };
            case 'Storage':
                return {
                    yAxisLabel: 'GB Data Stored',
                    domain: [0, 1000] as [number, number],
                    ticks: [0, 250, 500, 750, 1000],
                    bars: [
                        { key: 'databases', name: 'Databases', color: '#5829D6' },
                        { key: 'stages', name: 'Stages', color: '#22D3EE' },
                        { key: 'failsafe', name: 'Fail-safe', color: '#F59E0B' }
                    ]
                };
            case 'Data Transfer':
                return {
                    yAxisLabel: 'Data Transferred (MB)',
                    domain: [0, 305] as [number, number],
                    ticks: [0, 75, 150, 225, 300],
                    bars: [
                        { key: 'usEast1', name: 'us-east-1', color: '#10B981' },
                        { key: 'euWest1', name: 'eu-west-1', color: '#3B82F6' },
                        { key: 'apSoutheast1', name: 'ap-southeast-1', color: '#EC4899' }
                    ]
                };
            default:
                return {
                    yAxisLabel: 'Spend ($ USD)',
                    domain: [0, 5000] as [number, number],
                    ticks: [0, 1250, 2500, 3750, 5000],
                    bars: [
                        { key: 'spend', name: 'Total Organization Spend', color: '#5829D6' }
                    ]
                };
        }
    }, [selectedUsageType]);

    // QUERY HISTORY STATIC DATA FOR SELECTED WAREHOUSE / RESOURCE
    const queryHistoryRows = [
        { sqlText: "SELECT COUNT(*), dept_id FROM analytics_db.public.sales GROUP BY dept_id;", queryId: "01b2a3c4-0001-a1b2-0000-0123abcd4567", status: "SUCCESS", user: "mike_data_eng", duration: "1.2s", started: "2026-06-10 07:15:22", rows: 14002 },
        { sqlText: "CREATE OR REPLACE TEMPORARY TABLE temp_revenue AS SELECT * FROM raw_data.sales;", queryId: "01b2f3a2-0004-e310-0001-9231fbaa4240", status: "SUCCESS", user: "jane_data_analyst", duration: "4.5s", started: "2026-06-10 07:12:05", rows: 842000 },
        { sqlText: "SELECT * FROM core_fact_db.finance.ledgers WHERE transaction_year = 2026 LIMIT 100;", queryId: "01b2d41a-0002-cc91-0010-84a1bc923a12", status: "SUCCESS", user: "reporter_bi", duration: "0.8s", started: "2026-06-10 07:10:14", rows: 100 },
        { sqlText: "COPY INTO @raw_stage/sales_sync FROM (SELECT * FROM sales_raw) FILE_FORMAT = (TYPE = PARQUET);", queryId: "01b2e21b-0003-882a-0004-942bcba55123", status: "FAILED", user: "system_etl_proc", duration: "12.4s", started: "2026-06-10 07:05:00", rows: 0 },
        { sqlText: "ALTER WAREHOUSE ANAVSAN_WH RESUME IF SUSPENDED;", queryId: "01b2ff19-0005-cb12-0001-8314bbd2df89", status: "SUCCESS", user: "mike_data_eng", duration: "0.1s", started: "2026-06-10 07:00:12", rows: 0 },
        { sqlText: "SELECT * FROM security_logs.raw.records WHERE severity = 'CRITICAL';", queryId: "01b2a51f-0001-83b3-0009-1234abcd8823", status: "RUNNING", user: "system_etl_proc", duration: "1.5s", started: "2026-06-10 07:29:40", rows: 0 }
    ];

    // COMPUTE TABLE ROWS LIST
    const computeTableData = useMemo(() => {
        const list = [
            { id: 'wh-1', name: 'ANAVSAN_WH', type: 'Warehouse (X-Large)', tags: ['COST_CENTER: retail', 'env:production'], creditsUsed: 620 },
            { id: 'wh-2', name: 'COMPUTE_WH', type: 'Warehouse (Medium)', tags: ['COST_CENTER: supply_chain', 'team:data-eng'], creditsUsed: 280 },
            { id: 'wh-3', name: 'ETL_WH', type: 'Warehouse (Large)', tags: ['team:data-eng', 'env:production'], creditsUsed: 150 },
            { id: 'wh-4', name: 'BI_REPORTING_WH', type: 'Warehouse (Small)', tags: ['dept:finance'], creditsUsed: 90 },
            { id: 'wh-5', name: 'TRANSFORM_WH', type: 'Warehouse (Small)', tags: ['team:data-eng'], creditsUsed: 40 }
        ];
        
        let filtered = list;
        if (selectedResource !== 'All Resources') {
            filtered = list.filter(item => item.name === selectedResource);
        }
        if (selectedTag !== 'All Tags') {
            filtered = filtered.filter(item => item.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()) || selectedTag.toLowerCase().includes(tag.toLowerCase())));
        }
        if (tableSearchText.trim() !== '') {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(tableSearchText.toLowerCase()));
        }
        return filtered;
    }, [selectedResource, selectedTag, tableSearchText]);

    // Compute max credits used for normalization progress bar
    const maxCreditsInSet = useMemo(() => {
        if (computeTableData.length === 0) return 1;
        return Math.max(...computeTableData.map(item => item.creditsUsed));
    }, [computeTableData]);

    // STORAGE TABLE ROWS LIST
    const storageTableData = useMemo(() => {
        const list = [
            { id: 'st-1', object: 'ANALYTICS_DB', type: 'Database', tags: ['env:production', 'team:data-eng'], size: 450, dbSize: 310, stageSize: 90, failsafeSize: 50 },
            { id: 'st-2', object: 'RAW_DATA_DB', type: 'Database', tags: ['team:data-eng', 'env:production'], size: 190, dbSize: 130, stageSize: 40, failsafeSize: 20 },
            { id: 'st-3', object: 'FINANCE_STG_DB', type: 'Database', tags: ['dept:finance'], size: 85, dbSize: 60, stageSize: 15, failsafeSize: 10 },
            { id: 'st-4', object: 'USER_SCRATCHPAD', type: 'Database', tags: ['team:data-sci'], size: 30, dbSize: 22, stageSize: 8, failsafeSize: 0 },
            { id: 'st-5', object: 'USER$MANJU_STAGE', type: 'Stage', tags: ['team:data-sci'], size: 25, dbSize: 0, stageSize: 25, failsafeSize: 0 },
            { id: 'st-6', object: 'SYSTEM_STAGES', type: 'Stage', tags: ['COST_CENTER: retail'], size: 12.4, dbSize: 0, stageSize: 12.4, failsafeSize: 0 }
        ];

        let filtered = list;
        if (selectedObject !== 'All Objects') {
            filtered = list.filter(item => item.type.toLowerCase() === selectedObject.toLowerCase());
        }
        if (selectedTag !== 'All Tags') {
            filtered = filtered.filter(item => item.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()) || selectedTag.toLowerCase().includes(tag.toLowerCase())));
        }
        if (tableSearchText.trim() !== '') {
            filtered = filtered.filter(item => item.object.toLowerCase().includes(tableSearchText.toLowerCase()));
        }
        return filtered;
    }, [selectedObject, selectedTag, tableSearchText]);

    // Storage max GB size for normalization progress bar
    const maxStorageSizeInSet = useMemo(() => {
        if (storageTableData.length === 0) return 1;
        return Math.max(...storageTableData.map(item => item.size));
    }, [storageTableData]);

    // DATA TRANSFER TABLE ROWS LIST
    const transferTableData = useMemo(() => {
        const list = [
            { id: 'dt-1', provider: 'AWS', targetRegion: 'us-east-1', amountTransferred: 145, transferType: 'Cross-Region Replication' },
            { id: 'dt-2', provider: 'Azure', targetRegion: 'eu-west-1', amountTransferred: 72, transferType: 'Multi-cloud Stage Sync' },
            { id: 'dt-3', provider: 'GCP', targetRegion: 'asia-east1', amountTransferred: 37, transferType: 'Client BI Fetch Queries' }
        ];

        let filtered = list;
        if (selectedRegion !== 'All Regions') {
            filtered = list.filter(item => item.targetRegion === selectedRegion);
        }
        if (tableSearchText.trim() !== '') {
            filtered = list.filter(item => 
                item.provider.toLowerCase().includes(tableSearchText.toLowerCase()) ||
                item.targetRegion.toLowerCase().includes(tableSearchText.toLowerCase()) ||
                item.transferType.toLowerCase().includes(tableSearchText.toLowerCase())
            );
        }
        return filtered;
    }, [selectedRegion, tableSearchText]);

    // ALL SERVICES & COSTS TABLE ROWS LIST
    const allTableData = useMemo(() => {
        const list = [
            { id: 'all-1', startTime: '2026-06-10 06:00:00', region: 'us-east-1', serviceLevel: 'Enterprise Critical', cost: 1850, usageType: 'Compute' },
            { id: 'all-2', startTime: '2026-06-10 05:00:00', region: 'us-east-1', serviceLevel: 'Enterprise Standard', cost: 1350, usageType: 'Compute' },
            { id: 'all-3', startTime: '2026-06-10 04:00:00', region: 'us-east-1', serviceLevel: 'Enterprise Standard', cost: 980, usageType: 'Storage' },
            { id: 'all-4', startTime: '2026-06-10 03:00:00', region: 'us-east-1', serviceLevel: 'Standard Sandbox', cost: 420, usageType: 'Data Transfer' },
            { id: 'all-5', startTime: '2026-06-10 02:00:00', region: 'us-east-1', serviceLevel: 'Enterprise Standard', cost: 350, usageType: 'Compute' },
            { id: 'all-6', startTime: '2026-06-10 01:00:00', region: 'us-east-1', serviceLevel: 'Enterprise Critical', cost: 470, usageType: 'Cloud Services' }
        ];

        let filtered = list;
        if (selectedRegion !== 'All Regions') {
            filtered = list.filter(item => item.region === selectedRegion);
        }
        if (tableSearchText.trim() !== '') {
            filtered = list.filter(item => 
                item.usageType.toLowerCase().includes(tableSearchText.toLowerCase()) ||
                item.serviceLevel.toLowerCase().includes(tableSearchText.toLowerCase()) ||
                item.startTime.toLowerCase().includes(tableSearchText.toLowerCase())
            );
        }
        return filtered;
    }, [selectedRegion, tableSearchText]);

    // DYNAMIC METRIC DEFINITION ACCORDING TO USER MAPPING SPECIFICATION
    const activePrimaryMetric = useMemo(() => {
        if (selectedUsageType === 'Compute') {
            // Total compute credits summed over active visual series
            const totalCredits = 1050; // Aligns with the 1,050 cr standard label
            return {
                value: isCost ? `$${Math.round(totalCredits * 3).toLocaleString()}` : totalCredits.toLocaleString(),
                label: isCost ? 'total cost (USD spent approximation)' : 'credits used'
            };
        } else if (selectedUsageType === 'Storage') {
            // GB data stored
            const totalGB = 792.4; 
            return {
                value: totalGB.toLocaleString(),
                label: 'GB data stored'
            };
        } else if (selectedUsageType === 'Data Transfer') {
            // MB data transferred
            const totalMB = 254;
            return {
                value: totalMB.toLocaleString(),
                label: 'data transferred (MB)'
            };
        } else {
            // All Mode (USD spent)
            const totalUSD = 5420;
            return {
                value: `$${totalUSD.toLocaleString()}`,
                label: 'USD Spent'
            };
        }
    }, [selectedUsageType, isCost]);

    // Spend history trend bezier curve data Oct 21 to Nov 20 + Forecast
    const spendTrendHistoryData = [
        { name: 'Oct 21', value: 1610, forecast: 1610 },
        { name: 'Oct 23', value: 1390, forecast: 1390 },
        { name: 'Oct 25', value: 1720, forecast: 1715 },
        { name: 'Oct 27', value: 1510, forecast: 1520 },
        { name: 'Oct 29', value: 1390, forecast: 1400 },
        { name: 'Oct 31', value: 1740, forecast: 1730 },
        { name: 'Nov 2', value: 1395, forecast: 1410 },
        { name: 'Nov 4', value: 1610, forecast: 1610 },
        { name: 'Nov 6', value: 1420, forecast: 1430 },
        { name: 'Nov 8', value: 1630, forecast: 1625 },
        { name: 'Nov 10', value: 1410, forecast: 1420 },
        { name: 'Nov 12', value: 1640, forecast: 1635 },
        { name: 'Nov 14', value: 1510, forecast: 1520 },
        { name: 'Nov 16', value: 1620, forecast: 1615 },
        { name: 'Nov 18', value: 1410, forecast: 1430 },
        { name: 'Nov 20', value: 1710, forecast: 1710 },
        { name: 'Nov 22 (F)', value: null, forecast: 1750 },
        { name: 'Nov 24 (F)', value: null, forecast: 1800 },
        { name: 'Nov 26 (F)', value: null, forecast: 1850 },
        { name: 'Nov 28 (F)', value: null, forecast: 1890 },
        { name: 'Nov 30 (F)', value: null, forecast: 1950 }
    ];

    // Warehouse spend trend dataset Oct 21 to Nov 20 + Forecast
    const warehouseSpendHistoryData = [
        { name: 'Oct 21', value: 1200, forecast: 1200 },
        { name: 'Oct 23', value: 1100, forecast: 1110 },
        { name: 'Oct 25', value: 1350, forecast: 1340 },
        { name: 'Oct 27', value: 1210, forecast: 1220 },
        { name: 'Oct 29', value: 1050, forecast: 1060 },
        { name: 'Oct 31', value: 1380, forecast: 1370 },
        { name: 'Nov 2', value: 1080, forecast: 1090 },
        { name: 'Nov 4', value: 1240, forecast: 1240 },
        { name: 'Nov 6', value: 1110, forecast: 1120 },
        { name: 'Nov 8', value: 1290, forecast: 1280 },
        { name: 'Nov 10', value: 1090, forecast: 1100 },
        { name: 'Nov 12', value: 1320, forecast: 1315 },
        { name: 'Nov 14', value: 1180, forecast: 1190 },
        { name: 'Nov 16', value: 1270, forecast: 1260 },
        { name: 'Nov 18', value: 1090, forecast: 1110 },
        { name: 'Nov 20', value: 1350, forecast: 1350 },
        { name: 'Nov 22 (F)', value: null, forecast: 1380 },
        { name: 'Nov 24 (F)', value: null, forecast: 1410 },
        { name: 'Nov 26 (F)', value: null, forecast: 1450 },
        { name: 'Nov 28 (F)', value: null, forecast: 1480 },
        { name: 'Nov 30 (F)', value: null, forecast: 1520 }
    ];

    // Data Transfer trend dataset (GB egress) Oct 21 to Nov 20 + Forecast
    const dataTransferHistoryData = [
        { name: 'Oct 21', value: 150, forecast: 150 },
        { name: 'Oct 23', value: 140, forecast: 142 },
        { name: 'Oct 25', value: 180, forecast: 178 },
        { name: 'Oct 27', value: 160, forecast: 161 },
        { name: 'Oct 29', value: 130, forecast: 132 },
        { name: 'Oct 31', value: 190, forecast: 188 },
        { name: 'Nov 2', value: 150, forecast: 152 },
        { name: 'Nov 4', value: 170, forecast: 170 },
        { name: 'Nov 6', value: 140, forecast: 142 },
        { name: 'Nov 8', value: 180, forecast: 179 },
        { name: 'Nov 10', value: 140, forecast: 141 },
        { name: 'Nov 12', value: 195, forecast: 194 },
        { name: 'Nov 14', value: 160, forecast: 162 },
        { name: 'Nov 16', value: 180, forecast: 178 },
        { name: 'Nov 18', value: 150, forecast: 153 },
        { name: 'Nov 20', value: 190, forecast: 190 },
        { name: 'Nov 22 (F)', value: null, forecast: 195 },
        { name: 'Nov 24 (F)', value: null, forecast: 200 },
        { name: 'Nov 26 (F)', value: null, forecast: 204 },
        { name: 'Nov 28 (F)', value: null, forecast: 209 },
        { name: 'Nov 30 (F)', value: null, forecast: 214 }
    ];

    // Storage growth trend data Oct 21 to Nov 20 + Forecast (GB)
    const storageGrowthHistoryData = [
        { name: 'Oct 21', value: 850, forecast: 850 },
        { name: 'Oct 23', value: 880, forecast: 882 },
        { name: 'Oct 25', value: 920, forecast: 918 },
        { name: 'Oct 27', value: 940, forecast: 941 },
        { name: 'Oct 29', value: 970, forecast: 969 },
        { name: 'Oct 31', value: 1020, forecast: 1022 },
        { name: 'Nov 2', value: 1060, forecast: 1058 },
        { name: 'Nov 4', value: 1110, forecast: 1110 },
        { name: 'Nov 6', value: 1150, forecast: 1152 },
        { name: 'Nov 8', value: 1220, forecast: 1218 },
        { name: 'Nov 10', value: 1260, forecast: 1262 },
        { name: 'Nov 12', value: 1320, forecast: 1319 },
        { name: 'Nov 14', value: 1360, forecast: 1362 },
        { name: 'Nov 16', value: 1410, forecast: 1408 },
        { name: 'Nov 18', value: 1490, forecast: 1493 },
        { name: 'Nov 20', value: 1620, forecast: 1620 },
        { name: 'Nov 22 (F)', value: null, forecast: 1660 },
        { name: 'Nov 24 (F)', value: null, forecast: 1710 },
        { name: 'Nov 26 (F)', value: null, forecast: 1750 },
        { name: 'Nov 28 (F)', value: null, forecast: 1790 },
        { name: 'Nov 30 (F)', value: null, forecast: 1840 }
    ];

    const currentTrendChartData = useMemo(() => {
        if (activeTrendTab === 'SPEND TREND') return spendTrendHistoryData;
        if (activeTrendTab === 'WAREHOUSE SPEND') return warehouseSpendHistoryData;
        if (activeTrendTab === 'DATA TRANSFER') return dataTransferHistoryData;
        return storageGrowthHistoryData;
    }, [activeTrendTab]);

    const handleRowClick = (itemName: string) => {
        if (activeSpendTab === 'WAREHOUSE') {
            const whMock: Warehouse = {
                id: `wh-${Math.random()}`,
                name: itemName,
                size: 'Medium',
                status: 'Active',
                avgUtilization: 45,
                peakUtilization: 80,
                cost: 1800,
                tokens: 1800,
                credits: 1800,
                queriesExecuted: 1420,
                lastActive: 'Just now',
                health: 'Optimized'
            };
            onSelectWarehouse(whMock);
        } else if (activeSpendTab === 'DATABASE') {
            onNavigate('Databases');
        } else {
            onNavigate('Queries overview');
        }
    };

    const integrationData = [
        {
            name: 'Slack',
            category: 'Communication',
            description: 'Receive real-time AI insights and system alerts in your Slack channels.',
            icon: Slack,
            colorClass: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50',
            hoverColor: 'hover:border-purple-300 dark:hover:border-purple-800'
        },
        {
            name: 'MS Teams',
            category: 'Communication',
            description: 'Collaborate on data reports and trigger automated workflows within Teams.',
            icon: MessageSquare,
            colorClass: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50',
            hoverColor: 'hover:border-purple-300 dark:hover:border-purple-800'
        },
        {
            name: 'Jira',
            category: 'Project Management',
            description: "Automatically create Jira tickets from 'Enforcement Desk' violations.",
            icon: Layers,
            colorClass: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
            hoverColor: 'hover:border-purple-300 dark:hover:border-purple-800'
        },
        {
            name: 'Azure Service Bus',
            category: 'Messaging',
            description: 'Connect your Azure messaging queue to ingest enterprise data streams.',
            icon: Network,
            colorClass: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
            hoverColor: 'hover:border-purple-300 dark:hover:border-purple-800'
        },
        {
            name: 'GitHub',
            category: 'DevOps',
            description: 'Sync queries, automate code-based workflows, and enhance collaboration.',
            icon: Github,
            colorClass: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
            hoverColor: 'hover:border-purple-300 dark:hover:border-purple-800'
        }
    ];

    const toggleIntegration = (name: string) => {
        setConnectedIntegrations(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    // --- Dynamic calculations derived from Snowflake filters ---
    const dynamicCreditsUsed = useMemo(() => {
        let base = 94.1;
        if (selectedUsageType === 'All') base = 134.9;
        else if (selectedUsageType === 'Storage') base = 28.3;
        else if (selectedUsageType === 'Data Transfer') base = 12.5;

        // Factor for date range
        let dateFactor = 1.0;
        if (selectedDate === 'Last 6 months') dateFactor = 0.58;
        else if (selectedDate === 'Last 30 days') dateFactor = 0.09;
        else if (selectedDate === 'Last 7 days') dateFactor = 0.025;

        let total = base * dateFactor;

        // If specific resource selected, restrict to its share
        if (selectedResource !== 'All Resources') {
            if (selectedResource.includes('ANAVSAN_WH')) total = total * 0.51;
            else if (selectedResource.includes('COMPUTE_WH')) total = total * 0.24;
            else if (selectedResource.includes('CORTEX_CODE_SNOWSIGHT')) total = total * 0.15;
            else if (selectedResource.includes('AI_OBSERVABILITY_EVENTS')) total = total * 0.08;
            else total = total * 0.05;
        } else if (selectedServiceType !== 'All') {
            // Reduce if specific service chosen
            if (selectedServiceType.includes('AI') || selectedServiceType.includes('Cortex')) total = total * 0.18;
            else if (selectedServiceType.includes('Cluster')) total = total * 0.11;
            else total = total * 0.08;
        }

        return parseFloat(total.toFixed(1));
    }, [selectedUsageType, selectedDate, selectedResource, selectedServiceType]);

    const creditValVal = useMemo(() => {
        return Math.round(dynamicCreditsUsed * 1000);
    }, [dynamicCreditsUsed]);

    const costValVal = useMemo(() => {
        return creditValVal * 3;
    }, [creditValVal]);

    const avgMonthlyCredits = useMemo(() => {
        return parseFloat((creditValVal / 12).toFixed(1));
    }, [creditValVal]);

    const avgMonthlyCost = useMemo(() => {
        return Math.round(avgMonthlyCredits * 3);
    }, [avgMonthlyCredits]);

    const dynamicSummaryText = useMemo(() => {
        if (selectedUsageType === 'All') {
            return isCost ? `$234.35 USD Spent` : `78.1 credits used`;
        } else if (selectedUsageType === 'Storage') {
            if (selectedObject !== 'All Objects') {
                return `1.6 GB data stored`;
            }
            return `3.2 GB data stored`;
        } else if (selectedUsageType === 'Data Transfer') {
            if (selectedRegion !== 'All Regions') {
                return `2.4 MB data transferred`;
            }
            return `3.1 MB data transferred`;
        } else {
            // Compute
            let val = dynamicCreditsUsed;
            return isCost ? `$${Math.round(val * 3).toLocaleString()} USD Spent` : `${val} credits used`;
        }
    }, [selectedUsageType, selectedObject, selectedRegion, dynamicCreditsUsed, isCost]);

    const activeWarehouseCount = useMemo(() => {
        if (selectedResource !== 'All Resources') {
            return selectedResource.includes('_WH') ? 1 : 0;
        }
        if (selectedServiceType !== 'All') {
            if (selectedServiceType === 'Warehouse') return 4;
            if (selectedServiceType.includes('AI')) return 2;
            return 1;
        }
        return 12;
    }, [selectedResource, selectedServiceType]);

    // Active resource dots legend matching Snowflake interface
    const activeResourceDots = useMemo(() => {
        if (selectedUsageType === 'All') {
            return [];
        }
        if (selectedUsageType === 'Storage') {
            const list = [
                { name: 'DBT_ANALYTICS_TPCDS', color: '#EF4444', type: 'Storage' },
                { name: 'DBT_ANALYTICS_TPCH', color: '#10B981', type: 'Storage' },
                { name: 'SNOWFLAKE', color: '#8B5CF6', type: 'Storage' },
                { name: 'Stages', color: '#F97316', type: 'Storage' },
                { name: 'USER$MANJU', color: '#0EA5E9', type: 'Storage' },
            ];
            if (selectedObject !== 'All Objects') {
                return list.filter(obj => obj.name === selectedObject);
            }
            return list;
        }
        if (selectedUsageType === 'Data Transfer') {
            const list = [
                { name: 'us-east-1', color: '#10B981', type: 'Region' }
            ];
            if (selectedRegion !== 'All Regions') {
                return list.filter(reg => reg.name === selectedRegion);
            }
            return list;
        }

        // Compute Usage Type
        return RESOURCES_LIST.filter(res => {
            if (res.name === 'All Resources') return false;
            // If specific resource selected, show only that one
            if (selectedResource !== 'All Resources') {
                return res.name === selectedResource;
            }
            // If specific service selected:
            if (selectedServiceType !== 'All') {
                if (selectedServiceType === 'Warehouse') return res.type === 'Warehouse';
                if (selectedServiceType.includes('AI') || selectedServiceType.includes('Cortex')) return res.type.includes('AI') || res.type.includes('Cortex');
                return true;
            }
            return true;
        });
    }, [selectedUsageType, selectedObject, selectedRegion, selectedResource, selectedServiceType]);

    // Filtered lists inside search boxes
    const filteredServiceTypes = useMemo(() => {
        return SERVICE_TYPES.filter(item => item.toLowerCase().includes(serviceSearch.toLowerCase()));
    }, [serviceSearch]);

    const filteredResourcesList = useMemo(() => {
        return RESOURCES_LIST.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(resourceSearch.toLowerCase());
            if (selectedUsageType === 'Compute') {
                return (item.type === 'Warehouse' || item.type === 'All') && matchesSearch;
            }
            return matchesSearch;
        });
    }, [resourceSearch, selectedUsageType]);

    const filteredObjectsList = useMemo(() => {
        return OBJECTS_LIST.filter(item => item.toLowerCase().includes(objectSearch.toLowerCase()));
    }, [objectSearch]);

    const filteredRegionsList = useMemo(() => {
        return REGIONS_LIST.filter(item => item.toLowerCase().includes(regionSearch.toLowerCase()));
    }, [regionSearch]);

    return (
        <div className="space-y-6 pb-12 w-full max-w-[1440px] mx-auto z-0 relative px-1 md:px-2">
            
            {/* --- PAGE SCREEN HEADING --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1 select-none">
                <div>
                    <h1 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {activePageTab === 'Account overview' ? 'Account overview' : 'Consumption'}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1.5 font-sans">
                        {activePageTab === 'Account overview' 
                            ? 'Executive-level summary of alerts, optimization metrics and database aggregates.' 
                            : 'Monitor and analyze Snowflake account credits, storage and data transfer'
                        }
                    </p>
                </div>
            </div>

            {/* 1. SNOWFLAKE DYNAMIC FILTER BAR - NOW UNGROUPED & HORIZONTAL */}
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-40 select-none w-full mb-1">
                
                {/* Standalone Filter Cards / Horizontal Row */}
                <div className="flex flex-wrap items-center gap-3">
                    
                    {/* 1.1 DATE SELECTOR */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
                            className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors text-xs font-bold text-slate-700 dark:text-slate-350 shadow-sm"
                        >
                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{selectedDate}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        </button>
                        
                        {activeDropdown === 'date' && (
                            <>
                                <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {DATE_PERIODS.map((col) => (
                                        <button
                                            key={col}
                                            onClick={() => handleFilterChange(setSelectedDate, col)}
                                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                        >
                                            <span>{col}</span>
                                            {selectedDate === col && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 1.3 TAGS SELECTOR */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'tag' ? null : 'tag')}
                            className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors text-xs font-bold text-slate-700 dark:text-slate-350 shadow-sm"
                        >
                            <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{selectedTag === 'All Tags' ? 'All Tags' : selectedTag}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        
                        {activeDropdown === 'tag' && (
                            <>
                                <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {TAG_LIST.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleFilterChange(setSelectedTag, tag)}
                                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                        >
                                            <span>{tag}</span>
                                            {selectedTag === tag && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 1.4 USAGE TYPE SELECTOR */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'usage' ? null : 'usage')}
                            className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-350 shadow-sm"
                        >
                            <span className="text-slate-400 dark:text-slate-500 font-semibold">Usage Type:</span>
                            <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8]">{selectedUsageType}</span>
                            <ChevronDown className="w-3 h-3 text-slate-405" />
                        </button>
                        
                        {activeDropdown === 'usage' && (
                            <>
                                <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-[#2D3748] rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-150">
                                    {USAGE_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleUsageTypeChange(type)}
                                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                        >
                                            <span>{type}</span>
                                            {selectedUsageType === type && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 1.5 SERVICE TYPE SELECTOR (ONLY IN COMPUTE MODE) */}
                    {selectedUsageType === 'Compute' && (
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setActiveDropdown(activeDropdown === 'service' ? null : 'service');
                                    setServiceSearch('');
                                }}
                                className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-350 shadow-sm"
                            >
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Service Type:</span>
                                <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8]">{selectedServiceType}</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            
                            {activeDropdown === 'service' && (
                                <>
                                    <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col max-h-[290px] overflow-hidden animate-in fade-in duration-150">
                                        {/* Search Filter input box */}
                                        <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 bg-white dark:bg-[#1F2937]">
                                            <div className="relative flex items-center">
                                                <Search className="w-3.5 h-3.5 text-slate-405 absolute left-2.5" />
                                                <input 
                                                    type="text"
                                                    className="w-full pl-8 pr-6 py-1 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#5829D6]"
                                                    placeholder="Search service..."
                                                    value={serviceSearch}
                                                    onChange={(e) => setServiceSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                />
                                                {serviceSearch && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setServiceSearch(''); }}
                                                        className="absolute right-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Service options list */}
                                        <div className="overflow-y-auto py-1 flex-grow">
                                            {filteredServiceTypes.length > 0 ? (
                                                filteredServiceTypes.map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => handleFilterChange(setSelectedServiceType, item)}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span>{item}</span>
                                                        {selectedServiceType === item && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-xs font-bold text-slate-400">No Services found</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* 1.5.S STORAGE: OBJECTS SELECTOR (ONLY IN STORAGE MODE) */}
                    {selectedUsageType === 'Storage' && (
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setActiveDropdown(activeDropdown === 'object' ? null : 'object');
                                    setObjectSearch('');
                                }}
                                className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-350 shadow-sm"
                            >
                                <Database className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Object:</span>
                                <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8] truncate max-w-[130px]">{selectedObject}</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            
                            {activeDropdown === 'object' && (
                                <>
                                    <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col max-h-[290px] overflow-hidden animate-in fade-in duration-150 font-sans">
                                        {/* Search Filter input box */}
                                        <div className="p-2 border-b border-slate-105 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#1F2937]">
                                            <div className="relative flex items-center">
                                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                                                <input 
                                                    type="text"
                                                    className="w-full pl-8 pr-6 py-1 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-850 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#5829D6]"
                                                    placeholder="Search object..."
                                                    value={objectSearch}
                                                    onChange={(e) => setObjectSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                />
                                                {objectSearch && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setObjectSearch(''); }}
                                                        className="absolute right-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Options list */}
                                        <div className="overflow-y-auto py-1 flex-grow">
                                            {filteredObjectsList.length > 0 ? (
                                                filteredObjectsList.map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => handleFilterChange(setSelectedObject, item)}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Database className="w-3 h-3 text-slate-400" />
                                                            <span>{item}</span>
                                                        </div>
                                                        {selectedObject === item && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-xs font-bold text-slate-400">No objects found</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* 1.5.D DATA TRANSFER: REGIONS SELECTOR (ONLY IN DATA TRANSFER MODE) */}
                    {selectedUsageType === 'Data Transfer' && (
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setActiveDropdown(activeDropdown === 'region' ? null : 'region');
                                    setRegionSearch('');
                                }}
                                className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors text-xs text-slate-702 dark:text-slate-350 shadow-sm"
                            >
                                <Cloud className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Region:</span>
                                <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8] truncate max-w-[130px]">{selectedRegion}</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            
                            {activeDropdown === 'region' && (
                                <>
                                    <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col max-h-[290px] overflow-hidden animate-in fade-in duration-150 font-sans">
                                        {/* Search Filter input box */}
                                        <div className="p-2 border-b border-slate-105 dark:border-slate-800/80 sticky top-0 bg-white dark:bg-[#1F2937]">
                                            <div className="relative flex items-center">
                                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                                                <input 
                                                    type="text"
                                                    className="w-full pl-8 pr-6 py-1 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#2D3748] rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#5829D6]"
                                                    placeholder="Search region..."
                                                    value={regionSearch}
                                                    onChange={(e) => setRegionSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                />
                                                {regionSearch && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setRegionSearch(''); }}
                                                        className="absolute right-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Options list */}
                                        <div className="overflow-y-auto py-1 flex-grow">
                                            {filteredRegionsList.length > 0 ? (
                                                filteredRegionsList.map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => handleFilterChange(setSelectedRegion, item)}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Cloud className="w-3.5 h-3.5 text-slate-405" />
                                                            <span>{item}</span>
                                                        </div>
                                                        {selectedRegion === item && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-xs font-bold text-slate-400">No regions found</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* RESOURCES DROPDOWN FILTER CHIP (ONLY IN COMPUTE MODE) */}
                    {selectedUsageType === 'Compute' && (
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setActiveDropdown(activeDropdown === 'resource' ? null : 'resource');
                                    setResourceSearch('');
                                }}
                                className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] px-4 py-2 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors text-xs text-slate-707 dark:text-slate-350 shadow-sm"
                            >
                                <span className="text-slate-400 dark:text-slate-550 font-semibold mt-0.5">Resource:</span>
                                <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8] truncate max-w-[150px]">{selectedResource}</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            
                            {activeDropdown === 'resource' && (
                                <>
                                    <div className="fixed inset-0 z-45" onClick={() => setActiveDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col max-h-[300px] overflow-hidden animate-in fade-in duration-150">
                                        {/* Search Filter input box */}
                                        <div className="p-2 border-b border-slate-105 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#1F2937]">
                                            <div className="relative flex items-center">
                                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                                                <input 
                                                    type="text"
                                                    className="w-full pl-8 pr-6 py-1 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#5829D6]"
                                                    placeholder="Search Snowflake resources..."
                                                    value={resourceSearch}
                                                    onChange={(e) => setResourceSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                />
                                                {resourceSearch && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setResourceSearch(''); }}
                                                        className="absolute right-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Resource options list with customized type icon badges */}
                                        <div className="overflow-y-auto py-1 flex-grow">
                                            {filteredResourcesList.length > 0 ? (
                                                filteredResourcesList.map((item) => {
                                                    const isSelected = selectedResource === item.name;
                                                    return (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => handleFilterChange(setSelectedResource, item.name)}
                                                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer group"
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                                
                                                                {/* Dynamic Type Badge */}
                                                                {item.type === 'Warehouse' && <Server className="w-3 h-3 text-slate-400 group-hover:text-amber-500 flex-shrink-0" />}
                                                                {item.type === 'Table' && <Table className="w-3 h-3 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />}
                                                                {item.type.includes('AI') && <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                                                                {item.type === 'Services' && <Cloud className="w-3 h-3 text-sky-400 flex-shrink-0" />}
                                                                {item.type === 'All' && <Boxes className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                                                                
                                                                <span className="truncate">{item.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md font-extrabold uppercase scale-90">{item.type}</span>
                                                                {isSelected && <Check className="w-3.5 h-3.5 text-[#5829D6] flex-shrink-0" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-4 text-xs font-bold text-slate-400">No Resource found</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                </div>

                {/* Right utility: Refresh trigger */}
                <div>
                    <button 
                        onClick={handleRefresh}
                        className="bg-white hover:bg-slate-50 dark:bg-[#1F2937] dark:hover:bg-[#253041] p-2.5 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250 transition-all cursor-pointer shadow-sm flex items-center justify-center h-[38px] w-[38px]"
                        title="Reload Snowflake stats"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSimulatingFetch ? 'animate-spin text-[#5829D6]' : ''}`} />
                    </button>
                </div>

            </div>

            {/* OPTIMIZATION SUMMARY BANNER/WIDGET (Account level) */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-[24px] shadow-sm flex flex-col w-full mb-5 overflow-hidden font-sans select-none">
                {/* 3 columns layout with thin vertical boundaries */}
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-150 dark:divide-slate-800 bg-transparent">
                    {/* Column 1: TOTAL SPEND */}
                    <div className="flex justify-between items-center p-5 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-250 group text-left w-full cursor-pointer relative">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">
                                    TOTAL SPEND OF THE SNOWFLAKE ORG
                                </span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-[#111827] dark:text-slate-100 tracking-tight leading-none font-sans">
                                    {optimizationData.totalSpend}
                                </span>
                                <p className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                                    Year-to-date cumulative organization spend
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: AVERAGE MONTHLY SPEND */}
                    <div className="flex justify-between items-center p-5 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-250 group text-left w-full cursor-pointer relative">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">
                                    AVERAGE MONTHLY SPEND
                                </span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-[#111827] dark:text-slate-100 tracking-tight leading-none font-sans">
                                    {optimizationData.avgMonthly}
                                </span>
                                <p className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                                    Rolling average monthly standard cost pool
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: TOTAL EST SAVINGS & RECS */}
                    <div className="flex justify-between items-center p-5 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-250 group text-left w-full cursor-pointer relative overflow-hidden">
                        <div className="flex flex-col h-full justify-between w-full">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-[#8E8EA8] dark:text-[#9A9AB2] tracking-wider uppercase">
                                    TOTAL EST. SAVINGS & RECS
                                </span>
                                <span className="px-1.5 py-0.5 text-[8px] font-black tracking-wider rounded-md uppercase bg-purple-50 text-[#5829D6] dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 scale-90 origin-left">
                                    {optimizationData.recsCount} RECS
                                </span>
                            </div>
                            <div className="flex items-center justify-between w-full mt-0.5">
                                <div>
                                    <span className="text-xl font-bold text-[#6366F1] dark:text-[#A78BFA] tracking-tight leading-none font-sans">
                                        {optimizationData.savings}
                                    </span>
                                    <p className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                                        Potential financial adjustments
                                    </p>
                                </div>

                                <button
                                    onClick={() => onNavigate('Enforcement Desk')}
                                    className="px-2.5 py-1.5 bg-[#5829D6] hover:bg-[#4d21cf] text-white text-[9.5px] font-black tracking-wider uppercase rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1 select-none"
                                >
                                    <span>View Desk</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                        <div className="absolute right-1 top-2 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none pr-1">
                            <Sparkles className="w-5 h-5 text-purple-450 dark:text-purple-500 animate-pulse" />
                        </div>
                    </div>
            </div>
        </div>

        {/* SPEND TRENDS HERO SECTION WIDGET (For Account Overview page) */}
        {activePageTab === 'Account overview' && (
            <div id="spend-trends-hero-card" className="bg-white dark:bg-[#1F2937] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col mb-5 select-none font-sans">
                {/* Header Row */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <span>Spend Trends</span>
                            <InfoTooltip text="Runtimes, query frequencies, storage logs, and egress data analyzed weekly with active ML prediction models." />
                        </h2>
                        <span className="bg-purple-100 dark:bg-purple-950/45 text-[#5829D6] dark:text-purple-300 font-extrabold uppercase rounded px-2.5 py-0.5 tracking-wider text-[9.5px] border border-purple-200/40 dark:border-purple-900/40 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                            <span>Forecast Active</span>
                        </span>
                    </div>

                    {/* Tab controls capsule selector */}
                    <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                        {/* Tab options matching user UI */}
                        {(['SPEND TREND', 'WAREHOUSE SPEND', 'DATA TRANSFER', 'STORAGE GROWTH'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTrendTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                    activeTrendTab === tab
                                        ? 'bg-[#5829D6] text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/65 dark:hover:bg-slate-800/40'
                                }`}
                            >
                                {tab === 'SPEND TREND' ? 'spend trend' : tab.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart and detailed breakdown split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Recharts Area / Line trends chart (Left, span 7) */}
                    <div id="spend-trend-graph-parent" className="lg:col-span-7 flex flex-col pr-1 h-[270px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                                data={currentTrendChartData}
                                margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="spendTrendGradientOverview" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5829D6" stopOpacity={0.22} />
                                        <stop offset="100%" stopColor="#5829D6" stopOpacity={0.00} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid 
                                    strokeDasharray="4 4" 
                                    vertical={false} 
                                    stroke="#CBD5E1" 
                                    opacity={0.3} 
                                />
                                <XAxis 
                                    dataKey="name" 
                                    strokeWidth={0}
                                    fontSize={9}
                                    fontFamily="monospace"
                                    tickLine={false}
                                    dy={5}
                                    tickFormatter={(val) => val.replace(' (F)', '')}
                                    className="text-slate-400 dark:text-slate-500 font-bold"
                                />
                                <YAxis 
                                    strokeWidth={0}
                                    fontSize={9}
                                    fontFamily="monospace"
                                    tickLine={false}
                                    dx={-5}
                                    tickFormatter={(val) => {
                                        if (activeTrendTab === 'STORAGE GROWTH' || activeTrendTab === 'DATA TRANSFER') {
                                            return `${val}G`;
                                        }
                                        return isCost ? `$${Math.round(val * 3).toLocaleString()}` : val.toLocaleString();
                                    }}
                                    className="text-slate-400 dark:text-slate-500 font-bold"
                                />
                                <Tooltip 
                                    content={<SpendTrendsCustomTooltip activeTrendTab={activeTrendTab} displayMode={displayMode} />} 
                                />
                                
                                {/* Ground Area actual history curve */}
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#5829D6" 
                                    strokeWidth={3} 
                                    fill="url(#spendTrendGradientOverview)" 
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#5829D6', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                                    connectNulls={false}
                                />

                                {/* Dotted projection model forecast curve */}
                                <Area 
                                    type="monotone" 
                                    dataKey="forecast" 
                                    stroke="#5829D6" 
                                    strokeWidth={2} 
                                    strokeDasharray="4 4" 
                                    fill="none" 
                                    dot={false}
                                    activeDot={false}
                                    connectNulls={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detailed allocation list element (Right, col span 5) */}
                    <div id="trend-allocation-side-panel" className="lg:col-span-5 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/60 lg:pl-8 pt-6 lg:pt-0 justify-between">
                        <div>
                            <span className="text-[10px] font-black tracking-widest text-[#8E8EA8] dark:text-slate-500 uppercase mb-5 block leading-none select-none">
                                Spend Allocation Breakdown
                            </span>

                            {/* Breakdown row elements */}
                            <div className="space-y-4">
                                {/* Compute Row */}
                                <div className="flex items-center justify-between border-b border-rose-50/10 dark:border-slate-800/40 pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[12.5px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                            {activeTrendTab === 'SPEND TREND' ? 'Compute Warehouse Spend' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'Batch Processing Jobs' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'Sync Pipe Execution' : 'Table Standard Logs'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 tracking-wider uppercase mt-1">
                                            {activeTrendTab === 'SPEND TREND' ? 'QUERY PROCESSING AND INTERACTIVE JOBS' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'CORE BATCH RUNTIME AND REPORTING' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'INTER-REGION SYNC OVERHEADS' : 'STAGED COLD CACHE BUFFER'}
                                        </span>
                                    </div>
                                    <span className="text-[14px] font-extrabold text-[#5829D6] dark:text-[#A78BFA] font-sans">
                                        {activeTrendTab === 'SPEND TREND' ? '80%' :
                                         activeTrendTab === 'WAREHOUSE SPEND' ? '85%' :
                                         activeTrendTab === 'DATA TRANSFER' ? '50%' : '10%'}
                                    </span>
                                </div>

                                {/* Storage Row */}
                                <div className="flex items-center justify-between border-b border-rose-50/10 dark:border-slate-800/40 pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[12.5px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                            {activeTrendTab === 'SPEND TREND' ? 'Storage Service Cost' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'Metadata Service Cost' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'Overhead Store Buffer' : 'Table Volume Storage'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 tracking-wider uppercase mt-1">
                                            {activeTrendTab === 'SPEND TREND' ? 'DATABASE REPLICATION AND S3 SYNC TIMES' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'METADATA OPERATIONS CACHE' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'REPLICATED DATA STORE BUFFER' : 'DATABASE VOLUMES TABLE STORAGE'}
                                        </span>
                                    </div>
                                    <span className="text-[14px] font-extrabold text-[#5829D6] dark:text-[#A78BFA] font-sans">
                                        {activeTrendTab === 'SPEND TREND' ? '15%' :
                                         activeTrendTab === 'WAREHOUSE SPEND' ? '10%' :
                                         activeTrendTab === 'DATA TRANSFER' ? '30%' : '75%'}
                                    </span>
                                </div>

                                {/* Cloud Services row */}
                                <div className="flex items-center justify-between border-b border-rose-50/10 dark:border-slate-800/40 pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[12.5px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                            {activeTrendTab === 'SPEND TREND' ? 'Cloud Services Credit' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'Security Services Credit' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'Bandwidth Control plane' : 'Fail-Safe Protection'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 tracking-wider uppercase mt-1">
                                            {activeTrendTab === 'SPEND TREND' ? 'AUTHENTICATION, COMPILATION, METADATA' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'SECURITY AND IAM WORKFLOWS' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'NETWORK BANDWIDTH CONTROL PLANE' : 'FAIL-SAFE AND RECORD HISTORY'}
                                        </span>
                                    </div>
                                    <span className="text-[14px] font-extrabold text-[#5829D6] dark:text-[#A78BFA] font-sans">
                                        {activeTrendTab === 'SPEND TREND' ? '5%' :
                                         activeTrendTab === 'WAREHOUSE SPEND' ? '5%' :
                                         activeTrendTab === 'DATA TRANSFER' ? '20%' : '15%'}
                                    </span>
                                </div>

                                {/* Peak Spending row */}
                                <div className="flex items-center justify-between border-b border-rose-50/10 dark:border-slate-800/40 pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[12.5px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                            {activeTrendTab === 'STORAGE GROWTH' ? 'Peak Storage size' : 'Peak Spending Day'}
                                        </span>
                                        <span className="text-[9px] font-bold text-rose-550 dark:text-rose-450 tracking-wider uppercase mt-1">
                                            {activeTrendTab === 'SPEND TREND' ? 'NOV 12 - PIPELINE CRASH AND AUTO RESTART' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'OCT 31 - ETL BACKFILL JOBS TRIGGERED' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'NOV 12 - DATA REPLICATOR RESYNC OVERHEAD' : 'NOV 30 - HIGHEST RECORDED STORAGE SIZE'}
                                        </span>
                                    </div>
                                    <span className="text-[14px] font-black text-slate-900 dark:text-white font-mono">
                                        {activeTrendTab === 'SPEND TREND' ? (isCost ? '$5,220' : '1,740 cr') :
                                         activeTrendTab === 'WAREHOUSE SPEND' ? (isCost ? '$4,140' : '1,380 cr') :
                                         activeTrendTab === 'DATA TRANSFER' ? '195 GB' : '1,840 GB'}
                                    </span>
                                </div>

                                {/* Average historical row */}
                                <div className="flex items-center justify-between last:border-b-0 pb-1">
                                    <div className="flex flex-col">
                                        <span className="text-[12.5px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                            {activeTrendTab === 'STORAGE GROWTH' ? 'Average Storage size' : 'Average Historical Spend'}
                                        </span>
                                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 tracking-wider uppercase mt-1">
                                            {activeTrendTab === 'SPEND TREND' ? 'STEADY PRODUCTION WORKLOADS METRIC' :
                                             activeTrendTab === 'WAREHOUSE SPEND' ? 'SYSTEM STANDARD AVERAGE LIMIT' :
                                             activeTrendTab === 'DATA TRANSFER' ? 'DAILY TRANSFER METRIC EXPECTED' : 'HISTORICAL DATABASE GROWTH TREND'}
                                        </span>
                                    </div>
                                    <span className="text-[14px] font-black text-slate-900 dark:text-white font-mono">
                                        {activeTrendTab === 'SPEND TREND' ? (isCost ? '$2,850' : '950 cr') :
                                         activeTrendTab === 'WAREHOUSE SPEND' ? (isCost ? '$2,400' : '800 cr') :
                                         activeTrendTab === 'DATA TRANSFER' ? '160 GB' : '1,250 GB'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summation Row */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-6 h-9">
                            <span className="text-[10px] font-black tracking-wider text-[#8E8EA8] dark:text-slate-500 uppercase">
                                {activeTrendTab === 'SPEND TREND' || activeTrendTab === 'WAREHOUSE SPEND' ? 'Total Period Spend:' :
                                 activeTrendTab === 'DATA TRANSFER' ? 'Total Transferred:' : 'Total Combined Size:'}
                            </span>
                            <span className="text-[15px] font-black text-slate-900 dark:text-white uppercase font-sans">
                                {activeTrendTab === 'SPEND TREND' ? (isCost ? '$144,294' : '48,098 cr') :
                                 activeTrendTab === 'WAREHOUSE SPEND' ? (isCost ? '$115,200' : '38,400 cr') :
                                 activeTrendTab === 'DATA TRANSFER' ? '5,420 GB' : '2,880 GB'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}

            {/* TOP SPEND BY CATEGORY WIDGET (For Account Overview page) */}
            {activePageTab === 'Account overview' && (
                <div id="top-spend-by-category-card" className="bg-white dark:bg-[#1F2937] p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col mb-5 select-none font-sans">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
                        <div>
                            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                Top Spend by Category
                            </h2>
                            <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">
                                Resource consumption and credit metrics across system categories
                            </p>
                        </div>
                        
                        {/* Custom visual tab capsule */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
                            {(['WAREHOUSE', 'QUERY PATTERN', 'DATABASE', 'TAGS', 'USERS'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveSpendTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activeSpendTab === tab
                                            ? 'bg-[#5829D6] text-white shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/65 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    {tab === 'QUERY PATTERN' ? 'Query Pattern' : tab.toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart & Table columns split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Horizontal Bar Chart of Top 5 */}
                        <div id="horizontal-bar-graph-panel" className="lg:col-span-5 flex flex-col relative py-4 pr-2 pl-4">
                            {/* Faint dotted coordinate guidelines in background */}
                            <div className="absolute inset-0 left-28 right-0 flex justify-between pointer-events-none select-none z-0">
                                <div className="h-[200px] border-r border-dashed border-slate-100 dark:border-slate-850/50" />
                                <div className="h-[200px] border-r border-dashed border-slate-100 dark:border-slate-850/50" />
                                <div className="h-[200px] border-r border-dashed border-slate-100 dark:border-slate-850/50" />
                                <div className="h-[200px] border-r border-dashed border-slate-100 dark:border-slate-850/50" />
                                <div className="h-[200px] border-r border-dashed border-slate-100 dark:border-slate-850/50" />
                            </div>

                            {/* Outer container list of items */}
                            <div className="space-y-6 relative z-10">
                                {activeSpendData.items.map((item, index) => {
                                    // Calculate responsive width percentage
                                    const maxVal = Math.max(...activeSpendData.items.map(i => i.credits));
                                    const barWidthPercentage = `${(item.credits / maxVal) * 105}%`; // scaled slightly for visuals
                                    
                                    // Rank-specific sequential color schemes matching the purple gradient scale
                                    const fillColors = [
                                        'bg-[#5829D6] dark:bg-[#7C3AED]',
                                        'bg-[#7C3AED] dark:bg-[#8B5CF6]',
                                        'bg-[#9333EA] dark:bg-[#A78BFA]',
                                        'bg-[#A855F7] dark:bg-[#C084FC]',
                                        'bg-[#C084FC] dark:bg-[#DDD6FE]'
                                    ];

                                    return (
                                        <div key={item.name} className="flex items-center w-full">
                                            {/* Item Label (Left, right-aligned) */}
                                            <div className="w-28 text-right pr-4 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate select-none" title={item.name}>
                                                {item.name}
                                            </div>
                                            
                                            {/* Bar capsule */}
                                            <div className="flex-1 h-3.5 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center shadow-inner relative">
                                                <div 
                                                    className={`h-full ${fillColors[index] || fillColors[fillColors.length - 1]} rounded-full transition-all duration-500 ease-out`} 
                                                    style={{ width: barWidthPercentage }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* X-Axis labels at the bottom */}
                            <div className="flex justify-between items-center mt-4 pl-28 text-[9px] font-mono text-slate-400 dark:text-slate-500 select-none">
                                {activeSpendTab === 'WAREHOUSE' && (
                                    <>
                                        <span>0</span>
                                        <span>950</span>
                                        <span>1.9K</span>
                                        <span>2.9K</span>
                                        <span>3.8K</span>
                                    </>
                                )}
                                {activeSpendTab === 'QUERY PATTERN' && (
                                    <>
                                        <span>0</span>
                                        <span>1.0K</span>
                                        <span>2.1K</span>
                                        <span>3.1K</span>
                                        <span>4.2K</span>
                                    </>
                                )}
                                {activeSpendTab === 'DATABASE' && (
                                    <>
                                        <span>0</span>
                                        <span>1.2K</span>
                                        <span>2.5K</span>
                                        <span>3.8K</span>
                                        <span>5.1K</span>
                                    </>
                                )}
                                {activeSpendTab === 'TAGS' && (
                                    <>
                                        <span>0</span>
                                        <span>1.2K</span>
                                        <span>2.4K</span>
                                        <span>3.6K</span>
                                        <span>4.8K</span>
                                    </>
                                )}
                                {activeSpendTab === 'USERS' && (
                                    <>
                                        <span>0</span>
                                        <span>1.1K</span>
                                        <span>2.3K</span>
                                        <span>3.4K</span>
                                        <span>4.6K</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Detailed allocation table */}
                        <div id="allocation-details-table" className="lg:col-span-7 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/60 lg:pl-8 pt-6 lg:pt-0">
                            <span className="text-[10px] font-black tracking-widest text-[#8E8EA8] dark:text-slate-550 uppercase mb-4 block leading-none">
                                Detailed Allocation (Top 5)
                            </span>

                            {/* List layout of the 5 detailed rankings */}
                            <div className="space-y-3.5 flex-grow">
                                {activeSpendData.items.map((item) => (
                                    <div 
                                        key={item.name} 
                                        className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-3 last:border-b-0"
                                    >
                                        <div className="flex flex-col">
                                            <span 
                                                onClick={() => handleRowClick(item.name)}
                                                className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight hover:text-[#5829D6] dark:hover:text-[#A78BFA] cursor-pointer transition-colors"
                                            >
                                                {item.name}
                                            </span>
                                            <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                                                {item.rank}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="flex flex-col text-right">
                                                <span className="text-[12px] font-black text-slate-850 dark:text-slate-55 flex items-baseline gap-0.5 justify-end">
                                                    {item.credits.toLocaleString()} <span className="text-[10px] font-bold text-slate-450">cr</span>
                                                </span>
                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    {item.percentage}%
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleRowClick(item.name)}
                                                className="text-[9.5px] font-black text-[#5829D6] dark:text-[#A78BFA] hover:text-[#4d21cf] dark:hover:text-purple-300 cursor-pointer bg-slate-50 dark:bg-slate-900/60 hover:bg-[#5829D6]/10 px-3 py-1.5 rounded-lg border border-slate-150 dark:border-slate-800 transition-colors uppercase tracking-wider select-none shrink-0"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Bottom Row Summary */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 h-9">
                                <span className="text-[10px] font-black tracking-wider text-slate-450 dark:text-slate-550 uppercase">
                                    Total category spend shown:
                                </span>
                                <span className="text-[14px] font-black text-slate-900 dark:text-white uppercase font-sans">
                                    {activeSpendData.totalShown}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* DYNAMIC COST AND CONSUMPTION ANALYSIS DASHBOARD WIDGETS */}
            {activePageTab === 'Consumption' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {/* 1. COST SUMMARY */}
                    <div className="bg-white dark:bg-[#1f2937] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[145px] hover:shadow-sm transition-all duration-200">
                        <div>
                            <span className="text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-2">
                                Cost summary
                            </span>
                            <div className="flex items-center gap-2.5 mt-2.5">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-sans tracking-tight">
                                    25.2
                                </span>
                                <span className="text-[9.5px] font-black tracking-wider uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200/40 dark:border-slate-700/50">
                                    No prior data
                                </span>
                            </div>
                        </div>
                        <div className="text-[11px] font-bold text-slate-440 dark:text-slate-500 mt-4 font-mono">
                            MTD · Avg. 0.9 credits/day
                        </div>
                    </div>

                    {/* 2. MONTHLY BUDGET UTILIZATION */}
                    <div className="bg-white dark:bg-[#1f2937] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[145px] hover:shadow-sm transition-all duration-200">
                        <div>
                            <span className="text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-2">
                                Monthly budget utilization
                            </span>
                            
                            {!budgetActivated ? (
                                <div className="flex flex-col items-center justify-center py-1.5">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">
                                        No budget set
                                    </span>
                                    <button
                                        onClick={() => setBudgetActivated(true)}
                                        className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 px-3.5 py-1 rounded-xl border border-slate-200 dark:border-slate-750 text-[10.5px] font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-xs cursor-pointer select-none"
                                    >
                                        Activate budget
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col py-1">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs font-extrabold text-slate-850 dark:text-white">84% used</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">25.2 / {budgetLimit}.0 credits</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full animate-pulse" style={{ width: '84%' }} />
                                    </div>
                                    <button 
                                        onClick={() => setBudgetActivated(false)}
                                        className="text-[9.5px] font-bold text-rose-500 hover:text-rose-600 underline text-left cursor-pointer"
                                    >
                                        Deactivate budget
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={() => {
                                setAiTipMessage(
                                    aiTipMessage === "budget" 
                                    ? null 
                                    : "Snowflake Budgets monitor credit spend across the account. You can create account-level budgets, or customize specific resource budgets using SQL triggers."
                                );
                            }}
                            className={`w-fit mt-1.5 flex items-center gap-1.5 px-2.5 py-1 text-[9.5px] font-extrabold tracking-wider rounded-lg border cursor-pointer transition-all ${
                                aiTipMessage === "budget"
                                ? "bg-purple-100 dark:bg-purple-950/40 text-[#5829D6] dark:text-purple-300 border-purple-200 dark:border-purple-900/40"
                                : "bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/20 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-800"
                            }`}
                        >
                            <Sparkles className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400" />
                            <span>How can I set up a budget?</span>
                        </button>
                    </div>

                    {/* 3. ANOMALIES */}
                    <div className="bg-white dark:bg-[#1f2937] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[145px] hover:shadow-sm transition-all duration-200">
                        <div>
                            <span className="text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block mb-2">
                                Anomalies
                            </span>
                            <div className="flex flex-col items-center justify-center text-center py-2">
                                <span className="text-[11.5px] font-bold text-slate-400 dark:text-slate-500 leading-normal max-w-[190px]">
                                    Your current role cannot access this feature.
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setRolesExplanationOpen(!rolesExplanationOpen)}
                            className="text-[10px] font-bold text-[#5829D6] dark:text-[#A78BFA] hover:underline cursor-pointer text-left w-fit"
                        >
                            Learn more about roles
                        </button>
                    </div>

                    {/* 4. OPTIMIZATION INSIGHTS */}
                    <div className="bg-white dark:bg-[#1f2937] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[145px] hover:shadow-sm transition-all duration-200">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">
                                        Optimization insights
                                    </span>
                                    <InfoTooltip text="Automated consumption optimization queries and warehouse autosuspend rules parsed by the AI direct agent." position="top" />
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-center gap-1.5 mt-3 text-emerald-600 dark:text-emerald-400">
                                <Check className="w-4 h-4" />
                                <span className="text-xs font-bold font-sans">
                                    You are all optimized!
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setAiTipMessage(
                                    aiTipMessage === "optimize"
                                    ? null
                                    : "Your organization warehouses and databases are evaluated dynamically. Active auto-suspend guidelines are already configured inside the Enforcement Desk."
                                );
                            }}
                            className={`w-fit mt-1.5 flex items-center gap-1.5 px-2.5 py-1 text-[9.5px] font-extrabold tracking-wider rounded-lg border cursor-pointer transition-all ${
                                aiTipMessage === "optimize"
                                ? "bg-purple-100 dark:bg-purple-950/40 text-[#5829D6] dark:text-purple-300 border-purple-200 dark:border-purple-900/40"
                                : "bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/20 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-800"
                            }`}
                        >
                            <Sparkles className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400" />
                            <span>How can I optimize my spending?</span>
                        </button>
                    </div>
                </div>
            )}

            {/* EXPANDED INLINE AI HELP MSG */}
            {aiTipMessage && (
                <div className="bg-purple-50/50 dark:bg-[#5829D6]/10 border border-purple-100/50 dark:border-[#5829D6]/30 p-4 rounded-xl text-xs text-slate-705 dark:text-purple-200 font-medium mb-5 shadow-xs flex items-start gap-2.5 animate-in slide-in-from-top duration-200">
                    <Sparkles className="w-4 h-4 text-[#5829D6] dark:text-[#A78BFA] flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-grow">
                        <span className="font-extrabold text-[#5829D6] dark:text-[#A78BFA] block mb-0.5 uppercase text-[10px] tracking-wider">AI Direct Platform Advisory</span>
                        <p>{aiTipMessage}</p>
                    </div>
                    <button onClick={() => setAiTipMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer font-bold">✕</button>
                </div>
            )}

            {/* EXPANDED ROLES MODAL SYSTEM */}
            {rolesExplanationOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/55 dark:bg-black/60 backdrop-blur-xs" onClick={() => setRolesExplanationOpen(false)} />
                    <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 select-none font-sans">
                        <button 
                            onClick={() => setRolesExplanationOpen(false)}
                            className="absolute right-4.5 top-4.5 text-slate-405 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900"
                        >
                            ✕
                        </button>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Snowflake Security & Role Management</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                            Snowflake manages critical optimization features and cost alerts using role-based access control (RBAC). 
                        </p>
                        <div className="space-y-2.5 mb-5">
                            <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/40 text-left">
                                <span className="font-extrabold text-xs text-[#5829D6] dark:text-purple-300 block">ORGADMIN</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Manages organization-wide billing and global multi-region account structures.</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 text-left">
                                <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 block">ACCOUNTADMIN</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Full account authority, configuring Resource Monitors and Budgets.</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 text-left opacity-60">
                                <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 block">SYSADMIN / OTHER ROLES</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Authorized to create tables, compute warehouses, but blocked from parent alerts.</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setRolesExplanationOpen(false)}
                            className="bg-[#5829D6] hover:bg-[#4d21cf] text-white text-xs font-bold py-2.5 w-full rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            {/* 4. TOP WORKLOAD SPEND GRAPH CARD */}
            {activePageTab === 'Consumption' && (
                <div className="bg-white dark:bg-[#1F2937] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col mb-5">
                    {/* Visual stacked bars chart */}
                    <div className="relative h-[240px] w-full">
                        {activeWorkloadChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={activeWorkloadChartData} 
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#9A9AB2" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#9A9AB2', fontSize: 10, fontWeight: 500 }} />
                                    <YAxis 
                                        stroke="#9A9AB2" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fill: '#9A9AB2', fontSize: 10, fontWeight: 500 }} 
                                        domain={workloadChartConfig.domain} 
                                        ticks={workloadChartConfig.ticks}
                                        tickFormatter={(val) => {
                                            if (selectedUsageType === 'All') return `$${val}`;
                                            if (selectedUsageType === 'Storage') return `${val}G`;
                                            if (selectedUsageType === 'Data Transfer') return `${val}M`;
                                            return `${val}`;
                                        }}
                                    />
                                    <Tooltip cursor={{ fill: 'rgba(88, 41, 114, 0.02)' }} />
                                    
                                    {workloadChartConfig.bars.map((bar, index) => (
                                        <Bar 
                                            key={bar.key}
                                            dataKey={bar.key} 
                                            stackId="a" 
                                            fill={bar.color} 
                                            barSize={14} 
                                            radius={index === workloadChartConfig.bars.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                                            className="cursor-pointer hover:opacity-80 transition-all duration-200"
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 p-6">
                                <Cloud className="w-10 h-10 text-slate-300 dark:text-slate-650 animate-pulse mb-2" />
                                <span className="text-xs font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest text-center">No Data Graph Coordinates</span>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-[280px] text-center">Try resetting search filters or matching other Snowflake region endpoints.</p>
                            </div>
                        )}
                    </div>

                    {/* Interactive Legend for categories */}
                    {activeWorkloadChartData.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 mt-3 justify-center text-[10px] font-black text-slate-455 dark:text-slate-500 tracking-wider select-none">
                            {workloadChartConfig.bars.map(bar => (
                                <div key={bar.key} className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bar.color }} />
                                    <span>{bar.name.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 5. TOP WORKLOAD COST BREAKDOWN TABLE CARD */}
            {activePageTab === 'Consumption' && (
                <div className="bg-white dark:bg-[#1F2937] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                {/* Dynamic Table Toolbar Component */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-850 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-5 px-4 sm:px-5 rounded-t-2xl">
                    {/* Left filters layout */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Domain indicator tab/pill */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider select-none border border-slate-200/40 dark:border-slate-700/50">
                            <span>Domain:</span>
                            <span className="text-[#5829D6] dark:text-[#818CF8] font-black">{selectedUsageType}</span>
                        </div>

                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-750 hidden md:block" />

                        {/* Domain-specific sub-filters */}
                        {selectedUsageType === 'Compute' && (
                            <>
                                {/* Resource filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'resource' ? null : 'resource')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">Resource:</span>
                                        <span className="truncate max-w-[120px] text-[#5829D6] dark:text-[#818CF8]">{selectedResource}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'resource' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'resource' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 max-h-[250px] overflow-y-auto animate-in fade-in duration-150">
                                                {RESOURCES_LIST.map((r) => (
                                                    <button
                                                        key={r.name}
                                                        onClick={() => {
                                                            setSelectedResource(r.name);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span className="truncate">{r.name}</span>
                                                        {selectedResource === r.name && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0 border-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Service filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'service' ? null : 'service')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">Service:</span>
                                        <span className="text-[#5829D6] dark:text-[#818CF8]">{selectedServiceType}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'service' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'service' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                                                {SERVICE_TYPES.map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => {
                                                            setSelectedServiceType(t);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span>{t}</span>
                                                        {selectedServiceType === t && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Tag filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'tag' ? null : 'tag')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">Tag:</span>
                                        <span className="truncate max-w-[110px] text-[#5829D6] dark:text-[#818CF8]">{selectedTag}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'tag' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'tag' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                                                {TAG_LIST.map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            setSelectedTag(tag);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span className="truncate text-ellipsis overflow-hidden whitespace-nowrap">{tag}</span>
                                                        {selectedTag === tag && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {selectedUsageType === 'Storage' && (
                            <>
                                {/* Object filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'object' ? null : 'object')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">ObjectType:</span>
                                        <span className="text-[#5829D6] dark:text-[#818CF8]">{selectedObject}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'object' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'object' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                                                {OBJECTS_LIST.map((o) => (
                                                    <button
                                                        key={o}
                                                        onClick={() => {
                                                            setSelectedObject(o);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span>{o}</span>
                                                        {selectedObject === o && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Tag filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'tag' ? null : 'tag')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">Tag:</span>
                                        <span className="truncate max-w-[110px] text-[#5829D6] dark:text-[#818CF8]">{selectedTag}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'tag' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'tag' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                                                {TAG_LIST.map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            setSelectedTag(tag);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span className="truncate text-ellipsis overflow-hidden whitespace-nowrap">{tag}</span>
                                                        {selectedTag === tag && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {(selectedUsageType === 'Data Transfer' || selectedUsageType === 'All') && (
                            <>
                                {/* Region filter selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setTableDropdownOpen(tableDropdownOpen === 'region' ? null : 'region')}
                                        className="bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-705 dark:text-slate-350 shadow-xs transition-colors"
                                    >
                                        <span className="text-slate-400 font-normal">Region:</span>
                                        <span className="text-[#5829D6] dark:text-[#818CF8]">{selectedRegion}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${tableDropdownOpen === 'region' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {tableDropdownOpen === 'region' && (
                                        <>
                                            <div className="fixed inset-0 z-45" onClick={() => setTableDropdownOpen(null)} />
                                            <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                                                {REGIONS_LIST.map((r) => (
                                                    <button
                                                        key={r}
                                                        onClick={() => {
                                                            setSelectedRegion(r);
                                                            setTableDropdownOpen(null);
                                                        }}
                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                                                    >
                                                        <span>{r}</span>
                                                        {selectedRegion === r && <Check className="w-3.5 h-3.5 text-[#5829D6] dark:text-purple-400 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right search bar segment inside toolbar */}
                    <div className="relative w-full md:w-60">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            className="w-full pl-8 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#5829D6]/50"
                            placeholder={`Search ${selectedUsageType === 'Compute' ? 'warehouses' : selectedUsageType === 'Storage' ? 'objects' : 'transfers'}...`}
                            value={tableSearchText}
                            onChange={(e) => setTableSearchText(e.target.value)}
                        />
                        {tableSearchText && (
                            <button 
                                onClick={() => setTableSearchText('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table list below (using React Key for slick CSS switch transitions) */}
                <div key={selectedUsageType} className="overflow-x-auto animate-in fade-in duration-300">
                    
                    {/* Compute: Secondary detail query logs view if single resource is selected */}
                    {selectedUsageType === 'Compute' && selectedResource !== 'All Resources' ? (
                        <div className="flex flex-col gap-4 w-full text-slate-705 dark:text-slate-350 select-none animate-in fade-in duration-300">
                            
                            {/* 1. TOP HEADER ROW (Matching image: Back button, Title, right icons) */}
                            <div className="flex justify-between items-center bg-white dark:bg-[#1F2937] p-3 rounded-2xl border border-slate-150/80 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => {
                                            setSelectedResource('All Resources');
                                            setWarehouseActiveDropdown(null);
                                        }}
                                        className="p-1 px-3 py-1.5 rounded-lg border border-slate-150 bg-slate-50 hover:bg-slate-100 dark:bg-[#111827] dark:hover:bg-slate-800 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-extrabold transition-all flex items-center justify-center cursor-pointer text-xs"
                                        title="Back to warehouses list"
                                    >
                                        &larr;
                                    </button>
                                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase font-mono">
                                        {selectedResource}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* See Details Button toggler requested by user */}
                                    <button 
                                        onClick={() => setShowWarehouseDetailsPanel(!showWarehouseDetailsPanel)}
                                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                                            showWarehouseDetailsPanel 
                                                ? 'bg-[#5829D6] text-white border-[#5829D6] shadow-sm' 
                                                : 'bg-slate-50 dark:bg-[#111827] border-slate-150 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                        {showWarehouseDetailsPanel ? 'HIDE DETAILS' : 'SEE DETAILS'}
                                    </button>
                                </div>
                            </div>

                            {/* 3. RESPONSIVE GRID LAYOUT COLUMN SPLIT */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                                
                                {/* LEFT SECTION: ACTIVITY GRAPH AND QUERY LIST */}
                                <div className={showWarehouseDetailsPanel ? 'lg:col-span-8 space-y-5 w-full' : 'lg:col-span-12 space-y-5 w-full'}>
                                    
                                    {/* 3.1 WAREHOUSE ACTIVITY CARD */}
                                    <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-150/70 dark:border-slate-800 shadow-sm">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                            <h3 className="text-[15px] font-black tracking-tight text-slate-800 dark:text-white">Warehouse activity</h3>
                                            
                                            {/* Beautiful legends from original snowflake print */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-sm" />
                                                    <span>Running</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 bg-[#CBD5E1] rounded-sm" />
                                                    <span>Queued (Provisioning)</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-sm" />
                                                    <span>Blocked</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 bg-[#FBBF24] rounded-sm" />
                                                    <span>Queued</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chart visualization */}
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    data={[
                                                        { date: 'May 27, 12:00 AM', running: 0, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'May 28', running: 0.001, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'May 29', running: 0.001, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'May 30', running: 0.001, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'May 31, 12:00 AM', running: 0.003, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'Jun 1', running: 0.005, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'Jun 2', running: 0.009, queuedProvisioning: 0, blocked: 0, queued: 0 },
                                                        { date: 'Jun 3', running: 0.008, queuedProvisioning: 0.001, blocked: 0, queued: 0 },
                                                        { date: 'Jun 4, 12:00 AM', running: 0.009, queuedProvisioning: 0, blocked: 0.001, queued: 0.001 },
                                                        { date: 'Jun 5', running: 0.008, queuedProvisioning: 0, blocked: 0.002, queued: 0.001 },
                                                        { date: 'Jun 6', running: 0.008, queuedProvisioning: 0.001, blocked: 0, queued: 0 },
                                                        { date: 'Jun 7', running: 0.009, queuedProvisioning: 0, blocked: 0, queued: 0.001 },
                                                        { date: 'Jun 8, 12:00 AM', running: 0.010, queuedProvisioning: 0.001, blocked: 0, queued: 0 },
                                                        { date: 'Jun 9', running: 0.007, queuedProvisioning: 0, blocked: 0, queued: 0 }
                                                    ]} 
                                                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.15} />
                                                    <XAxis dataKey="date" stroke="#9A9AB2" fontSize={8} axisLine={false} tickLine={false} />
                                                    <YAxis stroke="#9A9AB2" fontSize={8} axisLine={false} tickLine={false} domain={[0, 0.012]} ticks={[0, 0.002, 0.004, 0.006, 0.008, 0.01]} />
                                                    <Tooltip content={<CategoryCustomTooltip displayMode={displayMode} />} />
                                                    <Bar dataKey="running" stackId="stack" fill="#2563EB" barSize={34} radius={[2, 2, 0, 0]} />
                                                    <Bar dataKey="queuedProvisioning" stackId="stack" fill="#94A3B8" />
                                                    <Bar dataKey="blocked" stackId="stack" fill="#DC2626" />
                                                    <Bar dataKey="queued" stackId="stack" fill="#F59E0B" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* 3.2 QUERY HISTORY CARD (WITH DYNAMIC FILTER CONTROLS) */}
                                    <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-150/70 dark:border-slate-800 shadow-sm flex flex-col">
                                        
                                        {/* Row with Title, filters search row, and actions */}
                                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                                            <h3 className="text-[15px] font-black text-slate-800 dark:text-white leading-none">Query history</h3>
                                            
                                            {/* FILTERS AREA */}
                                            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                                                
                                                {/* 3.2.1 STATUS FILTER */}
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setWarehouseActiveDropdown(warehouseActiveDropdown === 'status' ? null : 'status')}
                                                        className="bg-slate-50 border border-slate-150 hover:bg-slate-100 dark:bg-[#111827] dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350"
                                                    >
                                                        <span className="text-slate-400">Status</span>
                                                        <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8]">{warehouseStatusFilter}</span>
                                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                                    </button>

                                                    {warehouseActiveDropdown === 'status' && (
                                                        <>
                                                            <div className="fixed inset-0 z-45" onClick={() => setWarehouseActiveDropdown(null)} />
                                                            <div className="absolute left-0 mt-1.5 w-36 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-100">
                                                                {['All', 'Success', 'Failed'].map((st) => (
                                                                    <button
                                                                        key={st}
                                                                        onClick={() => {
                                                                            setWarehouseStatusFilter(st);
                                                                            setWarehouseActiveDropdown(null);
                                                                        }}
                                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center justify-between"
                                                                    >
                                                                        <span>{st}</span>
                                                                        {warehouseStatusFilter === st && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* 3.2.2 USER FILTER */}
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setWarehouseActiveDropdown(warehouseActiveDropdown === 'user' ? null : 'user')}
                                                        className="bg-slate-50 border border-slate-150 hover:bg-slate-100 dark:bg-[#111827] dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350"
                                                    >
                                                        <span className="text-slate-400">User</span>
                                                        <span className="font-extrabold text-[#5829D6] dark:text-[#818CF8] bg-[#5829D6]/5 dark:bg-[#5829D6]/10 px-1 rounded">{warehouseUserFilter}</span>
                                                        {warehouseUserFilter !== 'All' && (
                                                            <span 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setWarehouseUserFilter('All');
                                                                    setWarehouseActiveDropdown(null);
                                                                }}
                                                                className="hover:bg-slate-200 dark:hover:bg-slate-800 p-0.5 rounded text-slate-400 font-bold"
                                                                title="Clear select user"
                                                            >
                                                                &times;
                                                            </span>
                                                        )}
                                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                                    </button>

                                                    {warehouseActiveDropdown === 'user' && (
                                                        <>
                                                            <div className="fixed inset-0 z-45" onClick={() => setWarehouseActiveDropdown(null)} />
                                                            <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-100 font-sans">
                                                                {['All', 'MANJU', 'mike_data_eng', 'jane_data_analyst', 'system_etl_proc'].map((usr) => (
                                                                    <button
                                                                        key={usr}
                                                                        onClick={() => {
                                                                            setWarehouseUserFilter(usr);
                                                                            setWarehouseActiveDropdown(null);
                                                                        }}
                                                                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                                                                    >
                                                                        <span>{usr}</span>
                                                                        {warehouseUserFilter === usr && <Check className="w-3.5 h-3.5 text-[#5829D6]" />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* 3.2.3 FILTERS BUTTON */}
                                                <button className="bg-slate-50 hover:bg-slate-100 dark:bg-[#111827] border border-slate-150 dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
                                                    <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
                                                    <span>Filters</span>
                                                </button>

                                                {/* Count Indicator */}
                                                <span className="text-[11px] font-bold text-slate-400 tracking-tight ml-2">
                                                    {(() => {
                                                        const mQueries = [
                                                            { sqlText: "select * from snowflake.account_usage.query_history limit 100;", queryId: "01c4c1cc-0001-e27b-001c-746b00238456", status: "SUCCESS", user: "MANJU", duration: "25ms", started: "2026-06-10 11:15:02", rows: 100 },
                                                            { sqlText: "select * from snowflake.account_usage.database_storage_usage_history limit 50;", queryId: "01c4c1cb-0001-e1ed-001c-746b002289b2", status: "SUCCESS", user: "MANJU", duration: "18ms", started: "2026-06-10 11:13:40", rows: 50 },
                                                            { sqlText: "GRANT USAGE ON WAREHOUSE anavsan_wh TO ROLE analyst_role;", queryId: "01c4c1cc-0001-e247-001c-746b0023b18a", status: "SUCCESS", user: "MANJU", duration: "5ms", started: "2026-06-10 11:09:12", rows: 0 },
                                                            { sqlText: "ALTER USER anavsan_user SET DEFAULT_WAREHOUSE = anavsan_wh;", queryId: "01c4c1c6-0001-e2c3-001c-746b0023c0e6", status: "SUCCESS", user: "MANJU", duration: "8ms", started: "2026-06-10 11:02:50", rows: 0 },
                                                            { sqlText: "CREATE OR REPLACE WAREHOUSE anavsan_wh WITH WAREHOUSE_SIZE = 'X-SMALL';", queryId: "01c4c1c6-0001-e247-001c-746b0023b182", status: "SUCCESS", user: "MANJU", duration: "45ms", started: "2026-06-10 10:55:14", rows: 0 }
                                                        ];
                                                        const oQueries = [
                                                            { sqlText: "SELECT COUNT(*), dept_id FROM analytics_db.public.sales GROUP BY dept_id;", queryId: "01b2a3c4-0001-a1b2-0000-0123abcd4567", status: "SUCCESS", user: "mike_data_eng", duration: "1.2s", started: "2026-06-10 07:15:22", rows: 14002 },
                                                            { sqlText: "CREATE OR REPLACE TEMPORARY TABLE temp_revenue AS SELECT * FROM raw_data.sales;", queryId: "01b2f3a2-0004-e310-0001-9231fbaa4240", status: "SUCCESS", user: "jane_data_analyst", duration: "4.5s", started: "2026-06-10 07:12:05", rows: 842000 },
                                                            { sqlText: "SELECT * FROM core_fact_db.finance.ledgers WHERE transaction_year = 2026 LIMIT 100;", queryId: "01b2d41a-0002-cc91-0010-84a1bc923a12", status: "SUCCESS", user: "reporter_bi", duration: "0.8s", started: "2026-06-10 07:10:14", rows: 100 },
                                                            { sqlText: "COPY INTO @raw_stage/sales_sync FROM (SELECT * FROM sales_raw) FILE_FORMAT = (TYPE = PARQUET);", queryId: "01b2e21b-0003-882a-0004-942bcba55123", status: "FAILED", user: "system_etl_proc", duration: "12.4s", started: "2026-06-10 07:05:00", rows: 0 },
                                                            { sqlText: "ALTER WAREHOUSE COMPUTE_WH RESUME IF SUSPENDED;", queryId: "01b2ff19-0005-cb12-0001-8314bbd2df89", status: "SUCCESS", user: "mike_data_eng", duration: "0.1s", started: "2026-06-10 07:00:12", rows: 0 }
                                                        ];
                                                        const combinedList = selectedResource === 'ANAVSAN_WH' ? [...mQueries, ...oQueries] : [...oQueries, ...mQueries];
                                                        
                                                        const filteredCount = combinedList.filter(q => {
                                                            const matchesUser = warehouseUserFilter === 'All' ? true : q.user === warehouseUserFilter;
                                                            const matchesStatus = warehouseStatusFilter === 'All' ? true : q.status === warehouseStatusFilter.toUpperCase();
                                                            return matchesUser && matchesStatus;
                                                        }).length;
                                                        
                                                        return `${filteredCount} queries`;
                                                    })()}
                                                </span>

                                                {/* 3.2.4 COLUMNS SELECTOR */}
                                                <button className="bg-slate-50 hover:bg-slate-100 dark:bg-[#111827] border border-slate-150 dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 ml-auto cursor-pointer">
                                                    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
                                                    <span>Columns</span>
                                                </button>
                                                
                                                <button className="p-2 rounded-xl border border-slate-150 bg-white hover:bg-slate-55 dark:bg-[#1F2937] dark:border-slate-800 text-slate-400">
                                                    <RefreshCw className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* TABLE DETAILS */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[700px]">
                                                <thead>
                                                    <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 select-none">
                                                        <th className="pb-3.5 font-black flex items-center gap-1 cursor-pointer">SQL TEXT <span>&uarr;</span></th>
                                                        <th className="pb-3.5 font-black cursor-pointer">QUERY ID <span>&uarr;</span></th>
                                                        <th className="pb-3.5 font-black cursor-pointer">STATUS <span>&uarr;</span></th>
                                                        <th className="pb-3.5 font-black">USER</th>
                                                        <th className="pb-3.5 font-black">DURATION</th>
                                                        <th className="pb-3.5 font-black">STARTED</th>
                                                        <th className="pb-3.5 text-right font-black">ROWS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/45">
                                                    {(() => {
                                                        const mQueries = [
                                                            { sqlText: "select * from snowflake.account_usage.query_history limit 100;", queryId: "01c4c1cc-0001-e27b-001c-746b00238456", status: "SUCCESS", user: "MANJU", duration: "25ms", started: "2026-06-10 11:15:02", rows: 100 },
                                                            { sqlText: "select * from snowflake.account_usage.database_storage_usage_history limit 50;", queryId: "01c4c1cb-0001-e1ed-001c-746b002289b2", status: "SUCCESS", user: "MANJU", duration: "18ms", started: "2026-06-10 11:13:40", rows: 50 },
                                                            { sqlText: "GRANT USAGE ON WAREHOUSE anavsan_wh TO ROLE analyst_role;", queryId: "01c4c1cc-0001-e247-001c-746b0023b18a", status: "SUCCESS", user: "MANJU", duration: "5ms", started: "2026-06-10 11:09:12", rows: 0 },
                                                            { sqlText: "ALTER USER anavsan_user SET DEFAULT_WAREHOUSE = anavsan_wh;", queryId: "01c4c1c6-0001-e2c3-001c-746b0023c0e6", status: "SUCCESS", user: "MANJU", duration: "8ms", started: "2026-06-10 11:02:50", rows: 0 },
                                                            { sqlText: "CREATE OR REPLACE WAREHOUSE anavsan_wh WITH WAREHOUSE_SIZE = 'X-SMALL';", queryId: "01c4c1c6-0001-e247-001c-746b0023b182", status: "SUCCESS", user: "MANJU", duration: "45ms", started: "2026-06-10 10:55:14", rows: 0 }
                                                        ];
                                                        const oQueries = [
                                                            { sqlText: "SELECT COUNT(*), dept_id FROM analytics_db.public.sales GROUP BY dept_id;", queryId: "01b2a3c4-0001-a1b2-0000-0123abcd4567", status: "SUCCESS", user: "mike_data_eng", duration: "1.2s", started: "2026-06-10 07:15:22", rows: 14002 },
                                                            { sqlText: "CREATE OR REPLACE TEMPORARY TABLE temp_revenue AS SELECT * FROM raw_data.sales;", queryId: "01b2f3a2-0004-e310-0001-9231fbaa4240", status: "SUCCESS", user: "jane_data_analyst", duration: "4.5s", started: "2026-06-10 07:12:05", rows: 842000 },
                                                            { sqlText: "SELECT * FROM core_fact_db.finance.ledgers WHERE transaction_year = 2026 LIMIT 100;", queryId: "01b2d41a-0002-cc91-0010-84a1bc923a12", status: "SUCCESS", user: "reporter_bi", duration: "0.8s", started: "2026-06-10 07:10:14", rows: 100 },
                                                            { sqlText: "COPY INTO @raw_stage/sales_sync FROM (SELECT * FROM sales_raw) FILE_FORMAT = (TYPE = PARQUET);", queryId: "01b2e21b-0003-882a-0004-942bcba55123", status: "FAILED", user: "system_etl_proc", duration: "12.4s", started: "2026-06-10 07:05:00", rows: 0 },
                                                            { sqlText: "ALTER WAREHOUSE COMPUTE_WH RESUME IF SUSPENDED;", queryId: "01b2ff19-0005-cb12-0001-8314bbd2df89", status: "SUCCESS", user: "mike_data_eng", duration: "0.1s", started: "2026-06-10 07:00:12", rows: 0 }
                                                        ];
                                                        const combinedList = selectedResource === 'ANAVSAN_WH' ? [...mQueries, ...oQueries] : [...oQueries, ...mQueries];
                                                        
                                                        const filteredList = combinedList.filter(q => {
                                                            const matchesUser = warehouseUserFilter === 'All' ? true : q.user === warehouseUserFilter;
                                                            const matchesStatus = warehouseStatusFilter === 'All' ? true : q.status === warehouseStatusFilter.toUpperCase();
                                                            return matchesUser && matchesStatus;
                                                        });

                                                        if (filteredList.length === 0) {
                                                            return (
                                                                <tr>
                                                                    <td colSpan={7} className="py-8 text-center text-xs font-bold text-slate-400">
                                                                        No queries match the selected filters.
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }

                                                        return filteredList.map((row) => (
                                                            <tr key={row.queryId} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/10 transition-colors font-mono text-[11px] leading-relaxed">
                                                                <td className="py-3 max-w-[280px] truncate pr-4 text-slate-800 dark:text-slate-100 font-bold" title={row.sqlText}>
                                                                    {row.sqlText}
                                                                </td>
                                                                <td className="py-3 text-slate-400 dark:text-slate-500 font-bold pr-2 truncate max-w-[124px]" title={row.queryId}>
                                                                    {row.queryId}
                                                                </td>
                                                                <td className="py-3">
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                                        row.status === 'SUCCESS' ? 'bg-[#D1FAE5] text-[#065F46] dark:bg-emerald-950/40 dark:text-emerald-400' :
                                                                        row.status === 'FAILED' ? 'bg-[#FEE2E2] text-[#991B1B] dark:bg-rose-950/40 dark:text-rose-400' :
                                                                        'bg-[#FEF3C7] text-[#92400E] dark:bg-amber-950/40 dark:text-amber-400 animate-pulse'
                                                                    }`}>
                                                                        {row.status === 'SUCCESS' ? 'Success' : row.status === 'FAILED' ? 'Failed' : 'Running'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 text-slate-600 dark:text-slate-350 font-bold">{row.user}</td>
                                                                <td className="py-3 font-semibold text-slate-500 dark:text-slate-400">{row.duration}</td>
                                                                <td className="py-3 text-slate-400 dark:text-slate-500 font-bold whitespace-nowrap">{row.started.split(' ')[1]}</td>
                                                                <td className="py-3 text-right font-black text-slate-700 dark:text-slate-200">{row.rows.toLocaleString()}</td>
                                                            </tr>
                                                        ));
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>

                                {/* RIGHT PANEL: WAREHOUSE DETAILS (Toggled by See Details button, exactly matches image) */}
                                {showWarehouseDetailsPanel && (
                                    <div className="lg:col-span-4 bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-150/70 dark:border-slate-800 shadow-sm space-y-6 flex flex-col md:w-full">
                                        
                                        {/* SECTION 1: DESCRIPTION */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-black text-slate-930 dark:text-white">Description</h4>
                                                <button 
                                                    onClick={() => {
                                                        if (isEditingWarehouseDescription) {
                                                            setWarehouseDescription(tempWarehouseDescription);
                                                        } else {
                                                            setTempWarehouseDescription(warehouseDescription);
                                                        }
                                                        setIsEditingWarehouseDescription(!isEditingWarehouseDescription);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                                                    title="Edit description"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                                                {isEditingWarehouseDescription ? (
                                                    <div className="flex flex-col gap-2 pt-1 font-sans">
                                                        <textarea 
                                                            value={tempWarehouseDescription}
                                                            onChange={(e) => setTempWarehouseDescription(e.target.value)}
                                                            className="w-full text-xs font-semibold p-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#5829D6]"
                                                            rows={3}
                                                            placeholder="Add a warehouse description..."
                                                        />
                                                        <div className="flex gap-1.5 justify-end">
                                                            <button 
                                                                onClick={() => setIsEditingWarehouseDescription(false)}
                                                                className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setWarehouseDescription(tempWarehouseDescription);
                                                                    setIsEditingWarehouseDescription(false);
                                                                }}
                                                                className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#5829D6] text-white"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 pt-1 leading-relaxed">
                                                        {warehouseDescription || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* SECTION 2: WAREHOUSE DETAILS LIST (Exact copy of keys/layout in image) */}
                                        <div className="space-y-4">
                                            <h4 className="text-[13px] font-black tracking-tight text-slate-800 dark:text-white uppercase tracking-wider">Warehouse details</h4>
                                            
                                            <div className="space-y-3 pt-1 text-xs">
                                                {[
                                                    { key: 'Warehouse type', value: 'Standard' },
                                                    { key: 'Owner', value: 'ACCOUNTADMIN' },
                                                    { 
                                                        key: 'Status', 
                                                        value: (
                                                            <span className="flex items-center gap-1.5">
                                                                <span className={`w-2 h-2 rounded-full ${selectedResource === 'ANAVSAN_WH' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                                                <span>{selectedResource === 'ANAVSAN_WH' ? 'Suspended' : 'Active'}</span>
                                                            </span>
                                                        ) 
                                                    },
                                                    { key: 'Resumed', value: '4 hours ago' },
                                                    { key: 'Running', value: '0 queries' },
                                                    { key: 'Queued', value: '0 queries' },
                                                    { key: 'Size', value: selectedResource === 'ANAVSAN_WH' ? 'X-Small' : selectedResource === 'COMPUTE_WH' ? 'Medium' : 'Large' },
                                                    { key: 'Max clusters', value: selectedResource === 'ANAVSAN_WH' ? '1' : selectedResource === 'COMPUTE_WH' ? '2' : '4' },
                                                    { key: 'Min clusters', value: '1' },
                                                    { key: 'Scaling policy', value: 'Standard' },
                                                    { key: 'Auto suspend', value: '5 minutes' },
                                                    { key: 'Auto resume', value: 'Enabled' },
                                                    { key: 'Query acceleration', value: 'Enabled' },
                                                    { key: 'Scale factor', value: '2' },
                                                    { key: 'Resource constraint', value: 'STANDARD_GEN_2' },
                                                    { key: 'Created', value: '8 days ago' },
                                                ].map((item) => (
                                                    <div key={item.key} className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/40">
                                                        <span className="text-slate-400 dark:text-slate-500 font-semibold">{item.key}</span>
                                                        <span className="text-slate-800 dark:text-slate-200 font-black tracking-tight font-sans">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>
                    ) : (
                        <>
                            {/* Compute Warehouse Standard list table */}
                            {selectedUsageType === 'Compute' && (
                                <>
                                    {computeTableData.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2">
                                                    <th className="pb-2 font-black">NAME</th>
                                                    <th className="pb-2 font-black">TYPE</th>
                                                    <th className="pb-2 font-black">TAGS</th>
                                                    <th className="pb-2 font-black">CREDITS USED</th>
                                                    <th className="pb-2 text-right font-black">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                                                {computeTableData.map((item) => {
                                                    const pct = Math.round((item.creditsUsed / maxCreditsInSet) * 100);
                                                    return (
                                                        <tr 
                                                            key={item.id} 
                                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group/row"
                                                            onClick={() => setSelectedResource(item.name)}
                                                        >
                                                            <td className="py-2.5 font-bold text-[#5829D6] dark:text-[#818CF8] text-[13px] group-hover/row:underline">{item.name}</td>
                                                            <td className="py-2.5 text-slate-600 dark:text-slate-300 text-[12px] font-medium font-sans">{item.type}</td>
                                                            <td className="py-2.5">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.tags.map((tg) => (
                                                                        <span key={tg} className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md font-sans border border-slate-200/50 dark:border-slate-700/50">{tg}</span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 min-w-[55px] font-mono">{item.creditsUsed} cr</span>
                                                                    <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                                                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 text-right">
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); setSelectedResource(item.name); }}
                                                                    className="bg-[#5829D6] hover:bg-[#4F46E5] text-white text-[9px] font-black tracking-wider px-3 py-1.5 rounded-full transition-all uppercase"
                                                                >
                                                                    QUERY HISTORY
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 font-sans">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-1">No Matching Warehouses Found</p>
                                            <p className="text-[11px] text-slate-400">Try checking selected filters or search terms.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Storage: Databases/Stages breakdown list table */}
                            {selectedUsageType === 'Storage' && (
                                <>
                                    {storageTableData.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2">
                                                    <th className="pb-2 font-black">OBJECT</th>
                                                    <th className="pb-2 font-black">TYPE</th>
                                                    <th className="pb-2 font-black">TAGS</th>
                                                    <th className="pb-2 font-black">STORAGE SIZE</th>
                                                    <th className="pb-2 text-right font-black">STORAGE BREAKDOWN</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                                                {storageTableData.map((item) => {
                                                    const normPct = Math.round((item.size / maxStorageSizeInSet) * 100);
                                                    
                                                    // Stacked segment percentages for multi-color breakdown
                                                    const dbPct = item.size > 0 ? (item.dbSize / item.size) * 100 : 0;
                                                    const stagePct = item.size > 0 ? (item.stageSize / item.size) * 100 : 0;
                                                    const failsafePct = item.size > 0 ? (item.failsafeSize / item.size) * 105 : 0;

                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors">
                                                            <td className="py-2.5 font-bold text-[#5c2ae6] dark:text-[#818CF8] text-[13px]">{item.object}</td>
                                                            <td className="py-2.5">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                                                    item.type === 'Database' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' :
                                                                    'bg-cyan-50 text-cyan-650 dark:bg-cyan-950/20 dark:text-cyan-400'
                                                                }`}>
                                                                    {item.type.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="py-2.5">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.tags.map((tg) => (
                                                                        <span key={tg} className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md font-sans border border-slate-200/50 dark:border-slate-700/50">{tg}</span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 min-w-[55px] font-mono">{item.size} GB</span>
                                                                    <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                                                                        <div className="h-full bg-[#5829D6] rounded-full transition-all duration-500" style={{ width: `${normPct}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 text-right flex justify-end items-center">
                                                                <div className="flex flex-col items-end gap-1">
                                                                    {/* Stacked bar breakdown */}
                                                                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex">
                                                                        {dbPct > 0 && <div className="h-full bg-[#5829D6] hover:opacity-85" style={{ width: `${dbPct}%` }} title={`Database: ${item.dbSize}GB`} />}
                                                                        {stagePct > 0 && <div className="h-full bg-[#22D3EE] hover:opacity-85" style={{ width: `${stagePct}%` }} title={`Stage: ${item.stageSize}GB`} />}
                                                                        {failsafePct > 0 && <div className="h-full bg-[#F59E0B] hover:opacity-85" style={{ width: `${failsafePct}%` }} title={`Fail-safe: ${item.failsafeSize}GB`} />}
                                                                    </div>
                                                                    {/* Segment legend text values */}
                                                                    <div className="flex gap-2 text-[8px] font-black tracking-normal uppercase text-slate-400 font-sans">
                                                                        {item.dbSize > 0 && <span className="text-[#5829D6]">DB: {item.dbSize}G</span>}
                                                                        {item.stageSize > 0 && <span className="text-cyan-500">STG: {item.stageSize}G</span>}
                                                                        {item.failsafeSize > 0 && <span className="text-amber-500">FS: {item.failsafeSize}G</span>}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 font-sans">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-1">No Matching Storage Objects Found</p>
                                            <p className="text-[11px] text-slate-400 font-medium">Try checking object filters or search terms.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Data Transfer table: Provider, target region, size, type */}
                            {selectedUsageType === 'Data Transfer' && (
                                <>
                                    {transferTableData.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2">
                                                    <th className="pb-2 font-black">PROVIDER</th>
                                                    <th className="pb-2 font-black">TARGET REGION</th>
                                                    <th className="pb-2 font-black">AMOUNT TRANSFERRED</th>
                                                    <th className="pb-2 text-right font-black">TRANSFER TYPE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                                                {transferTableData.map((item) => {
                                                    // Normalize relative to 145 MB max
                                                    const pct = Math.min(100, Math.round((item.amountTransferred / 145) * 100));
                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors border-b border-slate-50 dark:border-slate-800">
                                                            <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">
                                                                <span className="px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-[11px] uppercase tracking-wider font-extrabold font-sans">
                                                                    {item.provider}
                                                                </span>
                                                            </td>
                                                            <td className="py-2.5 text-[#5829D6] dark:text-[#818CF8] font-bold text-[13px] font-mono">{item.targetRegion}</td>
                                                            <td className="py-2.5">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 min-w-[55px] font-mono">{item.amountTransferred} MB</span>
                                                                    <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                                                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 text-right font-black text-[11px] text-slate-500 dark:text-slate-400">
                                                                <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/40 rounded-lg">
                                                                    {item.transferType}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 font-sans border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl my-4">
                                            <Cloud className="w-8 h-8 text-slate-400 mx-auto mb-2 text-center" />
                                            <p className="text-xs font-black text-[#5829D6] uppercase tracking-widest mb-1">No transfer activity detected for this period</p>
                                            <p className="text-[11px] text-slate-400">All regional stages are fully synchronized with our cloud data lake sync routing.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* All Domain logs list */}
                            {selectedUsageType === 'All' && (
                                <>
                                    {allTableData.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2">
                                                    <th className="pb-2 font-black">START TIME (UTC)</th>
                                                    <th className="pb-2 font-black">COST</th>
                                                    <th className="pb-2 text-right font-black">USAGE TYPE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                                                {allTableData.map((item) => {
                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors text-[12px] font-medium font-sans">
                                                            <td className="py-2.5 font-bold text-slate-700 dark:text-slate-350 font-mono">{item.startTime}</td>
                                                            <td className="py-2.5 text-slate-900 dark:text-slate-100 font-extrabold text-[13px] font-mono">${item.cost.toLocaleString()}</td>
                                                            <td className="py-2.5 text-right">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                                                    item.usageType === 'Compute' ? 'bg-[#5829D6]/10 text-[#5829D6] dark:bg-[#5829D6]/20' :
                                                                    item.usageType === 'Storage' ? 'bg-cyan-100/60 text-cyan-700 dark:bg-cyan-950/30' :
                                                                    'bg-emerald-100/60 text-emerald-700 dark:bg-emerald-950/30'
                                                                }`}>
                                                                    {item.usageType.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 font-sans">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-1">No Matching Allocation History Logs Found</p>
                                            <p className="text-[11px] text-slate-400">Please reset region filter settings.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>
        )}


        </div>
    );
};

export default AccountOverviewDashboard;
