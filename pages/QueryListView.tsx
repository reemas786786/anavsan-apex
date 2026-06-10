
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryListFilters } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconAdjustments, IconChevronDown, IconChevronLeft, IconChevronRight, IconRefresh, IconTrendingUp, IconInfo, IconClipboardCopy, IconCheck } from '../constants';
import { Search, Info, Calendar, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Activity, Maximize2 } from 'lucide-react';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';
import ColumnSelector from '../components/ColumnSelector';
import { BarChart, Bar, LineChart, Line, Legend, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const QUERY_PATTERN_COLORS = [
    '#5829D6', // original deep purple/blue
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
    '#14B8A6', // teal
    '#8B5CF6', // violet
    '#F97316', // orange
    '#06B6D4', // cyan
];

const allColumns = [
    { key: 'queryId', label: 'Query ID' },
    { key: 'credits', label: 'Credits' },
    { key: 'duration', label: 'Duration' },
];

type QueryMode = 'High-impact';

interface QueryListViewProps {
    onShareQueryClick: (query: QueryListItem) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onAnalyzeQuery: (query: QueryListItem) => void;
    onOptimizeQuery: (query: QueryListItem) => void;
    onSimulateQuery: (query: QueryListItem) => void;
    onNavigateToRecommendations?: (page: any) => void;
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
    onDrillDownChange?: (isDrillingDown: boolean) => void;
    initialGroupId?: string | null;
    mode?: 'all' | 'repeated';
    showChart?: boolean;
}

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const QueryListView: React.FC<QueryListViewProps> = ({
    onShareQueryClick,
    onSelectQuery,
    onAnalyzeQuery,
    onOptimizeQuery,
    onSimulateQuery,
    onNavigateToRecommendations,
    filters,
    setFilters,
    onDrillDownChange,
    initialGroupId = null,
    mode = 'all',
    showChart = true,
}) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('Last 7 days');
    const [viewingHighImpactGroup, setViewingHighImpactGroup] = useState<string | null>(initialGroupId);
    const [chartTab, setChartTab] = useState<'trend' | 'distribution'>('trend');
    const [detailTab, setDetailTab] = useState<'Details' | 'Query list'>('Details');
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);

    const dailyPatternCosts = useMemo(() => [
        { date: '4 Feb', select: 3.5, delete: 0.8, unload: 0.3, ctas: 0.0, show: 0.1, call: 0.0 },
        { date: '5 Feb', select: 3.0, delete: 0.7, unload: 0.4, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '6 Feb', select: 3.2, delete: 0.6, unload: 0.3, ctas: 0.2, show: 0.0, call: 0.1 },
        { date: '7 Feb', select: 3.5, delete: 0.9, unload: 0.2, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '8 Feb', select: 3.8, delete: 0.8, unload: 0.4, ctas: 0.0, show: 0.2, call: 0.0 },
        { date: '9 Feb', select: 4.0, delete: 0.7, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.1 },
        { date: '10 Feb', select: 3.4, delete: 0.6, unload: 0.2, ctas: 0.2, show: 0.1, call: 0.0 },
        { date: '11 Feb', select: 3.6, delete: 0.9, unload: 0.4, ctas: 0.1, show: 0.2, call: 0.0 },
        { date: '12 Feb', select: 3.3, delete: 0.8, unload: 0.3, ctas: 0.2, show: 0.1, call: 0.1 },
        { date: '13 Feb', select: 3.5, delete: 0.7, unload: 0.5, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '14 Feb', select: 3.4, delete: 0.6, unload: 0.3, ctas: 0.2, show: 0.1, call: 0.0 },
        { date: '15 Feb', select: 3.8, delete: 0.9, unload: 0.4, ctas: 0.1, show: 0.2, call: 0.1 },
        { date: '16 Feb', select: 3.2, delete: 0.7, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '17 Feb', select: 3.8, delete: 0.8, unload: 0.3, ctas: 0.2, show: 0.1, call: 0.0 },
        { date: '18 Feb', select: 5.0, delete: 0.9, unload: 0.4, ctas: 4.2, show: 0.2, call: 0.1 },
        { date: '19 Feb', select: 4.5, delete: 0.8, unload: 0.4, ctas: 0.1, show: 0.2, call: 0.0 },
        { date: '20 Feb', select: 4.2, delete: 2.2, unload: 0.5, ctas: 0.2, show: 0.1, call: 0.1 },
        { date: '21 Feb', select: 4.8, delete: 0.7, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '22 Feb', select: 6.2, delete: 0.8, unload: 0.4, ctas: 0.2, show: 0.2, call: 0.1 },
        { date: '23 Feb', select: 6.8, delete: 1.8, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '24 Feb', select: 4.8, delete: 1.2, unload: 0.4, ctas: 0.1, show: 0.1, call: 0.1 },
        { date: '25 Feb', select: 4.4, delete: 0.7, unload: 0.3, ctas: 0.2, show: 0.2, call: 0.0 },
        { date: '26 Feb', select: 5.2, delete: 1.8, unload: 0.4, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '27 Feb', select: 5.5, delete: 1.6, unload: 0.5, ctas: 0.1, show: 0.1, call: 0.1 },
        { date: '28 Feb', select: 5.2, delete: 2.2, unload: 0.4, ctas: 0.2, show: 0.2, call: 0.0 },
        { date: '1 Mar', select: 4.3, delete: 0.7, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.0 },
        { date: '2 Mar', select: 4.5, delete: 0.8, unload: 0.4, ctas: 0.2, show: 0.1, call: 0.1 },
        { date: '3 Mar', select: 4.2, delete: 0.8, unload: 0.3, ctas: 0.2, show: 0.2, call: 0.0 },
        { date: '4 Mar', select: 4.4, delete: 0.7, unload: 0.3, ctas: 0.1, show: 0.1, call: 0.0 }
    ], []);

    const legendBreakdownData = useMemo(() => [
        { type: 'SELECT', total: '$135', annualized: '$1.64K', change: '↑ 30.9%', changeType: 'increase', percentage: '75.7%', color: '#56CCF2', isPercentageLessOne: false },
        { type: 'DELETE', total: '$24.70', annualized: '$300', change: '↑ 138%', changeType: 'increase', percentage: '13.8%', color: '#FFA940', isPercentageLessOne: false },
        { type: 'UNLOAD', total: '$13.23', annualized: '$161', change: '↓ 15.3%', changeType: 'decrease', percentage: '7.41%', color: '#34E0A1', isPercentageLessOne: false },
        { type: 'CREATE_TABLE_AS_SELECT', total: '$4.25', annualized: '$51.73', change: '↑ 2.64K%', changeType: 'increase', percentage: '2.38%', color: '#597EF7', isPercentageLessOne: false },
        { type: 'SHOW', total: '$0.88', annualized: '$10.68', change: '↑ 71%', changeType: 'increase', percentage: '<1%', color: '#EA40A4', isPercentageLessOne: true },
        { type: 'CALL', total: '$0.16', annualized: '$1.91', change: '↑ 17.1%', changeType: 'increase', percentage: '<1%', color: '#13C2C2', isPercentageLessOne: true }
    ], []);

    const queryPatternsData = useMemo(() => [
        {
            id: "pat-1",
            latestQuery: "select min(node_ip) m, max(node_ip) mx from raw_k8s_logs limit 100",
            queryType: "SELECT",
            user: "SELECT_BACKEND",
            warehouse: "SELECT_BACKEND_WH",
            queriesRun: "30",
            avgDuration: "8m 40s",
            avgDurationVal: 520,
            totalCost: "$7.14 (4%)",
            percentChange: "↑ 48.1%",
            percentChangeType: "increase",
            annualCost: "$86.90",
            annualCostVal: 86.90
        },
        {
            id: "pat-2",
            latestQuery: "select * from table_audit_logs where event_type = 'LOGIN' and status = 'SUCCESS' order by event_time desc",
            queryType: "SELECT",
            user: "Multiple",
            warehouse: "Multiple",
            queriesRun: "36.7K",
            avgDuration: "8.6s",
            avgDurationVal: 8.6,
            totalCost: "$6.07 (3.4%)",
            percentChange: "↑ 606%",
            percentChangeType: "increase",
            annualCost: "$73.81",
            annualCostVal: 73.81
        },
        {
            id: "pat-3",
            latestQuery: "select min(node_id), max(node_id), count(*) from raw_infrastructure_metrics group by node_id",
            queryType: "SELECT",
            user: "SELECT_BACKEND",
            warehouse: "SELECT_BACKEND_WH",
            queriesRun: "29",
            avgDuration: "6m 54s",
            avgDurationVal: 414,
            totalCost: "$5.21 (2.92%)",
            percentChange: "↑ 32.9%",
            percentChangeType: "increase",
            annualCost: "$63.42",
            annualCostVal: 63.42
        },
        {
            id: "pat-4",
            latestQuery: "copy into 'gcs://anavsan-exports/exports/' from raw_billing_details file_format=(type=json)",
            queryType: "UNLOAD",
            user: "SELECT_DOGFOOD",
            warehouse: "SELECT_DOGFOOD_WH",
            queriesRun: "60",
            avgDuration: "30.4s",
            avgDurationVal: 30.4,
            totalCost: "$3.43 (1.92%)",
            percentChange: "↓ 27.7%",
            percentChangeType: "decrease",
            annualCost: "$41.78",
            annualCostVal: 41.78
        },
        {
            id: "pat-5",
            latestQuery: "select min(node_cpu_utilization), max(node_cpu_utilization) from cluster_nodes_hourly",
            queryType: "SELECT",
            user: "SELECT_BACKEND",
            warehouse: "SELECT_BACKEND_WH",
            queriesRun: "30",
            avgDuration: "3m 31s",
            avgDurationVal: 211,
            totalCost: "$3.24 (1.81%)",
            percentChange: "↑ 33.8%",
            percentChangeType: "increase",
            annualCost: "$39.37",
            annualCostVal: 39.37
        },
        {
            id: "pat-6",
            latestQuery: "select 'query_pattern', sum(credits_used), avg(execution_time) from account_usage_statistics",
            queryType: "SELECT",
            user: "Multiple",
            warehouse: "Multiple",
            queriesRun: "40.8K",
            avgDuration: "4.5s",
            avgDurationVal: 4.5,
            totalCost: "$3.19 (1.79%)",
            percentChange: "New",
            percentChangeType: "new",
            annualCost: "$38.84",
            annualCostVal: 38.84
        },
        {
            id: "pat-7",
            latestQuery: "copy into 'gcs://anavsan-analytics/processed/' from s3_storage_ingest file_format=(type=parquet)",
            queryType: "UNLOAD",
            user: "SELECT_DOGFOOD",
            warehouse: "SELECT_DOGFOOD_WH",
            queriesRun: "61",
            avgDuration: "30s",
            avgDurationVal: 30,
            totalCost: "$3.17 (1.78%)",
            percentChange: "↓ 5.96%",
            percentChangeType: "decrease",
            annualCost: "$38.60",
            annualCostVal: 38.60
        },
        {
            id: "pat-8",
            latestQuery: "select min(node_memory_utilization) m, max(node_memory_utilization) mx from cluster_nodes_hourly",
            queryType: "SELECT",
            user: "SELECT_BACKEND",
            warehouse: "SELECT_BACKEND_WH",
            queriesRun: "30",
            avgDuration: "3m 38s",
            avgDurationVal: 218,
            totalCost: "$3.16 (1.77%)",
            percentChange: "↑ 32.5%",
            percentChangeType: "increase",
            annualCost: "$38.49",
            annualCostVal: 38.49
        },
        {
            id: "pat-9",
            latestQuery: "select user_id, count(session_id) from customer_sessions group by user_id limit 50",
            queryType: "SELECT",
            user: "ANALYTICS_SERVICE",
            warehouse: "ANALYTICS_WH",
            queriesRun: "45",
            avgDuration: "1m 15s",
            avgDurationVal: 75,
            totalCost: "$2.45 (1.37%)",
            percentChange: "↑ 12.4%",
            percentChangeType: "increase",
            annualCost: "$29.80",
            annualCostVal: 29.80
        },
        {
            id: "pat-10",
            latestQuery: "select avg(response_time) as avg_rt from API_latency_logs where cluster_id = 'prod-us'",
            queryType: "SELECT",
            user: "MONITORING_DAEMON",
            warehouse: "COMPUTE_WH",
            queriesRun: "124",
            avgDuration: "4.2s",
            avgDurationVal: 4.2,
            totalCost: "$1.85 (1.03%)",
            percentChange: "↓ 4.2%",
            percentChangeType: "decrease",
            annualCost: "$22.50",
            annualCostVal: 22.50
        }
    ], []);
    const [isHashCopied, setIsHashCopied] = useState(false);
    const [subSearchTerm, setSubSearchTerm] = useState('');
    const [subWarehouseFilter, setSubWarehouseFilter] = useState('All');
    const [subUserFilter, setSubUserFilter] = useState('All');

    const [groupQueriesColumns, setGroupQueriesColumns] = useState([
        { key: 'id', label: 'Query ID' },
        { key: 'status', label: 'Status' },
        { key: 'user', label: 'User' },
        { key: 'warehouse', label: 'Warehouse' },
        { key: 'costCredits', label: 'Credits' },
        { key: 'duration', label: 'Duration' },
        { key: 'startTime', label: 'Start Time' },
        { key: 'endTime', label: 'End Time' },
        { key: 'queryType', label: 'Query Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'bytesScanned', label: 'Bytes Scanned' },
        { key: 'bytesWritten', label: 'Bytes Written' },
    ]);
    const [visibleGroupQueriesColumns, setVisibleGroupQueriesColumns] = useState(['id', 'status', 'user', 'warehouse', 'costCredits', 'duration']);

    const generateHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    };

    const chartData = useMemo(() => {
        return queryPatternsData.map(row => {
            const hash = generateHash(row.latestQuery).substring(0, 8);
            const costVal = parseFloat(row.totalCost.replace(/[^0-9.]/g, '')) || 0;
            return {
                ...row,
                hash: `H_${hash}`,
                displayName: `H_${hash}`,
                costValue: costVal
            };
        }).sort((a, b) => b.costValue - a.costValue);
    }, [queryPatternsData]);

    const ChartTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-border-light text-[#161616] font-sans max-w-sm">
                    <p className="font-mono text-[10px] text-text-secondary mb-1 font-bold uppercase tracking-wide">
                        Hash: {data.hash}
                    </p>
                    <p className="text-xs font-bold text-slate-800 line-clamp-2 font-mono mb-1.5 leading-snug">
                        {data.latestQuery}
                    </p>
                    <div className="font-bold flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                        <span className="text-text-secondary font-medium">Cost:</span>
                        <span className="text-primary font-black">{data.totalCost}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const trendData = useMemo(() => {
        const days = ['Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22', 'Feb 23'];
        return days.map((day, dIdx) => {
            const dayObj: any = { name: day };
            chartData.forEach((item) => {
                const hashNum = parseInt(item.id.replace('pat-', '')) || 1;
                // Seed for unique, stable, and visually pleasing daily fluctuations
                const seed = (dIdx * 4 + hashNum * 9) % 12;
                const multiplier = 0.55 + (seed / 12) * 0.9; // ranging 0.55 to 1.45
                const dailyAverage = item.costValue / 7;
                dayObj[item.hash] = parseFloat((dailyAverage * multiplier).toFixed(2));
            });
            return dayObj;
        });
    }, [chartData]);

    const TrendTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-[#E2DDEB] text-[#161616] font-sans min-w-[220px]">
                    <p className="text-[11px] font-black text-text-secondary mb-2 border-b border-slate-100 pb-1.5 uppercase tracking-wider">
                        Timeline: {label}
                    </p>
                    <div className="space-y-1.5">
                        {sortedPayload.slice(0, 5).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] gap-4">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.stroke || item.color }} />
                                    <span className="font-mono text-[#4A4B57] font-semibold truncate">{item.name}:</span>
                                </div>
                                <span className="font-bold text-text-strong flex-shrink-0">${item.value.toFixed(2)}</span>
                            </div>
                        ))}
                        {sortedPayload.length > 5 && (
                            <div className="text-[10px] text-text-muted mt-1 italic text-right font-medium">
                                +{sortedPayload.length - 5} other query hashes
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        onDrillDownChange?.(!!viewingHighImpactGroup);
    }, [viewingHighImpactGroup, onDrillDownChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: 1 }));
    };

    // --- DATA PROCESSING FOR MODES ---

    const repeatedQueries = useMemo(() => {
        const groups: Record<string, { count: number; totalCredits: number; queries: QueryListItem[]; users: Set<string> }> = {};
        
        initialData.forEach(q => {
            if (!groups[q.queryText]) {
                groups[q.queryText] = { count: 0, totalCredits: 0, queries: [], users: new Set() };
            }
            groups[q.queryText].count++;
            groups[q.queryText].totalCredits += q.costCredits;
            groups[q.queryText].queries.push(q);
            groups[q.queryText].users.add(q.user);
        });

        const baseGroups = Object.entries(groups)
            .map(([text, data]) => {
                const firstExec = data.queries.reduce((min, q) => q.timestamp < min ? q.timestamp : min, data.queries[0].timestamp);
                const lastExec = data.queries.reduce((max, q) => q.timestamp > max ? q.timestamp : max, data.queries[0].timestamp);
                
                return {
                    id: `grp-${data.queries[0].id}`,
                    queryText: text,
                    parameterizedHash: generateHash(text),
                    count: data.count,
                    totalCredits: data.totalCredits,
                    avgCredits: data.totalCredits / data.count,
                    warehouse: data.queries[0].warehouse,
                    userCount: data.users.size,
                    firstExecution: firstExec,
                    lastExecution: lastExec,
                    representative: data.queries[0]
                };
            })
            .filter(g => {
                const matchesSearch = g.queryText.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCount = g.count > 1;
                return matchesSearch && matchesCount;
            });

        // Generate up to 100 dummy items if needed
        if (baseGroups.length > 0 && baseGroups.length < 100) {
            const dummyItems = [];
            for (let i = baseGroups.length; i < 100; i++) {
                const base = baseGroups[i % baseGroups.length];
                dummyItems.push({
                    ...base,
                    id: `${base.id}-dummy-${i}`,
                    parameterizedHash: generateHash(`${base.queryText}-${i}`),
                    count: Math.floor(Math.random() * 500) + 2,
                    totalCredits: Math.random() * 5000,
                    avgCredits: Math.random() * 50,
                });
            }
            return [...baseGroups, ...dummyItems].sort((a, b) => b.totalCredits - a.totalCredits);
        }

        return baseGroups.sort((a, b) => b.totalCredits - a.totalCredits);
    }, [searchTerm]);

    const paginatedData = useMemo(() => {
        if (mode === 'all') {
            return initialData.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage);
        }
        return repeatedQueries.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage);
    }, [filters.currentPage, filters.itemsPerPage, repeatedQueries, mode]);

    const totalPages = Math.ceil((mode === 'all' ? initialData.length : repeatedQueries.length) / filters.itemsPerPage);

    const groupData = useMemo(() => {
        if (!viewingHighImpactGroup) return null;
        return repeatedQueries.find(g => g.queryText === viewingHighImpactGroup) || {
            id: `grp-pat-${generateHash(viewingHighImpactGroup).substring(0,8)}`,
            queryText: viewingHighImpactGroup,
            parameterizedHash: generateHash(viewingHighImpactGroup).substring(0,8),
            count: 30,
            totalCredits: 7.14,
            avgCredits: 0.23,
            warehouse: "SELECT_BACKEND_WH",
            userCount: 1,
            firstExecution: "2026-02-17T12:00:00Z",
            lastExecution: "2026-02-23T18:00:00Z",
            representative: {
                id: "QID-98234",
                queryText: viewingHighImpactGroup,
                warehouse: "SELECT_BACKEND_WH",
                user: "SELECT_BACKEND",
                costCredits: 7.14,
                duration: "8m 40s"
            }
        };
    }, [viewingHighImpactGroup, repeatedQueries]);

    const groupQueries = useMemo(() => {
        if (!viewingHighImpactGroup) return [];
        const filtered = initialData.filter(q => q.queryText === viewingHighImpactGroup);
        if (filtered.length > 0) return filtered;
        // Fallback dummy items
        return [
            {
                id: 'QID-R1-30',
                status: 'Success',
                user: 'SELECT_BACKEND',
                warehouse: 'SELECT_BACKEND_WH',
                costCredits: 7.14,
                duration: '8m 40s',
                startTime: '2026-02-23T14:30:00Z',
                endTime: '2026-02-23T14:38:40Z',
                queryType: 'SELECT',
                severity: 'High',
                bytesScanned: 450000000000,
                bytesWritten: 0,
                timestamp: '2026-02-23T14:30:00Z',
                queryText: viewingHighImpactGroup
            }
        ];
    }, [viewingHighImpactGroup]);

    const filteredGroupQueries = useMemo(() => {
        const baseQueries = groupQueries.filter(q => {
            const matchesSearch = q.id.toLowerCase().includes(subSearchTerm.toLowerCase());
            const matchesWarehouse = subWarehouseFilter === 'All' || q.warehouse === subWarehouseFilter;
            const matchesUser = subUserFilter === 'All' || q.user === subUserFilter;
            return matchesSearch && matchesWarehouse && matchesUser;
        });

        // Generate up to 100 dummy items if needed
        if (baseQueries.length > 0 && baseQueries.length < 100) {
            const dummyItems = [];
            for (let i = baseQueries.length; i < 100; i++) {
                const base = baseQueries[i % baseQueries.length];
                dummyItems.push({
                    ...base,
                    id: `QID-R${i}-${Math.floor(Math.random() * 1000)}`,
                    costCredits: Math.random() * 10,
                    duration: `${Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 60)}s`,
                });
            }
            return [...baseQueries, ...dummyItems];
        }

        return baseQueries;
    }, [groupQueries, subSearchTerm, subWarehouseFilter, subUserFilter]);

    const subWarehouses = useMemo(() => ['All', ...Array.from(new Set(groupQueries.map(q => q.warehouse)))], [groupQueries]);
    const subUsers = useMemo(() => ['All', ...Array.from(new Set(groupQueries.map(q => q.user)))], [groupQueries]);

    if (viewingHighImpactGroup && groupData) {
        // ... (keep the drill-down view as is)
        return (
            <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar px-4 pt-4 pb-12">
                <div className="max-w-[1440px] mx-auto w-full space-y-4">
                    {/* Header Area */}
                    <header className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <button 
                                    onClick={() => setViewingHighImpactGroup(null)} 
                                    className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-hover transition-all shadow-sm flex-shrink-0"
                                    aria-label="Back"
                                >
                                    <IconChevronLeft className="h-6 w-6" />
                                </button>
                                <div>
                                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight leading-none">Repeated query hash detail</h1>
                                    <p className="text-sm text-text-secondary font-medium mt-2">Feb 17 to Feb 23 2026 (Last 7 days)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm flex items-center gap-2 cursor-pointer hover:bg-surface-nested transition-colors">
                                    <span className="text-sm font-bold text-text-strong">Last 7 days</span>
                                    <IconChevronDown className="w-4 h-4 text-text-muted" />
                                </div>
                                <button 
                                    onClick={() => onNavigateToRecommendations?.({ search: 'Scan Optimization', selectedId: 'REC-005' })}
                                    className="h-10 px-6 rounded-full bg-primary text-white font-bold text-[13px] flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
                                >
                                    Optimize
                                    <IconWand className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Optimization Banner - Matching Image */}
                    <div className="bg-[#F0F4FF] border border-[#D0E2FF] rounded-2xl p-6 space-y-3">
                        <div className="flex items-center gap-3 text-[#0043CE]">
                            <IconInfo className="w-5 h-5" />
                            <span className="font-bold text-sm">Optimization opportunity detected</span>
                        </div>
                        <ul className="space-y-2 text-[13px] text-text-secondary list-disc pl-5">
                            <li>Adding a WHERE clause could speed up this query by reducing the amount of data that it scans.</li>
                            <li>Specifying columns instead of using SELECT * would reduce I/O overhead by leveraging Snowflake's columnar storage architecture.</li>
                            <li>The query is scanning 100% of partitions. Filter by a clustering key (like Date or ID) to enable partition pruning and reduce scanned bytes.</li>
                            <li>High remote storage spilling detected. Consider upgrading the warehouse size (e.g., Small to Medium) for this specific workload to provide enough local memory for the JOIN operations.</li>
                        </ul>
                    </div>

                    {/* Details Section */}
                    <div className="bg-white p-4 rounded-[24px] border border-border-light shadow-sm space-y-4">
                        <h3 className="text-[13px] font-black text-text-strong uppercase tracking-widest">Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Execution count</p>
                                <p className="text-[15px] font-black text-text-strong">{groupData.count.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Credits</p>
                                <p className="text-[15px] font-black text-text-strong">{groupData.totalCredits.toFixed(2)} cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Avg. Credits / Exec</p>
                                <p className="text-[15px] font-black text-text-strong">{groupData.avgCredits.toFixed(2)} cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Max. Single credit</p>
                                <p className="text-[15px] font-black text-text-strong">1.20 cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Avg. Duration</p>
                                <p className="text-[15px] font-black text-text-strong">42s</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Max. Single duration</p>
                                <p className="text-[15px] font-black text-text-strong">4m 12s</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Partition %</p>
                                <p className="text-[15px] font-black text-text-strong">12</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Parameterized query hash</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[13px] font-mono text-primary font-bold">{groupData.parameterizedHash}</p>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(groupData.parameterizedHash);
                                            setIsHashCopied(true);
                                            setTimeout(() => setIsHashCopied(false), 2000);
                                        }}
                                        className="text-text-muted hover:text-primary transition-colors"
                                    >
                                        {isHashCopied ? <IconCheck className="w-3.5 h-3.5 text-status-success" /> : <IconClipboardCopy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                            <div className="space-y-6">
                                {/* Summary Pills */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <KPILabel label="Execution count" value={groupData.count.toString()} />
                                    <KPILabel label="Total credits" value={groupData.totalCredits.toFixed(0)} />
                                    <KPILabel label="Avg credits per execution" value={groupData.avgCredits.toFixed(0)} />
                                    <KPILabel label="Avg duration" value="12" />
                                </div>

                                {/* Table Section */}
                                <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col relative">
                                    {/* Sub-toolbar */}
                                    <div className="px-4 py-3 flex items-center border-b border-border-light bg-white relative z-30">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-text-secondary">Warehouse:</span>
                                                <div className="relative">
                                                    <select
                                                        className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                                        value={subWarehouseFilter}
                                                        onChange={(e) => setSubWarehouseFilter(e.target.value)}
                                                    >
                                                        {subWarehouses.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                        <IconChevronDown className="h-3 w-3 text-text-muted" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-4 w-px bg-border-light" />

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-text-secondary">User:</span>
                                                <div className="relative">
                                                    <select
                                                        className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                                        value={subUserFilter}
                                                        onChange={(e) => setSubUserFilter(e.target.value)}
                                                    >
                                                        {subUsers.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                        <IconChevronDown className="h-3 w-3 text-text-muted" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-grow"></div>

                                        <div className="flex items-center gap-4">
                                            <IconSearch className="w-4 h-4 text-text-muted cursor-pointer" />
                                            <ColumnSelector 
                                                columns={groupQueriesColumns} 
                                                visibleColumns={visibleGroupQueriesColumns} 
                                                onVisibleColumnsChange={setVisibleGroupQueriesColumns} 
                                                onColumnsOrderChange={setGroupQueriesColumns}
                                                defaultColumns={['id']} 
                                            />
                                        </div>
                                    </div>

                                     <div className="overflow-auto no-scrollbar max-h-[600px]">
                                        <table className="w-full text-[13px] border-separate border-spacing-0 min-w-max">
                                            <thead className="bg-[#F8F9FA] text-[10px] font-black text-text-muted uppercase tracking-widest sticky top-0 z-20">
                                                <tr>
                                                    {groupQueriesColumns.filter(col => visibleGroupQueriesColumns.includes(col.key)).map(col => (
                                                        <th key={col.key} className="px-6 py-4 text-left border-b border-border-light whitespace-nowrap">
                                                            {col.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-light bg-white">
                                                {filteredGroupQueries.map((query) => (
                                                    <tr key={query.id} className="group hover:bg-surface-nested transition-colors cursor-pointer" onClick={() => onSelectQuery(query)}>
                                                        {groupQueriesColumns.filter(col => visibleGroupQueriesColumns.includes(col.key)).map(col => {
                                                            const value = (query as any)[col.key];
                                                            
                                                            if (col.key === 'id') {
                                                                return (
                                                                    <td key={col.key} className="px-6 py-4 text-text-strong font-medium font-mono text-xs whitespace-nowrap sticky left-0 bg-white z-10 border-r border-border-light shadow-[2px_0_5px_rgba(0,0,0,0.05)] group-hover:bg-surface-nested">
                                                                        {value}
                                                                    </td>
                                                                );
                                                            }
                                                            
                                                            if (col.key === 'status') {
                                                                return (
                                                                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                                            value === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                                        }`}>
                                                                            {value}
                                                                        </span>
                                                                    </td>
                                                                );
                                                            }

                                                            if (col.key === 'costCredits') {
                                                                return (
                                                                    <td key={col.key} className="px-6 py-4 text-text-strong font-black whitespace-nowrap">
                                                                        {value.toFixed(2)}
                                                                    </td>
                                                                );
                                                            }

                                                            if (col.key === 'startTime' || col.key === 'endTime') {
                                                                return (
                                                                    <td key={col.key} className="px-6 py-4 text-text-secondary whitespace-nowrap">
                                                                        {value ? new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                                    </td>
                                                                );
                                                            }

                                                            if (col.key === 'bytesScanned' || col.key === 'bytesWritten') {
                                                                return (
                                                                    <td key={col.key} className="px-6 py-4 text-text-secondary whitespace-nowrap">
                                                                        {formatBytes(value)}
                                                                    </td>
                                                                );
                                                            }

                                                            return (
                                                                <td key={col.key} className="px-6 py-4 text-text-secondary whitespace-nowrap">
                                                                    {value?.toString() || '—'}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Bar */}
                                    <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-border-light text-[13px] text-text-secondary rounded-b-[12px]">
                                        <div className="flex items-center gap-2">
                                            <span>Items per page:</span>
                                            <div className="relative flex items-center gap-1 cursor-pointer hover:text-text-strong">
                                                <select 
                                                    value={100}
                                                    onChange={() => {}}
                                                    className="appearance-none bg-transparent pr-4 font-bold text-text-strong cursor-pointer focus:outline-none"
                                                >
                                                    <option value={100}>100</option>
                                                </select>
                                                <IconChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="h-10 w-px bg-border-light" />
                                            <span>1–100 of 100 items</span>
                                            <div className="h-10 w-px bg-border-light" />
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex items-center gap-1 cursor-pointer hover:text-text-strong">
                                                    <span className="font-bold">1</span>
                                                    <IconChevronDown className="w-3 h-3" />
                                                </div>
                                                <span>of 10 pages</span>
                                            </div>

                                            <div className="flex items-center border-l border-border-light">
                                                <button className="p-3 hover:bg-surface-hover border-r border-border-light">
                                                    <IconChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button className="p-3 hover:bg-surface-hover">
                                                    <IconChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        );
    }

    if (mode === 'repeated') {
        return (
            <div className="flex flex-col min-h-full space-y-6 px-6 py-6 overflow-y-auto no-scrollbar">
                {/* Chart Card */}
                {showChart && (
                    <div className="bg-white rounded-[24px] border border-border-light shadow-sm p-6 flex flex-col space-y-4 relative overflow-hidden transition-all duration-300">
                        {/* Subheader */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[12px] font-black text-text-muted tracking-wider uppercase">Top Parameterized Query Hashes by Cost</h2>
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-border-light text-[11px] font-bold">
                                    <button 
                                        onClick={() => setChartTab('trend')}
                                        className={`px-2.5 py-1 rounded-md transition-all ${chartTab === 'trend' ? 'bg-white shadow-sm text-primary font-extrabold' : 'text-text-secondary hover:text-text-strong'}`}
                                    >
                                        Historical Trend
                                    </button>
                                    <button 
                                        onClick={() => setChartTab('distribution')}
                                        className={`px-2.5 py-1 rounded-md transition-all ${chartTab === 'distribution' ? 'bg-white shadow-sm text-primary font-extrabold' : 'text-text-secondary hover:text-text-strong'}`}
                                    >
                                        Distribution
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary bg-slate-50 px-3 py-1.5 rounded-full border border-border-light">
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#5829D6] via-[#10B981] to-[#EF4444] block animate-pulse" />
                                <span>Unit: USD ($) - {chartTab === 'trend' ? '7-Day Trend' : 'Ranked Top 10'}</span>
                            </div>
                        </div>

                        {/* Recharts Chart Area */}
                        <div className="h-[220px] w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartTab === 'trend' ? (
                                    <LineChart
                                        data={trendData}
                                        margin={{ top: 15, right: 35, left: -20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.4} />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#5A5A72" 
                                            fontSize={10} 
                                            fontWeight={700}
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <YAxis 
                                            stroke="#5A5A72" 
                                            fontSize={10} 
                                            fontWeight={700}
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <RechartsTooltip 
                                            content={<TrendTooltip />} 
                                        />
                                        <Legend 
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', paddingTop: 8 }}
                                        />
                                        {chartData.slice(0, 5).map((entry, index) => (
                                            <Line
                                                key={entry.hash}
                                                type="monotone"
                                                dataKey={entry.hash}
                                                name={entry.hash}
                                                stroke={QUERY_PATTERN_COLORS[index % QUERY_PATTERN_COLORS.length]}
                                                strokeWidth={2.5}
                                                dot={{ r: 3, strokeWidth: 1.5 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        ))}
                                    </LineChart>
                                ) : (
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.4} />
                                        <XAxis 
                                            dataKey="displayName" 
                                            stroke="#5A5A72" 
                                            fontSize={10} 
                                            fontWeight={700}
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <YAxis 
                                            stroke="#5A5A72" 
                                            fontSize={10} 
                                            fontWeight={700}
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <RechartsTooltip 
                                            cursor={{ fill: 'rgba(105, 50, 213, 0.03)' }} 
                                            content={<ChartTooltip />} 
                                        />
                                        <Bar 
                                            dataKey="costValue" 
                                            barSize={32} 
                                            radius={[4, 4, 0, 0]} 
                                            onClick={(data) => {
                                                if (data && data.latestQuery) {
                                                    setViewingHighImpactGroup(data.latestQuery);
                                                }
                                            }}
                                            className="cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={QUERY_PATTERN_COLORS[index % QUERY_PATTERN_COLORS.length]} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Latest Query Table section */}
                <div className="bg-white rounded-[24px] border border-border-light shadow-sm overflow-hidden flex flex-col flex-grow">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-[13px] text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border-light text-[#9A9AB2] text-[10px] font-black uppercase tracking-wider">
                                    <th className="px-6 py-4 whitespace-nowrap">Parameterized Hash</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Query Type</th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 cursor-pointer select-none">
                                            <span>Queries Run</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 cursor-pointer select-none">
                                            <span>Avg Duration</span>
                                            <Info className="w-3 h-3 text-text-muted" />
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 whitespace-nowrap">Total Cost</th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 cursor-pointer select-none">
                                            <span>% Change</span>
                                            <Info className="w-3 h-3 text-text-muted" />
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 cursor-pointer select-none">
                                            <span>Annual Cost</span>
                                            <Info className="w-3 h-3 text-text-muted" />
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light bg-white text-[#161616]">
                                {queryPatternsData.map((row) => (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => setViewingHighImpactGroup(row.latestQuery)}
                                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group/row"
                                    >
                                        {/* Parameterized Hash */}
                                        <td className="px-6 py-4 max-w-sm">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-primary font-bold hover:underline block truncate max-w-[320px] transition-all" title={`H_${generateHash(row.latestQuery).substring(0, 8)}`}>
                                                    H_{generateHash(row.latestQuery).substring(0, 8)}
                                                </span>
                                                <span className="text-[11px] text-text-muted font-mono truncate max-w-[280px]" title={row.latestQuery}>
                                                    {row.latestQuery}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Query Type */}
                                        <td className="px-6 py-4 font-extrabold text-slate-700">
                                            {row.queryType}
                                        </td>

                                        {/* Queries Run */}
                                        <td className="px-6 py-4 font-black">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block animate-pulse" />
                                                <span>{row.queriesRun}</span>
                                            </div>
                                        </td>

                                        {/* Avg Duration */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden flex flex-shrink-0">
                                                    <div 
                                                        className="bg-slate-500 h-full rounded-full transition-all" 
                                                        style={{ width: `${Math.min((row.avgDurationVal / 520) * 100, 100)}%` }} 
                                                    />
                                                </div>
                                                <span className="font-mono text-xs font-black text-slate-800">{row.avgDuration}</span>
                                            </div>
                                        </td>

                                        {/* Total Cost */}
                                        <td className="px-6 py-4 font-extrabold text-slate-800">
                                            {row.totalCost}
                                        </td>

                                        {/* % Change */}
                                        <td className="px-6 py-4">
                                            {row.percentChangeType === 'new' ? (
                                                <span className="inline-flex items-center bg-[#E0F2FE] text-[#0369A1] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    {row.percentChange}
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center font-extrabold text-xs ${
                                                    row.percentChangeType === 'increase' ? 'text-[#E15241]' : 'text-[#27AE60]'
                                                }`}>
                                                    {row.percentChange}
                                                </span>
                                            )}
                                        </td>

                                        {/* Annual Cost */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-100 rounded-xs h-1.5 overflow-hidden flex flex-shrink-0">
                                                    <div 
                                                        className="bg-slate-400 h-full rounded transition-all" 
                                                        style={{ width: `${(row.annualCostVal / 86.90) * 100}%` }} 
                                                    />
                                                </div>
                                                <span className="font-extrabold text-slate-800">{row.annualCost}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background space-y-4 px-6 pt-6 pb-12 overflow-y-auto no-scrollbar">
            {/* Pill-style Summary Metrics */}
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                {mode === 'all' ? (
                    <>
                        <KPILabel label="Total queries" value="12K" />
                        <KPILabel label="Success" value="11.9K" />
                        <KPILabel label="Failed" value="100" />
                    </>
                ) : (
                    <KPILabel label="Query pattern" value={repeatedQueries.length.toString()} />
                )}
            </div>
            
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0 relative">
                {/* Integrated Filter Bar */}
                <div className="px-4 py-3 flex flex-wrap items-center gap-6 border-b border-border-light bg-white relative z-20">
                    {mode === 'all' && (
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-text-secondary">Warehouse:</span>
                                <div className="relative">
                                    <select className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer">
                                        <option>All</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                        <IconChevronDown className="h-3 w-3 text-text-muted" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-4 w-px bg-border-light" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-text-secondary">Warehouse size:</span>
                                <div className="relative">
                                    <select className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer">
                                        <option>All</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                        <IconChevronDown className="h-3 w-3 text-text-muted" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-4 w-px bg-border-light" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-text-secondary">User:</span>
                                <div className="relative">
                                    <select className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer">
                                        <option>All</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                        <IconChevronDown className="h-3 w-3 text-text-muted" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex-grow"></div>

                    <div className="flex items-center gap-4">
                        <IconSearch className="w-4 h-4 text-text-muted cursor-pointer" />
                        <IconAdjustments className="w-4 h-4 text-text-muted cursor-pointer" />
                    </div>
                </div>

                {/* Table Body */}
                <div className="overflow-auto no-scrollbar max-h-[600px]">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="text-[11px] text-text-strong uppercase font-bold sticky top-0 z-10 bg-[#F8F9FA] border-b border-border-light">
                            {mode === 'all' ? (
                                <tr>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Query ID</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Status</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Warehouse</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Warehouse size</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">User</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Credits</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Duration</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Parameterized Hash</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Execution Count</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Total Credits</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Avg Credits p...</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">First Execution</th>
                                    <th className="px-6 py-4 text-left border-b border-border-light">Last Execution</th>
                                    <th className="px-6 py-4 text-right border-b border-border-light">Insights</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="bg-white">
                            {mode === 'all' ? (
                                (paginatedData as QueryListItem[]).map((query, idx) => (
                                    <tr key={query.id} className="group hover:bg-surface-hover transition-colors cursor-pointer border-b border-border-light last:border-0" onClick={() => onSelectQuery(query)}>
                                        <td className="px-6 py-4">
                                            <span className="text-link font-mono font-medium hover:underline block truncate max-w-[150px]">
                                                {query.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                idx === 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {idx === 5 ? 'Failed' : 'Success'}
                                                {idx === 5 && <IconInfo className="w-3 h-3 ml-1" />}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{query.warehouse}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{idx % 2 === 0 ? 'Small' : idx % 3 === 0 ? 'Large' : 'Medium'}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{query.user}</td>
                                        <td className="px-6 py-4 text-text-strong font-black">{query.costCredits.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{query.duration}</td>
                                    </tr>
                                ))
                            ) : (
                                (paginatedData as any[]).map((group, idx) => (
                                    <tr key={group.id} className="group hover:bg-surface-hover transition-colors cursor-pointer border-b border-border-light last:border-0" onClick={() => setViewingHighImpactGroup(group.queryText)}>
                                        <td className="px-6 py-4">
                                            <span className="text-link font-mono font-medium hover:underline block truncate max-w-[300px]">
                                                {group.parameterizedHash}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{group.count}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{group.totalCredits.toFixed(0)}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{group.avgCredits.toFixed(1)}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{new Date(group.firstExecution).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
                                        <td className="px-6 py-4 text-text-secondary font-medium">{new Date(group.lastExecution).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            {idx % 4 === 0 ? (
                                                <div className="flex items-center justify-end">
                                                    <button 
                                                        onClick={() => onNavigateToRecommendations?.({ search: 'Scan Optimization', selectedId: 'REC-005' })}
                                                        className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                                    >
                                                        <span className="text-[12px] font-black">1</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-text-muted text-[11px]">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Bar - Matching Reference Image */}
                <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-border-light text-[13px] text-text-secondary rounded-b-[12px]">
                    <div className="flex items-center gap-2">
                        <span>Items per page:</span>
                        <div className="relative flex items-center gap-1 cursor-pointer hover:text-text-strong">
                            <select 
                                value={filters.itemsPerPage}
                                onChange={(e) => handleFilterChange('itemsPerPage', Number(e.target.value))}
                                className="appearance-none bg-transparent pr-4 font-bold text-text-strong cursor-pointer focus:outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <IconChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="h-10 w-px bg-border-light" />
                        <span>1–{Math.min(filters.itemsPerPage, mode === 'all' ? initialData.length : repeatedQueries.length)} of {mode === 'all' ? initialData.length : repeatedQueries.length} items</span>
                        <div className="h-10 w-px bg-border-light" />
                        
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center gap-1 cursor-pointer hover:text-text-strong">
                                <span className="font-bold">{filters.currentPage}</span>
                                <IconChevronDown className="w-3 h-3" />
                            </div>
                            <span>of {totalPages} pages</span>
                        </div>

                        <div className="flex items-center border-l border-border-light">
                            <button 
                                disabled={filters.currentPage === 1}
                                onClick={(e) => { e.stopPropagation(); handleFilterChange('currentPage', filters.currentPage - 1); }}
                                className="p-3 hover:bg-surface-hover disabled:opacity-30 border-r border-border-light"
                            >
                                <IconChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                disabled={filters.currentPage === totalPages}
                                onClick={(e) => { e.stopPropagation(); handleFilterChange('currentPage', filters.currentPage + 1); }}
                                className="p-3 hover:bg-surface-hover disabled:opacity-30"
                            >
                                <IconChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryListView;
