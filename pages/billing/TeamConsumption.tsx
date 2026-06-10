
import React, { useState, useMemo } from 'react';
import { User, UserStatus, Subscription } from '../../types';
import { usersData } from '../../data/dummyData';
import { IconSearch, IconArrowUp, IconArrowDown, IconAdd, IconDotsVertical, IconEdit, IconDelete, IconUser, IconInfo, IconCheck, IconExclamationTriangle } from '../../constants';
import Pagination from '../../components/Pagination';

const StatusBadge: React.FC<{ status: UserStatus; endsOn?: string }> = ({ status, endsOn }) => {
    const colorClasses: Record<UserStatus, string> = {
        Active: 'bg-status-success-light text-status-success-dark',
        Invited: 'bg-status-info-light text-status-info-dark',
        Suspended: 'bg-gray-200 text-gray-800',
    };
    const dotClasses: Record<UserStatus, string> = {
        Active: 'bg-status-success',
        Invited: 'bg-status-info',
        Suspended: 'bg-gray-500',
    };
    return (
        <div className="flex flex-col">
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded-full w-fit ${colorClasses[status]}`}>
                <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotClasses[status]}`}></span>
                {status}
            </span>
            {endsOn && (
                <span className="text-[10px] text-status-error font-bold mt-1">Ends {endsOn}</span>
            )}
        </div>
    );
};

interface TeamConsumptionProps {
    users: User[];
    subscription: Subscription;
    onAddUser: () => void;
    onEditUserRole: (user: User) => void;
    onSuspendUser: (user: User) => void;
    onActivateUser: (user: User) => void;
    onRemoveUser: (user: User) => void;
    onCancelDowngrade: () => void;
}

