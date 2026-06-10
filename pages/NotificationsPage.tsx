
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Notification, NotificationType, NotificationSeverity, Account, Warehouse, QueryListItem, AssignedQuery } from '../types';
import { queryListData, warehousesData } from '../data/dummyData';
import { IconBell, IconExclamationTriangle, IconList, IconClock, IconBolt, IconSearch, IconInfo, IconChevronLeft, IconChevronRight } from '../constants';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Pagination from '../components/Pagination';
import SidePanel from '../components/SidePanel';
import AssignedQueryModalContent from '../components/AssignedQueryModalContent';

// --- HELPER COMPONENTS ---

const SeverityBadge: React.FC<{ severity: NotificationSeverity }> = ({ severity }) => {
    const colorClasses: Record<NotificationSeverity, string> = {
        Info: 'bg-status-info-light text-status-info-dark',
        Warning: 'bg-status-warning-light text-status-warning-dark',
        Critical: 'bg-status-error-light text-status-error-dark',
    };
    return <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase rounded-full border border-border-light shadow-sm ${colorClasses[severity]}`}>{severity}</span>;
};

// --- INSIGHT DETAIL PANEL ---

interface InsightDetailPanelContentProps {
    insight: Notification;
    accounts: Account[];
    onClose: () => void;
    onNavigateToWarehouse: (account: Account, warehouse: Warehouse) => void;
    onNavigateToQuery: (account: Account, query: QueryListItem) => void;
}

const InsightDetailPanelContent: React.FC<InsightDetailPanelContentProps> = ({ insight, accounts, onClose, onNavigateToWarehouse, onNavigateToQuery }) => {
    const warehouse = useMemo(() => warehousesData.find(w => w.name === insight.warehouseName), [insight.warehouseName]);
    const query = useMemo(() => queryListData.find(q => q.id === insight.queryId), [insight.queryId]);
    const account = accounts.length > 0 ? accounts[0] : null;

    const handleWarehouseClick = () => {
        if (warehouse && account) {
            onNavigateToWarehouse(account, warehouse);
            onClose();
        }
    };
    
    const handleQueryClick = () => {
        if (query && account) {
            onNavigateToQuery(account, query);
            onClose();
        }
    };

    const formattedTimestamp = new Date(insight.timestamp).toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
        <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</p>
            <div className="text-sm font-bold text-text-primary mt-1">{value}</div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-8 space-y-8 flex-grow overflow-y-auto no-scrollbar">
                <div className="pb-6 border-b border-border-light">
                    <h3 className="text-xl font-black text-text-strong tracking-tight">{insight.insightTopic.replace(/_/g, ' ')} Alert</h3>
                    <div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
                        <span className="font-medium">{formattedTimestamp}</span>
                        <SeverityBadge severity={insight.severity} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <DetailItem label="Warehouse" value={insight.warehouseName} />
                    {insight.queryId && <DetailItem label="Query Reference" value={<span className="font-mono">{insight.queryId.substring(0, 10).toUpperCase()}</span>} />}
                </div>

                <div className="bg-surface-nested p-6 rounded-2xl border border-border-light space-y-2 shadow-inner">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Context</h4>
                    <p className="text-sm text-text-primary leading-relaxed font-medium">{insight.message}</p>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-sm font-black text-text-strong uppercase tracking-[0.15em] mb-4">
                        <IconBell className="w-4 h-4 text-primary" />
                        AI Recommendation
                    </h4>
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                        <p className="text-text-primary text-[15px] font-bold leading-relaxed italic">"{insight.suggestions}"</p>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-surface-nested border-t border-border-light flex justify-end gap-3 flex-shrink-0">
                <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-text-secondary hover:text-text-strong">Close</button>
                {insight.queryId && (
                    <button onClick={handleQueryClick} className="bg-primary text-white font-black px-8 py-3 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-widest">
                        Analyze Query
                    </button>
                )}
            </div>
        </div>
    );
};


// --- MAIN VIEW ---

interface NotificationsPageProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onMarkNotificationAsRead: (id: string) => void;
    accounts: Account[];
    onNavigateToWarehouse: (account: Account, warehouse: Warehouse) => void;
    onNavigateToQuery: (account: Account, query: QueryListItem) => void;
    onOpenAssignedQueryPreview: (assignedQuery: AssignedQuery) => void;
    assignedQueries: AssignedQuery[];
    onNavigateToAssignedTasks: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = (props) => {
    const { notifications, assignedQueries, onOpenAssignedQueryPreview, onNavigateToAssignedTasks } = props;
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedInsight, setSelectedInsight] = useState<Notification | null>(null);
    const [selectedAssignedTask, setSelectedAssignedTask] = useState<AssignedQuery | null>(null);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (statusFilter.length > 0) {
                if (statusFilter[0] === 'Read' && !n.isRead) return false;
                if (statusFilter[0] === 'Unread' && n.isRead) return false;
            }

            if (search && !(
                n.message.toLowerCase().includes(search.toLowerCase()) || 
                n.warehouseName.toLowerCase().includes(search.toLowerCase())
            )) return false;
            
            if (typeof dateFilter === 'string') {
                if (dateFilter !== 'All') {
                    const itemDate = new Date(n.timestamp);
                    const now = new Date();
                    let days = 0;
                    if (dateFilter === '7d') days = 7;
                    if (dateFilter === '1d') days = 1;
                    if (dateFilter === '30d') days = 30;
                    if (days > 0 && (now.getTime() - itemDate.getTime()) > (days * 24 * 60 * 60 * 1000)) return false;
                }
            } else {
                const itemDate = new Date(n.timestamp);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (itemDate < startDate || itemDate >= endDate) return false;
            }
            return true;
        });
    }, [notifications, search, dateFilter, statusFilter]);
    
    const sortedNotifications = useMemo(() => {
        return [...filteredNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [filteredNotifications]);

    const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
    
    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const handleOpenInsight = (n: Notification) => {
        if (n.insightTypeId === 'QUERY_ASSIGNED') {
            const aq = assignedQueries.find(a => a.queryId === n.queryId);
            if (aq) setSelectedAssignedTask(aq);
        } else {
            setSelectedInsight(n);
        }
    };

    const handleCloseInsight = () => {
        if (selectedInsight && !selectedInsight.isRead) {
            props.onMarkNotificationAsRead(selectedInsight.id);
        }
        setSelectedInsight(null);
    };

    const handleCloseAssignedTask = () => {
        setSelectedAssignedTask(null);
    };

    const handleGoToTaskOptimization = () => {
        if (selectedAssignedTask) {
            const query = queryListData.find(q => q.id === selectedAssignedTask.queryId);
            if (query) {
                props.onNavigateToQuery(props.accounts[0], query);
            }
            setSelectedAssignedTask(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 overflow-y-auto no-scrollbar">
            <header className="flex justify-between items-end mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Alerts</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">AI-detected anomalies and system-wide alerts.</p>
                </div>
                <button 
                    onClick={props.onMarkAllAsRead} 
                    className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                    Mark all as read
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-border-light flex flex-col flex-grow min-h-0 overflow-hidden">
                {/* Simplified Filter Bar */}
                <div className="px-6 py-4 flex flex-wrap items-center gap-6 border-b border-border-light relative z-20 overflow-visible bg-white flex-shrink-0">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    <div className="w-px h-4 bg-border-color"></div>
                    <MultiSelectDropdown 
                        label="Status" 
                        options={['Unread', 'Read']} 
                        selectedOptions={statusFilter} 
                        onChange={setStatusFilter} 
                        selectionMode="single" 
                    />
                    
                    <div className="relative flex-grow ml-auto max-w-xs">
                        <IconSearch className="h-4 w-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder="Search alerts..." 
                            className="bg-surface-nested border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary outline-none pr-10 pl-4 py-2 w-full text-left"
                        />
                    </div>
                </div>

                {/* Main Alerts List */}
                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10 text-[10px] font-black text-text-muted uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left border-b border-border-light w-[180px]">Type</th>
                                <th className="px-6 py-4 text-left border-b border-border-light">Message</th>
                                <th className="px-6 py-4 text-left border-b border-border-light w-[140px]">Date</th>
                                <th className="px-6 py-4 text-left border-b border-border-light w-[120px]">Status</th>
                                <th className="px-6 py-4 text-right border-b border-border-light w-[80px]"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                             {paginatedNotifications.map(n => (
                                <tr 
                                    key={n.id} 
                                    onClick={() => handleOpenInsight(n)}
                                    className="hover:bg-surface-nested transition-colors group cursor-pointer relative"
                                >
                                    <td className="px-6 py-5 relative">
                                        <span className="text-[11px] font-black uppercase tracking-tighter text-text-muted">
                                            {n.insightTopic.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="line-clamp-1 leading-snug font-medium text-text-secondary">
                                            {n.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-text-muted">
                                        {formatTimestamp(n.timestamp)}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            !n.isRead ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-60'
                                        }`}>
                                            {n.isRead ? 'Read' : 'Unread'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-text-muted group-hover:text-primary transition-all">
                                            <IconInfo className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedNotifications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="flex flex-col items-center opacity-40 grayscale">
                                            <IconBell className="w-16 h-16 text-text-muted mb-4" />
                                            <p className="text-base font-bold text-text-strong uppercase tracking-widest">Everything's quiet</p>
                                            <p className="text-sm text-text-secondary mt-1">You have no alerts matching your current filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedNotifications.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>

            <SidePanel isOpen={!!selectedInsight} onClose={handleCloseInsight} title="Alert Details">
                {selectedInsight && (
                    <InsightDetailPanelContent 
                        insight={selectedInsight}
                        accounts={props.accounts}
                        onClose={handleCloseInsight}
                        onNavigateToWarehouse={props.onNavigateToWarehouse}
                        onNavigateToQuery={props.onNavigateToQuery}
                    />
                )}
            </SidePanel>

            <SidePanel isOpen={!!selectedAssignedTask} onClose={handleCloseAssignedTask} title="Assigned Task Details">
                {selectedAssignedTask && (
                    <AssignedQueryModalContent 
                        assignedQuery={selectedAssignedTask}
                        onGoToQueryDetails={handleGoToTaskOptimization}
                        onViewTaskList={() => { onNavigateToAssignedTasks(); handleCloseAssignedTask(); }}
                    />
                )}
            </SidePanel>
        </div>
    );
};

export default NotificationsPage;
