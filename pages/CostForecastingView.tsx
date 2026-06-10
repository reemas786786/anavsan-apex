
import React, { useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    costSpendForecastData,
    costForecastByTierData,
    costAnomalyAlertsData,
    costSavingsProjectionData
} from '../data/dummyData';
import { IconExclamationTriangle, IconAIAgent } from '../constants';
import TimeRangeFilter, { TimeRange } from '../components/TimeRangeFilter';
import InfoTooltip from '../components/InfoTooltip';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string, tooltipText?: string }> = ({ children, className = '', title, tooltipText }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 ${className}`}>
        {title && (
            <h3 className="text-base font-semibold text-text-strong mb-4 flex items-center gap-1.5 leading-none">
                <span>{title}</span>
                {tooltipText && <InfoTooltip text={tooltipText} />}
            </h3>
        )}
        {children}
    </div>
);

const SpendVsForecastWidget: React.FC = () => (
    <WidgetCard title="Current Month Spend vs. Forecast" tooltipText="Estimated spending based on actual daily consumption mapped against forecasted trajectories.">
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costSpendForecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="day" stroke="#9A9AB2" fontSize={12} tickFormatter={(tick) => `Day ${tick}`} />
                    <YAxis stroke="#9A9AB2" fontSize={12} tickFormatter={(tick) => `$${(tick / 1000)}k`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                        labelFormatter={(label) => `Day ${label}`}
                        formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Legend verticalAlign="top" height={36} iconSize={10} />
                    <Line type="monotone" dataKey="actual" stroke="#6932D5" strokeWidth={2} dot={false} name="Actual" />
                    <Line type="monotone" dataKey="forecast" stroke="#A78BFA" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Forecast" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </WidgetCard>
);

const ForecastByTierWidget: React.FC = () => (
    <WidgetCard title="Forecast by Tier" tooltipText="Visualizes projected monthly storage costs categorised across active hot, warm and cold storage tiers over the next several months.">
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costForecastByTierData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="month" stroke="#9A9AB2" fontSize={12} />
                    <YAxis stroke="#9A9AB2" fontSize={12} tickFormatter={(tick) => `$${(tick / 1000)}k`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                        formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                    />
                    <Legend verticalAlign="top" height={36} iconSize={10} />
                    <Area type="monotone" dataKey="Hot" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Warm" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="Cold" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </WidgetCard>
);

const AnomalyDetectionWidget: React.FC = () => (
    <WidgetCard title="Anomaly Detection" tooltipText="Automated ML models check active tables and compute tasks for any weird behavior or abnormal spending trends.">
        <div className="space-y-4" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {costAnomalyAlertsData.map(alert => (
                <div key={alert.id} className="bg-surface-nested p-4 rounded-3xl border border-status-warning/30 flex items-start gap-3">
                    <IconExclamationTriangle className="h-5 w-5 text-status-warning flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-mono text-xs font-semibold text-text-primary">{alert.tableName}</p>
                        <p className="text-sm text-text-secondary mt-1">{alert.projection}</p>
                    </div>
                </div>
            ))}
            {costAnomalyAlertsData.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-4">No anomalies detected.</p>
            )}
        </div>
    </WidgetCard>
);

const SavingsProjectionWidget: React.FC = () => (
    <WidgetCard title="AI Savings Projection" tooltipText="Intelligent optimization engines analyze resource idling, redundant schedules and scan redundancies to project percentage savings.">
        <div className="flex flex-col items-center justify-center text-center" style={{ height: 300 }}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <IconAIAgent className="w-10 h-10 text-primary" />
            </div>
            <p className="text-text-secondary max-w-sm">
                {costSavingsProjectionData.message}
            </p>
            <p className="text-5xl font-bold text-status-success-dark my-4">
                {costSavingsProjectionData.savingsPercentage}%
            </p>
            <p className="font-semibold text-text-primary">next month.</p>
        </div>
    </WidgetCard>
);

const CostForecastingView: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Cost Forecasting</h1>
                <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="columns-1 lg:columns-2 gap-4">
                <SpendVsForecastWidget />
                <ForecastByTierWidget />
                <AnomalyDetectionWidget />
                <SavingsProjectionWidget />
            </div>
        </div>
    );
};

export default CostForecastingView;
