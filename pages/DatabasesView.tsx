
import React, { useState, useMemo } from 'react';
import { Database, DatabaseTable, User } from '../types';
import { databasesData, databaseTablesData, usersData } from '../data/dummyData';
import { formatStorageSize } from '../utils/storageMetrics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IconChevronLeft, IconSearch, IconAdjustments, IconChevronDown } from '../constants';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0" title={name}>
            {initials}
        </div>
    );
};

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const DatabaseDetailView: React.FC<{ database: Database, onBack: () => void }> = ({ database, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const users = useMemo(() => database.users.map(u => usersData.find(ud => ud.id === u.id)).filter((u): u is User => !!u), [database.users]);

    const tablesWithUsers = useMemo(() => {
        // Filter tables for this database
        let tables = databaseTablesData.filter(t => t.databaseName === database.name);
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            tables = tables.filter(t => 
                t.name.toLowerCase().includes(query) || 
                t.schemaName.toLowerCase().includes(query)
            );
        }

        if (users.length === 0) {
            return tables.map(table => ({...table, user: null}));
        }
        return tables.map(table => ({
            ...table,
            user: users[Math.floor(Math.random() * users.length)]
        }));
    }, [database.name, users, searchQuery]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-nested transition-all shadow-sm flex-shrink-0"
                    aria-label="Back to databases list"
                >
                    <IconChevronLeft className="h-6 w-6" />
                </button>
            </div>

            {/* Pill Section for Database Level Metrics */}
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Total size" value={formatStorageSize(database.sizeGB)} />
                <KPILabel label="Est. cost" value={`$${database.cost.toLocaleString()}`} />
                <KPILabel label="Tables" value={database.tableCount.toString()} />
                <KPILabel label="Users" value={database.userCount.toString()} />
            </div>
            
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0">
                <div className="px-4 py-3 flex justify-between items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <h3 className="text-sm font-bold text-text-strong">Table storage analysis</h3>
                    <div className="relative flex-1 max-w-xs ml-4">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-full text-right"
                            placeholder="Search tables or schemas..."
                        />
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Table name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Schema name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Total size (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Active size (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Time travel (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Fail safe (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Retention time (Days)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {tablesWithUsers.length > 0 ? (
                                tablesWithUsers.map(table => (
                                    <tr key={table.id} className="hover:bg-surface-nested transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-text-primary">{table.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-text-secondary">{table.schemaName}</td>
                                        <td className="px-6 py-4 text-sm text-right font-black text-primary">{table.totalSizeGB.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-strong">{table.activeSizeGB.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{table.timeTravelSizeGB.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{table.failSafeSizeGB.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{table.retentionTimeDays}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-text-muted italic">
                                        No table data found for this database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface DatabaseListViewProps { 
    onSelectDatabase: (databaseName: string) => void 
}

const DatabaseListView: React.FC<DatabaseListViewProps> = ({ onSelectDatabase }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDatabases = useMemo(() => {
        return databasesData.filter(db => {
            const matchesSearch = !searchQuery || 
                db.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [searchQuery]);

    const aggregateMetrics = useMemo(() => {
        const totalSize = filteredDatabases.reduce((sum, db) => sum + db.sizeGB, 0);
        const totalCost = filteredDatabases.reduce((sum, db) => sum + db.cost, 0);
        const totalTables = filteredDatabases.reduce((sum, db) => sum + db.tableCount, 0);

        return {
            totalSize,
            totalCost,
            totalTables,
            totalDbs: filteredDatabases.length,
        };
    }, [filteredDatabases]);

    return (
         <div className="flex flex-col h-full gap-4">
            {/* Aggregate Pills */}
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Databases" value={aggregateMetrics.totalDbs.toString()} />
                <KPILabel label="Tables" value={aggregateMetrics.totalTables.toString()} />
                <KPILabel label="Total size" value={formatStorageSize(aggregateMetrics.totalSize)} />
                <KPILabel label="Total cost" value={`$${aggregateMetrics.totalCost.toLocaleString()}`} />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col min-h-0">
                <div className="px-4 py-3 flex items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
                    <h3 className="text-sm font-bold text-text-strong">Databases</h3>
                    <div className="relative flex-1 ml-4">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-full text-right"
                            placeholder="Search databases..."
                        />
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Databases</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Tables</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Size (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Cost</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Credits</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Users</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {filteredDatabases.length > 0 ? (
                                filteredDatabases.map(db => (
                                    <tr 
                                        key={db.id} 
                                        className="hover:bg-surface-nested transition-colors group cursor-pointer" 
                                        onClick={() => onSelectDatabase(db.name)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                                                {db.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{db.tableCount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-black text-primary">{db.sizeGB.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-strong">${db.cost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{db.credits.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{db.userCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">
                                        No databases match your search criteria.
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

interface DatabasesViewProps {
    onNavigateToSchemas: (databaseName: string) => void;
}

const DatabasesView: React.FC<DatabasesViewProps> = ({ onNavigateToSchemas }) => {
    return <DatabaseListView onSelectDatabase={onNavigateToSchemas} />;
};

export default DatabasesView;
