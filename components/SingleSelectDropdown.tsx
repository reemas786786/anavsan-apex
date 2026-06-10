import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck } from '../constants';

interface Option {
    value: string;
    label: string;
}

interface SingleSelectDropdownProps {
    label: string;
    options: Option[];
    selectedValue: string;
    onChange: (selected: string) => void;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({ label, options, selectedValue, onChange }) => {
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

    const handleOptionClick = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    const displayLabel = options.find(o => o.value === selectedValue)?.label || options[0]?.label;

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="bg-background rounded-lg flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between gap-2 text-sm font-semibold text-text-primary focus:outline-none w-40 px-3 py-2"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="text-sm text-text-secondary font-normal">{label}:</span>
                    <span className="truncate flex-grow text-left">{displayLabel}</span>
                    <IconChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && (
                <div className="absolute top-full mt-1 w-40 bg-surface rounded-lg shadow-lg z-20 border border-border-color">
                    <ul className="py-1 max-h-60 overflow-y-auto" role="listbox">
                        {options.map(option => {
                            const selected = selectedValue === option.value;
                            return (
                                <li key={option.value}>
                                    <button
                                        onClick={() => handleOptionClick(option.value)}
                                        className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm transition-colors ${selected ? 'bg-primary/10' : 'hover:bg-surface-hover'}`}
                                        role="option"
                                        aria-selected={selected}
                                    >
                                        <span className={`truncate ${selected ? 'font-semibold text-primary' : 'text-text-primary'}`}>
                                            {option.label}
                                        </span>
                                        {selected && <IconCheck className="w-4 h-4 text-primary" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SingleSelectDropdown;
