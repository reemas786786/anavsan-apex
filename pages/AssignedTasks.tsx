
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AssignedQuery, AssignmentStatus, AssignmentPriority, User } from '../types';
import { 
    IconDotsVertical, 
    IconSearch, 
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconClipboardList,
    IconEdit
} from '../constants';
import Pagination from '../components/Pagination';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const PriorityBadge: React.FC<{ priority: AssignmentPriority }> = ({ priority }) => {
    const colorClasses = {
        Low: 'bg-slate-50 text-slate-700 border-slate-200',
        Medium: 'bg-amber-50 text-amber-800 border-amber-200',
        High: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[priority]}`}>
            {priority}
        </span>
    );
};

const StatusBadge: React.FC<{ 
    status: AssignmentStatus; 
    isEditable?: boolean; 
    onStatusChange?: (newStatus: AssignmentStatus) => void;
}> = ({ status, isEditable, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const colorClasses: Record<string, string> = {
        'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
        'In progress': 'bg-amber-50 text-amber-800 border-amber-200',
        'Optimized': 'bg-emerald-50 text-emerald-700 border-emerald-300',
        'Cannot be optimized': 'bg-red-50 text-red-700 border-red-200',
        'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayStatus = status.toUpperCase();
    
    if (isEditable) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    className={`group inline-flex items-center gap-2 px-2 py-1 text-[10px] font-bold rounded border uppercase tracking-wider transition-all hover:ring-2 hover:ring-primary/20 ${colorClasses[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                    {displayStatus}
                    <IconChevronDown className={`w-3 h-3 opacity-40 group-hover:opacity-100 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl z-30 border border-border-color py-1 animate-in fade-in slide-in-from-top-1">
                        {(['Assigned', 'In progress', 'Optimized', 'Cannot be optimized'] as AssignmentStatus[]).map(s => (
                            <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); onStatusChange?.(s); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors hover:bg-surface-nested ${status === s ? 'text-primary' : 'text-text-secondary'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {displayStatus}
        </span>
    );
};

interface AssignedQueriesProps {
    assignedQueries: AssignedQuery[];
    currentUser: User | null;
    onViewQuery: (queryId: string) => void;
    onResolveQuery: (id: string) => void;
    onUpdateStatus?: (id: string, status: AssignmentStatus) => void;
}

const AssignedTasks: React.FC<AssignedQueriesProps> = ({ assignedQueries, onViewQuery, currentUser, onUpdateStatus }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const isDataEngineer = currentUser?.role === 'DataEngineer';

    const stats = useMemo(() => {
        const total = assignedQueries.length;
        const assigned = assignedQueries.filter(q => q.status === 'Assigned').length;
        const inProgress = assignedQueries.filter(q => q.status === 'In progress').length;
        const optimized = assignedQueries.filter(q => q.status === 'Optimized').length;

        return {
            total: total.toString(),
            assigned: assigned.toString(),
            inProgress: inProgress.toString(),
            optimized: optimized.toString()
        };
    }, [assignedQueries]);

    const filteredQueries = useMemo(() => {
        return assignedQueries.filter(q => {
            if (search && !(
                q.queryId.toLowerCase().includes(search.toLowerCase()) ||
                q.message.toLowerCase().includes(search.toLowerCase()) ||
                q.assignedTo.toLowerCase().includes(search.toLowerCase())
            )) return false;

            if (priorityFilter.length > 0 && !priorityFilter.includes(q.priority)) return false;
            if (statusFilter.length > 0 && !statusFilter.includes(q.status)) return false;
            if (assigneeFilter.length > 0 && !assigneeFilter.includes(q.assignedTo)) return false;

            return true;
        });
    }, [assignedQueries, search, priorityFilter, statusFilter, assigneeFilter]);

    const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
    const paginatedData = filteredQueries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const assigneeOptions = useMemo(() => [...new Set(assignedQueries.map(q => q.assignedTo))], [assignedQueries]);

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 overflow-y-auto no-scrollbar gap-4">
            <header className="flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Assigned tasks</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Track queries that have been assigned to you or by you for optimization.</p>
            </header>

            {/* KPI Pills */}
            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                <KPILabel label="Total Tasks" value={stats.total} />
                <KPILabel label="Assigned" value={stats.assigned} />
                <KPILabel label="In Progress" value={stats.inProgress} />
                <KPILabel label="Optimized" value={stats.optimized} />
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col overflow-visible flex-grow min-h-0">
                
                {/* Unified Filter Bar */}
                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border-light bg-white rounded-t-[12px] relative z-20">
                    <div className="flex items-center gap-6 text-[13px]">
                        <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                        
                        <div className="w-px h-3 bg-border-color hidden sm:block"></div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-text-muted font-medium">Priority:</span>
                            <MultiSelectDropdown 
                                label="All" 
                                options={['Low', 'Medium', 'High']} 
                                selectedOptions={priorityFilter} 
                                onChange={setPriorityFilter} 
                                selectionMode="single"
                            />
                        </div>

                        <div className="w-px h-3 bg-border-color hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                            <span className="text-text-muted font-medium">Status:</span>
                            <MultiSelectDropdown 
                                label="All" 
                                options={['Assigned', 'In progress', 'Optimized', 'Cannot be optimized']} 
                                selectedOptions={statusFilter} 
                                onChange={setStatusFilter} 
                                selectionMode="single"
                            />
                        </div>

                        {!isDataEngineer && (
                            <>
                                <div className="w-px h-3 bg-border-color hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-text-muted font-medium">Assignee:</span>
                                    <MultiSelectDropdown 
                                        label="All" 
                                        options={assigneeOptions} 
                                        selectedOptions={assigneeFilter} 
                                        onChange={setAssigneeFilter} 
                                        selectionMode="single"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search tasks..."
                        />
                    </div>
                </div>

                {/* Table Body */}
                <div className="overflow-x-auto overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    {filteredQueries.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-4">
                                <IconClipboardList className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-base font-bold text-text-strong">No assigned tasks found</h3>
                            <p className="text-sm text-text-secondary mt-1">Adjust your filters to see more results.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[160px]">Resource ID</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[120px]">Credits</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[150px]">Assigned To</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[120px]">Priority</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[140px]">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light uppercase tracking-widest w-[150px] text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-border-light">
                                {paginatedData.map((query) => (
                                    <tr 
                                        key={query.id} 
                                        onClick={() => onViewQuery(query.queryId)}
                                        className="hover:bg-surface-nested transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-text-primary text-left truncate block w-full">
                                                {query.queryId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-text-secondary italic line-clamp-1" title={query.message}>
                                                    "{query.message}"
                                                </span>
                                                {query.engineerResponse && (
                                                    <span className="text-[11px] font-semibold text-indigo-600 line-clamp-1" title={query.engineerResponse}>
                                                        Eng: {query.engineerResponse}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-text-strong">
                                                {query.credits.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-text-primary">{query.assignedTo}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <PriorityBadge priority={query.priority} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge 
                                                status={query.status} 
                                                isEditable={false} 
                                                onStatusChange={(s) => onUpdateStatus?.(query.id, s)}
                                            />
                                        </td>
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <span className="text-[12px] font-bold text-text-muted">
                                                {new Date(query.engineerResponseDate || query.assignedOn).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredQueries.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignedTasks;
