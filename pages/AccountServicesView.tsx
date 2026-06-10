
import React, { useState, useMemo } from 'react';
import { servicesData } from '../data/dummyData';
import { IconSearch, IconChevronRight, IconBolt } from '../constants';
import Pagination from '../components/Pagination';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[12px] text-text-secondary font-bold whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

interface AccountServicesViewProps {
    accountName: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

const AccountServicesView: React.FC<AccountServicesViewProps> = ({ accountName, onNavigateToRecommendations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const localServices = useMemo(() => [
        { id: 's-1', type: 'SEARCH_OPTIMIZATION', credits: 1230, queries: 18200, status: 'Active', trend: '↑ 12%' },
        { id: 's-2', type: 'QUERY_ACCELERATION', credits: 2840, queries: 41600, status: 'Active', trend: '↑ 21%' },
        { id: 's-3', type: 'SERVERLESS_TASK', credits: 420, queries: 6200, status: 'Active', trend: '↓ 4%' },
        { id: 's-4', type: 'AUTO_CLUSTERING', credits: 310, queries: 2900, status: 'Active', trend: '↑ 6%' },
        { id: 's-5', type: 'AI_SERVICES', credits: 1980, queries: 14400, status: 'Active', trend: '↑ 17%' },
        { id: 's-6', type: 'SNOWPIPE', credits: 150, queries: 82000, status: 'Active', trend: '↓ 2%' },
        { id: 's-7', type: 'REPLICATION', credits: 85, queries: 120, status: 'Idle', trend: '—' },
    ], []);

    const filteredServices = useMemo(() => {
        return localServices.filter(s => 
            s.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, localServices]);

    const globalMetrics = useMemo(() => {
        const totalCredits = filteredServices.reduce((sum, s) => sum + s.credits, 0);
        return {
            total: filteredServices.length.toString(),
            credits: totalCredits.toLocaleString(),
            active: filteredServices.filter(s => s.status === 'Active').length.toString()
        };
    }, [filteredServices]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredServices.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredServices, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-6 pb-12 space-y-4">
            <div className="flex-shrink-0 mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Services</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Monitor serverless and background services consumption for this account.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                <KPILabel label="Active Services" value={globalMetrics.active} />
                <KPILabel label="Total Spend" value={`${globalMetrics.credits} cr`} />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col flex-grow min-h-0">
                <div className="px-6 py-4 flex justify-end items-center border-b border-border-light bg-white flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search services..."
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10 font-bold uppercase tracking-widest text-[10px] text-text-muted">
                            <tr>
                                <th className="px-6 py-4 border-b border-border-light">Service type</th>
                                <th className="px-6 py-4 border-b border-border-light">Credits</th>
                                <th className="px-6 py-4 border-b border-border-light">Queries/Events</th>
                                <th className="px-6 py-4 border-b border-border-light text-right">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedRows.map(row => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                                <IconBolt className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-text-strong">{row.type.replace(/_/g, ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-text-strong">{row.credits.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-text-secondary">{row.queries.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                onClick={() => onNavigateToRecommendations?.({ search: row.type })}
                                                className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                                            >
                                                <span className="text-[12px] font-black">{Math.floor(Math.random() * 4) + 1}</span>
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
                        totalItems={filteredServices.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountServicesView;
