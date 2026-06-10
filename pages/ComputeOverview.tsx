
import React, { useMemo } from 'react';
import { Account, Warehouse } from '../types';
import { IconDatabase, IconSparkles, IconBolt, IconTrendingUp, IconInfo } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

interface ComputeOverviewProps {
    account: Account;
    warehouses: Warehouse[];
    onNavigate: (page: string, healthFilter?: string) => void;
    onSelectWarehouse: (warehouse: Warehouse) => void;
}

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string, infoText?: string, headerActions?: React.ReactNode }> = ({ children, className = '', title, infoText, headerActions }) => (
    <div className={`bg-white rounded-[24px] p-6 border border-border-light shadow-sm flex flex-col ${className}`}>
        <div className="flex justify-between items-start mb-6">
            <div>
                {title && <h3 className="text-[11px] font-black text-text-strong uppercase tracking-widest flex items-center gap-2">
                    {title}
                    {infoText && (
                        <div className="group relative">
                            <IconInfo className="w-3.5 h-3.5 text-text-muted cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-text-strong text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-medium leading-relaxed">
                                {infoText}
                            </div>
                        </div>
                    )}
                </h3>}
            </div>
            {headerActions}
        </div>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </div>
);

const SummaryMetricCard: React.FC<{ 
    label: string; 
    value: string; 
    subValue?: string; 
    icon: React.FC<{ className?: string }>;
    color: string;
}> = ({ label, value, subValue, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-[24px] border border-border-light flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-2xl font-black text-text-strong tracking-tight">{value}</p>
                {subValue && <p className="text-xs font-bold text-text-secondary">{subValue}</p>}
            </div>
        </div>
    </div>
);

const WarehouseHealthWidget: React.FC<{ warehouses: Warehouse[], onNavigate: (page: string, filter?: string) => void }> = ({ warehouses, onNavigate }) => {
    const total = warehouses.length;
    const underutilized = warehouses.filter(w => w.health === 'Under-utilized').length;
    const overprovisioned = warehouses.filter(w => w.health === 'Over-provisioned').length;
    const healthy = warehouses.filter(w => w.health === 'Optimized').length;

    const stats = [
        { label: 'Total Warehouses', value: total, color: 'text-primary', bgColor: 'bg-primary/5', filter: undefined },
        { label: 'Under-utilized', value: underutilized, color: 'text-amber-600', bgColor: 'bg-amber-50', filter: 'Under-utilized' },
        { label: 'Over-provisioned', value: overprovisioned, color: 'text-red-600', bgColor: 'bg-red-50', filter: 'Over-provisioned' },
        { label: 'Healthy', value: healthy, color: 'text-emerald-600', bgColor: 'bg-emerald-50', filter: 'Optimized' },
    ];

    return (
        <WidgetCard title="Warehouse Health" className="h-full" infoText="Overview of warehouse utilization and health status. Click any metric to filter the warehouse list.">
            <div className="grid grid-cols-2 gap-4 h-full">
                {stats.map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => onNavigate('Warehouse', stat.filter)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border-light hover:border-primary/30 hover:bg-surface-nested transition-all group"
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center group-hover:text-primary">{stat.label}</span>
                    </button>
                ))}
            </div>
        </WidgetCard>
    );
};

const ComputeOverview: React.FC<ComputeOverviewProps> = ({ account, warehouses, onNavigate, onSelectWarehouse }) => {
    const computeCredits = Math.round(account.tokens * 0.82);
    const cortexCredits = Math.round(account.tokens * 0.02);
    
    const resourceDistribution = [
        { name: 'Warehouse', value: computeCredits, color: '#6932D5', page: 'Warehouse' },
        { name: 'Cortex', value: cortexCredits, color: '#10B981', page: 'Cortex' },
        { name: 'Serverless', value: Math.round(account.tokens * 0.05), color: '#F59E0B', page: 'Serverless' }
    ];

    const topWarehouses = useMemo(() => {
        return [...warehouses].sort((a, b) => b.credits - a.credits).slice(0, 5);
    }, [warehouses]);

    const cortexTrend = [
        { date: 'Oct 10', tokens: 450 }, { date: 'Oct 11', tokens: 520 }, { date: 'Oct 12', tokens: 480 },
        { date: 'Oct 13', tokens: 610 }, { date: 'Oct 14', tokens: 750 }, { date: 'Oct 15', tokens: 690 },
        { date: 'Oct 16', tokens: 820 }
    ];

    return (
        <div className="flex flex-col h-full bg-background gap-4">
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 animate-in fade-in duration-500">
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SummaryMetricCard 
                        label="Compute Credits" 
                        value={computeCredits.toLocaleString()} 
                        subValue="cr" 
                        icon={IconDatabase} 
                        color="bg-primary/10 text-primary" 
                    />
                    <SummaryMetricCard 
                        label="Total Queries" 
                        value={account.queriesCount} 
                        icon={IconTrendingUp} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <SummaryMetricCard 
                        label="Cortex Credits" 
                        value={cortexCredits.toLocaleString()} 
                        subValue="cr" 
                        icon={IconSparkles} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Warehouse Health Widget */}
                    <div className="lg:col-span-6 h-[400px]">
                        <WarehouseHealthWidget warehouses={warehouses} onNavigate={onNavigate} />
                    </div>

                    {/* Distribution Chart */}
                    <WidgetCard 
                        title="Credits by Resource" 
                        className="lg:col-span-6 h-[400px]"
                        infoText="Distribution of compute credits across different resource types."
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={resourceDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            onClick={(data) => onNavigate(data.page)}
                                            cursor="pointer"
                                        >
                                            {resourceDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-1 gap-2 mt-4">
                                {resourceDistribution.map((item) => (
                                    <button 
                                        key={item.name}
                                        onClick={() => onNavigate(item.page)}
                                        className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-nested transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-text-strong">{item.value.toLocaleString()} cr</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </WidgetCard>

                    {/* Top Warehouses */}
                    <WidgetCard 
                        title="Top Warehouses by Credits" 
                        className="lg:col-span-12 h-[400px]"
                        headerActions={
                            <button onClick={() => onNavigate('Warehouse')} className="text-[11px] font-bold text-link hover:underline">View all</button>
                        }
                    >
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topWarehouses} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        fontSize={11} 
                                        width={100}
                                        tick={{ fontWeight: 700, fill: '#4B4B63' }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar 
                                        dataKey="credits" 
                                        radius={[0, 4, 4, 0]} 
                                        barSize={24}
                                        onClick={(data) => onSelectWarehouse(data)}
                                        cursor="pointer"
                                    >
                                        {topWarehouses.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#6932D5" fillOpacity={1 - (index * 0.15)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </WidgetCard>

                    {/* Cortex Usage Trend */}
                    <WidgetCard 
                        title="Cortex Model Usage Trend" 
                        className="lg:col-span-12 h-[350px]"
                        headerActions={
                            <button onClick={() => onNavigate('Cortex')} className="text-[11px] font-bold text-link hover:underline">View Cortex models</button>
                        }
                    >
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cortexTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        fontSize={10} 
                                        tick={{ fontWeight: 700, fill: '#9A9AB2' }}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        fontSize={10} 
                                        tick={{ fontWeight: 700, fill: '#9A9AB2' }}
                                        unit="K"
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="tokens" 
                                        stroke="#10B981" 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </WidgetCard>
                </div>
            </div>
        </div>
    );
};

export default ComputeOverview;
