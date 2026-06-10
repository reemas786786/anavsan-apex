import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, UserStatus } from '../../types';
import { IconAdd, IconDotsVertical, IconArrowUp, IconArrowDown, IconSearch } from '../../constants';
import Pagination from '../../components/Pagination';

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
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
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};


interface UserManagementProps {
    users: User[];
    onAddUser: () => void;
    onEditUserRole: (user: User) => void;
    onSuspendUser: (user: User) => void;
    onActivateUserClick: (user: User) => void;
    onRemoveUserClick: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onEditUserRole, onSuspendUser, onActivateUserClick, onRemoveUserClick }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const userStats = useMemo(() => {
        return {
            total: users.length,
            active: users.filter(u => u.status === 'Active').length,
            suspended: users.filter(u => u.status === 'Suspended').length,
            invited: users.filter(u => u.status === 'Invited').length,
        };
    }, [users]);
    
    const sortedAndFilteredUsers = useMemo(() => {
        let filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (sortConfig !== null) {
            filteredUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredUsers;
    }, [users, sortConfig, searchTerm]);
    
    const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);
    const paginatedData = useMemo(() => sortedAndFilteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sortedAndFilteredUsers, currentPage, itemsPerPage]);

    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (openMenuId && menuRef.current && !menuRef.current.contains(target)) {
                if (!target.closest(`[data-menu-trigger-id]`)) {
                    setOpenMenuId(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);
    
    const SortIcon: React.FC<{ columnKey: keyof User }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="flex flex-col bg-background space-y-4">
            <div className="flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">User Management</h1>
                <p className="mt-1 text-text-secondary">Manage users, roles, and permissions for your organization.</p>
                 <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                        Total Users: <span className="font-bold text-text-strong">{userStats.total}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                        Active: <span className="font-bold text-status-success-dark">{userStats.active}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                        Suspended: <span className="font-bold text-text-secondary">{userStats.suspended}</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl flex flex-col">
                 <div className="p-2 mb-2 flex-shrink-0">
                     <div className="flex justify-between items-center">
                        <div className="relative">
                            <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="search" 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                placeholder="Search users..." 
                                className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" 
                            />
                        </div>
                        <button
                            onClick={onAddUser}
                            className="bg-primary text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm"
                        >
                            <span>Add User</span>
                            <IconAdd className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">
                                    <button onClick={() => requestSort('name')} className="group flex items-center">
                                        User <SortIcon columnKey="name" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">
                                     <button onClick={() => requestSort('role')} className="group flex items-center">
                                        Role <SortIcon columnKey="role" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">
                                     <button onClick={() => requestSort('status')} className="group flex items-center">
                                        Status <SortIcon columnKey="status" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">
                                    <button onClick={() => requestSort('dateAdded')} className="group flex items-center">
                                        Date Added <SortIcon columnKey="dateAdded" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(user => (
                                <tr key={user.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested" data-row-hover>
                                    <td className="px-6 py-3 font-medium text-text-primary whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={user.name} />
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="text-sm text-text-secondary font-normal">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{user.role}</td>
                                    <td className="px-6 py-3"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-3">{user.dateAdded}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === user.id ? menuRef : null}>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                aria-label={`Actions for ${user.name}`}
                                                title="Actions"
                                                aria-haspopup="true"
                                                aria-expanded={openMenuId === user.id}
                                                data-menu-trigger-id={user.id}
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-20 border border-border-color">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={() => { onEditUserRole(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Edit Role</button>
                                                        {user.status === 'Suspended' ? (
                                                            <button onClick={() => { onActivateUserClick(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Activate User</button>
                                                        ) : (
                                                            <button onClick={() => { onSuspendUser(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Suspend User</button>
                                                        )}
                                                        <button onClick={() => { onRemoveUserClick(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">Remove User</button>
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
                 {sortedAndFilteredUsers.length > 10 && (
                     <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedAndFilteredUsers.length}
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

export default UserManagement;