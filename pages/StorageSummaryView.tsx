
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from 'recharts';
import { storageSummaryData, storageGrowthData, databasesData, storageByTypeData, databaseTablesData, unusedTablesData } from '../data/dummyData';
import { calculateStorageMetrics, formatStorageSize } from '../utils/storageMetrics';
import InfoTooltip from '../components/InfoTooltip';
import { BigScreenWidget, TableType } from '../types';
import { IconDotsVertical, IconList, IconInfo } from '../constants';
import SidePanel from '../components/SidePanel';
import TableView from '../components/TableView';


const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string, actions?: React.ReactNode }> = ({ children, className = '', title, actions }) => (
    <div className={`bg-surface p-6 rounded-[24px] shadow-sm flex flex-col border border-border-light h-full ${className}`}>
        {(title || actions) && (
            <div className="flex justify-between items-center mb-6">
                {title && (
                    <div className="flex items-center gap-1.5">
                        <h4 className="text-[14px] font-bold text-text-strong tracking-tight">{title}</h4>
                        <IconInfo className="w-4 h-4 text-[#9A9AB2] cursor-help" />
                    </div>
                )}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        )}
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

interface WidgetActionMenuProps {
    widgetId: string;
    onExpand: () => void;
    onTableView: (() => void) | null;
    onDownload: () => void;
    openMenu: string | null;
    handleMenuClick: (id: string) => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

const WidgetActionMenu: React.FC<WidgetActionMenuProps> = ({ widgetId, onExpand, onTableView, onDownload, openMenu, handleMenuClick, menuRef }) => (
    <div className="relative" ref={openMenu === widgetId ? menuRef : null}>
        <button
            onClick={() => handleMenuClick(widgetId)}
            className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
            aria-label={`${widgetId} options`}
            aria-haspopup="true"
            aria-expanded={openMenu === widgetId}
        >
            <IconDotsVertical className="h-5 w-5" />
        </button>
        {openMenu === widgetId && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                    <button onClick={onExpand} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Expand View</button>
                    {onTableView && <button onClick={onTableView} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>}
                    <button onClick={onDownload} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                </div>
            </div>
        )}
    </div>
);


const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const StorageSummaryView: React.FC<{ 
    onSelectDatabase: (databaseId: string) => void, 
    onSetBigScreenWidget: (widget: BigScreenWidget) => void,
    onNavigate: (page: string, filters?: { tableType?: string; database?: string; schema?: string }) => void
}> = ({ onSelectDatabase, onSetBigScreenWidget, onNavigate }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [tableViewData, setTableViewData] = useState<{
        title: string;
        data: { name: string; cost: number; credits: number; percentage: number }[];
    } | null>(null);

    const metrics = useMemo(() => calculateStorageMetrics(databaseTablesData, databasesData, unusedTablesData), []);
    
    const tableTypeMetrics = useMemo(() => {
        const types: TableType[] = ['Permanent', 'Transient', 'Temporary', 'Hybrid', 'Dynamic'];
        const result: Record<string, { count: number, size: number }> = {};
        types.forEach(t => result[t] = { count: 0, size: 0 });
        
        databaseTablesData.forEach(t => {
            const type = t.tableType || 'Permanent';
            if (result[type]) {
                result[type].count += 1;
                result[type].size += t.totalSizeGB;
            }
        });
        return result;
    }, []);

    const topDatabasesBySize = [...databasesData].sort((a, b) => b.sizeGB - a.sizeGB).slice(0, 8);
    
    const schemasBySize = useMemo(() => {
        const map: Record<string, number> = {};
        databaseTablesData.forEach(t => {
            map[t.schemaName] = (map[t.schemaName] || 0) + t.totalSizeGB;
        });
        return Object.entries(map)
            .map(([name, size]) => ({ name, size }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 8);
    }, []);

    const topTablesBySize = [...databaseTablesData].sort((a, b) => b.totalSizeGB - a.totalSizeGB).slice(0, 8);

    const storageByTypeChartData = [
        { type: 'Active bytes', storageGB: 45000, color: '#6932D5' },
        { type: 'Staged bytes', storageGB: 800, color: '#A78BFA' },
        { type: 'Time travel', storageGB: 1500, color: '#C4B5FD' },
        { type: 'Failsafe', storageGB: 200, color: '#D1D1E9' },
        { type: 'Hybrid bytes', storageGB: 120, color: '#E5E5F7' },
    ];
    const totalStorageByType = storageByTypeChartData.reduce((sum, item) => sum + item.storageGB, 0);

    const failsafeData = storageByTypeData.find(d => d.type === 'Fail-safe');
    const timeTravelData = storageByTypeData.find(d => d.type === 'Time Travel');
    const totalUnusedGB = unusedTablesData.reduce((sum, t) => sum + t.sizeGB, 0);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (menuId: string) => {
        setOpenMenu(prev => (prev === menuId ? null : menuId));
    };

    const downloadCSV = (content: string, fileName: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.replace(/\s+/g, '_')}_${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadCSV = (widgetType: string) => {
        let headers: string[] = [];
        let dataRows: (string | number)[][] = [];
        let fileName = '';

        switch (widgetType) {
            case 'top-db-size':
                fileName = 'top_databases_by_size';
                headers = ['Database Name', 'Size (GB)'];
                dataRows = databasesData.map(db => [db.name, db.sizeGB]);
                break;
            case 'top-schema-size':
                fileName = 'top_schemas_by_size';
                headers = ['Schema Name', 'Size (GB)'];
                dataRows = schemasBySize.map(s => [s.name, s.size]);
                break;
            case 'top-table-size':
                fileName = 'top_tables_by_size';
                headers = ['Table Name', 'Size (GB)'];
                dataRows = databaseTablesData.map(t => [t.name, t.totalSizeGB]);
                break;
            case 'storage-by-type':
                fileName = 'storage_by_type';
                headers = ['Storage Type', 'Storage (GB)', 'Cost ($)'];
                dataRows = storageByTypeData.map(item => [item.type, item.storageGB, item.cost]);
                break;
            case 'storage-growth':
                fileName = 'storage_growth_trend';
                headers = ['Date', 'Active Storage (GB)', 'Time Travel (GB)'];
                dataRows = storageGrowthData.map(item => [item.date, item['Active Storage (GB)'], item['Time Travel (GB)']]);
                break;
        }
        
        if (headers.length > 0) {
            const csvContent = [headers.join(','), ...dataRows.map(row => row.join(','))].join('\n');
            downloadCSV(csvContent, fileName);
        }
        setOpenMenu(null);
    };

    const handleOpenTableView = (widgetType: string) => {
        if (widgetType === 'top-db-size') {
            const totalSize = databasesData.reduce((acc, db) => acc + db.sizeGB, 0);
            setTableViewData({
                title: 'Top databases by size',
                data: databasesData.map(db => ({
                    name: db.name,
                    cost: db.sizeGB,
                    credits: db.sizeGB,
                    percentage: totalSize > 0 ? (db.sizeGB / totalSize) * 100 : 0
                }))
            });
        } else if (widgetType === 'storage-by-type') {
            const totalCost = storageByTypeData.reduce((acc, item) => acc + item.cost, 0);
            setTableViewData({
                title: 'Storage by type',
                data: storageByTypeData.map(item => ({
                    name: item.type,
                    cost: item.cost,
                    credits: item.storageGB,
                    percentage: totalCost > 0 ? (item.cost / totalCost) * 100 : 0
                }))
            });
        }
        setOpenMenu(null);
    };

    return (
        <div className="flex flex-col h-full gap-4 bg-background overflow-y-auto no-scrollbar">
            <WidgetCard 
                title="Storage summary"
                actions={
                    <>
                        <button className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary transition-colors">
                            <IconList className="w-5 h-5" />
                        </button>
                        <WidgetActionMenu
                            widgetId="storage-summary"
                            openMenu={openMenu}
                            handleMenuClick={handleMenuClick}
                            menuRef={menuRef}
                            onExpand={() => {}}
                            onTableView={null}
                            onDownload={() => {}}
                        />
                    </>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                        onClick={() => onNavigate('Databases')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Total credits</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{(storageSummaryData.totalCredits / 1000).toFixed(1)}K</p>
                            <p className="text-[10px] font-bold text-[#5A5A72] mt-1 tracking-tight">{formatStorageSize(metrics.totalSizeGB)}</p>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate('Databases')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Databases</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{metrics.databaseCount}</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => onNavigate('Schemas')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Schemas</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{metrics.schemaCount}</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => onNavigate('Schema objects')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Schema objects</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{metrics.tableCount}</p>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <button 
                        onClick={() => onNavigate('Unused tables')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Unused tables</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{metrics.unusedTableCount}</p>
                            <p className="text-[10px] font-bold text-[#5A5A72] mt-1 tracking-tight">{formatStorageSize(metrics.unusedSizeGB)}</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => onNavigate('Databases')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Failsafe</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{formatStorageSize(metrics.failSafeSizeGB)}</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => onNavigate('Databases')}
                        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
                    >
                        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">Time travel</p>
                        <div className="mt-auto">
                            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{formatStorageSize(metrics.timeTravelSizeGB)}</p>
                        </div>
                    </button>
                </div>
            </WidgetCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Table Type Widget */}
                <WidgetCard title="Table type">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <button 
                            onClick={() => onNavigate('Schema objects', { tableType: 'Permanent' })}
                            className="bg-surface-nested p-4 rounded-2xl border border-border-light/50 col-span-1 text-left hover:border-primary/40 hover:bg-surface-hover transition-all group"
                        >
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Permanent</p>
                            <p className="text-2xl font-black text-text-strong">{tableTypeMetrics['Permanent'].count}</p>
                            <p className="text-xs font-bold text-text-muted mt-1">{formatStorageSize(tableTypeMetrics['Permanent'].size)}</p>
                        </button>
                        <button 
                            onClick={() => onNavigate('Schema objects', { tableType: 'Transient' })}
                            className="bg-surface-nested p-4 rounded-2xl border border-border-light/50 col-span-1 text-left hover:border-primary/40 hover:bg-surface-hover transition-all group"
                        >
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Transient</p>
                            <p className="text-2xl font-black text-text-strong">{tableTypeMetrics['Transient'].count}</p>
                            <p className="text-xs font-bold text-text-muted mt-1">{formatStorageSize(tableTypeMetrics['Transient'].size)}</p>
                        </button>
                        <div className="grid grid-cols-3 gap-4 col-span-2">
                            <button 
                                onClick={() => onNavigate('Schema objects', { tableType: 'Temporary' })}
                                className="bg-surface-nested p-4 rounded-2xl border border-border-light/50 text-left hover:border-primary/40 hover:bg-surface-hover transition-all group"
                            >
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Temporary</p>
                                <p className="text-xl font-black text-text-strong">{tableTypeMetrics['Temporary'].count}</p>
                                <p className="text-xs font-bold text-text-muted mt-1">{formatStorageSize(tableTypeMetrics['Temporary'].size)}</p>
                            </button>
                            <button 
                                onClick={() => onNavigate('Schema objects', { tableType: 'Hybrid' })}
                                className="bg-surface-nested p-4 rounded-2xl border border-border-light/50 text-left hover:border-primary/40 hover:bg-surface-hover transition-all group"
                            >
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Hybrid</p>
                                <p className="text-xl font-black text-text-strong">{tableTypeMetrics['Hybrid'].count}</p>
                                <p className="text-xs font-bold text-text-muted mt-1">{formatStorageSize(tableTypeMetrics['Hybrid'].size)}</p>
                            </button>
                            <button 
                                onClick={() => onNavigate('Schema objects', { tableType: 'Dynamic' })}
                                className="bg-surface-nested p-4 rounded-2xl border border-border-light/50 text-left hover:border-primary/40 hover:bg-surface-hover transition-all group"
                            >
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Dynamic</p>
                                <p className="text-xl font-black text-text-strong">{tableTypeMetrics['Dynamic'].count}</p>
                                <p className="text-xs font-bold text-text-muted mt-1">{formatStorageSize(tableTypeMetrics['Dynamic'].size)}</p>
                            </button>
                        </div>
                    </div>
                </WidgetCard>

                {/* Storage Type Widget */}
                <WidgetCard title="Storage type">
                    <div className="flex items-center gap-8 py-4">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={storageByTypeChartData}
                                        dataKey="storageGB"
                                        nameKey="type"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {storageByTypeChartData.map((entry) => (
                                            <Cell key={`cell-${entry.type}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-text-primary">64 TB</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-3">
                            {storageByTypeChartData.map(item => (
                                <div key={item.type} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-text-secondary font-medium">{item.type}</span>
                                    </div>
                                    <span className="font-bold text-text-strong">{(item.storageGB / 1000).toFixed(1)} TB</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </WidgetCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Storage Growth Trend */}
                <WidgetCard title="Storage growth trend">
                    <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={storageGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9A9AB2" fontSize={12} tickLine={false} axisLine={false}/>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                    labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
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

                {/* Top Database by Size */}
                <WidgetCard 
                    title="Top database by size"
                    actions={<button onClick={() => onNavigate('Databases')} className="text-xs font-bold text-primary hover:underline">View all</button>}
                >
                    <div className="h-80 mt-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topDatabasesBySize} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#9A9AB2" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} GB`} />
                                <YAxis dataKey="name" type="category" stroke="#9A9AB2" fontSize={12} width={100} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F0FA' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                />
                                <Bar dataKey="sizeGB" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* Top Schema by Size */}
                <WidgetCard 
                    title="Top schema by size"
                    actions={<button onClick={() => onNavigate('Databases')} className="text-xs font-bold text-primary hover:underline">View all</button>}
                >
                    <div className="h-80 mt-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={schemasBySize} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#9A9AB2" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} GB`} />
                                <YAxis dataKey="name" type="category" stroke="#9A9AB2" fontSize={12} width={100} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F0FA' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                />
                                <Bar dataKey="size" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* Top Table by Size */}
                <WidgetCard 
                    title="Top table by size"
                    actions={<button onClick={() => onNavigate('Databases')} className="text-xs font-bold text-primary hover:underline">View all</button>}
                >
                    <div className="h-80 mt-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topTablesBySize} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#9A9AB2" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} GB`} />
                                <YAxis dataKey="name" type="category" stroke="#9A9AB2" fontSize={12} width={100} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F0FA' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                                />
                                <Bar dataKey="totalSizeGB" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>
            </div>
            
            <SidePanel
                isOpen={!!tableViewData}
                onClose={() => setTableViewData(null)}
                title="Table View"
            >
                {tableViewData && (
                    <TableView
                        title={tableViewData.title}
                        data={tableViewData.data}
                    />
                )}
            </SidePanel>
        </div>
    );
};
export default StorageSummaryView;
