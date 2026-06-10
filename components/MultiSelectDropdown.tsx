import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck } from '../constants';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
    selectionMode?: 'single' | 'multiple';
    layout?: 'inline' | 'stacked';
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onChange, selectionMode = 'multiple', layout = 'inline' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isSingle = selectionMode === 'single';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (option: string) => {
        if (isSingle) {
            if (option === 'All') {
                onChange([]);
            } else {
                onChange(selectedOptions[0] === option ? [] : [option]);
            }
        } else { // 'multiple'
            if (option === 'All') {
                onChange(selectedOptions.length === options.length ? [] : [...options]);
            } else {
                const newSelection = [...selectedOptions];
                const currentIndex = newSelection.indexOf(option);
                if (currentIndex > -1) {
                    newSelection.splice(currentIndex, 1);
                } else {
                    newSelection.push(option);
                }
                onChange(newSelection);
            }
        }
    };

    const displayValue = () => {
        if (selectedOptions.length === 0) return 'All';
        if (!isSingle && selectedOptions.length === options.length) return 'All';
        if (selectedOptions.length === 1) return selectedOptions[0];
        if (!isSingle && selectedOptions.length > 1) return `${selectedOptions.length} selected`;
        return selectedOptions[0];
    };

    const allOptions = ['All', ...options];
    const isAllSelected = !isSingle && selectedOptions.length === options.length;

    const dropdownContent = (
        <div className={`absolute top-full z-20 bg-surface rounded-lg shadow-lg border border-border-color ${layout === 'inline' ? 'mt-2 w-56' : 'mt-1 w-full'}`}>
            <ul className="py-1 max-h-60 overflow-y-auto" role="listbox">
                {allOptions.map(option => {
                    const isSelected = option === 'All' 
                        ? (isSingle ? selectedOptions.length === 0 : isAllSelected)
                        : selectedOptions.includes(option);
                    
                    const isIndeterminate = !isSingle && option === 'All' && selectedOptions.length > 0 && !isAllSelected;

                    return (
                        <li key={option}>
                            <button
                                onClick={() => handleOptionClick(option)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isSelected && !isIndeterminate ? 'bg-primary/10' : 'hover:bg-surface-hover'}`}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <div className={`w-4 h-4 ${isSingle ? 'rounded-full' : 'rounded'} border flex items-center justify-center flex-shrink-0 ${isSelected || isIndeterminate ? 'bg-primary border-primary' : 'border-text-muted'}`}>
                                    {isSelected && !isIndeterminate && (isSingle ? <div className="w-2 h-2 bg-white rounded-full"></div> : <IconCheck className="w-3 h-3 text-white" />)}
                                    {isIndeterminate && <div className="w-2 h-2 bg-white"></div>}
                                </div>
                                <span className={`truncate ${isSelected && !isIndeterminate ? 'font-semibold text-primary' : 'text-text-primary'}`}>
                                    {!isSingle && option === 'All' ? 'Select all' : option}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <div className={`relative ${layout === 'stacked' ? 'w-full' : ''}`} ref={wrapperRef}>
            {layout === 'stacked' ? (
                <>
                    <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex justify-between items-center text-left border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                    >
                        <span className="text-text-primary truncate">{displayValue()}</span>
                        <IconChevronDown className={`h-5 w-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm focus:outline-none"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="text-text-secondary">{label}:</span>
                    <span className="font-bold text-text-primary">{displayValue()}</span>
                    <IconChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            )}
            {isOpen && dropdownContent}
        </div>
    );
};

export default MultiSelectDropdown;