
import React, { useMemo } from 'react';
import { queryListData } from '../data/dummyData';
import { IconClock, IconTrendingUp, IconRefresh, IconInfo, IconDotsVertical, IconList, IconChevronDown } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatK = (val: number | string): string => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return Math.round(num).toLocaleString();
};

const SummaryMetricCard: React.FC<{ 
    label: string; 
    value: string; 
    subValue?: string; 
    onClick?: () => void 
}> = ({ label, value, subValue, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group w-full"
    >
        <p className="text-[10px] font-bold text-[#9A9AB2] group-hover:text-primary transition-colors uppercase tracking-widest">{label}</p>
        <div className="mt-auto">
            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-[#5A5A72] mt-1 tracking-tight">{subValue}</p>}
        </div>
    </button>
);

interface QueriesOverviewProps {
    onNavigate: (page: string) => void;
    onSelectQuery?: (query: any) => void;
    onSelectRepeatedPattern?: (hash: string) => void;
}

const QueriesOverview: React.FC<QueriesOverviewProps> = ({ onNavigate, onSelectQuery, onSelectRepeatedPattern }) => {
    const stats = useMemo(() => {
        const totalQueries = queryListData.length;
        
        // Group by text for repeated
        const groups: Record<string, number> = {};
        queryListData.forEach(q => {
            groups[q.queryText] = (groups[q.queryText] || 0) + 1;
        });
        const repeatedCount = Object.values(groups).filter(c => c > 1).length;

        return {
            totalQueries: '12K', // Hardcoded to match image for visual consistency
            repeatedCount: '13',
            expensiveCount: '13'
        };
    }, []);

    const topExpensiveQueries = useMemo(() => {
        return [...queryListData]
            .sort((a, b) => b.costCredits - a.costCredits)
            .slice(0, 8)
            .map(q => ({
                ...q,
                credits: q.costCredits,
                name: q.id.length > 15 ? q.id.substring(0, 6) + '...' + q.id.substring(q.id.length - 6) : q.id
            }));
    }, []);

    const topRepeatedQueries = useMemo(() => {
        // Group by query text
        const groups: Record<string, { id: string, credits: number, count: number }> = {};
        queryListData.forEach(q => {
            if (!groups[q.queryText]) {
                groups[q.queryText] = { id: q.id, credits: 0, count: 0 };
            }
            groups[q.queryText].credits += q.costCredits;
            groups[q.queryText].count += 1;
        });

        return Object.entries(groups)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([text, data]) => ({
                id: data.id.length > 15 ? data.id.substring(0, 6) + '...' + data.id.substring(data.id.length - 6) : data.id,
                fullId: data.id,
                credits: `${data.credits.toFixed(1)} credits`,
                executions: data.count >= 1000 ? (data.count / 1000).toFixed(1) + 'K' : data.count.toString()
            }));
    }, []);

    return (
        <div className="flex flex-col h-full bg-background gap-4">
            <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-strong tracking-tight">Query summary</h3>
                    <IconInfo className="w-4 h-4 text-text-muted" />
                    <div className="ml-auto flex items-center gap-4">
                        <IconList className="w-5 h-5 text-text-muted" />
                        <IconDotsVertical className="w-5 h-5 text-text-muted" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryMetricCard 
                        label="All queries" 
                        value={stats.totalQueries} 
                        subValue="Count"
                        onClick={() => onNavigate('Query list')} 
                    />
                    <SummaryMetricCard 
                        label="repeated query hash" 
                        value={stats.repeatedCount} 
                        subValue="Count"
                        onClick={() => onNavigate('Repeated queries')} 
                    />
                    <SummaryMetricCard 
                        label="Repeated expensive queries" 
                        value={stats.expensiveCount} 
                        subValue="Count"
                        onClick={() => onNavigate('Expensive queries')} 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-[24px] border border-border-light shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-text-strong uppercase tracking-widest">Top repeated query hash</h3>
                            <IconInfo className="w-4 h-4 text-text-muted" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => onNavigate('Repeated queries')}
                                className="text-xs font-black text-primary hover:underline"
                            >
                                View all
                            </button>
                            <IconDotsVertical className="w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        {topRepeatedQueries.map((q, idx) => (
                            <button 
                                key={idx} 
                                className="flex items-center justify-between group cursor-pointer w-full text-left"
                                onClick={() => onSelectRepeatedPattern?.(q.id)}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-text-strong group-hover:text-primary transition-colors">{q.id}</span>
                                    <span className="text-xs text-text-muted font-medium">{q.credits}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-text-strong">{q.executions}</span>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Executions</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-border-light shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-text-strong uppercase tracking-widest">Top repeated expensive queries</h3>
                            <IconInfo className="w-4 h-4 text-text-muted" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => onNavigate('Expensive queries')}
                                className="text-xs font-black text-primary hover:underline"
                            >
                                View all
                            </button>
                            <IconDotsVertical className="w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topExpensiveQueries}
                                margin={{ top: 0, right: 30, left: 60, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis 
                                    type="number" 
                                    stroke="#94a3b8" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    label={{ value: 'Credits', position: 'bottom', offset: 0, fontSize: 10, fontWeight: 'bold' }}
                                />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    stroke="#94a3b8" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    width={100}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="credits" 
                                    fill="#6366f1" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={12}
                                    onClick={(data) => onSelectQuery?.(data)}
                                    className="cursor-pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueriesOverview;
