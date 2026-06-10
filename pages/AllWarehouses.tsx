import React, { useState, useMemo, useEffect } from 'react';
import { Warehouse, WarehouseHealth } from '../types';
import { IconArrowUp, IconArrowDown, IconSearch, IconSparkles, IconInfo, IconChevronRight } from '../constants';
import Pagination from '../components/Pagination';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import InfoTooltip from '../components/InfoTooltip';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const HealthBadge: React.FC<{ health: WarehouseHealth }> = ({ health }) => {
    const styles = {
        'Optimized': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Under-utilized': 'bg-amber-50 text-amber-900 border-amber-200',
        'Over-provisioned': 'bg-red-50 text-red-900 border-red-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded border ${styles[health]}`}>
            {health.replace('-', ' ')}
        </span>
    );
};

interface AllWarehousesProps {
    warehouses: Warehouse[];
    onSelectWarehouse: (warehouse: Warehouse) => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    initialHealthFilter?: string[];
}

const AllWarehouses: React.FC<AllWarehousesProps> = ({ warehouses, onSelectWarehouse, onNavigateToRecommendations, initialHealthFilter }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [search, setSearch] = useState('');
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [healthFilter, setHealthFilter] = useState<string[]>(initialHealthFilter || []);

    const warehouseSizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'];
    const healthOptions = ['Optimized', 'Under-utilized', 'Over-provisioned'];

    // Mock trend data for graphs
    const usageTrendData = [
        { date: 'Oct 01', credits: 45 }, { date: 'Oct 05', credits: 62 }, { date: 'Oct 10', credits: 55 },
        { date: 'Oct 15', credits: 82 }, { date: 'Oct 20', credits: 74 }, { date: 'Oct 25', credits: 91 },
        { date: 'Oct 30', credits: 110 }
    ];

    const loadDistributionData = warehouses.slice(0, 8).map(w => ({
        name: w.name,
        load: Math.floor(Math.random() * 60) + 20
    }));

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sizeFilter, healthFilter, itemsPerPage]);

    const warehousesWithInsights = useMemo(() => {
        return warehouses.map(wh => ({
            ...wh,
            insightCount: wh.health === 'Optimized' ? 0 : Math.floor(Math.random() * 3) + 1
        }));
    }, [warehouses]);

    const filteredAndSortedWarehouses = useMemo(() => {
        let filtered = warehousesWithInsights.filter(wh => {
            if (search && !wh.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (sizeFilter.length > 0 && !sizeFilter.includes(wh.size)) return false;
            if (healthFilter.length > 0 && !healthFilter.includes(wh.health)) return false;
            return true;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [warehousesWithInsights, search, sizeFilter, healthFilter, sortConfig]);

    const activePills = useMemo(() => {
        const totalCredits = filteredAndSortedWarehouses.reduce((sum, wh) => sum + (wh.credits || 0), 0);
        const totalQueries = filteredAndSortedWarehouses.reduce((sum, wh) => sum + (wh.queriesExecuted || 0), 0);
        
        return [
            { label: 'Total warehouses', value: filteredAndSortedWarehouses.length.toString() },
            { label: 'Total compute credits', value: `${totalCredits.toLocaleString()} K` },
            { label: 'Total queries', value: totalQueries.toLocaleString() }
        ];
    }, [filteredAndSortedWarehouses]);

    const totalPages = Math.ceil(filteredAndSortedWarehouses.length / itemsPerPage);
    const paginatedData = useMemo(() => filteredAndSortedWarehouses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedWarehouses, currentPage, itemsPerPage]);

    const requestSort = (key: keyof Warehouse) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof Warehouse }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="h-4 w-4 ml-1" />;
    };

    return (
        <div className="px-6 pt-6 pb-12 flex flex-col space-y-6 overflow-y-auto no-scrollbar h-full">
            <div className="mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Warehouse</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Manage, monitor health, and optimize all compute clusters in this account.</p>
            </div>

            {/* KPI Pills at top of tab */}
            <div className="flex flex-wrap items-center gap-3 mb-4 overflow-x-auto no-scrollbar flex-shrink-0">
                {activePills.map((pill, idx) => (
                    <KPILabel key={idx} label={pill.label} value={pill.value} />
                ))}
            </div>

            {/* Main Inventory Table */}
            <div className="bg-white rounded-2xl flex flex-col shadow-sm border border-border-light overflow-hidden flex-shrink-0">
                <div className="p-4 flex flex-wrap items-center gap-6 border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <MultiSelectDropdown label="Size" options={warehouseSizes} selectedOptions={sizeFilter} onChange={setSizeFilter} selectionMode="single" />
                        <div className="w-px h-4 bg-border-color hidden sm:block"></div>
                        <MultiSelectDropdown label="Health status" options={healthOptions} selectedOptions={healthFilter} onChange={setHealthFilter} selectionMode="single" />
                    </div>
                    <div className="relative flex-grow ml-auto max-w-xs">
                        <IconSearch className="h-4 w-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search warehouses..."
                            className="w-full pl-9 pr-4 py-1.5 bg-background border-transparent rounded-full text-[11px] font-medium focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10 font-bold uppercase tracking-widest text-[10px] text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left border-b border-border-color"><button onClick={() => requestSort('name')} className="group flex items-center">Warehouse <SortIcon columnKey="name" /></button></th>
                                <th scope="col" className="px-6 py-4 text-left border-b border-border-color"><button onClick={() => requestSort('health')} className="group flex items-center">Health <SortIcon columnKey="health" /></button></th>
                                <th scope="col" className="px-6 py-4 text-left border-b border-border-color"><button onClick={() => requestSort('size')} className="group flex items-center">Size <SortIcon columnKey="size" /></button></th>
                                <th scope="col" className="px-6 py-4 text-left border-b border-border-color"><button onClick={() => requestSort('credits')} className="group flex items-center">Compute credits <SortIcon columnKey="credits" /></button></th>
                                <th scope="col" className="px-6 py-4 text-right border-b border-border-color">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedData.map(wh => (
                                <tr key={wh.id} className="hover:bg-surface-nested group transition-colors">
                                    <td className="px-6 py-5 font-bold text-link whitespace-nowrap">
                                        <button onClick={() => onSelectWarehouse(wh)} className="hover:underline focus:outline-none">
                                            {wh.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5">
                                        <HealthBadge health={wh.health} />
                                    </td>
                                    <td className="px-6 py-5 font-medium text-text-primary">{wh.size}</td>
                                    <td className="px-6 py-5 font-black text-text-strong">{wh.credits.toLocaleString()} cr</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                onClick={() => onNavigateToRecommendations?.({ search: wh.name })}
                                                className="inline-flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="text-xs font-black">{wh.insightCount}</span>
                                                <span className="text-[9px] font-bold uppercase">Insights</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredAndSortedWarehouses.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>

            {/* Analytic Section below the table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                {/* Usage Trend Card */}
                <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                             <h3 className="text-sm font-black text-text-strong uppercase tracking-[0.15em]">Aggregate usage trend</h3>
                             <InfoTooltip text="Total credit usage trend for all warehouses in this account over the last 30 days." position="bottom" />
                        </div>
                    </div>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usageTrendData}>
                                <defs>
                                    <linearGradient id="usageGradientWH" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#usageGradientWH)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-[11px] text-text-secondary font-medium italic">
                        * Note: High volatility detected around Oct 15 due to large ETL processing window.
                    </p>
                </div>

                {/* Load distribution card */}
                <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                             <h3 className="text-sm font-black text-text-strong uppercase tracking-[0.15em]">Cluster load distribution</h3>
                             <InfoTooltip text="Average load percentage for the most active warehouses." position="bottom" />
                        </div>
                    </div>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={loadDistributionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#5A5A72', fontWeight: 700}} width={90} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="load" fill="#A78BFA" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <p className="mt-4 text-[11px] text-text-secondary font-medium italic">
                        * Recommendation: Scaling up overloaded clusters can reduce query queueing and improve end-user latency.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllWarehouses;