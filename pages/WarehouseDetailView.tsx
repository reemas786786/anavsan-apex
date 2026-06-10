import React, { useState, useMemo } from 'react';
import { Warehouse, WarehouseHealth } from '../types';
import { IconChevronLeft, IconLightbulb, IconSearch, IconChevronDown, IconSparkles, IconChevronRight, IconInfo, IconClose } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { queryListData } from '../data/dummyData';
import Pagination from '../components/Pagination';

// --- PROPS INTERFACE ---
interface WarehouseDetailViewProps {
    warehouse: Warehouse;
    warehouses: Warehouse[];
    onSelectWarehouse: (warehouse: Warehouse) => void;
    onBack: () => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }, context?: any) => void;
}

// --- HELPER & CHILD COMPONENTS ---

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
        <div className="text-sm font-black text-text-primary mt-1">{value}</div>
    </div>
);

const SummaryMetricCard: React.FC<{ 
    label: string; 
    value: string; 
    subValue?: string; 
}> = ({ label, value, subValue }) => (
    <div className="bg-white p-4 rounded-[20px] border border-border-light flex flex-col h-[100px] text-left w-full">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
        <div className="mt-auto">
            <p className="text-[20px] font-black text-text-strong tracking-tight leading-none">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-text-secondary mt-1 tracking-tight">{subValue}</p>}
        </div>
    </div>
);

