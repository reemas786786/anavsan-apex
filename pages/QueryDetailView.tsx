
import React, { useState } from 'react';
import { QueryListItem, AssignedQuery, User, AssignmentStatus } from '../types';
import { IconChevronLeft, IconClipboardCopy, IconCheck, IconAIAgent, IconAdjustments, IconShare, IconAdd } from '../constants';

interface QueryDetailViewProps {
    query: QueryListItem;
    onBack: () => void;
    onAnalyzeQuery: (query: QueryListItem, source: string) => void;
    onOptimizeQuery: (query: QueryListItem, source: string) => void;
    onSimulateQuery: (query: QueryListItem, source: string) => void;
    sourcePage: string;
    assignment?: AssignedQuery;
    currentUser: User | null;
    onUpdateAssignmentStatus: (assignmentId: string, status: AssignmentStatus) => void;
    onAssignToEngineer: (query: QueryListItem) => void;
    onResolveAssignment: (assignmentId: string) => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; copyable?: boolean }> = ({ label, value, copyable }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof value === 'string') {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold text-[#9A9AB2] uppercase tracking-widest">{label}</p>
            <div className="flex items-center gap-2">
                <div className={`text-[13px] font-black text-[#161616] tracking-tight ${copyable ? 'font-mono text-primary' : ''}`}>
                    {value}
                </div>
                {copyable && (
                    <button onClick={handleCopy} className="text-text-muted hover:text-primary transition-colors">
                        {copied ? <IconCheck className="w-3 h-3 text-status-success" /> : <IconClipboardCopy className="w-3 h-3" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const QueryDetailView: React.FC<QueryDetailViewProps> = ({ 
    query, 
    onBack, 
    onAnalyzeQuery, 
    onOptimizeQuery, 
    onSimulateQuery, 
    sourcePage,
    assignment,
    currentUser,
    onUpdateAssignmentStatus,
    onAssignToEngineer,
    onResolveAssignment
}) => {
    const [isSqlCopied, setIsSqlCopied] = useState(false);

    const handleCopySql = () => {
        navigator.clipboard.writeText(query.queryText);
        setIsSqlCopied(true);
        setTimeout(() => setIsSqlCopied(false), 2000);
    };
    
    const formatBytes = (bytes: number) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
    };

    // Split query text into lines for line numbers
    const queryLines = query.queryText.split('\n');

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar">
            {/* Breadcrumbs are handled by AccountView, so we just focus on the content */}
            
            <div className="p-8 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h1 className="text-[28px] font-bold text-text-strong tracking-tight leading-none">Query detail</h1>
                        <p className="text-[13px] font-bold text-[#9A9AB2] tracking-tight">{query.id}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3D3D3D] text-white hover:bg-[#2D2D2D] transition-all shadow-sm">
                            <IconAdjustments className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3D3D3D] text-white hover:bg-[#2D2D2D] transition-all shadow-sm">
                            <IconShare className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => onAnalyzeQuery(query, sourcePage)}
                            className="h-10 px-6 rounded-full bg-[#6336D1] text-white font-bold text-[13px] flex items-center gap-2 hover:bg-[#522BB0] transition-all shadow-sm"
                        >
                            Analyze
                            <IconAdd className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm space-y-8">
                    <h3 className="text-[13px] font-black text-[#161616] uppercase tracking-widest">Details</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12">
                        <DetailItem 
                            label="Execution status" 
                            value={
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    query.status === 'Success' ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'
                                }`}>
                                    {query.status}
                                </span>
                            } 
                        />
                        <DetailItem label="Warehouse" value={query.warehouse} />
                        <DetailItem label="Warehouse size" value="Small" />
                        <DetailItem label="Credits" value={`${query.costCredits.toFixed(2)} cr`} />
                        
                        <DetailItem label="Total duration" value={query.duration} />
                        <DetailItem label="Bytes scanned" value={formatBytes(query.bytesScanned || 2 * 1024 * 1024 * 1024)} />
                        <DetailItem label="Bytes written" value={formatBytes(query.bytesWritten || 12 * 1024 * 1024 * 1024)} />
                        <DetailItem label="Query tag" value="ETL job" />
                        
                        <DetailItem label="Spilled (Local)" value="12" />
                        <DetailItem label="Spilled (Remote)" value="12" />
                        <DetailItem label="Partitions scanned" value="12" />
                        <DetailItem label="Partitions total" value="2" />
                        
                        <div className="col-span-1">
                            <DetailItem label="Query ID" value={query.id.substring(0, 15) + '...'} copyable={true} />
                        </div>
                        <div className="col-span-1">
                            <DetailItem label="Parameterized query hash" value="293cefwef7...6c5wqefwbfcf" copyable={true} />
                        </div>
                    </div>
                </div>

                {/* Query Text Card */}
                <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[13px] font-black text-[#161616] uppercase tracking-widest">Query text</h3>
                        <button 
                            onClick={handleCopySql}
                            className="text-[#9A9AB2] hover:text-primary transition-colors"
                        >
                            {isSqlCopied ? <IconCheck className="w-5 h-5 text-status-success" /> : <IconClipboardCopy className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    <div className="bg-[#F8F9FA] p-6 rounded-[24px] border border-border-light font-mono text-[13px] leading-relaxed overflow-x-auto">
                        <div className="flex gap-6">
                            <div className="flex flex-col text-[#9A9AB2] text-right select-none min-w-[20px]">
                                {queryLines.map((_, i) => (
                                    <span key={i}>{i + 1}</span>
                                ))}
                            </div>
                            <div className="flex flex-col text-[#161616] whitespace-pre">
                                {queryLines.map((line, i) => (
                                    <span key={i}>{line || ' '}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryDetailView;
