import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SimilarQuery } from '../types';
import { similarQueriesData } from '../data/dummyData';
import { IconSearch, IconDotsVertical, IconEdit, IconDelete, IconArrowUp, IconArrowDown } from '../constants';
import Pagination from '../components/Pagination';

const PatternTag: React.FC<{ pattern?: string }> = ({ pattern }) => {
    if (!pattern) return null;
    
    let colorClasses = "bg-yellow-100 text-yellow-800"; // Scan-heavy default
    if (pattern === 'Join-heavy') colorClasses = "bg-blue-100 text-blue-800";
    if (pattern === 'Aggregation-heavy') colorClasses = "bg-purple-100 text-purple-800";
    
    return (
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colorClasses}`}>
            {pattern}
        </span>
    );
};

const SortIndicator: React.FC<{ direction: 'ascending' | 'descending' | null }> = ({ direction }) => {
    if (!direction) return <span className="w-4 h-4 inline-block"></span>;
    if (direction === 'ascending') return <IconArrowUp className="w-4 h-4 inline-block ml-1 text-text-secondary" />;
    return <IconArrowDown className="w-4 h-4 inline-block ml-1 text-text-secondary" />;
};

export const SimilarQueryPatternsView: React.FC = () => {
    const [viewingDetailsOf, setViewingDetailsOf] = useState<string | null>(null);

    const groupedData = useMemo(() => {
        const groups: { [key: string]: { queries: SimilarQuery[]; totalCredits: number; totalCost: number } } = {};
        similarQueriesData.forEach(q => {
            if (q.pattern) {
                if (!groups[q.pattern]) {
                    groups[q.pattern] = { queries: [], totalCredits: 0, totalCost: 0 };
                }
                groups[q.pattern].queries.push(q);
                /* Fixed: Changed q.credits to q.tokens as per SimilarQuery definition */
                groups[q.pattern].totalCredits += q.tokens;
                groups[q.pattern].totalCost += q.cost;
            }
        });
        return Object.entries(groups).map(([pattern, data]) => ({
            pattern,
            count: data.queries.length,
            totalCredits: data.totalCredits,
            totalCost: data.totalCost,
        })).sort((a, b) => b.totalCredits - a.totalCredits);
    }, []);

    // State for main patterns table
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const filteredPatterns = useMemo(() => {
        return groupedData.filter(g => g.pattern.toLowerCase().includes(search.toLowerCase()));
    }, [groupedData, search]);

    const paginatedPatterns = useMemo(() => {
        return filteredPatterns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredPatterns, currentPage, itemsPerPage]);
    const totalPatternPages = Math.ceil(filteredPatterns.length / itemsPerPage);

    // State for detail queries table
    const [detailCurrentPage, setDetailCurrentPage] = useState(1);
    const [detailItemsPerPage, setDetailItemsPerPage] = useState(10);

    const queriesForPattern = useMemo(() => similarQueriesData.filter(q => q.pattern === viewingDetailsOf), [viewingDetailsOf]);
    const paginatedQueries = useMemo(() => {
        return queriesForPattern.slice((detailCurrentPage - 1) * detailItemsPerPage, detailCurrentPage * detailItemsPerPage);
    }, [queriesForPattern, detailCurrentPage, detailItemsPerPage]);
    const totalQueryPages = Math.ceil(queriesForPattern.length / detailItemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

     useEffect(() => {
        if (viewingDetailsOf) {
            setDetailCurrentPage(1);
        }
    }, [viewingDetailsOf]);

    if (viewingDetailsOf) {
        return (
            <div className="flex flex-col h-full bg-background p-4 space-y-4">
                <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                     <div className="p-4 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-text-strong">Queries for pattern:</h2>
                                <PatternTag pattern={viewingDetailsOf} />
                            </div>
                            <button onClick={() => setViewingDetailsOf(null)} className="text-sm font-semibold text-link hover:underline">
                                &larr; Back to Patterns
                            </button>
                        </div>
                    </div>
                     <div className="overflow-y-auto flex-grow min-h-0">
                        <table className="w-full text-sm">
                            <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                               <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Query</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Similarity</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Execution Time (ms)</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Warehouse</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Cost ($)</th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                {paginatedQueries.map(query => (
                                    <tr key={query.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested" data-row-hover>
                                        <td className="px-6 py-3 font-mono text-xs text-text-primary whitespace-nowrap max-w-sm truncate">{query.name}</td>
                                        <td className="px-6 py-3 font-medium text-text-primary">{query.similarity}%</td>
                                        <td className="px-6 py-3">{query.executionTime.toLocaleString()}</td>
                                        <td className="px-6 py-3">{query.warehouse}</td>
                                        <td className="px-6 py-3">${query.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {queriesForPattern.length > 10 && (
                        <div className="flex-shrink-0">
                            <Pagination
                                currentPage={detailCurrentPage}
                                totalPages={totalQueryPages}
                                totalItems={queriesForPattern.length}
                                itemsPerPage={detailItemsPerPage}
                                onPageChange={setDetailCurrentPage}
                                onItemsPerPageChange={(size) => setDetailItemsPerPage(size)}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background p-4 space-y-4">
            <div className="flex-shrink-0">
                 <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Similar query patterns</h1>
                 <p className="mt-1 text-text-secondary">Group and analyze queries with similar structures to identify optimization opportunities.</p>
                 <div className="mt-4 flex flex-wrap items-center gap-2">
                     <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                        Total Patterns: <span className="font-bold text-text-strong">{groupedData.length}</span>
                    </div>
                     <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                        Queries Analyzed: <span className="font-bold text-text-strong">{similarQueriesData.length}</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                <div className="p-2 mb-2 flex-shrink-0">
                     <div className="flex justify-between items-center">
                        <div className="relative">
                            <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="search" 
                                value={search} 
                                onChange={e => setSearch(e.target.value)} 
                                placeholder="Search patterns..." 
                                className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" 
                            />
                        </div>
                    </div>
                </div>

                 <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Pattern</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Query Count</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Total Credits</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Total Cost ($)</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedPatterns.map(group => (
                                <tr key={group.pattern} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested" data-row-hover>
                                    <td className="px-6 py-3"><PatternTag pattern={group.pattern} /></td>
                                    <td className="px-6 py-3 font-medium text-text-primary">{group.count}</td>
                                    <td className="px-6 py-3">{group.totalCredits.toFixed(2)}</td>
                                    <td className="px-6 py-3">${group.totalCost.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            onClick={() => setViewingDetailsOf(group.pattern)}
                                            className="text-sm font-semibold text-link hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPatterns.length > 10 && (
                    <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPatternPages}
                            totalItems={filteredPatterns.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(size) => setItemsPerPage(size)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const QueryPerformanceView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof SimilarQuery; direction: 'ascending' | 'descending' } | null>({ key: 'similarity', direction: 'descending' });
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortedAndFilteredData = useMemo(() => {
        let sortedData = [...similarQueriesData];
        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                const aVal = a[sortConfig.key] ?? '';
                const bVal = b[sortConfig.key] ?? '';
                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        if (searchTerm) {
            return sortedData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return sortedData;
    }, [sortConfig, searchTerm]);

    const requestSort = (key: keyof SimilarQuery) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof SimilarQuery) => {
        if (!sortConfig || sortConfig.key !== key) return <SortIndicator direction={null} />;
        return <SortIndicator direction={sortConfig.direction} />;
    };

    return (
        <div className="space-y-4">
            <div className="bg-surface p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-text-strong">Similar queries</h2>
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter queries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-primary font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('name')} className="group flex items-center">Query {getSortIndicator('name')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('similarity')} className="group flex items-center">Similarity {getSortIndicator('similarity')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('executionTime')} className="group flex items-center">Execution Time (ms) {getSortIndicator('executionTime')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('warehouse')} className="group flex items-center">Warehouse {getSortIndicator('warehouse')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('cost')} className="group flex items-center">Cost ($) {getSortIndicator('cost')}</button></th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredData.map(query => (
                                <tr key={query.id} className="border-t border-border-color hover:bg-surface-hover cursor-pointer" onClick={() => alert(`Navigating to details for query ${query.id}`)}>
                                    <td className="px-6 py-4 font-mono text-xs text-text-primary whitespace-nowrap max-w-sm truncate">
                                        {query.name}
                                        <div className="mt-1"><PatternTag pattern={query.pattern} /></div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-text-primary">{query.similarity}%</td>
                                    <td className="px-6 py-4">{query.executionTime.toLocaleString()}</td>
                                    <td className="px-6 py-4">{query.warehouse}</td>
                                    <td className="px-6 py-4">${query.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === query.id ? null : query.id); }}
                                                title="Actions"
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === query.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu">
                                                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Edit'); }} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconEdit className="h-4 w-4" /> Edit
                                                        </a>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Delete'); }} className="flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                                            <IconDelete className="h-4 w-4" /> Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
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

export default QueryPerformanceView;