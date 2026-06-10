
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, GripVertical, Check, Copy, CheckCircle2 } from 'lucide-react';
import { unusedTablesData } from '../data/dummyData';
import { formatStorageSize } from '../utils/storageMetrics';
import { IconSearch, IconInfo, IconChevronDown, IconClipboardCopy } from '../constants';
import InfoTooltip from '../components/InfoTooltip';

interface Column {
    id: string;
    label: string;
    visible: boolean;
    sortable: boolean;
    align?: 'left' | 'right';
}

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

interface UnusedTablesViewProps {
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    initialTableTypeFilter?: string | null;
}

const UnusedTablesView: React.FC<UnusedTablesViewProps> = ({ 
    onNavigateToRecommendations,
    initialTableTypeFilter
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDb, setSelectedDb] = useState('All databases');
    const [selectedSchema, setSelectedSchema] = useState('All schemas');
    const [selectedTableType, setSelectedTableType] = useState(initialTableTypeFilter || 'All types');
    const [unusedDaysFilter, setUnusedDaysFilter] = useState('15');
    const [customMinDays, setCustomMinDays] = useState('');
    const [customMaxDays, setCustomMaxDays] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'sizeGB', direction: 'desc' });
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const columnMenuRef = useRef<HTMLDivElement>(null);

    const [columns, setColumns] = useState<Column[]>([
        { id: 'name', label: 'Table name', visible: true, sortable: true },
        { id: 'database', label: 'Database', visible: true, sortable: true },
        { id: 'schema', label: 'Schema', visible: true, sortable: true },
        { id: 'tableType', label: 'Table type', visible: true, sortable: true },
        { id: 'sizeGB', label: 'Size', visible: true, sortable: true, align: 'right' },
        { id: 'rows', label: 'Rows', visible: true, sortable: true, align: 'right' },
        { id: 'lastAccessed', label: 'Last used', visible: true, sortable: true, align: 'right' },
        { id: 'unusedDays', label: 'Unused days', visible: true, sortable: true, align: 'right' },
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
                setIsColumnMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumn = (id: string) => {
        setColumns(prev => prev.map(col => 
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
    };

    const moveColumn = (index: number, direction: 'up' | 'down') => {
        const newColumns = [...columns];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newColumns.length) {
            [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
            setColumns(newColumns);
        }
    };

    const handleCopySQL = (table: any) => {
        const sql = `"${table.database}"."${table.schema}"."${table.name}";`;
        navigator.clipboard.writeText(sql);
        setCopiedId(table.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const dbOptions = useMemo(() => {
        const dbs = Array.from(new Set(unusedTablesData.map(t => t.database)));
        return ['All databases', ...dbs.sort()];
    }, []);

    const schemaOptions = useMemo(() => {
        const filteredByDb = selectedDb === 'All databases' 
            ? unusedTablesData 
            : unusedTablesData.filter(t => t.database === selectedDb);
        const schemas = Array.from(new Set(filteredByDb.map(t => t.schema)));
        return ['All schemas', ...schemas.sort()];
    }, [selectedDb]);

    const tableTypeOptions = ['All types', 'Permanent', 'Transient', 'Temporary', 'Hybrid', 'Dynamic'];
    const unusedDaysOptions = [
        { label: '15+ days', value: '15' },
        { label: '30+ days', value: '30' },
        { label: '60+ days', value: '60' },
        { label: '90+ days', value: '90' },
        { label: 'Custom', value: 'custom' }
    ];

    const filteredAndSortedData = useMemo(() => {
        let result = [...unusedTablesData].filter(table => {
            const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                table.database.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                table.schema.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDb = selectedDb === 'All databases' || table.database === selectedDb;
            const matchesSchema = selectedSchema === 'All schemas' || table.schema === selectedSchema;
            const matchesType = selectedTableType === 'All types' || table.tableType === selectedTableType;
            
            let matchesUnusedDays = true;
            if (unusedDaysFilter === 'custom') {
                const min = customMinDays ? parseInt(customMinDays) : 0;
                const max = customMaxDays ? parseInt(customMaxDays) : Infinity;
                matchesUnusedDays = table.unusedDays >= min && table.unusedDays <= max;
            } else {
                matchesUnusedDays = table.unusedDays >= parseInt(unusedDaysFilter);
            }
            
            return matchesSearch && matchesDb && matchesSchema && matchesType && matchesUnusedDays;
        });

        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof typeof a];
                const bValue = b[sortConfig.key as keyof typeof b];
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [searchTerm, selectedDb, selectedSchema, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'desc' };
        });
    };

    const totalUnusedStorage = unusedTablesData.reduce((sum, table) => sum + table.sizeGB, 0);

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Banner */}
            <div className="bg-[#f0f7ff] border border-[#d1e9ff] border-l-4 border-l-[#0066ff] p-4 flex items-center gap-3 shadow-sm mb-2">
                <IconInfo className="w-5 h-5 text-[#0066ff] flex-shrink-0" />
                <p className="text-[13px] font-medium text-[#1e1e1e]">
                    Anavsan found tables that haven’t been accessed in over 30 days. Deleting, archiving, or moving them to cheaper storage can reduce unnecessary storage spend.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Unused tables" value={unusedTablesData.length.toString()} />
                <KPILabel label="Total unused storage" value={formatStorageSize(totalUnusedStorage)} />
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

                        <div className="h-4 w-[1px] bg-border-light" />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-secondary">Unused</span>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-0 pr-6 py-1 bg-transparent text-xs font-bold text-text-strong focus:outline-none cursor-pointer"
                                    value={unusedDaysFilter}
                                    onChange={(e) => setUnusedDaysFilter(e.target.value)}
                                >
                                    {unusedDaysOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                    <IconChevronDown className="h-3 w-3 text-text-muted" />
                                </div>
                            </div>
                        </div>

                        {unusedDaysFilter === 'custom' && (
                            <div className="flex items-center gap-1 ml-1">
                                <input 
                                    type="number" 
                                    placeholder="Min"
                                    value={customMinDays}
                                    onChange={(e) => setCustomMinDays(e.target.value)}
                                    className="w-12 px-1 py-0.5 text-[10px] border border-border-light rounded focus:outline-none focus:border-primary"
                                />
                                <span className="text-[10px] text-text-muted">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max"
                                    value={customMaxDays}
                                    onChange={(e) => setCustomMaxDays(e.target.value)}
                                    className="w-12 px-1 py-0.5 text-[10px] border border-border-light rounded focus:outline-none focus:border-primary"
                                />
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1 ml-4 flex items-center gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-full text-right"
                                placeholder="Search tables..."
                            />
                            <IconSearch className="w-4 h-4 text-text-muted absolute right-0 top-1/2 -translate-y-1/2" />
                        </div>
                        
                        <div className="relative" ref={columnMenuRef}>
                            <button 
                                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                                className={`p-2 rounded-lg transition-colors ${isColumnMenuOpen ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-nested'}`}
                                title="Manage columns"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            
                            <AnimatePresence>
                                {isColumnMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-border-light z-50 p-2"
                                    >
                                        <div className="px-3 py-2 border-b border-border-light mb-2">
                                            <span className="text-xs font-bold text-text-strong uppercase tracking-wider">Display Columns</span>
                                        </div>
                                        <div className="space-y-1 max-h-80 overflow-y-auto no-scrollbar">
                                            {columns.map((col, idx) => (
                                                <div key={col.id} className="flex items-center justify-between p-2 hover:bg-surface-nested rounded-lg group">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <button 
                                                            onClick={() => toggleColumn(col.id)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${col.visible ? 'bg-primary border-primary text-white' : 'border-border-light bg-white'}`}
                                                        >
                                                            {col.visible && <Check className="w-3 h-3" />}
                                                        </button>
                                                        <span className={`text-xs font-medium ${col.visible ? 'text-text-strong' : 'text-text-muted'}`}>{col.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            disabled={idx === 0}
                                                            onClick={() => moveColumn(idx, 'up')}
                                                            className="p-1 text-text-muted hover:text-primary disabled:opacity-30"
                                                        >
                                                            <IconChevronDown className="w-3 h-3 rotate-180" />
                                                        </button>
                                                        <button 
                                                            disabled={idx === columns.length - 1}
                                                            onClick={() => moveColumn(idx, 'down')}
                                                            className="p-1 text-text-muted hover:text-primary disabled:opacity-30"
                                                        >
                                                            <IconChevronDown className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0 min-w-[1000px]">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                {columns.filter(c => c.visible).map(col => (
                                    <th 
                                        key={col.id}
                                        className={`px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light transition-colors ${col.sortable ? 'cursor-pointer hover:text-primary' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                                        onClick={() => col.sortable && handleSort(col.id)}
                                    >
                                        <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                                            {col.label}
                                            {sortConfig?.key === col.id && (
                                                <motion.span layoutId="sort-indicator">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {filteredAndSortedData.map((table) => (
                                <tr key={table.id} className="hover:bg-surface-nested transition-colors group">
                                    {columns.filter(c => c.visible).map(col => (
                                        <td key={col.id} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                                            {col.id === 'name' && <div className="text-sm font-bold text-text-strong">{table.name}</div>}
                                            {col.id === 'database' && <div className="text-sm font-medium text-text-secondary">{table.database}</div>}
                                            {col.id === 'schema' && <div className="text-sm font-medium text-text-primary">{table.schema}</div>}
                                            {col.id === 'tableType' && <div className="text-sm font-medium text-text-secondary">{table.tableType || 'Permanent'}</div>}
                                            {col.id === 'sizeGB' && <div className="font-mono text-sm font-bold text-text-strong">{formatStorageSize(table.sizeGB)}</div>}
                                            {col.id === 'rows' && <div className="font-mono text-sm font-medium text-text-secondary">{table.rows.toLocaleString()}</div>}
                                            {col.id === 'lastAccessed' && <div className="text-sm font-medium text-text-secondary">{new Date(table.lastAccessed).toLocaleDateString()}</div>}
                                            {col.id === 'unusedDays' && <div className="text-sm font-black text-primary">{table.unusedDays}</div>}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="relative group/copy">
                                                <button 
                                                    onClick={() => handleCopySQL(table)}
                                                    className={`p-2 rounded-lg transition-all ${copiedId === table.id ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-primary/10 text-text-muted hover:text-primary'}`}
                                                >
                                                    {copiedId === table.id ? <CheckCircle2 className="w-4 h-4" /> : <IconClipboardCopy className="w-4 h-4" />}
                                                </button>
                                                
                                                {/* Tooltip - Positioned to the left to avoid clipping by container overflow */}
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-text-strong text-white text-[10px] rounded-lg opacity-0 group-hover/copy:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                                    <div className="font-mono mb-1">"{table.database}"."{table.schema}"."{table.name}";</div>
                                                    <div className="text-white/60 text-[9px] uppercase tracking-wider font-bold text-right">Click to copy SQL</div>
                                                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-text-strong" />
                                                </div>
                                            </div>
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
};

export default UnusedTablesView;
