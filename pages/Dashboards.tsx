
import React, { useState, useEffect, useRef } from 'react';
import { IconAdd, IconDotsVertical, IconEdit, IconDelete, IconShare } from '../constants';
import { DashboardItem } from '../types';

interface DashboardCardProps {
    dashboard: DashboardItem;
    onViewClick: () => void;
    onEditClick: () => void;
    onShareClick: () => void;
    onDeleteClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ dashboard, onViewClick, onEditClick, onShareClick, onDeleteClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            onClick={onViewClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewClick();
                }
            }}
            tabIndex={0}
            role="button"
            className="bg-surface p-4 rounded-[24px] border border-border-light shadow-sm flex flex-col h-full text-left hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all group cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2 w-full">
                <h3 className="text-base font-bold text-text-strong pr-4 group-hover:text-primary transition-colors">{dashboard.title}</h3>
                <div className="relative flex-shrink-0" ref={menuRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Actions for ${dashboard.title}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <IconDotsVertical className="h-5 w-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl border border-border-color py-1 z-50 animate-in fade-in zoom-in duration-150">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button onClick={(e) => { e.stopPropagation(); onEditClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-primary/5 hover:text-primary" role="menuitem">
                                    <IconEdit className="h-4 w-4" /> Edit
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onShareClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-primary/5 hover:text-primary" role="menuitem">
                                    <IconShare className="h-4 w-4" /> Share
                                </button>
                                <div className="h-px bg-border-light my-1"></div>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                    <IconDelete className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {dashboard.description && <p className="text-sm text-text-secondary mt-2 flex-grow leading-relaxed">{dashboard.description}</p>}
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-6">{dashboard.createdOn}</p>
        </div>
    );
};

const EmptyState: React.FC<{ onAddDashboardClick: () => void }> = ({ onAddDashboardClick }) => (
    <div className="text-center py-20 px-4 bg-white rounded-[32px] border border-border-light shadow-sm">
        <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-6 mx-auto">
            <IconAdd className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">No dashboards found</h2>
        <p className="mt-2 text-text-secondary max-w-md mx-auto">It looks like you haven't created any dashboards yet. Get started by clicking the "Create Dashboard" button.</p>
        <button
            onClick={onAddDashboardClick}
            className="mt-8 bg-primary text-white font-black px-8 py-3 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-all whitespace-nowrap shadow-lg shadow-primary/20 mx-auto"
        >
            <span>Create Dashboard</span>
            <IconAdd className="h-5 w-5" />
        </button>
    </div>
);

interface DashboardsProps {
    dashboards: DashboardItem[];
    onDeleteDashboardClick: (dashboard: DashboardItem) => void;
    onAddDashboardClick: () => void;
    onEditDashboardClick: (dashboard: DashboardItem) => void;
    onViewDashboardClick: (dashboard: DashboardItem) => void;
}

const Dashboards: React.FC<DashboardsProps> = ({ dashboards, onDeleteDashboardClick, onAddDashboardClick, onEditDashboardClick, onViewDashboardClick }) => {
  return (
    <div className="p-4 pb-12 gap-4 h-full flex flex-col overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-end mb-4 flex-shrink-0">
        <div>
            <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Dashboards</h1>
            <p className="text-sm text-text-secondary font-medium mt-1">Your custom workspace for building and viewing saved dashboards.</p>
        </div>
        <button
            onClick={onAddDashboardClick}
            className="bg-primary text-white font-black px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-all whitespace-nowrap shadow-lg shadow-primary/20"
        >
            <span>Create Dashboard</span>
            <IconAdd className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-grow">
        {dashboards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboards.map(dashboard => (
                    <DashboardCard 
                        key={dashboard.id} 
                        dashboard={dashboard}
                        onViewClick={() => onViewDashboardClick(dashboard)}
                        onEditClick={() => onEditDashboardClick(dashboard)}
                        onShareClick={() => console.log(`Sharing ${dashboard.title}`)}
                        onDeleteClick={() => onDeleteDashboardClick(dashboard)}
                    />
                ))}
            </div>
        ) : (
            <EmptyState onAddDashboardClick={onAddDashboardClick} />
        )}
      </div>
    </div>
  );
};

export default Dashboards;
