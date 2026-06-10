import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    totalStorageMetrics,
    storageGrowthForecast,
    topStorageConsumersData,
    storageGrowthData
} from '../data/dummyData';
import { IconSearch, IconDotsVertical } from '../constants';
import { TopStorageConsumer } from '../types';
import TimeRangeFilter, { TimeRange } from '../components/TimeRangeFilter';
import InfoTooltip from '../components/InfoTooltip';

// Widget Card wrapper for consistent styling
const WidgetCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 flex flex-col ${className}`}>
        {children}
    </div>
);

// Sort Indicator Component
const SortIndicator: React.FC<{ direction: 'ascending' | 'descending' | null }> = ({ direction }) => {
    if (!direction) {
        return (
            <svg className="w-4 h-4 inline-block ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
        );
    }
    const d = direction === 'ascending' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7";
    return (
        <svg className="w-4 h-4 inline-block ml-1 text-text-secondary" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
        </svg>
    );
};

interface WidgetProps {
    handleMenuClick: (id: string) => void;
    openMenu: string | null;
    menuRef: React.RefObject<HTMLDivElement>;
}

// 1. Total Storage Widget with nested forecast
const TotalStorageWidget: React.FC<WidgetProps> = ({ handleMenuClick, openMenu, menuRef }) => (
    <WidgetCard>
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <h3 className="text-base font-semibold text-text-strong">Total Storage</h3>
                <InfoTooltip text="Total active storage usage and the forecasted usage for the next month." position="bottom" />
            </div>
            <div className="relative" ref={openMenu === 'total-storage' ? menuRef : null}>
                <button
                    onClick={() => handleMenuClick('total-storage')}
                    className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                    aria-label="Total storage options"
                    aria-haspopup="true"
                    aria-expanded={openMenu === 'total-storage'}
                >
                    <IconDotsVertical className="h-5 w-5" />
                </button>
                 {openMenu === 'total-storage' && (
                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-border-color z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <button onClick={() => {}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="space-y-4 flex-grow flex flex-col">
            <div className="bg-surface-nested p-4 rounded-3xl">
                <p className="text-text-secondary text-sm">Total storage</p>
                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">{totalStorageMetrics.totalSizeGB.toLocaleString()} GB</p>
            </div>
            <div className="bg-surface-nested p-4 rounded-3xl">
                <p className="text-text-secondary text-sm">Forecasted storage</p>
                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">{storageGrowthForecast.nextMonthSizeGB.toLocaleString()} GB</p>
            </div>
        </div>
    </WidgetCard>
);

// 2. Storage Cost Widget with nested forecast
const StorageCostWidget: React.FC<WidgetProps> = ({ handleMenuClick, openMenu, menuRef }) => (
    <WidgetCard>
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <h3 className="text-base font-semibold text-text-strong">Storage Cost</h3>
                <InfoTooltip text="Estimated monthly storage cost based on current usage and the forecasted cost for next month." position="bottom" />
            </div>
            <div className="relative" ref={openMenu === 'storage-cost' ? menuRef : null}>
                <button
                    onClick={() => handleMenuClick('storage-cost')}
                    className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                    aria-label="Storage cost options"
                    aria-haspopup="true"
                    aria-expanded={openMenu === 'storage-cost'}
                >
                    <IconDotsVertical className="h-5 w-5" />
                </button>
                 {openMenu === 'storage-cost' && (
                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-border-color z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                             <button onClick={() => {}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="space-y-4 flex-grow flex flex-col">
            <div className="bg-surface-nested p-4 rounded-3xl">
                <p className="text-text-secondary text-sm">Current storage cost</p>
                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">${totalStorageMetrics.totalCost.toLocaleString()}.00</p>
            </div>
            <div className="bg-surface-nested p-4 rounded-3xl">
                <p className="text-text-secondary text-sm">Forecasted cost</p>
                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">${storageGrowthForecast.nextMonthCost.toLocaleString()}.00</p>
            </div>
        </div>
    </WidgetCard>
);

// 3. Storage Analysis Table Widget
const StorageAnalysisTableWidget: React.FC<WidgetProps> = ({ handleMenuClick, openMenu, menuRef }) => {
    type SortKeys = keyof Pick<TopStorageConsumer, 'name' | 'size' | 'rows'>;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' }>({ key: 'size', direction: 'descending' });

    const sortedAndFilteredData = useMemo(() => {
        let filteredData = topStorageConsumersData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig !== null) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? 0;
                const bValue = b[sortConfig.key] ?? 0;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    }, [searchTerm, sortConfig]);

    const requestSort = (key: SortKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <SortIndicator direction={null} />;
        }
        return <SortIndicator direction={sortConfig.direction} />;
    };

    return (
        <WidgetCard>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <h3 className="text-base font-semibold text-text-strong">Table Storage Analysis</h3>
                    <InfoTooltip text="Detailed breakdown of storage usage by table, sortable by size and row count." position="bottom" />
                </div>
                <div className="relative" ref={openMenu === 'storage-table' ? menuRef : null}>
                    <button
                        onClick={() => handleMenuClick('storage-table')}
                        className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                    >
                        <IconDotsVertical className="h-5 w-5" />
                    </button>
                    {openMenu === 'storage-table' && (
                         <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-border-color z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button onClick={() => {}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
             <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-text-muted" />
                </div>
                <input
                    type="search"
                    placeholder="Filter tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                    aria-label="Filter tables by name"
                />
            </div>
            <div className="overflow-auto flex-grow">
                <table className="w-full text-sm">
                    <thead className="text-left text-xs text-text-primary sticky top-0 bg-table-header-bg z-10">
                        <tr>
                            <th scope="col" className="py-2 px-3 font-medium">
                                <button onClick={() => requestSort('name')} className="group flex items-center w-full text-left focus:outline-none focus:text-text-primary" aria-sort={sortConfig?.key === 'name' ? sortConfig.direction : 'none'}>
                                    Table Name {getSortIndicator('name')}
                                </button>
                            </th>
                            <th scope="col" className="py-2 px-3 font-medium text-right">
                                <button onClick={() => requestSort('size')} className="group flex items-center w-full justify-end focus:outline-none focus:text-text-primary" aria-sort={sortConfig?.key === 'size' ? sortConfig.direction : 'none'}>
                                    Size (GB) {getSortIndicator('size')}
                                </button>
                            </th>
                            <th scope="col" className="py-2 px-3 font-medium text-right">
                                 <button onClick={() => requestSort('rows')} className="group flex items-center w-full justify-end focus:outline-none focus:text-text-primary" aria-sort={sortConfig?.key === 'rows' ? sortConfig.direction : 'none'}>
                                    Rows {getSortIndicator('rows')}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {sortedAndFilteredData.map(item => (
                            <tr key={item.name} className="hover:bg-surface-hover">
                                <td className="py-2.5 px-3 font-mono text-xs text-text-primary">{item.name}</td>
                                <td className="py-2.5 px-3 text-right font-semibold text-text-primary">{item.size.toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-right text-text-secondary">{item.rows?.toLocaleString() ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </WidgetCard>
    );
};

// 4. Storage Growth Trends Widget
const StorageGrowthTrendsWidget: React.FC<WidgetProps> = ({ handleMenuClick, openMenu, menuRef }) => (
    <WidgetCard>
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <h3 className="text-base font-semibold text-text-strong">Storage Growth Trends</h3>
                <InfoTooltip text="Historical storage usage growth." position="bottom" />
            </div>
            <div className="relative" ref={openMenu === 'storage-growth' ? menuRef : null}>
                 <button onClick={() => handleMenuClick('storage-growth')} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none">
                    <IconDotsVertical className="h-5 w-5" />
                 </button>
                 {openMenu === 'storage-growth' && (
                     <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-border-color z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <button onClick={() => {}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
        <div style={{ height: 300 }} className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={storageGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9A9AB2" fontSize={12} unit=" GB" tickFormatter={(value) => value.toLocaleString()} tickLine={false} axisLine={false}/>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                        labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                        formatter={(value: number, name: string) => [`${value.toLocaleString()} GB`, name]}
                    />
                    <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6932D5" stopOpacity={0.7}/>
                            <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="Active Storage (GB)" stroke="#6932D5" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </WidgetCard>
);

// Main Component
const StorageOptimizationView: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('day');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (menuId: string) => {
        setOpenMenu(prev => (prev === menuId ? null : menuId));
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-end items-center">
                <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TotalStorageWidget handleMenuClick={handleMenuClick} openMenu={openMenu} menuRef={menuRef} />
                <StorageCostWidget handleMenuClick={handleMenuClick} openMenu={openMenu} menuRef={menuRef} />
                <StorageAnalysisTableWidget handleMenuClick={handleMenuClick} openMenu={openMenu} menuRef={menuRef} />
                <StorageGrowthTrendsWidget handleMenuClick={handleMenuClick} openMenu={openMenu} menuRef={menuRef} />
            </div>
        </div>
    );
};

export default StorageOptimizationView;
