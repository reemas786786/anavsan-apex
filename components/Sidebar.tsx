
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { NAV_ITEMS_TOP, NAV_ITEMS_BOTTOM } from '../constants';
import { Page, NavItem as NavItemType, NavSubItem, UserRole, SubscriptionPlan } from '../types';
import { IconChevronRight } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page, subPage?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeSubPage?: string;
  isOverlayMode?: boolean;
  userRole?: UserRole;
  subscriptionPlan?: SubscriptionPlan;
  hasAccounts?: boolean;
}

const NavItem: React.FC<{ 
    item: NavItemType, 
    isActive: boolean,
    expanded: boolean,
    onToggle: () => void,
    onClick: (page: Page, subPage?: string) => void,
    activeSubPage?: string,
}> = ({ item, isActive, expanded, onToggle, onClick, activeSubPage }) => {
    
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const handleParentClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (hasSubItems) {
            onToggle();
        } else {
            onClick(item.name);
        }
    };

    return (
        <li>
            <button
                onClick={handleParentClick}
                className={`w-full group relative flex items-center justify-between rounded-[8px] text-[13px] px-4 py-2 transition-colors duration-200
                    ${isActive && !hasSubItems 
                        ? 'bg-[#F0EAFB] text-primary font-semibold' 
                        : (isActive ? 'text-primary font-semibold hover:bg-surface-hover' : 'text-text-strong font-medium hover:bg-surface-hover')}
                `}
                aria-expanded={expanded}
            >
                <div className="flex items-center">
                    <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary' : 'text-text-strong'}`} />
                    <span className="ml-3 whitespace-nowrap">{item.label || item.name}</span>
                </div>
                {hasSubItems && (
                    <IconChevronRight className={`h-4 w-4 text-text-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                )}
            </button>

            {hasSubItems && (
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <ul className="mt-[2px] space-y-[2px] px-1">
                        {item.subItems?.map(subItem => {
                            const isSubActive = isActive && activeSubPage === subItem.name;
                            
                            return (
                                <li key={subItem.name}>
                                    <button
                                        onClick={() => onClick(item.name, subItem.name)}
                                        className={`w-full text-left pl-12 pr-4 py-2 text-[13px] rounded-[8px] transition-colors whitespace-nowrap
                                            ${isSubActive 
                                                ? 'text-primary font-medium bg-[#F0EAFB]' 
                                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                                        `}
                                    >
                                        {subItem.label || subItem.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </li>
    );
};

const CompactNavItem: React.FC<{
    item: NavItemType,
    isActive: boolean,
    onClick: (page: Page) => void,
}> = ({ item, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <li 
            className="relative flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onClick(item.name);
                }}
                className={`group relative flex justify-center items-center h-10 w-10 rounded-[8px] transition-colors
                    ${isActive ? 'bg-[#F0EAFB] text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-primary'}
                    focus:outline-none focus:ring-2 focus:ring-primary
                `}
                aria-label={item.name}
            >
                <item.icon className="h-[18px] w-[18px]" />
            </button>

            {isHovered && (
                <div className="absolute left-full ml-2 bg-surface rounded-md shadow-lg border border-border-light px-3 py-1.5 z-50 whitespace-nowrap">
                    <span className="text-[13px] font-medium text-text-primary">{item.label || item.name}</span>
                </div>
            )}
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onClose, activeSubPage, isOverlayMode = false, userRole = 'Admin', subscriptionPlan = 'Trial', hasAccounts = false }) => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [tempExpanded, setTempExpanded] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Helper to find the parent item and mapped sub-item of the active page
    const activeParentPageAndSub = useMemo(() => {
        if (activePage === 'Query vault') {
            return { parent: 'Activity logs' as Page, sub: 'Query vault' };
        }
        if (['Query logs', 'System logs'].includes(activePage)) {
            return { parent: 'Activity logs' as Page, sub: activePage };
        }
        return { parent: activePage, sub: activeSubPage };
    }, [activePage, activeSubPage]);

    const filteredTopItems = useMemo(() => {
        return NAV_ITEMS_TOP.map(item => {
            let updatedItem = { ...item };
            if (updatedItem.name === 'Cost Intelligence' && hasAccounts) {
                return { ...updatedItem, name: 'Cost Intelligence' as Page };
            }
            return updatedItem;
        });
    }, [hasAccounts]);

    const filteredBottomItems = useMemo(() => {
        return NAV_ITEMS_BOTTOM;
    }, []);

    useEffect(() => {
        const parentPage = activeParentPageAndSub.parent;
        const parentItem = [...NAV_ITEMS_TOP, ...NAV_ITEMS_BOTTOM].find(i => i.name === parentPage);
        if (parentItem && parentItem.subItems && parentItem.subItems.length > 0) {
            setExpandedItem(parentPage);
        }
    }, [activeParentPageAndSub]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((tempExpanded || isOverlayMode) && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                if (isOverlayMode) onClose();
                else setTempExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [tempExpanded, isOverlayMode, onClose]);

    const handleItemClick = (page: Page, subPage?: string) => {
        const item = [...NAV_ITEMS_TOP, ...NAV_ITEMS_BOTTOM].find(i => i.name === page);
        const hasSubItems = item?.subItems && item.subItems.length > 0;

        if (!isOverlayMode && !isOpen && !tempExpanded && hasSubItems && !subPage) {
            setTempExpanded(true);
            setExpandedItem(page);
            return; 
        }

        if (page === 'Activity logs' && subPage) {
            if (subPage === 'Query vault') {
                setActivePage('Query vault', undefined);
            } else {
                setActivePage('Activity logs', subPage);
            }
        } else {
            setActivePage(page, subPage);
        }
        
        if (tempExpanded) {
            setTempExpanded(false);
        }

        if (window.innerWidth < 768 || isOverlayMode) {
            onClose();
        }
    }

    const handleToggleExpand = (itemName: string) => {
        setExpandedItem(prev => prev === itemName ? null : itemName);
    };

    const isExpanded = isOverlayMode ? isOpen : (isOpen || tempExpanded);

    const NavigationContent = () => (
        <nav className="flex flex-col h-full pt-[4px] pb-[2px] px-[4px] overflow-y-auto overflow-x-hidden bg-surface border-r border-border-light">
            <ul className="space-y-[2px]">
                {filteredTopItems.map((item) => (
                    isExpanded 
                        ? <NavItem 
                            key={item.name} 
                            item={item} 
                            isActive={activeParentPageAndSub.parent === item.name} 
                            expanded={expandedItem === item.name}
                            onToggle={() => handleToggleExpand(item.name)}
                            onClick={handleItemClick} 
                            activeSubPage={activeParentPageAndSub.sub} 
                          />
                        : <CompactNavItem 
                            key={item.name} 
                            item={item} 
                            isActive={activeParentPageAndSub.parent === item.name} 
                            onClick={(p) => handleItemClick(p)} 
                          />
                ))}
            </ul>
            <div className="mt-auto">
                <div className={`my-2 border-t border-border-light ${isExpanded ? 'mx-4' : 'mx-2'}`}></div>
                <ul className="space-y-[2px]">
                    {filteredBottomItems.map((item) => (
                        isExpanded
                            ? <NavItem 
                                key={item.name} 
                                item={item} 
                                isActive={activeParentPageAndSub.parent === item.name} 
                                expanded={expandedItem === item.name}
                                onToggle={() => handleToggleExpand(item.name)}
                                onClick={handleItemClick} 
                                activeSubPage={activeParentPageAndSub.sub} 
                                />
                            : <CompactNavItem 
                                key={item.name} 
                                item={item} 
                                isActive={activeParentPageAndSub.parent === item.name} 
                                onClick={(p) => handleItemClick(p)} 
                                />
                    ))}
                </ul>
            </div>
        </nav>
    );

    if (isOverlayMode) {
        return (
            <div className={`fixed inset-0 z-[45] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
                <div className={`absolute inset-0 bg-black/30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
                <aside 
                    ref={sidebarRef}
                    className={`absolute top-12 bottom-0 left-0 w-64 bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-[calc(100vh-3rem)]`}
                >
                    <NavigationContent />
                </aside>
            </div>
        );
    }

    return (
        <>
            {/* Mobile/Tablet Drawer */}
            <div className={`md:hidden fixed inset-0 z-[50] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
                <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
                <aside className={`absolute top-0 bottom-0 left-0 w-64 bg-surface shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full`}>
                    <NavigationContent />
                </aside>
            </div>

            {/* Normal Inline Sidebar */}
            <div className={`hidden md:block flex-shrink-0 transition-[width] duration-300 relative ${isOpen ? 'w-64' : 'w-16'}`}>
                <aside ref={sidebarRef} className={`bg-surface flex flex-col h-full transition-all duration-300 ease-in-out ${tempExpanded ? 'absolute top-0 left-0 bottom-0 w-64 z-50 shadow-2xl' : 'w-full'}`}>
                    <NavigationContent />
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
