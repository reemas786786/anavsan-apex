import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Account, ConnectionStatus } from '../types';
import { IconDotsVertical, IconSearch, IconView, IconEdit, IconDelete, IconAdd, IconArrowUp, IconArrowDown, IconClock } from '../constants';
import Pagination from '../components/Pagination';

const StatusBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    const colorClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-indigo-50 text-[#5829D6] border border-indigo-100/80',
        Error: 'bg-rose-50 text-rose-700 border border-rose-100/80',
        Disconnected: 'bg-slate-100 text-slate-600 border border-slate-200/80',
        Connected: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80',
    };
    const dotClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-[#5829D6] animate-pulse',
        Error: 'bg-rose-500',
        Disconnected: 'bg-slate-400',
        Connected: 'bg-emerald-500',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-full ${colorClasses[status]}`}>
            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

interface ConnectionsProps {
  accounts: Account[];
  onSelectAccount: (account: Account, initialPage?: string) => void;
  onAddAccountClick: () => void;
  onDeleteAccount: (accountId: string) => void;
}

const Connections: React.FC<ConnectionsProps> = ({ accounts, onSelectAccount, onAddAccountClick, onDeleteAccount }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Account; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const sortedAndFilteredAccounts = useMemo(() => {
        let filteredAccounts = accounts.filter(account => 
            account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.identifier.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig !== null) {
            filteredAccounts.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredAccounts;
    }, [accounts, sortConfig, searchTerm]);

    const totalPages = Math.ceil(sortedAndFilteredAccounts.length / itemsPerPage);
    const paginatedData = useMemo(() => sortedAndFilteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sortedAndFilteredAccounts, currentPage, itemsPerPage]);

    const requestSort = (key: keyof Account) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (accounts.length === 0 && !searchTerm) {
        return <EmptyConnections onAdd={onAddAccountClick} />;
    }

    const SortIcon: React.FC<{ columnKey: keyof Account }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <IconArrowUp className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-3.5 h-3.5 text-[#5829D6]" />;
        }
        return <IconArrowDown className="w-3.5 h-3.5 text-[#5829D6]" />;
    };

    return (
        <div className="flex flex-col h-full bg-background gap-4 p-4 pb-20 max-w-[1440px] mx-auto overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Account inventory</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">Manage and monitor all your connected Snowflake data warehouses across the organization.</p>
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-border-light shadow-sm flex flex-col overflow-hidden flex-grow">
                <div className="p-5 flex justify-between items-center flex-shrink-0 border-b border-border-light bg-white gap-4">
                    <div className="relative flex-grow max-w-md">
                        <IconSearch className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                            type="search" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="Search accounts..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 focus:border-[#5829D6] rounded-full text-xs font-bold text-slate-700 focus:ring-1 focus:ring-[#5829D6]/20 transition-all outline-none" 
                        />
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddAccountClick();
                        }} 
                        className="bg-[#5829D6] hover:bg-[#4F46E5] text-white font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        <span>Add Account</span>
                        <IconAdd className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-x-auto flex-grow w-full">
                    <table className="w-full text-[12px] text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-y border-border-light">
                                <th scope="col" className="px-6 py-3.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                    <button onClick={() => requestSort('name')} className="group flex items-center gap-1 focus:outline-none">
                                        Account <SortIcon columnKey="name" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                    <button onClick={() => requestSort('lastSynced')} className="group flex items-center gap-1 focus:outline-none">
                                        Last Synced <SortIcon columnKey="lastSynced" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider">
                                    <button onClick={() => requestSort('status')} className="group flex items-center gap-1 focus:outline-none">
                                        Status <SortIcon columnKey="status" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-[9px] font-bold text-[#9A9AB2] uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light bg-white">
                            {paginatedData.map(account => (
                                <tr 
                                    key={account.id} 
                                    onClick={() => onSelectAccount(account)}
                                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-black text-[#5829D6] hover:underline hover:text-[#4F46E5] text-left transition-colors leading-tight">
                                                {account.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-1 font-mono">
                                                {account.identifier ? account.identifier.toUpperCase() : 'EVC54287'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-semibold">
                                            <IconClock className="w-3.5 h-3.5 text-slate-400" />
                                            {account.lastSynced}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={account.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === account.id ? menuRef : null}>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setOpenMenuId(openMenuId === account.id ? null : account.id); 
                                                }} 
                                                title="Actions" 
                                                className="p-2 text-slate-450 hover:text-[#5829D6] rounded-full hover:bg-[#5829D6]/10 transition-colors focus:outline-none"
                                            >
                                                <IconDotsVertical className="h-5 w-5"/>
                                            </button>
                                            {openMenuId === account.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg z-25 border border-slate-200/80">
                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                e.stopPropagation();
                                                                onSelectAccount(account); 
                                                                setOpenMenuId(null); 
                                                            }} 
                                                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5829D6]" 
                                                            role="menuitem"
                                                        >
                                                            <IconView className="h-4 w-4 text-slate-450"/> View
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                e.stopPropagation(); 
                                                                setOpenMenuId(null);
                                                            }} 
                                                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-705 hover:bg-slate-50 hover:text-[#5829D6]" 
                                                            role="menuitem"
                                                        >
                                                            <IconEdit className="h-4 w-4 text-slate-450"/> Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); 
                                                                e.stopPropagation(); 
                                                                onDeleteAccount(account.id); 
                                                                setOpenMenuId(null); 
                                                            }} 
                                                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-650 hover:bg-red-50" 
                                                            role="menuitem"
                                                        >
                                                            <IconDelete className="h-4 w-4 text-red-400"/> Delete
                                                        </button>
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

                {sortedAndFilteredAccounts.length > 0 && (
                    <div className="flex-shrink-0 bg-white border-t border-border-light p-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedAndFilteredAccounts.length}
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

const EmptyConnections: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="w-full text-center max-w-lg mx-auto mt-24 p-8 bg-white border border-border-light rounded-[24px] shadow-sm">
        <div className="w-16 h-16 bg-[#5829D6]/5 text-[#5829D6] flex items-center justify-center rounded-2xl mx-auto mb-6">
            <IconAdd className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-800 mb-2">You haven’t connected any Snowflake accounts yet.</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">Let’s add one to get started. Connect your Snowflake account to start optimizing performance and costs.</p>
        <button 
            onClick={onAdd} 
            className="bg-[#5829D6] hover:bg-[#4F46E5] text-white font-black px-6 py-3 rounded-full flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm mx-auto cursor-pointer"
        >
            <span>Connect Account</span>
            <IconAdd className="h-5 w-5" />
        </button>
    </div>
);

export default Connections;
