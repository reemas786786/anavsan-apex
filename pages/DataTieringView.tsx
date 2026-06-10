import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
    dataAgeDistributionData,
    storageByTierData,
    tieringOpportunitiesData,
    policyComplianceData
} from '../data/dummyData';
import TimeRangeFilter, { TimeRange } from '../components/TimeRangeFilter';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

const DataAgeDistributionWidget: React.FC = () => (
    <WidgetCard title="Data Age Distribution (Last Access)">
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataAgeDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" stroke="#9A9AB2" fontSize={12} unit=" GB" />
                    <YAxis dataKey="ageBucket" type="category" stroke="#9A9AB2" fontSize={12} width={80} />
                    <Tooltip
                        cursor={{ fill: '#F3F0FA' }}
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                        labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="sizeGB" fill="#6932D5" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </WidgetCard>
);

const StorageByTierWidget: React.FC = () => {
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <WidgetCard title="Storage by Tier (Current vs. Recommended)">
            <div className="grid grid-cols-2 gap-4 items-center" style={{ height: 300 }}>
                <div className="flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Current</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={storageByTierData.current.map(i => ({...i}))}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {storageByTierData.current.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} TB`}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">AI Recommended</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={storageByTierData.recommended.map(i => ({...i}))}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {storageByTierData.recommended.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} TB`}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="col-span-2 flex justify-center space-x-4">
                    {storageByTierData.current.map(item => (
                        <div key={item.name} className="flex items-center text-xs">
                            <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
};

const TieringOpportunitiesWidget: React.FC = () => (
    <WidgetCard title="Tiering Opportunities">
        <div className="overflow-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-text-primary sticky top-0 bg-table-header-bg">
                    <tr>
                        <th className="py-2 font-medium">Table</th>
                        <th className="py-2 font-medium">Recommendation</th>
                        <th className="py-2 font-medium text-right">Est. Savings</th>
                    </tr>
                </thead>
                <tbody>
                    {tieringOpportunitiesData.map(item => (
                        <tr key={item.id} className="border-t border-border-color">
                            <td className="py-2.5">
                                <p className="font-mono text-xs font-semibold text-text-primary">{item.tableName}</p>
                                <p className="text-xs text-text-secondary">{item.size}</p>
                            </td>
                            <td className="py-2.5 text-xs">
                                Move from <span className="font-semibold">{item.currentTier}</span> to <span className="font-semibold">{item.recommendedTier}</span>
                            </td>
                            <td className="py-2.5 text-right font-bold text-status-success-dark">${item.potentialSavings.toLocaleString()}/mo</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </WidgetCard>
);

const PolicyComplianceWidget: React.FC = () => {
    const { compliancePercentage } = policyComplianceData;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (compliancePercentage / 100) * circumference;

    return (
        <WidgetCard title="Policy Compliance Status">
            <div className="flex flex-col items-center justify-center" style={{ height: 300 }}>
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 140 140">
                        <circle
                            className="text-border-color"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="70"
                            cy="70"
                        />
                        <circle
                            className="text-primary"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="70"
                            cy="70"
                            transform="rotate(-90 70 70)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-text-primary">{compliancePercentage}%</span>
                        <span className="text-sm text-text-secondary">Compliant</span>
                    </div>
                </div>
                <p className="mt-4 text-sm text-text-secondary text-center max-w-xs">
                    Percentage of tables following the defined data tiering rules.
                </p>
            </div>
        </WidgetCard>
    );
};

const DataTieringView: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Data Tiering</h1>
                <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="columns-1 lg:columns-2 gap-4">
                <DataAgeDistributionWidget />
                <StorageByTierWidget />
                <TieringOpportunitiesWidget />
                <PolicyComplianceWidget />
            </div>
        </div>
    );
};

export default DataTieringView;