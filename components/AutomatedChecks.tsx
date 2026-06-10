
import React from 'react';
import { AutomatedCheck, AutomatedCheckStatus } from '../types';
import { IconCheckCircle, IconXCircle, IconPending } from '../constants';

interface AutomatedChecksProps {
    checks: AutomatedCheck[];
}

const StatusIcon: React.FC<{ status: AutomatedCheckStatus }> = ({ status }) => {
    switch (status) {
        case 'Passed':
            return <IconCheckCircle className="h-5 w-5 text-status-success" />;
        case 'Failed':
            return <IconXCircle className="h-5 w-5 text-status-error" />;
        case 'Pending':
            return <IconPending className="h-5 w-5 text-status-warning animate-pulse" />;
        default:
            return null;
    }
};

const AutomatedChecks: React.FC<AutomatedChecksProps> = ({ checks }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-text-strong mb-2">Automated Checks</h3>
            <div className="space-y-3">
                {checks.map((check) => (
                    <div key={check.name} className="flex items-start gap-3">
                        <div className="mt-0.5">
                            <StatusIcon status={check.status} />
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary text-sm">{check.name}</p>
                            <p className="text-xs text-text-secondary">{check.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AutomatedChecks;
