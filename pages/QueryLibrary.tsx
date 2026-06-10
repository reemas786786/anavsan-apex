

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SQLFile, Account, SQLVersion, User, PullRequest, QueryListItem } from '../types';
import { IconSearch, IconArrowUp, IconArrowDown, IconChevronLeft, IconDotsVertical, IconView, IconWand, IconBeaker, IconDelete } from '../constants';
import Pagination from '../components/Pagination';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';

const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) return null;

    const colorClasses: { [key: string]: string } = {
        Optimized: "bg-status-success-light text-status-success-dark",
        Simulated: "bg-status-info-light text-status-info-dark",
        Analyzed: "bg-status-warning-light text-status-warning-dark",
        Default: "bg-gray-100 text-gray-800"
    };
    
    const tagClass = colorClasses[tag] || colorClasses.Default;

    return <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${tagClass}`}>{tag}</span>;
}

interface QueryLibraryProps {
    sqlFiles: SQLFile[];
    accounts: Account[];
    // onFileSelect navigates from Level 1 (Files) -> Level 2 (Versions)
    onFileSelect: (file: SQLFile) => void;
    // selectedFile controls whether we are in Level 2
    selectedFile: SQLFile | null;
    // onVersionSelect navigates from Level 2 (Versions) -> Level 3 (Detail View)
    onVersionSelect: (version: SQLVersion) => void;
    // onBack navigates from Level 2 (Versions) -> Level 1 (Files)
    onBack: () => void;
    
    onCompare: (file: SQLFile, v1: SQLVersion, v2: SQLVersion) => void;
    
    // Actions
    onAnalyze?: (version: SQLVersion) => void;
    onOptimize?: (version: SQLVersion) => void;
    onSimulate?: (version: SQLVersion) => void;

    title?: string;
    pullRequests?: PullRequest[];
    onSelectPullRequest?: (pr: PullRequest) => void;
}

export const QueryLibrary: React.FC<QueryLibraryProps> = ({ 
    sqlFiles, 
    accounts, 
    onFileSelect, 
    selectedFile,
    onVersionSelect,
    onBack,
    onCompare,
    onAnalyze,
    onOptimize,
    onSimulate,
    title = "Query Library"
}) => {
    // --- File List State ---
    const [fileSortConfig, setFileSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'createdDate', direction: 'descending' });
    const [fileSearchTerm, setFileSearchTerm] = useState('');
    const [fileCurrentPage, setFileCurrentPage] = useState(1);
    const [fileItemsPerPage, setFileItemsPerPage] = useState(10);
    const [accountFilter, setAccountFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');

    // --- Version List State ---
    const [versionSortConfig, setVersionSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
    const [selectedVersionIds, setSelectedVersionIds] = useState<Set<string>>(new Set());
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // --- Effects & Helpers ---
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Reset selections when file changes
        setSelectedVersionIds(new Set());
    }, [selectedFile]);

    const SortIcon: React.FC<{ sortConfig: any, columnKey: string }> = ({ sortConfig, columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };
    
    // --- Render Level 1: File List ---

    const renderFileList = () => {
        const filterOptions = {
            accounts: [...new Set(sqlFiles.map(f => f.accountName))],
        };

        const filteredFiles = sqlFiles.filter(file => {
            if (fileSearchTerm && !file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())) return false;
            if (accountFilter.length > 0 && !accountFilter.includes(file.accountName)) return false;
            
            // Date filter logic (simplified for createdDate)
             if (typeof dateFilter === 'string') {
                if (dateFilter !== 'All') {
                    const itemDate = new Date(file.createdDate);
                    const now = new Date();
                    let days = 0;
                    if (dateFilter === '7d') days = 7;
                    if (dateFilter === '1d') days = 1;
                    if (dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - itemDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else {
                const itemDate = new Date(file.createdDate);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (itemDate < startDate || itemDate >= endDate) return false;
            }
            return true;
        });

        if (fileSortConfig) {
            filteredFiles.sort((a, b) => {
                const key = fileSortConfig.key as keyof typeof a;
                // @ts-ignore
                if (a[key] < b[key]) return fileSortConfig.direction === 'ascending' ? -1 : 1;
                // @ts-ignore
                if (a[key] > b[key]) return fileSortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        const totalPages = Math.ceil(filteredFiles.length / fileItemsPerPage);
        const paginatedFiles = filteredFiles.slice((fileCurrentPage - 1) * fileItemsPerPage, fileCurrentPage * fileItemsPerPage);

        const requestFileSort = (key: string) => {
            let direction: 'ascending' | 'descending' = 'ascending';
            if (fileSortConfig && fileSortConfig.key === key && fileSortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            setFileSortConfig({ key, direction });
        };

        return (
            <>
                 <div className="bg-surface rounded-xl flex flex-col min-h-0 flex-grow">
                    <div className="p-2 mb-2 flex-shrink-0 flex items-center gap-x-2 border-b border-border-color">
                        <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                        <div className="h-4 w-px bg-border-color"></div>
                        <MultiSelectDropdown label="Account" options={filterOptions.accounts} selectedOptions={accountFilter} onChange={setAccountFilter} selectionMode="single" />
                        <div className="relative flex-grow ml-auto">
                            <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="search" 
                                value={fileSearchTerm} 
                                onChange={e => setFileSearchTerm(e.target.value)} 
                                placeholder="Search files..." 
                                className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" 
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-grow min-h-0">
                        <table className="w-full text-sm">
                            <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestFileSort('name')} className="group flex items-center">File Name <SortIcon sortConfig={fileSortConfig} columnKey="name" /></button></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestFileSort('accountName')} className="group flex items-center">Account Name <SortIcon sortConfig={fileSortConfig} columnKey="accountName" /></button></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Message</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestFileSort('createdDate')} className="group flex items-center">Created Date <SortIcon sortConfig={fileSortConfig} columnKey="createdDate" /></button></th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                {paginatedFiles.map(file => {
                                    // Get latest version message
                                    const latestVersion = [...file.versions].sort((a,b) => b.version - a.version)[0];
                                    return (
                                        <tr key={file.id} onClick={() => onFileSelect(file)} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" data-row-hover>
                                            <td className="px-6 py-3 font-medium text-link whitespace-nowrap">{file.name}</td>
                                            <td className="px-6 py-3">{file.accountName}</td>
                                            <td className="px-6 py-3 italic truncate max-w-xs">{latestVersion?.description || 'No versions'}</td>
                                            <td className="px-6 py-3">{new Date(file.createdDate).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                     {filteredFiles.length > fileItemsPerPage && (
                         <div className="flex-shrink-0">
                            <Pagination
                                currentPage={fileCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredFiles.length}
                                itemsPerPage={fileItemsPerPage}
                                onPageChange={setFileCurrentPage}
                                onItemsPerPageChange={setFileItemsPerPage}
                            />
                        </div>
                    )}
                </div>
            </>
        )
    };

    // --- Render Level 2: Versions List ---

    const renderVersionList = () => {
        if (!selectedFile) return null;

        const versions = selectedFile.versions;
        // Sort versions
        if (versionSortConfig) {
            versions.sort((a, b) => {
                const key = versionSortConfig.key as keyof typeof a;
                // @ts-ignore
                if (a[key] < b[key]) return versionSortConfig.direction === 'ascending' ? -1 : 1;
                // @ts-ignore
                if (a[key] > b[key]) return versionSortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        const requestVersionSort = (key: string) => {
             let direction: 'ascending' | 'descending' = 'ascending';
            if (versionSortConfig && versionSortConfig.key === key && versionSortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            setVersionSortConfig({ key, direction });
        };

        const handleCheckboxChange = (id: string) => {
            const newSet = new Set(selectedVersionIds);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (newSet.size < 2) {
                    newSet.add(id);
                } else {
                    // Replace the first one or prevent? Let's prevent > 2
                    // Or maybe replace oldest selection?
                    // Simple logic: allow up to 2.
                }
            }
            setSelectedVersionIds(newSet);
        };

        const handleCompareClick = () => {
            if (selectedVersionIds.size !== 2) return;
            const ids = Array.from(selectedVersionIds);
            const v1 = versions.find(v => v.id === ids[0]);
            const v2 = versions.find(v => v.id === ids[1]);
            if (v1 && v2) {
                const sorted = [v1, v2].sort((a,b) => a.version - b.version);
                onCompare(selectedFile, sorted[0], sorted[1]);
            }
        }

        return (
            <div className="flex flex-col h-full space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors flex-shrink-0" aria-label="Back">
                            <IconChevronLeft className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold text-text-primary">{selectedFile.name}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-sm text-text-secondary">Select 2 versions to compare</span>
                         <button 
                            onClick={handleCompareClick}
                            disabled={selectedVersionIds.size !== 2}
                            className="bg-primary text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Compare
                        </button>
                    </div>
                </div>

                <div className="bg-surface rounded-xl flex flex-col min-h-0 flex-grow">
                     <div className="overflow-y-auto flex-grow min-h-0">
                        <table className="w-full text-sm">
                            <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                                <tr>
                                    <th className="px-6 py-4 w-10"></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestVersionSort('version')} className="group flex items-center">Version <SortIcon sortConfig={versionSortConfig} columnKey="version" /></button></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestVersionSort('tag')} className="group flex items-center">Type <SortIcon sortConfig={versionSortConfig} columnKey="tag" /></button></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Message</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestVersionSort('date')} className="group flex items-center">Date Saved <SortIcon sortConfig={versionSortConfig} columnKey="date" /></button></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                {versions.map(v => (
                                    <tr key={v.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested">
                                        <td className="px-6 py-3">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedVersionIds.has(v.id)} 
                                                onChange={() => handleCheckboxChange(v.id)}
                                                className="h-4 w-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-text-primary">v{v.version}</td>
                                        <td className="px-6 py-3"><Tag tag={v.tag} /></td>
                                        <td className="px-6 py-3 italic truncate max-w-sm">{v.description}</td>
                                        <td className="px-6 py-3">{new Date(v.date).toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="relative inline-block text-left" ref={openMenuId === v.id ? menuRef : null}>
                                                <button onClick={() => setOpenMenuId(openMenuId === v.id ? null : v.id)} className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                    <IconDotsVertical className="h-5 w-5" />
                                                </button>
                                                {openMenuId === v.id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                         <div className="py-1" role="menu">
                                                            <button onClick={() => onVersionSelect(v)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconView className="h-4 w-4"/> Query Preview</button>
                                                            {onAnalyze && <button onClick={() => onAnalyze(v)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Open in Analyzer</button>}
                                                            {onOptimize && <button onClick={() => onOptimize(v)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Open in Optimizer</button>}
                                                            {onSimulate && <button onClick={() => onSimulate(v)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Open in Simulator</button>}
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
        )
    };

    return (
        <div className="flex flex-col bg-background space-y-4 p-4 h-full">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                <p className="mt-1 text-text-secondary">
                    {title === 'Query Vault' 
                        ? 'Centralized repository for all your saved queries across all accounts.'
                        : 'Access your executed and saved query history.'}
                </p>
            </div>
            
            <div className="flex-grow flex flex-col min-h-0">
                 {selectedFile ? renderVersionList() : renderFileList()}
            </div>
        </div>
    );
};
