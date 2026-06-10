
import React, { useState, useRef, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight, IconUser, IconBell, IconChevronDown, IconTrendingUp } from '../constants';
import UserManagement from './settings/UserManagement';
import IntegrationsPage from './settings/IntegrationsPage';
import { User } from '../types';

interface SettingsPageProps {
    activeSubPage: string;
    onSubPageChange: (subPage: string) => void;
    onBack: () => void;
    onAddUserClick: () => void;
    users: User[];
    onEditUserRoleClick: (user: User) => void;
    onSuspendUserClick: (user: User) => void;
    onActivateUserClick: (user: User) => void;
    onRemoveUserClick: (user: User) => void;
    onDisconnectGitHub: (onConfirm: () => void) => void;
}

const settingsNavItems = [
    { name: 'Budgets and Alerts', icon: IconBell },
    { name: 'Integrations', label: 'Tools', icon: IconTrendingUp },
];

const MobileNav: React.FC<{
    activeSubPage: string;
    onSubPageChange: (page: string) => void;
    navItems: any[];
}> = ({ activeSubPage, onSubPageChange, navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={navRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg bg-surface-nested border border-border-color">
                <span className="font-semibold text-text-primary">{(navItems.find(i => i.name === activeSubPage)?.label || activeSubPage)}</span>
                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface rounded-lg shadow-lg mt-1 z-20 border border-border-color">
                    <ul className="py-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button onClick={() => { onSubPageChange(item.name); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium ${activeSubPage === item.name ? 'text-primary bg-primary/10' : 'text-text-strong'}`}>
                                    {item.label || item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    activeSubPage, 
    onSubPageChange, 
    onBack, 
    onAddUserClick, 
    users,
    onEditUserRoleClick,
    onSuspendUserClick,
    onActivateUserClick,
    onRemoveUserClick,
    onDisconnectGitHub
}) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const renderSubPage = () => {
        switch (activeSubPage) {
            case 'Budgets and Alerts':
                 return (
                    <div className="p-4 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">Budgets and Alerts</h2>
                        <p className="mt-2 text-text-secondary">Set spending budgets and configure alert notifications.</p>
                    </div>
                );
            case 'Integrations':
                return <IntegrationsPage onDisconnect={onDisconnectGitHub} />;
            default:
                return (
                    <div className="p-4 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">Budgets and Alerts</h2>
                        <p className="mt-2 text-text-secondary">Set spending budgets and configure alert notifications.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full bg-background">
            <aside className={`hidden lg:flex bg-surface flex-shrink-0 border-r border-border-color flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="flex-grow overflow-y-auto p-4">
                        <nav>
                        <ul className="space-y-1">
                            {settingsNavItems.map(item => (
                                <li key={item.name}>
                                    <button
                                        onClick={() => onSubPageChange(item.name)}
                                        className={`w-full flex items-center text-left px-3 py-2 rounded-full text-sm transition-colors ${
                                            activeSubPage === item.name 
                                            ? 'bg-[#F0EAFB] text-primary font-semibold' 
                                            : 'text-text-strong font-medium hover:bg-surface-hover'
                                        }`}
                                        aria-label={item.label || item.name}
                                        title={isSidebarExpanded ? '' : (item.label || item.name)}
                                    >
                                        <item.icon className={`h-5 w-5 shrink-0 ${
                                            activeSubPage === item.name 
                                            ? 'text-primary' 
                                            : 'text-text-strong'
                                        }`} />
                                        {isSidebarExpanded && <span className="ml-3">{item.label || item.name}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="flex-shrink-0 mt-auto p-2">
                    <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                    <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                        <button
                            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isSidebarExpanded 
                                ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                                : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                            }
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="lg:hidden p-4 border-b border-border-color bg-surface sticky top-0 z-10">
                    <MobileNav activeSubPage={activeSubPage || 'Budgets and Alerts'} onSubPageChange={(subPage) => onSubPageChange(subPage)} navItems={settingsNavItems} />
                </div>
                <div className="p-4">
                    {renderSubPage()}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
