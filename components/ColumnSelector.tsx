import React, { useState, useRef, useEffect } from 'react';
import { IconAdjustments, IconCheck } from '../constants';

interface ColumnSelectorProps {
    columns: { key: string; label: string; }[];
    visibleColumns: string[];
    onVisibleColumnsChange: (visible: string[]) => void;
    onColumnsOrderChange?: (columns: { key: string; label: string; }[]) => void;
    defaultColumns?: string[];
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
    columns, 
    visibleColumns, 
    onVisibleColumnsChange, 
    onColumnsOrderChange,
    defaultColumns = [] 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleColumn = (columnKey: string) => {
        if (defaultColumns.includes(columnKey)) return;

        const newVisibleColumns = visibleColumns.includes(columnKey)
            ? visibleColumns.filter(key => key !== columnKey)
            : [...visibleColumns, columnKey];
        onVisibleColumnsChange(newVisibleColumns);
    };

    const handleMoveColumn = (index: number, direction: 'up' | 'down') => {
        if (!onColumnsOrderChange) return;
        
        const newColumns = [...columns];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newColumns.length) return;
        
        // Don't allow moving into or out of locked positions if they are at the top
        const isTargetLocked = defaultColumns.includes(newColumns[targetIndex].key);
        const isCurrentLocked = defaultColumns.includes(newColumns[index].key);
        
        if (isTargetLocked || isCurrentLocked) return;

        const [movedColumn] = newColumns.splice(index, 1);
        newColumns.splice(targetIndex, 0, movedColumn);
        onColumnsOrderChange(newColumns);
    };

    return (
        <div className="relative group" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 rounded-md text-black hover:bg-button-secondary-bg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-colors"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Select columns"
            >
                <IconAdjustments className="h-5 w-5" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-surface rounded-lg shadow-lg z-50 border border-border-color overflow-hidden">
                    <div className="px-3 py-2 border-b border-border-color bg-surface-nested">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Display Columns</span>
                    </div>
                    <ul className="py-1 max-h-80 overflow-y-auto" role="listbox">
                        {columns.map((column, index) => {
                            const isVisible = visibleColumns.includes(column.key);
                            const isLocked = defaultColumns.includes(column.key);
                            
                            return (
                                <li key={column.key} className="flex items-center group/item hover:bg-surface-hover transition-colors">
                                    <button
                                        onClick={() => handleToggleColumn(column.key)}
                                        className={`flex-1 text-left flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                                        role="option"
                                        aria-selected={isVisible}
                                        disabled={isLocked}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isVisible ? 'bg-primary border-primary' : 'border-text-muted'} ${isLocked ? 'opacity-50' : ''}`}>
                                            {isVisible && <IconCheck className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`truncate ${isVisible ? 'font-semibold text-text-primary' : 'text-text-primary'} ${isLocked ? 'text-text-muted' : ''}`}>
                                            {column.label}
                                        </span>
                                    </button>
                                    
                                    {!isLocked && onColumnsOrderChange && (
                                        <div className="flex items-center pr-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleMoveColumn(index, 'up'); }}
                                                disabled={index === 0 || defaultColumns.includes(columns[index-1].key)}
                                                className="p-1 hover:text-primary disabled:opacity-20"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleMoveColumn(index, 'down'); }}
                                                disabled={index === columns.length - 1}
                                                className="p-1 hover:text-primary disabled:opacity-20"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    {isLocked && (
                                        <div className="pr-3">
                                            <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;