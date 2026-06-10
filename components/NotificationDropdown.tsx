import React from 'react';
import { Bell, AlertTriangle, List, Clock, Zap, Check, X, BellOff, ArrowRight } from 'lucide-react';
import { Notification, NotificationType } from '../types';

interface TypeConfig {
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
}

const typeConfigMap: Record<NotificationType, TypeConfig> = {
    performance: { 
        bg: 'bg-amber-500/[0.08] dark:bg-amber-500/[0.15]', 
        text: 'text-amber-600 dark:text-amber-400', 
        border: 'border-amber-500/10 dark:border-amber-500/20',
        icon: Bell
    },
    latency: { 
        bg: 'bg-orange-500/[0.08] dark:bg-orange-500/[0.15]', 
        text: 'text-orange-600 dark:text-orange-400', 
        border: 'border-orange-500/10 dark:border-orange-500/20',
        icon: AlertTriangle
    },
    storage: { 
        bg: 'bg-blue-500/[0.08] dark:bg-blue-500/[0.15]', 
        text: 'text-blue-600 dark:text-blue-400', 
        border: 'border-blue-500/10 dark:border-blue-500/20',
        icon: List
    },
    query: { 
        bg: 'bg-sky-500/[0.08] dark:bg-sky-500/[0.15]', 
        text: 'text-sky-600 dark:text-sky-400', 
        border: 'border-sky-500/10 dark:border-sky-500/20',
        icon: Clock
    },
    load: { 
        bg: 'bg-red-500/[0.08] dark:bg-red-500/[0.15]', 
        text: 'text-red-600 dark:text-red-400', 
        border: 'border-red-500/10 dark:border-red-500/20',
        icon: Zap
    },
    TABLE_SCAN: { 
        bg: 'bg-amber-500/[0.08] dark:bg-amber-500/[0.15]', 
        text: 'text-amber-600 dark:text-amber-400', 
        border: 'border-amber-500/10 dark:border-amber-500/20',
        icon: AlertTriangle
    },
    JOIN_INEFFICIENCY: { 
        bg: 'bg-amber-500/[0.08] dark:bg-amber-500/[0.15]', 
        text: 'text-amber-600 dark:text-amber-400', 
        border: 'border-amber-500/10 dark:border-amber-500/20',
        icon: AlertTriangle
    },
    WAREHOUSE_IDLE: { 
        bg: 'bg-indigo-500/[0.08] dark:bg-indigo-500/[0.15]', 
        text: 'text-indigo-600 dark:text-indigo-400', 
        border: 'border-indigo-500/10 dark:border-indigo-500/20',
        icon: Bell
    },
    COST_SPIKE: { 
        bg: 'bg-rose-500/[0.08] dark:bg-rose-500/[0.15]', 
        text: 'text-rose-600 dark:text-rose-400', 
        border: 'border-rose-500/10 dark:border-rose-500/20',
        icon: Zap
    },
    QUERY_ASSIGNED: { 
        bg: 'bg-purple-500/[0.08] dark:bg-purple-500/[0.15]', 
        text: 'text-purple-600 dark:text-purple-400', 
        border: 'border-purple-500/10 dark:border-purple-500/20',
        icon: Bell
    },
    ASSIGNMENT_UPDATED: { 
        bg: 'bg-pink-500/[0.08] dark:bg-pink-500/[0.15]', 
        text: 'text-pink-600 dark:text-pink-400', 
        border: 'border-pink-500/10 dark:border-pink-500/20',
        icon: Bell
    },
};

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const config = typeConfigMap[notification.insightTopic] || { 
        bg: 'bg-slate-500/[0.08] dark:bg-slate-500/[0.15]', 
        text: 'text-slate-600 dark:text-slate-400', 
        border: 'border-slate-500/10 dark:border-slate-500/20',
        icon: Bell 
    };
    
    const IconComponent = config.icon;

    const formattedTimestamp = new Date(notification.timestamp).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <li className="relative group transition-all duration-200 hover:bg-slate-500/[0.02]">
            <a href="#" className="flex gap-3.5 p-4 items-start select-none">
                {/* Modern Squircle for Icon */}
                <div className="flex-shrink-0">
                    <div className={`w-9 h-9 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shadow-sm`}>
                        <IconComponent className={`w-4.5 h-4.5 ${config.text}`} />
                    </div>
                </div>

                {/* Content block */}
                <div className="flex-grow overflow-hidden pr-2">
                    <p className={`text-xs leading-relaxed transition-colors duration-150 ${
                        !notification.isRead 
                            ? 'text-slate-900 dark:text-white font-bold' 
                            : 'text-slate-550 dark:text-slate-400 font-medium'
                    }`}>
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-550 font-semibold mt-1">
                        <Clock className="w-3 h-3 text-slate-350 dark:text-slate-600" />
                        <span>{formattedTimestamp}</span>
                    </div>
                </div>

                {/* Modern Unread Glow */}
                {!notification.isRead && (
                    <div className="flex-shrink-0 self-center pl-1">
                        <div className="w-2 h-2 bg-[#6A38EB] dark:bg-purple-400 rounded-full shadow-[0_0_10px_rgba(106,56,235,0.6)] animate-pulse" />
                    </div>
                )}
            </a>
        </li>
    );
};

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onViewAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, notifications, onMarkAllAsRead, onViewAll }) => {
    if (!isOpen) {
        return null;
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const sortedNotifications = [...notifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    return (
        <div className="origin-top-right absolute right-0 top-full mt-2.5 w-96 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800/80 z-50 flex flex-col max-h-[calc(100vh-80px)] overflow-hidden">
            {/* Header section with smooth micro-action button and numbers */}
            <header className="p-4 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Alerts</h3>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-[#6A38EB]/10 dark:bg-purple-500/10 text-[#6A38EB] dark:text-purple-300 rounded-full border border-[#6A38EB]/10 dark:border-purple-500/10">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2.5">
                    {unreadCount > 0 && (
                        <button 
                            onClick={onMarkAllAsRead} 
                            className="flex items-center gap-1 text-[11px] font-extrabold text-[#6A38EB] dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-150 hover:underline px-2 py-1 rounded-lg hover:bg-[#6A38EB]/5 dark:hover:bg-purple-500/5 select-none"
                        >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Mark all read</span>
                        </button>
                    )}
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>
            </header>
            
            {/* Scrollable Area */}
            <div className="overflow-y-auto flex-grow no-scrollbar">
                {notifications.length > 0 ? (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        {sortedNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                    </ul>
                ) : (
                    <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-800/30 flex items-center justify-center border border-slate-100 dark:border-slate-800/40 mb-3">
                            <BellOff className="w-5 h-5 text-slate-350 dark:text-slate-500" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No alerts detected</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Everything is operating normally and within normal thresholds.</p>
                    </div>
                )}
            </div>
            
            {/* Footer with on-trend gradient key action button */}
            <footer className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
                <button 
                    onClick={onViewAll} 
                    className="w-full bg-[#6A38EB] hover:bg-[#582ed1] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/15 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none"
                >
                    <span>View all alerts</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
            </footer>
        </div>
    );
};

export default NotificationDropdown;