
import React, { useState, useMemo } from 'react';
import { queryListData } from '../data/dummyData';
import { QueryListItem } from '../types';
import SingleSelectDropdown from '../components/SingleSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';
import ColumnSelector from '../components/ColumnSelector';
import { 
    IconSearch, 
    IconChevronDown, 
    IconChevronLeft, 
    IconChevronRight, 
    IconDatabase, 
    IconUser, 
    IconClock, 
    IconTrendingUp,
    IconBolt,
    IconCalendar,
    IconAdjustments
} from '../constants';

interface ExpensiveQueriesViewProps {
    onSelectQuery: (query: QueryListItem) => void;
}

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const durationToSeconds = (duration: string) => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
};

const ExpensiveQueriesView: React.FC<ExpensiveQueriesViewProps> = ({ onSelectQuery }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('Last 7 days');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [userFilter, setUserFilter] = useState('All');
    const [visibleColumns, setVisibleColumns] = useState(['queryId', 'warehouse', 'user', 'totalCredits', 'computeCredits', 'qasCredits', 'duration']);
    const [minCredits, setMinCredits] = useState(0);
    const [limit, setLimit] = useState(25);
    const [sortKey, setSortKey] = useState<string>('totalCredits');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const warehouses = useMemo(() => Array.from(new Set(queryListData.map(q => q.warehouse))), []);
    const users = useMemo(() => Array.from(new Set(queryListData.map(q => q.user))), []);

    const warehouseOptions = useMemo(() => [
        { value: 'All', label: 'All Warehouses' },
        ...warehouses.map(w => ({ value: w, label: w }))
    ], [warehouses]);

    const userOptions = useMemo(() => [
        { value: 'All', label: 'All Users' },
        ...users.map(u => ({ value: u, label: u }))
    ], [users]);

    const limitOptions = [
        { value: '10', label: 'Top 10' },
        { value: '25', label: 'Top 25' },
        { value: '50', label: 'Top 50' },
        { value: '100', label: 'Top 100' },
    ];

    const allColumns = [
        { key: 'queryId', label: 'Query ID' },
        { key: 'warehouse', label: 'Warehouse' },
        { key: 'user', label: 'User' },
        { key: 'totalCredits', label: 'Total Credits' },
        { key: 'computeCredits', label: 'Compute Credits' },
        { key: 'qasCredits', label: 'QAS Credits' },
        { key: 'duration', label: 'Duration' },
    ];

    const filteredData = useMemo(() => {
        return [...queryListData]
            .filter(q => {
                const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    q.queryText.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesWarehouse = warehouseFilter === 'All' || q.warehouse === warehouseFilter;
                const matchesUser = userFilter === 'All' || q.user === userFilter;
                const matchesMinCredits = q.costCredits >= minCredits;
                const matchesNonZero = q.costCredits > 0; // Edge case: exclude zero compute credits

                return matchesSearch && matchesWarehouse && matchesUser && matchesMinCredits && matchesNonZero;
            })
            .sort((a, b) => {
                let valA: any = a[sortKey as keyof QueryListItem];
                let valB: any = b[sortKey as keyof QueryListItem];

                if (sortKey === 'totalCredits') {
                    valA = a.costCredits;
                    valB = b.costCredits;
                } else if (sortKey === 'duration') {
                    valA = durationToSeconds(a.duration);
                    valB = durationToSeconds(b.duration);
                }

                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [searchTerm, warehouseFilter, userFilter, minCredits, sortKey, sortOrder]);

    const topNData = useMemo(() => {
        return filteredData.slice(0, limit);
    }, [filteredData, limit]);

    const metrics = useMemo(() => {
        const totalQueries = filteredData.length;
        const topNCredits = topNData.reduce((sum, q) => sum + q.costCredits, 0);
        const highestCredits = topNData.length > 0 ? topNData[0].costCredits : 0;
        const totalQasCredits = topNData.reduce((sum, q) => sum + (q.qasCredits || 0), 0);

        return {
            totalQueries,
            topNCredits,
            highestCredits,
            totalQasCredits
        };
    }, [filteredData, topNData]);

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const handleRowClick = (query: QueryListItem) => {
        onSelectQuery(query);
    };

    const getQueryName = (query: QueryListItem) => {
        const match = query.queryText.match(/\/\* (.*?) \*\//);
        return match ? match[1] : query.id;
    };

    return (
        <div className="flex flex-col h-full bg-background space-y-4 px-6 pt-6 pb-12 overflow-y-auto no-scrollbar">
            {/* Pill-style Summary Metrics */}
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Total credits" value={`${metrics.topNCredits.toFixed(1)} Credits`} />
                <KPILabel label="Query acceleration credits" value={`${(metrics.totalQasCredits / 1000).toFixed(1)}K`} />
            </div>

            {/* Integrated Table and Filters */}
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0 overflow-hidden">
                {/* Integrated Filter Bar */}
                <div className="px-4 py-3 flex items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-secondary">Warehouses</span>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                    value={warehouseFilter}
                                    onChange={(e) => setWarehouseFilter(e.target.value)}
                                >
                                    {warehouseOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.value === 'All' ? 'All' : opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                </div>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-border-light hidden md:block" />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-secondary">Users</span>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                >
                                    {userOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.value === 'All' ? 'All' : opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                </div>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-border-light hidden md:block" />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-secondary">Show</span>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                    value={limit.toString()}
                                    onChange={(e) => setLimit(parseInt(e.target.value))}
                                >
                                    {limitOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label.replace('Top ', '')}
                                        </option>
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
                        <div className="relative w-64">
                            <input 
                                type="text"
                                placeholder="Search queries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none text-[13px] font-medium focus:ring-0 placeholder:text-text-muted text-right pr-8"
                            />
                            <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer" />
                        </div>
                        <ColumnSelector 
                            columns={allColumns} 
                            visibleColumns={visibleColumns} 
                            onVisibleColumnsChange={setVisibleColumns} 
                            defaultColumns={['queryId', 'warehouse', 'user', 'totalCredits']} 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="text-[11px] text-text-strong uppercase font-bold sticky top-0 z-10 bg-[#F8F9FA] border-b border-border-light">
                            <tr>
                                {visibleColumns.includes('queryId') && <th className="px-6 py-4 text-left border-b border-border-light">Query ID</th>}
                                {visibleColumns.includes('warehouse') && <th className="px-6 py-4 text-left border-b border-border-light">Warehouse</th>}
                                {visibleColumns.includes('user') && <th className="px-6 py-4 text-left border-b border-border-light">User</th>}
                                {visibleColumns.includes('totalCredits') && (
                                    <th 
                                        className="px-6 py-4 text-left border-b border-border-light cursor-pointer hover:bg-surface-hover transition-colors group"
                                        onClick={() => handleSort('totalCredits')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Total Cr...
                                            {sortKey === 'totalCredits' && (
                                                <IconChevronDown className={`w-3 h-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.includes('computeCredits') && <th className="px-6 py-4 text-left border-b border-border-light">Compu...</th>}
                                {visibleColumns.includes('qasCredits') && <th className="px-6 py-4 text-left border-b border-border-light">QAS Cre...</th>}
                                {visibleColumns.includes('duration') && (
                                    <th 
                                        className="px-6 py-4 text-left border-b border-border-light cursor-pointer hover:bg-surface-hover transition-colors group"
                                        onClick={() => handleSort('duration')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Duration
                                            {sortKey === 'duration' && (
                                                <IconChevronDown className={`w-3 h-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {topNData.map((query) => (
                                <tr key={query.id} className="group hover:bg-surface-hover transition-colors cursor-pointer border-b border-border-light last:border-0" onClick={() => handleRowClick(query)}>
                                    {visibleColumns.includes('queryId') && (
                                        <td className="px-6 py-4">
                                            <span className="text-link font-mono text-xs font-medium hover:underline">
                                                {query.id}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.includes('warehouse') && <td className="px-6 py-4 text-text-secondary font-medium">{query.warehouse}</td>}
                                    {visibleColumns.includes('user') && <td className="px-6 py-4 text-text-secondary font-medium">{query.user}</td>}
                                    {visibleColumns.includes('totalCredits') && <td className="px-6 py-4 text-text-secondary font-medium">{query.costCredits.toFixed(0)}</td>}
                                    {visibleColumns.includes('computeCredits') && <td className="px-6 py-4 text-text-secondary font-medium">{query.computeCredits.toFixed(0)}</td>}
                                    {visibleColumns.includes('qasCredits') && <td className="px-6 py-4 text-text-secondary font-medium">{query.qasCredits.toFixed(0)}</td>}
                                    {visibleColumns.includes('duration') && <td className="px-6 py-4 text-text-secondary font-medium">{query.duration}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpensiveQueriesView;