const HealthBadge: React.FC<{ health: string }> = ({ health }) => {
    const isOverutilized = health.toLowerCase().includes('over');
    const styles = isOverutilized 
        ? 'bg-red-50 text-red-900 border-red-200'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200';
    
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded border ${styles}`}>
            {health}
        </span>
    );
};

const CreditTrendChart: React.FC = () => {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
    
    const data = useMemo(() => {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        return Array.from({ length: days }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                credits: parseFloat((Math.random() * 1.5 + 0.5).toFixed(1))
            };
        });
    }, [dateRange]);

    return (
        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[11px] font-black text-text-strong uppercase tracking-widest">Credit Trend</h3>
                <div className="flex bg-surface-nested p-1 rounded-lg border border-border-light">
                    {(['7d', '30d', '90d'] as const).map(range => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${
                                dateRange === range 
                                ? 'bg-white text-primary shadow-sm' 
                                : 'text-text-muted hover:text-text-secondary'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis 
                            dataKey="date" 
                            stroke="#9A9AB2" 
                            fontSize={10} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontWeight: 700}} 
                            interval={dateRange === '90d' ? 14 : dateRange === '30d' ? 4 : 0}
                        />
                        <YAxis stroke="#9A9AB2" fontSize={10} unit="cr" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <defs>
                            <linearGradient id="creditGradientDetail" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6932D5" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#creditGradientDetail)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const QueryHistoryTable: React.FC<{ warehouseName: string }> = ({ warehouseName }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const queries = useMemo(() => {
        const filtered = queryListData.filter(q => q.warehouse === warehouseName);
        if (!searchTerm) return filtered;
        return filtered.filter(q => 
            q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.user.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [warehouseName, searchTerm]);

    const totalPages = Math.ceil(queries.length / itemsPerPage);
    const paginatedQueries = queries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
        <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-6 py-4 flex justify-between items-center border-b border-border-light bg-white flex-shrink-0">
                <h3 className="text-sm font-black text-text-strong uppercase tracking-[0.15em]">Execution History</h3>
                <div className="relative">
                    <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="bg-surface-nested border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary outline-none pr-10 pl-4 py-2 w-64 text-left placeholder:text-text-muted"
                        placeholder="Search query or user..."
                    />
                </div>
            </div>

            <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                <table className="w-full text-[13px] border-separate border-spacing-0">
                    <thead className="bg-[#F8F9FA] sticky top-0 z-10 text-[10px] font-black text-text-muted uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 text-left border-b border-border-light">Query ID</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">User</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">Duration</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">Credits</th>
                            <th className="px-6 py-4 text-right border-b border-border-light">Start Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light bg-white">
                        {paginatedQueries.map(q => (
                            <tr key={q.id} className="hover:bg-surface-nested group transition-colors">
                                <td className="px-6 py-5 font-mono text-xs text-link font-bold truncate max-w-[160px]">{q.id.substring(7, 13).toUpperCase()}</td>
                                <td className="px-6 py-5 font-bold text-text-primary">{q.user}</td>
                                <td className="px-6 py-5 text-text-secondary font-medium">{q.duration}</td>
                                <td className="px-6 py-5 font-black text-text-strong">{q.costTokens.toFixed(3)}</td>
                                <td className="px-6 py-5 text-right text-text-muted font-bold whitespace-nowrap">{new Date(q.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {queries.length > itemsPerPage && (
                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={queries.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const WarehouseDetailView: React.FC<WarehouseDetailViewProps> = ({ warehouse, onBack, onNavigateToRecommendations }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Query History'>('Details');
    const [isNotificationVisible, setIsNotificationVisible] = useState(true);

    const insightCount = useMemo(() => warehouse.health === 'Optimized' ? 0 : Math.floor(Math.random() * 3) + 1, [warehouse]);

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar px-4 pt-4 pb-12">
            <div className="max-w-[1440px] mx-auto w-full space-y-8">
                {/* Header Area */}
                <header className="flex flex-col gap-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <button 
                                onClick={onBack} 
                                className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-hover transition-all shadow-sm flex-shrink-0"
                                aria-label="Back"
                            >
                                <IconChevronLeft className="h-6 w-6" />
                            </button>
                            
                            <div className="flex flex-col">
                            </div>
                        </div>

                        {/* Carbon System Actionable Notification Component */}
                        {isNotificationVisible && (
                            <div className="hidden lg:flex items-center justify-between bg-[#edf5ff] border border-[#d0e2ff] border-l-[4px] border-l-[#0f62fe] px-4 py-3 min-w-[540px] shadow-sm animate-in fade-in slide-in-from-right-2 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 text-[#0f62fe]">
                                        <IconInfo className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-wrap gap-x-1.5 text-sm leading-tight text-[#161616]">
                                        <span className="font-bold">Platform AI</span>
                                        <span>
                                            {insightCount > 0 
                                                ? `Detected ${insightCount} optimizations for this cluster.` 
                                                : 'This warehouse is currently running at peak operational health.'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 ml-6">
                                    {insightCount > 0 && (
                                        <button 
                                            onClick={() => onNavigateToRecommendations?.({ search: warehouse.name }, { warehouse })}
                                            className="text-sm font-semibold text-[#0f62fe] hover:underline whitespace-nowrap"
                                        >
                                            View optimizations
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setIsNotificationVisible(false)}
                                        className="p-1 text-[#161616] hover:bg-black/5 rounded transition-colors"
                                        aria-label="Close alert"
                                    >
                                        <IconClose className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Horizontal Tab Navigation */}
                    <div className="flex border-b border-border-light overflow-x-auto no-scrollbar gap-8">
                        {(['Details', 'Query History'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-text-muted hover:text-text-secondary'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content Area */}
                <main className="animate-in fade-in duration-500">
                    {activeTab === 'Details' ? (
                        <div className="space-y-8">
                            {/* NEW: 6-Metric Summary Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SummaryMetricCard label="Credits Used" value={`${warehouse.tokens.toLocaleString()}`} subValue="cr" />
                                <SummaryMetricCard label="Avg Runtime" value="4.2s" subValue="Standard performance" />
                                <SummaryMetricCard label="Query Count" value="120K" subValue="Total executions" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column: Metadata & Config */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm space-y-8">
                                        <h3 className="text-sm font-black text-text-strong uppercase tracking-[0.2em] border-b border-border-light pb-4">Details</h3>
                                        <div className="grid grid-cols-1 gap-y-8">
                                            <DetailItem label="Health Status" value={<HealthBadge health="OVERUTILIZED" />} />
                                            <DetailItem label="Size" value={warehouse.size} />
                                            <DetailItem label="Type" value="STANDARD" />
                                            <DetailItem label="Scaling" value="MULTI CLUSTER (1–3)" />
                                            <DetailItem label="Auto Suspend" value="600 seconds" />
                                            <DetailItem label="Auto Resume" value="Enabled" />
                                            <DetailItem label="Resumed On" value="3 hours ago" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Trends */}
                                <div className="lg:col-span-8 space-y-6">
                                    <CreditTrendChart />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <QueryHistoryTable warehouseName={warehouse.name} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default WarehouseDetailView;
