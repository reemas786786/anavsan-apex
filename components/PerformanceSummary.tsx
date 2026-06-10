
import React from 'react';
import { PerformanceMetric } from '../types';

interface PerformanceSummaryProps {
    metrics: PerformanceMetric[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ metrics }) => {
    const getDeltaColor = (delta: string) => {
        if (delta.startsWith('↓')) return 'text-status-success-dark';
        if (delta.startsWith('↑')) return 'text-status-error-dark';
        return 'text-text-secondary';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="text-left text-xs text-text-secondary uppercase">
                    <tr>
                        <th className="py-2 px-3 font-semibold">Metric</th>
                        <th className="py-2 px-3 font-semibold">Before</th>
                        <th className="py-2 px-3 font-semibold">After</th>
                        <th className="py-2 px-3 font-semibold">Delta</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                    {metrics.map((metric) => (
                        <tr key={metric.metric}>
                            <td className="py-3 px-3 font-semibold text-text-primary">{metric.metric}</td>
                            <td className="py-3 px-3 text-text-secondary">{metric.before}</td>
                            <td className="py-3 px-3 text-text-secondary">{metric.after}</td>
                            <td className={`py-3 px-3 font-semibold ${getDeltaColor(metric.delta)}`}>{metric.delta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PerformanceSummary;
