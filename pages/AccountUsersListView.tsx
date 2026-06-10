
import React, { useState, useMemo } from 'react';
import { usersData } from '../data/dummyData';
import { IconSearch, IconChevronRight, IconUser } from '../constants';
import Pagination from '../components/Pagination';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[12px] text-text-secondary font-bold whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const UserAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0 border border-primary/10">
            {initials}
        </div>
    );
};

interface AccountUsersListViewProps {
    accountName: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

const AccountUsersListView: React.FC<AccountUsersListViewProps> = ({ accountName, onNavigateToRecommendations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const localUsers = useMemo(() => [
        { id: 'u-1', name: 'Alex Johnson', email: 'alex@acme.com', role: 'DE_ROLE', credits: 4200, queries: 1250, lastActive: '2 mins ago' },
        { id: 'u-2', name: 'Maria Garcia', email: 'maria@acme.com', role: 'ANALYST_ROLE', credits: 1850, queries: 8400, lastActive: 'Just now' },
        { id: 'u-3', name: 'Sam Chen', email: 'sam@acme.com', role: 'SYSADMIN', credits: 940, queries: 420, lastActive: '1 hour ago' },
        { id: 'u-4', name: 'Sarah Miller', email: 'sarah@acme.com', role: 'REPORTING_ROLE', credits: 420, queries: 12400, lastActive: '3 days ago' },
        { id: 'u-5', name: 'Service Account ETL', email: 'etl-bot@acme.com', role: 'ETL_ROLE', credits: 42500, queries: 880, lastActive: 'Just now' },
        { id: 'u-6', name: 'Chris Evans', email: 'chris@acme.com', role: 'ANALYST_ROLE', credits: 210, queries: 450, lastActive: '5 hours ago' },
    ], []);

    const filteredUsers = useMemo(() => {
        return localUsers.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, localUsers]);

    const globalMetrics = useMemo(() => {
        return {
            total: filteredUsers.length.toString(),
            credits: filteredUsers.reduce((sum, u) => sum + u.credits, 0).toLocaleString(),
            avgQueries: Math.round(filteredUsers.reduce((sum, u) => sum + u.queries, 0) / filteredUsers.length || 0).toLocaleString()
        };
    }, [filteredUsers]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="flex flex-col bg-background px-6 pt-6 pb-12 space-y-4">
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Users</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Track individual consumption and activity for users in this account.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                <KPILabel label="Active Users" value={globalMetrics.total} />
                <KPILabel label="User Credits" value={`${globalMetrics.credits} cr`} />
                <KPILabel label="Avg. Queries/User" value={globalMetrics.avgQueries} />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-6 py-3 flex justify-between items-center border-b border-border-light bg-white flex-shrink-0">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Account members</span>
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search users..."
                        />
                    </div>
                </div>

                <div className="overflow-y-auto min-h-0 no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10 font-bold uppercase tracking-widest text-[10px] text-text-muted">
                            <tr>
                                <th className="px-6 py-4 border-b border-border-light">User name</th>
                                <th className="px-6 py-4 border-b border-border-light">Role</th>
                                <th className="px-6 py-4 border-b border-border-light">Credits</th>
                                <th className="px-6 py-4 border-b border-border-light">Queries</th>
                                <th className="px-6 py-4 border-b border-border-light text-right">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedRows.map(row => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={row.name} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-strong group-hover:text-primary">{row.name}</span>
                                                <span className="text-[10px] text-text-muted font-medium">{row.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase text-text-muted bg-surface-nested px-2 py-1 rounded border border-border-light">{row.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-text-strong">{row.credits.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-text-secondary">{row.queries.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                onClick={() => onNavigateToRecommendations?.({ search: row.name })}
                                                className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                            >
                                                <span className="text-[12px] font-black">{(row.id.charCodeAt(row.id.length - 1) % 3) + 1}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountUsersListView;
