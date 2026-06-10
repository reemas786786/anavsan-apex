
import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '../constants';

export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'custom';

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
  { id: 'custom', label: 'Custom' },
];

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const activeLabel = timeRanges.find(r => r.id === value)?.label || 'Select';

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
      menuItemsRef.current[0]?.focus();
    }
  }, [isOpen]);

  const handleSelect = (rangeId: TimeRange) => {
    onChange(rangeId);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = menuItemsRef.current.filter(item => item) as HTMLElement[];
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex;
      if (event.key === 'ArrowDown') {
        nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      } else { // ArrowUp
        nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      }
      items[nextIndex]?.focus();
    } else if (event.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex justify-between items-center w-40 rounded-full border border-border-color shadow-sm px-4 py-2 bg-surface text-sm font-medium text-text-primary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{activeLabel}</span>
          <IconChevronDown className={`-mr-1 ml-2 h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-20 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          onKeyDown={handleKeyDown}
        >
          <div className="py-1" role="none">
            {timeRanges.map((range, index) => (
              <button
                key={range.id}
                ref={el => { menuItemsRef.current[index] = el; }}
                onClick={() => handleSelect(range.id)}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  value === range.id
                    ? 'font-semibold text-primary bg-primary/10'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
                role="menuitem"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;
