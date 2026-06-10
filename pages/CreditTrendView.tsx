
import React, { useState, useMemo } from 'react';
import { Account } from '../types';
import { spendTrendsData } from '../data/dummyData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import InfoTooltip from '../components/InfoTooltip';
import DateRangeDropdown from '../components/DateRangeDropdown';

interface CreditTrendViewProps {
    account: Account;
}

const WidgetCard: React.FC<{ title: string; children: React.ReactNode; infoText?: string; color?: string }> = ({ title, children, infoText, color = "#6932D5" }) => (
    <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                <h3 className="text-sm font-black text-text-strong uppercase tracking-widest">{title}</h3>
                {infoText && <InfoTooltip text={infoText} />}
            </div>
        </div>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label, unit = "cr" }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-xl shadow-xl border border-border-light min-w-[140px]">
                <p className="text-xs font-bold text-text-muted uppercase tracking-tighter mb-2 border-b border-border-light pb-1">{label}</p>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-black text-text-strong">{payload[0].value.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-text-muted uppercase">{unit}</span>
                </div>
            </div>
        );
    }
    return null;
};

const CreditTrendView: React.FC<CreditTrendViewProps> = ({ account }) => {
    // Fixed: Default range set to last 7 days as requested
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('7d');

    // Filtering logic to align the 30-day dummy data with the requested date range
    const filteredData = useMemo(() => {
        // If it's a preset string
        if (typeof dateFilter === 'string') {
            if (dateFilter === 'All') return spendTrendsData;
            
            // Map common presets to day counts
            const presetMap: Record<string, number> = {
                '1d': 2, // Use 2 days for "Last 24 hours" to ensure a line is drawn (today + yesterday)
                '7d': 7,
                '14d': 14,
                '30d': 30
            };
            
            const days = presetMap[dateFilter] || parseInt(dateFilter);
            if (!isNaN(days)) {
                return spendTrendsData.slice(-days);
            }
            return spendTrendsData;
        }

        // If it's a custom range, we try to match by date strings for the demo
        // spendTrendsData uses format like "Nov 20"
        const start = new Date(dateFilter.start);
        const end = new Date(dateFilter.end);
        
        // Helper to check if a "Nov 20" style string falls within our ISO range
        // Since dummyData doesn't have year, we assume current year 2023 for matching
        const result = spendTrendsData.filter(item => {
            const itemDate = new Date(`${item.date}, 2023`);
            return itemDate >= start && itemDate <= end;
        });

        // Ensure we always return at least something to avoid breaking charts
        return result.length > 0 ? result : spendTrendsData.slice(-7);
    }, [dateFilter]);

    return (
        <div className="flex flex-col h-full bg-background px-4 pt-4 pb-12 space-y-8 overflow-y-auto no-scrollbar">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Credit trend</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">Historical credit consumption patterns for {account.name}.</p>
                </div>
                <div className="bg-white p-2 rounded-2xl border border-border-light shadow-sm flex items-center relative z-20">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. Overall Account Credit Trend */}
                <WidgetCard title="Total credits trend" infoText="Total organizational credit consumption (Compute + Storage + Cloud Services).">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="total" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* 2. Compute Specific Trend */}
                <WidgetCard title="Compute consumption" infoText="Credits consumed by virtual warehouses during query execution and background tasks." color="#6932D5">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="warehouse" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#colorCompute)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* 3. Storage Specific Trend */}
                <WidgetCard title="Storage consumption" infoText="Credits consumed for data storage, including database tables and internal/external stages." color="#A78BFA">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="storage" stroke="#A78BFA" strokeWidth={3} fillOpacity={1} fill="url(#colorStorage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* 4. Cloud Services Specific Trend */}
                <WidgetCard title="Cloud services consumption" infoText="Credits consumed for metadata management, query compilation, and access control." color="#C4B5FD">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="cloud" stroke="#C4B5FD" strokeWidth={3} fillOpacity={1} fill="url(#colorCloud)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>
            </div>
        </div>
    );
};

export default CreditTrendView;
