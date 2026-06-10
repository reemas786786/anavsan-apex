import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Account, ConnectionStatus } from '../types';
import { IconDotsVertical, IconSearch, IconView, IconEdit, IconDelete, IconAdd, IconArrowUp, IconArrowDown, IconClock } from '../constants';
import Pagination from '../components/Pagination';

const StatusBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    const colorClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-status-info-light text-status-info-dark',
        Error: 'bg-status-error-light text-status-error-dark',
        Disconnected: 'bg-gray-200 text-gray-800',
        Connected: 'bg-status-success-light text-status-success-dark',
    };
    const dotClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-status-info',
        Error: 'bg-status-error',
        Disconnected: 'bg-gray-400',
        Connected: 'bg-status-success',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
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
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="flex flex-col bg-background space-y-4 px-6 pt-4 pb-12 h-full">
            <div className="mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Account inventory</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Manage and monitor all your connected Snowflake data warehouses across the organization.</p>
            </div>

            <div className="bg-surface rounded-xl flex flex-col shadow-sm border border-border-light overflow-hidden flex-grow">
                <div className="p-4 flex justify-between items-center flex-shrink-0 border-b border-border-light">
                    <div className="relative">
                        <IconSearch className="h-4 w-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                            type="search" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="Search accounts..." 
                            className="w-full md:w-80 pl-9 pr-4 py-1.5 bg-background border-transparent rounded-full text-[11px] font-medium focus:ring-1 focus:ring-primary" 
                        />
                    </div>
                    <button onClick={onAddAccountClick} className="bg-primary text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm">
                        <span>Add Account</span>
                        <IconAdd className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-[12px]">
                        <thead className="text-[10px] text-text-secondary uppercase tracking-widest sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color">
                                    <button onClick={() => requestSort('name')} className="group flex items-center">
                                        Account <SortIcon columnKey="name" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color">
                                    <button onClick={() => requestSort('lastSynced')} className="group flex items-center">
                                        Last Synced <SortIcon columnKey="lastSynced" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color">
                                    <button onClick={() => requestSort('status')} className="group flex items-center">
                                        Status <SortIcon columnKey="status" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-bold text-right border-b border-border-color">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-white">
                            {paginatedData.map(account => (
                                <tr key={account.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested transition-colors" data-row-hover>
                                    <td onClick={() => onSelectAccount(account)} className="px-6 py-3 whitespace-nowrap cursor-pointer group/cell">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-link group-hover/cell:underline">{account.name}</span>
                                            <span className="text-[10px] text-text-muted font-mono">{account.identifier}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-left">
                                        <div className="flex items-center gap-1.5 text-text-muted font-medium">
                                            <IconClock className="w-3.5 h-3.5" />
                                            {account.lastSynced}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3"><StatusBadge status={account.status} /></td>
                                    <td className="px-6 py-3 text-right">
                                      <div className="relative inline-block text-left" ref={openMenuId === account.id ? menuRef : null}>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === account.id ? null : account.id); }} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                          <IconDotsVertical className="h-5 w-5"/>
                                        </button>
                                        {openMenuId === account.id && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <button onClick={(e) => { e.preventDefault(); onSelectAccount(account); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                        <IconView className="h-4 w-4"/> View
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                        <IconEdit className="h-4 w-4"/> Edit
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteAccount(account.id); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                                        <IconDelete className="h-4 w-4"/> Delete
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
                     <div className="flex-shrink-0">
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
    <div className="w-full text-center max-w-lg mx-auto mt-16 p-4">
        <h2 className="text-xl font-bold text-text-primary mb-2">You haven’t connected any Snowflake accounts yet.</h2>
        <p className="text-text-secondary mb-6">Let’s add one to get started. Connect your Snowflake account to start optimizing performance and costs.</p>
        <button onClick={onAdd} className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm mx-auto">
            <span>Connect Account</span>
            <IconAdd className="h-5 w-5" />
        </button>
    </div>
);

export default Connections;