const TeamConsumption: React.FC<TeamConsumptionProps> = ({ 
    users, 
    subscription,
    onAddUser, 
    onEditUserRole, 
    onSuspendUser, 
    onActivateUser, 
    onRemoveUser,
    onCancelDowngrade
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof User>('usageTokens');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const teamWithUsage = useMemo(() => {
        return users.map(u => ({
            ...u,
            usageTokens: u.usageTokens || Math.floor(Math.random() * 500) + 50
        }));
    }, [users]);

    const filteredUsers = useMemo(() => {
        return teamWithUsage.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teamWithUsage, searchTerm]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const valA = a[sortKey] ?? 0;
            const valB = b[sortKey] ?? 0;
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortKey, sortDir]);

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSort = (key: keyof User) => {
        if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const usedSeats = users.length;
    const includedSeats = 5;
    const extraSeats = Math.max(0, usedSeats - includedSeats);

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 pb-20">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Team management</h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your team members and monitor their platform usage.</p>
                </div>
                <button 
                    onClick={onAddUser}
                    className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    <IconAdd className="w-5 h-5" />
                    Invite member
                </button>
            </header>

            {/* Downgrade Scheduled Alert Banner */}
            {subscription.isDowngradePending && (
                <div className="bg-[#FFF1F1] rounded-xl p-4 border border-status-error/10 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-status-error/10 flex items-center justify-center flex-shrink-0 text-status-error">
                            <IconExclamationTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-text-strong">Plan switch scheduled</h4>
                            <p className="text-xs text-text-secondary font-medium mt-0.5">
                                This workspace will transition to <span className="font-bold text-text-strong">Individual Mode</span> on {subscription.pendingPlanEffectiveDate}. {users.length - 1} members will lose access on that date.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onCancelDowngrade}
                        className="text-xs font-bold text-[#0F62FE] hover:underline px-4 py-2"
                    >
                        Cancel switch
                    </button>
                </div>
            )}

            {/* Seat Usage Overview Stats */}
            <div className="flex gap-4">
                 <div className="bg-white px-6 py-3 rounded-2xl border border-border-light shadow-sm flex items-center gap-2">
                    <span className="text-sm text-text-secondary font-medium">Total seats:</span>
                    <span className="text-sm font-black text-text-strong">{includedSeats}</span>
                 </div>
                 <div className="bg-white px-6 py-3 rounded-2xl border border-border-light shadow-sm flex items-center gap-2">
                    <span className="text-sm text-text-secondary font-medium">Active:</span>
                    <span className="text-sm font-black text-text-strong">{usedSeats}</span>
                 </div>
                 <div className="bg-white px-6 py-3 rounded-2xl border border-border-light shadow-sm flex items-center gap-2">
                    <span className="text-sm text-text-secondary font-medium">Available seats:</span>
                    <span className="text-sm font-black text-text-strong">{Math.max(0, includedSeats - usedSeats)}</span>
                 </div>
            </div>

            {/* Combined Table */}
            <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border-light flex justify-end items-center bg-white">
                    <div className="relative max-w-xs w-full">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Invite member" 
                            className="w-full pl-10 pr-4 py-2 bg-surface-nested border-none rounded-full text-sm focus:ring-1 focus:ring-primary"
                        />
                         <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary">
                            <IconAdd className="w-4 h-4" />
                         </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-table-header-bg text-[10px] font-black text-text-muted uppercase tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Mail</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('role')}>
                                    Role {sortKey === 'role' && (sortDir === 'desc' ? '↓' : '↑')}
                                </th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {paginatedUsers.map((user, idx) => {
                                // Logic: In a downgrade scenario, only the current user (Admin) survives.
                                // sample assumption: first user is admin or survivor
                                const isSurvivor = idx === 0;
                                const showEndsOn = subscription.isDowngradePending && !isSurvivor;
                                
                                return (
                                    <tr key={user.id} className="hover:bg-surface-nested group transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-text-primary group-hover:text-primary">{user.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-text-muted font-medium italic">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{user.roleTitle || user.role}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge 
                                                status={user.status} 
                                                endsOn={showEndsOn ? subscription.pendingPlanEffectiveDate : undefined}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block text-left">
                                                <button 
                                                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-all"
                                                >
                                                    <IconDotsVertical className="w-5 h-5" />
                                                </button>
                                                {openMenuId === user.id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl bg-surface shadow-xl z-50 border border-border-color overflow-hidden ring-1 ring-black ring-opacity-5">
                                                        <div className="py-1">
                                                            <button 
                                                                onClick={() => { onEditUserRole(user); setOpenMenuId(null); }}
                                                                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                                                            >
                                                                <IconEdit className="h-4 w-4" /> Edit Role
                                                            </button>
                                                            {user.status === 'Suspended' ? (
                                                                <button 
                                                                    onClick={() => { onActivateUser(user); setOpenMenuId(null); }}
                                                                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-status-success-dark hover:bg-status-success-light transition-colors"
                                                                >
                                                                    <IconCheck className="w-4 h-4" /> Activate User
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => { onSuspendUser(user); setOpenMenuId(null); }}
                                                                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                                                                >
                                                                    <IconEdit className="w-4 h-4 rotate-90" /> Suspend User
                                                                </button>
                                                            )}
                                                            <div className="h-px bg-border-light my-1"></div>
                                                            <button 
                                                                onClick={() => { onRemoveUser(user); setOpenMenuId(null); }}
                                                                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-status-error hover:bg-status-error/10 transition-colors"
                                                            >
                                                                <IconDelete className="h-4 w-4" /> Remove User
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

             {/* Quick Policy Note Banner (Bottom) */}
             {subscription.isDowngradePending && (
                <div className="mt-8 bg-white rounded-3xl p-8 w-full border border-border-light shadow-sm flex gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-12 h-12 rounded-full bg-status-warning/10 flex items-center justify-center flex-shrink-0">
                        <IconInfo className="w-6 h-6 text-status-warning" />
                    </div>
                    <div className="space-y-2">
                            <h4 className="text-lg font-bold text-text-strong">Quick Policy Note (Downgrade Scheduled)</h4>
                            <p className="text-sm text-text-secondary leading-relaxed max-w-4xl">
                            Your Team plan currently includes 5 seats with unlimited optimization. On <span className="font-bold text-text-strong">{subscription.pendingPlanEffectiveDate}</span>, this workspace will downgrade to the Individual plan (1 seat only). Your team members will automatically be removed and will <span className="font-bold text-text-strong">no longer have access</span> to this portal. Any unsaved work for secondary members should be backed up before the transition date.
                            </p>
                            <p className="text-xs text-text-muted pt-2 lowercase">
                            Need more seats after {subscription.pendingPlanEffectiveDate}? You will need to upgrade back to a Team plan at $49/mo per seat.
                            </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamConsumption;
