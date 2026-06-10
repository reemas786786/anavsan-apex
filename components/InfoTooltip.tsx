
import React from 'react';
import { IconInfo } from '../constants';

interface InfoTooltipProps {
    text: string;
    position?: 'top' | 'bottom';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, position = 'top' }) => {
    const id = `tooltip-${React.useId()}`;
    
    // Position classes
    const positionClasses = position === 'top' 
        ? 'bottom-full mb-2' 
        : 'top-full mt-2';
    
    // Arrow classes
    const arrowClasses = position === 'top'
        ? 'top-full border-t-sidebar-topbar border-x-transparent'
        : 'bottom-full border-b-sidebar-topbar border-x-transparent';
    
    const arrowBorderClass = position === 'top'
        ? 'border-t-4'
        : 'border-b-4';

    return (
        <div className="relative group/tooltip flex items-center inline-flex">
            <div
                role="button"
                tabIndex={0}
                className="ml-1.5 text-text-muted hover:text-primary focus:outline-none rounded-full transition-colors cursor-pointer"
                aria-describedby={id}
                aria-label="More information"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                    }
                }}
            >
                <IconInfo className="h-4 w-4" />
            </div>
            <div
                id={id}
                role="tooltip"
                className={`absolute ${positionClasses} left-1/2 -translate-x-1/2 w-64 bg-sidebar-topbar text-white text-[11px] font-medium rounded-lg py-2 px-3 z-[100] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none shadow-2xl text-center leading-relaxed`}
            >
                {text}
                <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 ${arrowBorderClass} ${arrowClasses}`}></div>
            </div>
        </div>
    );
};

export default InfoTooltip;
