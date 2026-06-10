
import React, { useState, useMemo } from 'react';
import { databaseTablesData, databasesData } from '../data/dummyData';
import { formatStorageSize } from '../utils/storageMetrics';
import { IconSearch, IconChevronDown } from '../constants';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

interface SchemasViewProps {
    initialDatabaseFilter?: string | null;
    onNavigateToTables?: (database: string, schema: string) => void;
}

const SchemasView: React.FC<SchemasViewProps> = ({ 
    initialDatabaseFilter,
    onNavigateToTables
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDb, setSelectedDb] = useState(initialDatabaseFilter || 'All databases');

    const dbOptions = useMemo(() => {
        const dbs = Array.from(new Set(databaseTablesData.map(t => t.databaseName).filter(Boolean)));
        return ['All databases', ...dbs.sort()];
    }, []);

    const schemasData = useMemo(() => {
        const schemaMap = new Map<string, { 
            name: string; 
            database: string; 
            tableCount: number; 
            sizeGB: number; 
            cost: number; 
            credits: number; 
            userCount: number 
        }>();

        databaseTablesData.forEach(table => {
            const key = `${table.databaseName}.${table.schemaName}`;
            if (!schemaMap.has(key)) {
                const db = databasesData.find(d => d.name === table.databaseName);
                schemaMap.set(key, {
                    name: table.schemaName,
                    database: table.databaseName || '',
                    tableCount: 0,
                    sizeGB: 0,
                    cost: 0,
                    credits: 0,
                    userCount: db?.userCount || 0
                });
            }
            const schema = schemaMap.get(key)!;
            schema.tableCount += 1;
            schema.sizeGB += table.totalSizeGB;
            schema.cost += (table.totalSizeGB / 100) * 2.5; // Mock cost calculation
            schema.credits += (table.totalSizeGB / 100); // Mock credits calculation
        });

        return Array.from(schemaMap.values());
    }, []);

    const filteredSchemas = useMemo(() => {
        return schemasData.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.database.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDb = selectedDb === 'All databases' || s.database === selectedDb;
            return matchesSearch && matchesDb;
        });
    }, [schemasData, searchQuery, selectedDb]);

    const aggregateMetrics = useMemo(() => {
        const totalSize = filteredSchemas.reduce((sum, s) => sum + s.sizeGB, 0);
        const totalTables = filteredSchemas.reduce((sum, s) => sum + s.tableCount, 0);

        return {
            totalSize,
            totalTables,
            totalSchemas: filteredSchemas.length,
        };
    }, [filteredSchemas]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Schemas" value={aggregateMetrics.totalSchemas.toString()} />
                <KPILabel label="Tables" value={aggregateMetrics.totalTables.toString()} />
                <KPILabel label="Total size" value={formatStorageSize(aggregateMetrics.totalSize)} />
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
                                    onChange={(e) => setSelectedDb(e.target.value)}
                                >
                                    {dbOptions.map(opt => <option key={opt} value={opt}>{opt === 'All databases' ? 'All' : opt}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-1 ml-4">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-full text-right"
                            placeholder="Search schemas or databases..."
                        />
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Schemas</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Databases</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Tables</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Size (GB)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Cost</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Credits</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Users</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {filteredSchemas.length > 0 ? (
                                filteredSchemas.map((schema, idx) => (
                                    <tr 
                                        key={idx} 
                                        className="hover:bg-surface-nested transition-colors group cursor-pointer"
                                        onClick={() => onNavigateToTables?.(schema.database, schema.name)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                                                {schema.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-text-secondary">{schema.database}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{schema.tableCount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-black text-primary">{formatStorageSize(schema.sizeGB)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-strong">${schema.cost.toFixed(2).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-secondary">{schema.credits.toFixed(2).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right font-medium text-text-muted">{schema.userCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-text-muted italic">
                                        No schemas match your search criteria.
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

export default SchemasView;
