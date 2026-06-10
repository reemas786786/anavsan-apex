
import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck } from '../constants';

interface Option {
    value: string;
    label: string;
}

interface CompactSelectDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    ariaLabel: string;
}

const CompactSelectDropdown: React.FC<CompactSelectDropdownProps> = ({ options, value, onChange, ariaLabel }) => {
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

    const selectedLabel = options.find(o => o.value === value)?.label || '';

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="appearance-none bg-surface-nested rounded px-2 py-1 font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary flex items-center gap-1"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedLabel}</span>
                <IconChevronDown className="h-4 w-4 text-text-muted" />
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-1 w-24 bg-surface rounded-lg shadow-lg z-20 border border-border-color">
                    <ul className="py-1 max-h-48 overflow-y-auto" role="listbox">
                        {options.map(option => (
                            <li key={option.value}>
                                <button
                                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                                    className={`w-full text-left flex items-center justify-between px-3 py-1.5 text-sm hover:bg-surface-hover ${option.value === value ? 'text-primary' : 'text-text-primary'}`}
                                    role="option"
                                    aria-selected={option.value === value}
                                >
                                    {option.label}
                                    {value === option.value && <IconCheck className="h-4 w-4 text-primary" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CompactSelectDropdown;
