
import React, { useState, useMemo } from 'react';
import { Application, QueryListItem, Recommendation } from '../types';
import { accountApplicationsData, queryListData, recommendationsData, warehousesData } from '../data/dummyData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { IconChevronLeft, IconChevronRight, IconLightbulb, IconSearch, IconAdjustments, IconClock, IconActivity, IconDatabase, IconLayers, IconBeaker } from '../constants';
import Pagination from '../components/Pagination';

// --- SUB-COMPONENTS ---

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[12px] text-text-secondary font-bold whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const WidgetCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ title, subtitle, children, className = "", icon }) => (
    <div className={`bg-white p-6 rounded-[24px] border border-border-light shadow-sm flex flex-col ${className}`}>
        <div className="mb-6 flex justify-between items-start">
            <div className="flex items-center gap-3">
                {icon && <div className="p-2 bg-primary/5 rounded-lg text-primary">{icon}</div>}
                <div>
                    <h3 className="text-sm font-black text-text-strong uppercase tracking-widest">{title}</h3>
                    {subtitle && <p className="text-[11px] text-text-muted font-bold mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
        <div className="flex-grow min-h-0">
            {children}
        </div>
    </div>
);

const ApplicationDetailView: React.FC<{ 
    application: Application; 
    onBack: () => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}> = ({ application, onBack, onNavigateToRecommendations }) => {
    // Mock drill-down data
    const trendData = useMemo(() => [
        { date: 'Dec 1', credits: application.totalCredits * 0.12 },
        { date: 'Dec 2', credits: application.totalCredits * 0.15 },
        { date: 'Dec 3', credits: application.totalCredits * 0.10 },
        { date: 'Dec 4', credits: application.totalCredits * 0.18 },
        { date: 'Dec 5', credits: application.totalCredits * 0.14 },
        { date: 'Dec 6', credits: application.totalCredits * 0.13 },
        { date: 'Dec 7', credits: application.totalCredits * 0.18 },
    ], [application]);

    const resourceMix = [
        { name: 'Compute', value: application.warehouseCredits, color: '#6932D5' },
        { name: 'Storage', value: application.storageCredits, color: '#A78BFA' },
        { name: 'Other', value: application.otherCredits, color: '#DDD6FE' },
    ];

    const appWarehouses = useMemo(() => [
        { name: 'COMPUTE_WH', size: 'Large', usage: '82%', cost: application.warehouseCredits * 0.7 },
        { name: 'ETL_WH', size: 'Small', usage: '14%', cost: application.warehouseCredits * 0.3 }
    ], [application]);

    const appTables = useMemo(() => [
        { name: 'FACT_SALES', size: '1.2 TB', owner: 'SALES_APP' },
        { name: 'STG_ORDERS', size: '450 GB', owner: 'ETL_PIPELINE' },
        { name: 'DIM_CUSTOMERS', size: '120 GB', owner: 'SALES_APP' }
    ], []);

    const appQueries = useMemo(() => queryListData.slice(0, 8), []);
    
    // Use dummy data or actual filtering
    const appRecommendations = useMemo(() => 
        recommendationsData.filter(r => r.affectedResource.toLowerCase().includes(application.name.toLowerCase()) || r.resourceType === 'Application'),
    [application]);

    const recommendationSummary = useMemo(() => {
        const types = [...new Set(appRecommendations.map(r => r.insightType))];
        // Ensure count is never 0 for demo/actionability
        const baseCount = appRecommendations.length || Math.floor(Math.random() * 40) + 10;
        return {
            count: baseCount,
            types: types.length > 0 ? types.slice(0, 3) : ['Unexpected Cost Spike', 'Governance Violation', 'Complex Join Pattern']
        };
    }, [appRecommendations, application]);

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar px-4 pt-4 pb-12 space-y-8">
            <div className="max-w-[1440px] mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-hover transition-all shadow-sm flex-shrink-0"
                    >
                        <IconChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-[28px] font-bold text-text-strong tracking-tight">{application.name}</h1>
                        <p className="text-sm text-text-secondary font-medium mt-1 max-w-2xl">{application.description}</p>
                    </div>
                </div>

                {/* Top Level Metric Drill-down Summary */}
                <div className="flex flex-wrap items-center gap-3">
                    <KPILabel label="Total credits" value={`${application.totalCredits.toLocaleString()} cr`} />
                    <KPILabel label="Warehouse" value={`${application.warehouseCredits.toLocaleString()} cr`} />
                    <KPILabel label="Storage" value={`${application.storageCredits.toLocaleString()} cr`} />
                    <KPILabel label="Queries" value={application.queryCount.toLocaleString()} />
                    <KPILabel label="Insights" value={recommendationSummary.count.toString()} />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left & Middle: Drill-down Widgets */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* 1. Consumption Drill-down */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <WidgetCard title="Consumption Trend" subtitle="Daily credit usage patterns." className="h-[380px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorAppSpend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6932D5" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                        <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                        <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#colorAppSpend)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </WidgetCard>

                            <WidgetCard title="Resource Mix" subtitle="Credits by Snowfalke service type." className="h-[380px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={resourceMix} 
                                            innerRadius={80} 
                                            outerRadius={110} 
                                            paddingAngle={8} 
                                            dataKey="value"
                                        >
                                            {resourceMix.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </WidgetCard>
                        </div>

                        {/* 2. Warehouse & Storage Specific Drill-downs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <WidgetCard title="Warehouse Drill-down" icon={<IconActivity className="w-4 h-4"/>} subtitle="Used clusters and efficiency.">
                                <div className="space-y-4">
                                    {appWarehouses.map(wh => (
                                        <div key={wh.name} className="p-4 bg-surface-nested rounded-2xl border border-border-light group hover:border-primary/20 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-primary text-[10px] shadow-sm border border-primary/10">WH</div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-strong group-hover:text-primary">{wh.name}</p>
                                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{wh.size} • {wh.usage} Load</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-text-strong">{wh.cost.toLocaleString()} cr</p>
                                        </div>
                                    ))}
                                </div>
                            </WidgetCard>

                            <WidgetCard title="Storage Drill-down" icon={<IconLayers className="w-4 h-4"/>} subtitle="Contribution by table data.">
                                <div className="space-y-4">
                                    {appTables.map(table => (
                                        <div key={table.name} className="p-4 bg-surface-nested rounded-2xl border border-border-light group hover:border-primary/20 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-emerald-600 text-[10px] shadow-sm border border-emerald-100">TB</div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-strong group-hover:text-primary font-mono">{table.name}</p>
                                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{table.owner}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-text-strong">{table.size}</p>
                                        </div>
                                    ))}
                                </div>
                            </WidgetCard>
                        </div>

                        {/* 3. Query History Drill-down */}
                        <WidgetCard title="Recent Application Queries" subtitle="The most expensive and recent executions for this app." className="min-h-[400px]">
                            <div className="overflow-x-auto rounded-xl border border-border-light">
                                <table className="w-full text-left text-xs border-separate border-spacing-0">
                                    <thead className="bg-[#F8F9FA] text-[10px] font-black text-text-muted uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-border-light">Query ID</th>
                                            <th className="px-6 py-4 border-b border-border-light">User</th>
                                            <th className="px-6 py-4 border-b border-border-light">Warehouse</th>
                                            <th className="px-6 py-4 border-b border-border-light">Credits</th>
                                            <th className="px-6 py-4 border-b border-border-light text-right">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light bg-white font-medium">
                                        {appQueries.map(q => (
                                            <tr key={q.id} className="hover:bg-surface-nested transition-colors">
                                                <td className="px-6 py-4 font-mono text-link font-bold">{q.id.substring(7, 13).toUpperCase()}</td>
                                                <td className="px-6 py-4 text-text-primary">{q.user}</td>
                                                <td className="px-6 py-4 text-text-secondary">{q.warehouse}</td>
                                                <td className="px-6 py-4 font-black text-text-strong">{q.costCredits.toFixed(2)} cr</td>
                                                <td className="px-6 py-4 text-right text-text-muted">{q.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline decoration-primary/30">View All 4.5K Queries</button>
                            </div>
                        </WidgetCard>
                    </div>

                    {/* Right: AI Insights Banner Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#150A2B] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col min-h-[460px]">
                            {/* Decorative background blur */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-10">
                                    <IconLightbulb className="w-8 h-8 text-primary" />
                                    <h2 className="text-[24px] font-black uppercase tracking-tight">AI Insights</h2>
                                </div>
                                
                                <div className="space-y-10 flex-grow">
                                    <p className="text-[17px] text-gray-200 leading-relaxed font-medium">
                                        Anavsan AI detected <span className="text-primary font-black text-2xl">{recommendationSummary.count} optimizations</span> specifically for this application's workload.
                                    </p>
                                    
                                    <div className="space-y-5">
                                        <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.25em]">Key Focus Areas:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {recommendationSummary.types.map(type => (
                                                <span key={type} className="px-4 py-1.5 bg-white/10 rounded-full text-[11px] font-bold text-gray-100 border border-white/5 whitespace-nowrap transition-colors hover:bg-white/15">
                                                    {type}
                                                </span>
                                            ))}
                                            {recommendationSummary.count > 3 && (
                                                <span className="px-4 py-1.5 bg-white/5 rounded-full text-[11px] font-bold text-gray-400 italic">
                                                    +{recommendationSummary.count - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => onNavigateToRecommendations?.({ search: application.name })}
                                    className="w-full mt-10 bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-[24px] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] text-base"
                                >
                                    <span>View recommendations</span>
                                    <IconChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Lower Action Card: Simulator CTA */}
                        <div className="bg-white rounded-[40px] p-8 border border-border-light shadow-sm flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary">
                                <IconBeaker className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[15px] font-bold text-text-strong leading-relaxed">
                                    Need deeper analysis? Run a full simulation for this workload.
                                </p>
                                <p className="text-xs text-text-secondary font-medium">Predict impact of scaling and refactoring before applying changes.</p>
                            </div>
                            <button className="w-full py-4 bg-white text-primary border-2 border-primary font-black rounded-[20px] hover:bg-primary/5 transition-all text-sm">
                                Open Simulator
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ApplicationsListView: React.FC<{ 
    onSelect: (app: Application) => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}> = ({ onSelect, onNavigateToRecommendations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredApps = useMemo(() => {
        return accountApplicationsData.filter(app => 
            app.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Enhanced logic: ensure no insightCount is 0 to make it actionable for the demo
    const appsWithInsights = useMemo(() => {
        return filteredApps.map(app => ({
            ...app,
            insightCount: app.insightCount > 0 ? app.insightCount : Math.floor(Math.random() * 5) + 2
        }));
    }, [filteredApps]);

    const globalMetrics = useMemo(() => {
        return {
            totalApps: appsWithInsights.length,
            totalCredits: appsWithInsights.reduce((sum, app) => sum + app.totalCredits, 0),
            totalWarehouse: appsWithInsights.reduce((sum, app) => sum + app.warehouseCredits, 0),
            totalStorage: appsWithInsights.reduce((sum, app) => sum + app.storageCredits, 0),
            totalInsights: appsWithInsights.reduce((sum, app) => sum + app.insightCount, 0),
        };
    }, [appsWithInsights]);

    const totalPages = Math.ceil(appsWithInsights.length / itemsPerPage);
    const paginatedApps = appsWithInsights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 space-y-4">
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Applications</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Manage and optimize workloads associated with specific applications and services.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                <KPILabel label="Applications" value={globalMetrics.totalApps.toString()} />
                <KPILabel label="Total credits" value={`${globalMetrics.totalCredits.toLocaleString()} cr`} />
                <KPILabel label="Compute" value={`${globalMetrics.totalWarehouse.toLocaleString()} cr`} />
                <KPILabel label="Storage" value={`${globalMetrics.totalStorage.toLocaleString()} cr`} />
                <KPILabel label="Total insights" value={globalMetrics.totalInsights.toString()} />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col flex-grow min-h-0">
                <div className="px-6 py-4 flex justify-between items-center border-b border-border-light bg-white flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search applications..."
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Application name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Compute (cr)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light">Storage (cr)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light text-right">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedApps.map(app => (
                                <tr key={app.id} className="hover:bg-surface-nested cursor-pointer transition-colors group">
                                    <td onClick={() => onSelect(app)} className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-link group-hover:underline">{app.name}</span>
                                            <span className="text-[10px] text-text-muted font-normal mt-0.5 truncate max-w-xs">{app.description}</span>
                                        </div>
                                    </td>
                                    <td onClick={() => onSelect(app)} className="px-6 py-5 font-medium text-text-primary">{app.warehouseCredits.toLocaleString()}</td>
                                    <td onClick={() => onSelect(app)} className="px-6 py-5 font-medium text-text-primary">{app.storageCredits.toLocaleString()}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigateToRecommendations?.({ search: app.name });
                                                }}
                                                className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                            >
                                                <span className="text-[12px] font-black">{app.insightCount}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={appsWithInsights.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

interface ApplicationsViewProps {
    selectedAppId?: string | null;
    onSelectApp: (appId: string | null) => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

const ApplicationsView: React.FC<ApplicationsViewProps> = ({ selectedAppId, onSelectApp, onNavigateToRecommendations }) => {
    const selectedApplication = useMemo(() => {
        if (!selectedAppId) return null;
        return accountApplicationsData.find(a => a.id === selectedAppId || a.name === selectedAppId) || null;
    }, [selectedAppId]);

    if (selectedApplication) {
        return <ApplicationDetailView application={selectedApplication} onBack={() => onSelectApp(null)} onNavigateToRecommendations={onNavigateToRecommendations} />;
    }

    return <ApplicationsListView onSelect={(app) => onSelectApp(app.id)} onNavigateToRecommendations={onNavigateToRecommendations} />;
};

export default ApplicationsView;
