
import React, { useRef, useState, useEffect } from 'react';
import { Account } from '../types';
import { accountNavItems } from '../constants';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCheck, IconSearch, IconArrowUp } from '../constants';

const ChevronUpIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const AccountAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};

const ContextualNavItem: React.FC<{
    item: typeof accountNavItems[0];
    isSidebarExpanded: boolean;
    activePage: string;
    onPageChange: (page: string) => void;
    openSubMenus: Record<string, boolean>;
    handleSubMenuToggle: (itemName: string) => void;
    selectedApplicationId?: string | null;
    isDeepDrillDown?: boolean;
}> = ({ item, isSidebarExpanded, activePage, onPageChange, openSubMenus, handleSubMenuToggle, selectedApplicationId, isDeepDrillDown }) => {
    const [openFlyout, setOpenFlyout] = useState(false);
    const flyoutTimeoutIdRef = useRef<number | null>(null);

    const handleFlyoutEnter = () => {
        if (flyoutTimeoutIdRef.current) clearTimeout(flyoutTimeoutIdRef.current);
        setOpenFlyout(true);
    };

    const handleFlyoutLeave = () => {
        flyoutTimeoutIdRef.current = window.setTimeout(() => setOpenFlyout(false), 200);
    };

    const hasChildren = item.children.length > 0;
    const isSubMenuOpen = openSubMenus[item.name];
    const isSomeChildActive = !isDeepDrillDown && hasChildren && item.children.some(c => c.name === activePage);

    const isItemActuallyActive = !isDeepDrillDown && (activePage === item.name || (item.name === 'Compute' && ['Compute overview', 'Warehouse', 'Serverless', 'Cortex', 'Overview'].includes(activePage)) || (item.name === 'Query pattern' && ['Query pattern', 'Queries overview', 'Repeated queries', 'Expensive queries', 'Overview', 'Analysis', 'Query list'].includes(activePage)) || (item.name === 'Storage' && ['Storage overview', 'Databases', 'Schemas', 'Schema objects', 'Unused tables', 'Overview'].includes(activePage)) || (item.name === 'Optimization' && ['Query analyzer', 'Query optimizer', 'Query simulator', 'Overview'].includes(activePage))) && !(item.name === 'Applications' && selectedApplicationId);

    if (isSidebarExpanded) {
        return (
            <li>
                <button
                    onClick={() => {
                        if (hasChildren) {
                            handleSubMenuToggle(item.name);
                        } else {
                            onPageChange(item.name);
                        }
                    }}
                    className={`w-full group relative flex items-center justify-between rounded-[8px] text-[13px] px-4 py-2 transition-colors duration-200
                        ${isItemActuallyActive && !hasChildren
                            ? 'bg-[#F0EAFB] text-[#5829D6] font-semibold'
                            : (isItemActuallyActive ? 'text-[#5829D6] font-semibold hover:bg-surface-hover' : 'text-text-strong font-medium hover:bg-surface-hover hover:text-[#5829D6]')}
                    `}
                >
                    <div className="flex items-center min-w-0 mr-2">
                        <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isItemActuallyActive ? 'text-[#5829D6]' : 'text-text-strong group-hover:text-[#5829D6]'}`} />
                        <span className="ml-3 truncate">{item.label || item.name}</span>
                    </div>
                    {hasChildren && (
                        <IconChevronDown className={`h-4 w-4 transition-transform transition-colors duration-200 ${isSubMenuOpen ? 'rotate-180' : ''} ${isItemActuallyActive ? 'text-[#5829D6]' : 'text-text-strong group-hover:text-[#5829D6]'}`} />
                    )}
                </button>
                {hasChildren && isSubMenuOpen && (
                    <ul className="mt-[2px] space-y-[2px] px-1">
                        {item.children.map(child => {
                            const isChildActive = activePage === child.name || 
                                (item.name === 'Query pattern' && ['Query list', 'Repeated queries', 'Expensive queries'].includes(activePage) && child.name === 'Analysis');
                            return (
                                <li key={child.name}>
                                    <button
                                        onClick={() => onPageChange(child.name)}
                                        className={`w-full text-left pl-12 pr-4 py-2 text-[13px] rounded-[8px] transition-colors whitespace-nowrap
                                            ${isChildActive
                                                ? 'text-[#5829D6] font-medium bg-[#F0EAFB]'
                                                : 'text-text-secondary hover:text-[#5829D6] hover:bg-surface-hover'
                                            }
                                        `}
                                    >
                                        {child.label || child.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    } else {
        const isActive = isItemActuallyActive;
        return (
            <li
                onMouseEnter={handleFlyoutEnter}
                onMouseLeave={handleFlyoutLeave}
                className="relative flex justify-center"
            >
                <button
                    onClick={() => onPageChange(item.name)}
                    className={`group relative flex justify-center items-center h-10 w-10 rounded-[8px] transition-colors ${
                        isActive
                        ? 'bg-[#F0EAFB] text-[#5829D6]'
                        : 'text-text-strong hover:bg-surface-hover hover:text-[#5829D6]'
                    }`}
                >
                    <item.icon className="h-5 w-5 shrink-0" />
                </button>

                {openFlyout && (
                     <div 
                        className="absolute left-full ml-2 top-0 w-60 bg-surface rounded-lg shadow-lg p-2 z-30 border border-border-color"
                        onMouseEnter={handleFlyoutEnter}
                        onMouseLeave={handleFlyoutLeave}
                    >
                        <div className="px-3 py-2 text-[13px] font-semibold text-text-strong">{item.label || item.name}</div>
                    </div>
                )}
            </li>
        );
    }
};

interface ContextualSidebarProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onBackToAccounts: () => void;
    backLabel?: string;
    selectedApplicationId?: string | null;
    isDeepDrillDown?: boolean;
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ account, accounts, onSwitchAccount, activePage, onPageChange, onBackToAccounts, backLabel = 'Back to accounts', selectedApplicationId, isDeepDrillDown }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const accountSwitcherRef = useRef<HTMLDivElement>(null);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountSwitcherRef.current && !accountSwitcherRef.current.contains(event.target as Node)) {
                setIsAccountSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Find the parent menu that contains the current active page
        const parentToOpen = accountNavItems.find(item => 
            item.children.some(child => {
                const isChildActive = activePage === child.name || 
                    (item.name === 'Query pattern' && activePage === 'Queries overview' && child.name === 'Queries overview') || 
                    (item.name === 'Query pattern' && ['Query list', 'Repeated queries', 'Expensive queries'].includes(activePage) && child.name === 'Analysis') ||
                    (item.name === 'Compute' && activePage === 'Compute overview' && child.name === 'Compute overview') ||  
                    (item.name === 'Storage' && activePage === 'Storage overview' && child.name === 'Storage overview') || 
                    (item.name === 'Optimization' && activePage === 'Query analyzer' && child.name === 'Query analyzer');
                return isChildActive;
            })
        )?.name;
        
        if (parentToOpen) {
            setOpenSubMenus(prev => ({ ...prev, [parentToOpen]: true }));
        }
    }, [account.id, activePage]);

    const handleSubMenuToggle = (itemName: string) => {
        setOpenSubMenus(prev => {
            const isCurrentlyOpen = !!prev[itemName];
            
            if (isCurrentlyOpen) {
                localStorage.removeItem('anavsan_last_open_submenu');
                return { ...prev, [itemName]: false };
            } else {
                localStorage.setItem('anavsan_last_open_submenu', itemName);
                return { ...prev, [itemName]: true };
            }
        });
    };

    return (
        <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out border-r border-border-light h-full ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
            <div className="flex-shrink-0 h-[32px] flex items-center border-b border-border-light overflow-hidden">
                <button
                    onClick={onBackToAccounts}
                    className={`h-full w-full group relative flex items-center rounded-none text-[13px] px-4 transition-colors duration-200 text-text-strong font-medium hover:bg-surface-hover hover:text-[#5829D6] ${isSidebarExpanded ? 'min-w-0' : 'justify-center'}`}
                >
                    <div className="flex items-center min-w-0 w-full">
                        <IconChevronLeft className="h-5 w-5 shrink-0 transition-colors text-text-strong group-hover:text-[#5829D6]" />
                        {isSidebarExpanded && <span className="ml-3 truncate">{backLabel}</span>}
                    </div>
                </button>
            </div>
            
            <div className={`py-3 px-[6px] flex-shrink-0 transition-all ${isSidebarExpanded ? '' : 'flex justify-center'}`}>
                <div 
                    ref={accountSwitcherRef}
                    className="relative w-full"
                >
                    <button
                        onClick={() => setIsAccountSwitcherOpen(prev => !prev)}
                        className={`w-full flex items-center transition-all group relative border ${
                            isSidebarExpanded 
                            ? 'text-left py-2.5 px-3 rounded-2xl bg-white dark:bg-[#1E293B]/60 border-slate-200/50 dark:border-slate-800 hover:border-[#5829D6]/35 dark:hover:border-[#5829D6]/40 hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/90 hover:shadow-sm justify-between' 
                            : 'h-10 w-10 rounded-xl bg-white dark:bg-[#1E293B]/60 border-slate-200/50 dark:border-slate-800 hover:border-[#5829D6]/35 dark:hover:border-[#5829D6]/40 hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/90 hover:shadow-sm justify-center'
                        }`}
                        aria-haspopup="true"
                        aria-expanded={isAccountSwitcherOpen}
                        title={isSidebarExpanded ? "Switch Account" : account.name}
                    >
                        {isSidebarExpanded ? (
                            <>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex flex-col overflow-hidden leading-tight text-left">
                                        <span className="text-[12.5px] font-black text-slate-850 dark:text-white truncate group-hover:text-[#5829D6] transition-colors">
                                            {account.name}
                                        </span>
                                        <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">
                                            {account.identifier ? account.identifier.toUpperCase() : 'EVC54287'}
                                        </span>
                                    </div>
                                </div>
                                <IconChevronDown className={`h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isAccountSwitcherOpen ? 'rotate-180 text-[#5829D6]' : 'group-hover:text-slate-600'}`} />
                            </>
                        ) : (
                            <div className="text-xs font-black text-[#5829D6] dark:text-[#C4B5FD] flex items-center justify-center">
                                {account.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                        )}
                    </button>
                    {isAccountSwitcherOpen && (
                        <div className={`absolute z-30 mt-2 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl border border-slate-150 dark:border-slate-800 shadow-2xl p-2.5 ${isSidebarExpanded ? 'w-full' : 'w-64 left-full ml-2 -top-2'}`}>
                            <div className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase pb-2 mb-1.5 px-2.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                <span>Switch Account</span>
                                <span className="bg-[#10B981]/15 text-[#10B981] font-extrabold px-1.5 py-0.5 rounded text-[8px] tracking-tight">Active link</span>
                            </div>
                            <ul className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                                {accounts.map(acc => {
                                    const isActive = acc.id === account.id;
                                    return (
                                        <li key={acc.id}>
                                            <button
                                                onClick={() => { onSwitchAccount(acc); setIsAccountSwitcherOpen(false); }}
                                                className={`w-full text-left flex items-center justify-between gap-3 p-2 rounded-xl text-xs transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-[#5829D6]/10 to-[#7C3AED]/5 border-l-4 border-[#5829D6] text-[#5829D6] dark:text-[#C4B5FD] font-black pl-1.5'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                    <div className="flex flex-col overflow-hidden text-left">
                                                        <span className="truncate text-slate-800 dark:text-slate-200 text-xs">{acc.name}</span>
                                                        <span className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">
                                                            {acc.identifier ? acc.identifier.toUpperCase() : 'EVC54287'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <div className="h-4 w-4 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center flex-shrink-0">
                                                        <IconCheck className="h-2.5 w-2.5" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <nav className={`flex-grow px-[4px] space-y-[2px] ${isSidebarExpanded ? 'overflow-y-auto' : ''} no-scrollbar`}>
                <ul className="space-y-[2px]">
                    {accountNavItems.map(item => (
                        <ContextualNavItem
                            key={item.name}
                            item={item}
                            isSidebarExpanded={isSidebarExpanded}
                            activePage={activePage}
                            onPageChange={onPageChange}
                            openSubMenus={openSubMenus}
                            handleSubMenuToggle={handleSubMenuToggle}
                            selectedApplicationId={selectedApplicationId}
                            isDeepDrillDown={isDeepDrillDown}
                        />
                     ))}
                </ul>
            </nav>

            <div className="py-3 px-4 mt-auto flex-shrink-0 border-t border-border-light">
                <div className={`flex ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-primary transition-all focus:outline-none"
                        aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarExpanded 
                            ? <IconChevronLeft className="h-5 w-5" /> 
                            : <IconChevronRight className="h-5 w-5" />
                        }
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ContextualSidebar;
