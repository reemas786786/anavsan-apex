
import React, { useState, useMemo } from 'react';
import { databaseTablesData, materializedViewsData, tasksData } from '../data/dummyData';
import { formatStorageSize } from '../utils/storageMetrics';
import { IconSearch, IconChevronDown } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

interface TablesViewProps {
    initialTableTypeFilter?: string | null;
    initialDatabaseFilter?: string | null;
    initialSchemaFilter?: string | null;
    forceTab?: 'Tables' | 'Materialized Views' | 'Tasks';
}

const TablesView: React.FC<TablesViewProps> = ({ 
    initialTableTypeFilter, 
    initialDatabaseFilter, 
    initialSchemaFilter,
    forceTab
}) => {
    const [activeTab, setActiveTab] = useState<'Tables' | 'Materialized Views' | 'Tasks'>(forceTab || 'Tables');

    // Update activeTab if forceTab changes
    React.useEffect(() => {
        if (forceTab) {
            setActiveTab(forceTab);
        }
    }, [forceTab]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDb, setSelectedDb] = useState(initialDatabaseFilter || 'All databases');
    const [selectedSchema, setSelectedSchema] = useState(initialSchemaFilter || 'All schemas');
    const [selectedTableType, setSelectedTableType] = useState(initialTableTypeFilter || 'All types');

    const dbOptions = useMemo(() => {
        const dbs = Array.from(new Set(databaseTablesData.map(t => t.databaseName).filter(Boolean)));
        return ['All databases', ...dbs.sort()];
    }, []);

    const schemaOptions = useMemo(() => {
        let sourceData: any[] = [];
        if (activeTab === 'Tables') sourceData = databaseTablesData;
        else if (activeTab === 'Materialized Views') sourceData = materializedViewsData;
        else sourceData = tasksData;

        const filteredByDb = selectedDb === 'All databases' 
            ? sourceData 
            : sourceData.filter((t: any) => t.databaseName === selectedDb);
        const schemas = Array.from(new Set(filteredByDb.map((t: any) => t.schemaName)));
        return ['All schemas', ...schemas.sort()];
    }, [selectedDb, activeTab]);

    const tableTypeOptions = ['All types', 'Permanent', 'Transient', 'Temporary', 'Hybrid', 'Dynamic'];

    const filteredTables = useMemo(() => {
        return databaseTablesData.filter(table => {
            const matchesSearch = !searchQuery || 
                table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                table.schemaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                table.databaseName?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesDb = selectedDb === 'All databases' || table.databaseName === selectedDb;
            const matchesSchema = selectedSchema === 'All schemas' || table.schemaName === selectedSchema;
            const matchesType = selectedTableType === 'All types' || table.tableType === selectedTableType;

            return matchesSearch && matchesDb && matchesSchema && matchesType;
        });
    }, [searchQuery, selectedDb, selectedSchema, selectedTableType]);

    const filteredMVs = useMemo(() => {
        return materializedViewsData.filter(mv => {
            const matchesSearch = !searchQuery || 
                mv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mv.schemaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mv.databaseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDb = selectedDb === 'All databases' || mv.databaseName === selectedDb;
            const matchesSchema = selectedSchema === 'All schemas' || mv.schemaName === selectedSchema;
            return matchesSearch && matchesDb && matchesSchema;
        });
    }, [searchQuery, selectedDb, selectedSchema]);

    const filteredTasks = useMemo(() => {
        return tasksData.filter(task => {
            const matchesSearch = !searchQuery || 
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.schemaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.databaseName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDb = selectedDb === 'All databases' || task.databaseName === selectedDb;
            return matchesSearch && matchesDb;
        });
    }, [searchQuery, selectedDb]);

    const aggregateMetrics = useMemo(() => {
        if (activeTab === 'Tables') {
            const totalSize = filteredTables.reduce((sum, t) => sum + t.totalSizeGB, 0);
            const totalRows = filteredTables.reduce((sum, t) => sum + t.rows, 0);
            return {
                count: filteredTables.length,
                size: formatStorageSize(totalSize),
                extra: `${totalRows.toLocaleString()} rows`
            };
        } else if (activeTab === 'Materialized Views') {
            const totalSize = filteredMVs.reduce((sum, mv) => sum + mv.sizeGB, 0);
            const totalCredits = filteredMVs.reduce((sum, mv) => sum + mv.credits, 0);
            return {
                count: filteredMVs.length,
                size: formatStorageSize(totalSize),
                extra: `${totalCredits.toFixed(1)} credits`
            };
        } else {
            const totalCredits = filteredTasks.reduce((sum, task) => sum + task.credits, 0);
            return {
                count: filteredTasks.length,
                size: 'N/A',
                extra: `${totalCredits.toFixed(1)} credits`
            };
        }
    }, [activeTab, filteredTables, filteredMVs, filteredTasks]);

    const tabs = ['Tables', 'Materialized Views', 'Tasks'] as const;

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Tabs - only show if not forced */}
            {!forceTab && (
                <div className="flex items-center gap-1 bg-surface-nested p-1 rounded-xl border border-border-light w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
                                activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-text-muted hover:text-text-strong'
                            }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm rounded-lg border border-border-light"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label={activeTab} value={aggregateMetrics.count.toString()} />
                {activeTab !== 'Tasks' && <KPILabel label="Total size" value={aggregateMetrics.size} />}
                <KPILabel label={activeTab === 'Tables' ? 'Total rows' : 'Total credits'} value={aggregateMetrics.extra} />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0">
                <div className="px-4 py-3 flex items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-secondary">Database</span>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                    value={selectedDb}
                                    onChange={(e) => {
                                        setSelectedDb(e.target.value);
                                        setSelectedSchema('All schemas');
                                    }}
                                >
                                    {dbOptions.map(opt => <option key={opt} value={opt}>{opt === 'All databases' ? 'All' : opt}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                </div>
                            </div>
                        </div>

                        {(activeTab === 'Tables' || activeTab === 'Materialized Views') && (
                            <>
                                <div className="h-4 w-[1px] bg-border-light" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-text-secondary">Schema</span>
                                    <div className="relative">
                                        <select
                                            className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                            value={selectedSchema}
                                            onChange={(e) => setSelectedSchema(e.target.value)}
                                        >
                                            {schemaOptions.map(opt => <option key={opt} value={opt}>{opt === 'All schemas' ? 'All' : opt}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                            <IconChevronDown className="h-3 w-3 text-text-muted" />
                                        </div>
                                    </div>
                                </div>

                                {activeTab === 'Tables' && (
                                    <>
                                        <div className="h-4 w-[1px] bg-border-light" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-text-secondary">Type</span>
                                            <div className="relative">
                                                <select
                                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                                    value={selectedTableType}
                                                    onChange={(e) => setSelectedTableType(e.target.value)}
                                                >
                                                    {tableTypeOptions.map(opt => <option key={opt} value={opt}>{opt === 'All types' ? 'All' : opt}</option>)}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="relative flex-1 ml-4">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-full text-right"
                            placeholder={`Search ${activeTab.toLowerCase()}...`}
                        />
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                                    {activeTab === 'Tables' && (
                                        <tr>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Tables</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Databases</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Schemas</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Table types</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Size (GB)</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Credits</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Rows</th>
                                        </tr>
                                    )}
                                    {activeTab === 'Materialized Views' && (
                                        <tr>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Materialized View</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Database</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Schema</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Size (GB)</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Credits</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Last Refreshed</th>
                                        </tr>
                                    )}
                                    {activeTab === 'Tasks' && (
                                        <tr>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Task Name</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Database</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Schema</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Status</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Credits</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Last Run</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="bg-white divide-y divide-border-light">
                                    {activeTab === 'Tables' && (
                                        filteredTables.length > 0 ? (
                                            filteredTables.map((table, idx) => (
                                                <tr key={idx} className="hover:bg-surface-nested transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-text-primary">{table.name}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{table.databaseName}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{table.schemaName}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{table.tableType || 'Permanent'}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-black text-primary">{formatStorageSize(table.totalSizeGB)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-black text-text-strong">{(table.totalSizeGB / 100).toFixed(1)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{table.rows.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No tables found.</td></tr>
                                        )
                                    )}
                                    {activeTab === 'Materialized Views' && (
                                        filteredMVs.length > 0 ? (
                                            filteredMVs.map((mv, idx) => (
                                                <tr key={idx} className="hover:bg-surface-nested transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-text-primary">{mv.name}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{mv.databaseName}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{mv.schemaName}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-black text-primary">{formatStorageSize(mv.sizeGB)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-black text-text-strong">{mv.credits.toFixed(1)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{new Date(mv.lastRefreshed).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No materialized views found.</td></tr>
                                        )
                                    )}
                                    {activeTab === 'Tasks' && (
                                        filteredTasks.length > 0 ? (
                                            filteredTasks.map((task, idx) => (
                                                <tr key={idx} className="hover:bg-surface-nested transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-text-primary">{task.name}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{task.databaseName}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">{task.schemaName}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">{task.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-right font-black text-text-strong">{task.credits.toFixed(1)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{new Date(task.lastRun).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No tasks found.</td></tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TablesView;
