
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subValue?: string;
    trend?: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, className }) => {
    const trendColor = trend?.startsWith('+') ? 'text-status-error' : trend?.startsWith('-') ? 'text-status-success' : 'text-text-secondary';
    
    return (
        <div className={`bg-surface p-4 rounded-3xl ${className}`}>
            <h4 className="text-base font-semibold text-text-strong">{title}</h4>
            <div className="flex items-baseline gap-2 mt-6">
                <p className="text-[22px] leading-7 font-bold text-text-primary">{value}</p>
                {subValue && <p className="text-sm font-medium text-text-secondary">{subValue}</p>}
            </div>
            {trend && <p className={`text-sm font-medium mt-1 ${trendColor}`}>{trend}</p>}
        </div>
    );
};

export default StatCard;
