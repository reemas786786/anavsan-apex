
import React from 'react';
import { IconExclamationTriangle } from '../constants';
import InfoTooltip from './InfoTooltip';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-transparent border border-border-light dark:border-white/10 p-4 rounded-3xl break-inside-avoid mb-4 ${className}`}>
        {children}
    </div>
);

interface BudgetStatusWidgetProps {
    displayMode?: 'cost' | 'credits';
}

const BudgetStatusWidget: React.FC<BudgetStatusWidgetProps> = ({ displayMode = 'cost' }) => {
    const isCost = displayMode === 'cost';

    const allocated = isCost ? 50000 : 20000; // Mock values for cost vs credits
    const consumed = isCost ? 32450 : 12980; // Mock values for cost vs credits
    const remaining = allocated - consumed;
    const consumedPercentage = (consumed / allocated) * 100;
    const remainingPercentage = 100 - consumedPercentage;

    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let progressBarColor = 'bg-status-success';
    let textColor = 'text-status-success-dark';

    if (consumedPercentage > 95) {
        status = 'error';
        progressBarColor = 'bg-status-error';
        textColor = 'text-status-error-dark';
    } else if (consumedPercentage > 75) {
        status = 'warning';
        progressBarColor = 'bg-status-warning';
        textColor = 'text-status-warning-dark';
    }
    
    let alertIcon: React.ReactNode = null;
    if (status === 'warning' || status === 'error') {
        alertIcon = <IconExclamationTriangle className={`w-4 h-4 ml-2 ${textColor}`} />;
    }
    
    const formatCost = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h4 className="text-base font-semibold text-text-strong">Monthly budget status</h4>
                    <InfoTooltip text="Tracks the consumed budget against the allocated monthly amount, showing the remaining percentage and value." position="bottom" />
                </div>
                {alertIcon}
            </div>
            <div className="flex flex-col space-y-4">
                <div className="text-center">
                    <p className={`text-[22px] leading-7 font-bold ${textColor}`}>{remainingPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-text-secondary">Remaining</p>
                </div>

                <div>
                    <div 
                        className="w-full bg-border-color rounded-full h-2.5"
                        role="progressbar"
                        aria-valuenow={consumedPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Budget consumed: ${consumedPercentage.toFixed(1)}%`}
                    >
                        <div 
                            className={`${progressBarColor} h-2.5 rounded-full`} 
                            style={{ width: `${consumedPercentage}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                    <div className="text-left">
                        <p className="text-text-secondary">Consumed</p>
                        <p className="font-semibold text-text-primary inline-flex items-baseline">
                             {isCost ? formatCost(consumed) : (
                                <>
                                    <span>{Math.round(consumed).toLocaleString()}</span>
                                    <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                                </>
                             )}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-text-secondary">Remaining</p>
                         <p className="font-semibold text-text-primary inline-flex items-baseline">
                             {isCost ? formatCost(remaining) : (
                                <>
                                    <span>{Math.round(remaining).toLocaleString()}</span>
                                    <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                                </>
                             )}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-text-secondary">Allocated</p>
                         <p className="font-semibold text-text-primary inline-flex items-baseline">
                             {isCost ? formatCost(allocated) : (
                                <>
                                    <span>{Math.round(allocated).toLocaleString()}</span>
                                    <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                                </>
                             )}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BudgetStatusWidget;
