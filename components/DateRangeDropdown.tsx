
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCalendar } from '../constants';

interface DateRangeDropdownProps {
    selectedValue: string | { start: string; end: string };
    onChange: (selected: string | { start: string; end: string }) => void;
}

const presetOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '1d', label: 'Last 24 hours' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'All', label: 'All Time' }
];

const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
};

const formatDisplayDate = (date: Date | null): string => {
    if (!date) return 'mm/dd/yyyy';
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({ selectedValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomViewOpen, setIsCustomViewOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
    const [activeInput, setActiveInput] = useState<'start' | 'end'>('start');
    
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

    useEffect(() => {
        if (isOpen) {
            setIsCustomViewOpen(typeof selectedValue === 'object');
        }
    }, [isOpen, selectedValue]);

    useEffect(() => {
        if (typeof selectedValue === 'object') {
            setTempStartDate(new Date(selectedValue.start));
            setTempEndDate(new Date(selectedValue.end));
        } else {
            setTempStartDate(null);
            setTempEndDate(null);
        }
    }, [selectedValue]);

    const handlePresetClick = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    const handleApplyCustom = () => {
        if (tempStartDate && tempEndDate) {
            onChange({ start: formatDateForInput(tempStartDate), end: formatDateForInput(tempEndDate) });
            setIsOpen(false);
        }
    };
    
    const displayLabel = () => {
        if (typeof selectedValue === 'string') {
            return presetOptions.find(o => o.value === selectedValue)?.label || 'Select';
        }
        if (typeof selectedValue === 'object' && selectedValue.start && selectedValue.end) {
            const start = new Date(selectedValue.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const end = new Date(selectedValue.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `${start} - ${end}`;
        }
        return 'Select';
    };

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: null, date: null });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, date: new Date(year, month, i) });
        }
        return days;
    }, [viewDate]);

    const handleDateClick = (date: Date) => {
        if (activeInput === 'start' || (tempStartDate && tempEndDate)) {
            setTempStartDate(date);
            setTempEndDate(null);
            setActiveInput('end');
        } else if (activeInput === 'end' && tempStartDate) {
            if (date < tempStartDate) {
                setTempEndDate(tempStartDate);
                setTempStartDate(date);
            } else {
                setTempEndDate(date);
            }
            setActiveInput('start');
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCustomSelected = typeof selectedValue === 'object';

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-[13px] focus:outline-none bg-white px-4 py-2 rounded-full shadow-sm hover:bg-surface-hover transition-all"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-text-secondary font-medium">Date range:</span>
                <span className="font-bold text-text-strong">{displayLabel()}</span>
                <IconChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 bg-surface rounded-lg shadow-lg z-20 border border-border-color flex">
                    <div className={`w-40 p-2 ${isCustomViewOpen ? 'border-r border-border-color' : ''}`}>
                        <ul className="space-y-1">
                            {presetOptions.map(option => (
                                <li key={option.value}>
                                    <button
                                        onClick={() => handlePresetClick(option.value)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                                            selectedValue === option.value && !isCustomSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-surface-hover text-text-primary'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => setIsCustomViewOpen(true)}
                                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                                        isCustomSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-surface-hover text-text-primary'
                                    }`}
                                >
                                    Custom Range
                                </button>
                            </li>
                        </ul>
                    </div>
                    {isCustomViewOpen && (
                        <div className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-text-secondary">Start date</label>
                                    <div onClick={() => setActiveInput('start')} className={`mt-1 flex items-center gap-2 border rounded-md px-2 py-1.5 cursor-pointer ${activeInput === 'start' ? 'border-primary ring-1 ring-primary' : 'border-border-color'}`}>
                                        <IconCalendar className="h-4 w-4 text-text-muted" />
                                        <span className="text-sm text-text-primary">{formatDisplayDate(tempStartDate)}</span>
                                    </div>
                                </div>
                                 <div>
                                    <label className="text-xs text-text-secondary">End date</label>
                                    <div onClick={() => setActiveInput('end')} className={`mt-1 flex items-center gap-2 border rounded-md px-2 py-1.5 cursor-pointer ${activeInput === 'end' ? 'border-primary ring-1 ring-primary' : 'border-border-color'}`}>
                                        <IconCalendar className="h-4 w-4 text-text-muted" />
                                        <span className="text-sm text-text-primary">{formatDisplayDate(tempEndDate)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-surface-hover"><IconChevronLeft className="h-5 w-5 text-text-secondary" /></button>
                                <div className="font-semibold text-text-primary text-sm">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                                <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-surface-hover"><IconChevronRight className="h-5 w-5 text-text-secondary" /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-text-muted mb-1">
                                {['S', 'M', 'T', 'W', 'Th', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">
                                {calendarDays.map((day, i) => {
                                    if (!day.date) return <div key={`empty-${i}`}></div>;
                                    const isStartDate = tempStartDate && day.date.getTime() === tempStartDate.getTime();
                                    const isEndDate = tempEndDate && day.date.getTime() === tempEndDate.getTime();
                                    const isInRange = tempStartDate && tempEndDate && day.date > tempStartDate && day.date < tempEndDate;
                                    const isToday = day.date.getTime() === today.getTime();
                                    
                                    return (
                                    <button
                                        key={day.date.toISOString()}
                                        onClick={() => handleDateClick(day.date!)}
                                        className={`relative h-8 w-8 text-sm rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
                                            isStartDate || isEndDate ? 'bg-primary text-white' :
                                            isInRange ? 'bg-primary/10 text-primary' :
                                            'hover:bg-surface-hover text-text-primary'
                                        }`}
                                    >
                                        {day.day}
                                        {isToday && <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isStartDate || isEndDate ? 'bg-white' : 'bg-primary'}`}></span>}
                                    </button>
                                )})}
                            </div>
                            <div className="border-t border-border-color mt-4 pt-4 flex justify-end">
                                 <button
                                    onClick={handleApplyCustom}
                                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full disabled:bg-gray-300"
                                    disabled={!tempStartDate || !tempEndDate}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DateRangeDropdown;
