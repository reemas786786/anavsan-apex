
import React from 'react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav 
            aria-label="breadcrumb" 
            className="flex items-center gap-1.5 select-none text-[11px] font-semibold"
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <span className="text-[#9C94AC] dark:text-[#7A6F8F] mx-0.5 select-none font-normal">/</span>
                    )}
                    {item.onClick && index < items.length - 1 ? (
                        <button 
                            onClick={item.onClick} 
                            className="text-[#6932D5] dark:text-[#9A7DFF] hover:text-[#5225ab] dark:hover:text-[#b099ff] hover:underline cursor-pointer font-semibold transition-colors"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span 
                            className="text-[#1A112B] dark:text-[#ECE9F2] font-semibold"
                            aria-current={index === items.length - 1 ? 'page' : undefined}
                        >
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
