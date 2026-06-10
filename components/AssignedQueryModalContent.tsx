
import React, { useState, useMemo } from 'react';
import { AssignedQuery } from '../types';
import { IconClipboardCopy, IconCheck, IconLightbulb, IconChevronRight } from '../constants';

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-text-secondary uppercase tracking-wider">{label}</p>
        <div className="text-lg font-semibold text-text-primary mt-1">{value}</div>
    </div>
);

const AssignedQueryModalContent: React.FC<{
    assignedQuery: AssignedQuery;
    onGoToQueryDetails: () => void;
    onViewTaskList: () => void;
}> = ({ assignedQuery, onGoToQueryDetails, onViewTaskList }) => {
    const [isCopied, setIsCopied] = useState(false);

    const highlightedCode = useMemo(() => {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'ON', 'WITH', 'INSERT', 'INTO', 'VALUES', 'DATE', 'SUM', 'COUNT', 'DISTINCT', 'NOT', 'IN'];
        const functions = ['DATE_TRUNC', 'MIN', 'MAX', 'AVG'];

        let html = assignedQuery.queryText;
        html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi'), '<span class="text-primary font-bold">$1</span>');
        html = html.replace(new RegExp(`\\b(${functions.join('|')})\\b`, 'gi'), '<span class="text-teal-500">$1</span>');
        html = html.replace(/('[\s\S]*?')/g, '<span class="text-green-600">$1</span>');
        html = html.replace(/(--.*)/g, '<span class="text-text-muted italic">$1</span>');
        return html;
    }, [assignedQuery.queryText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(assignedQuery.queryText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const formattedTimestamp = new Date(assignedQuery.assignedOn).toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 space-y-6 flex-grow overflow-y-auto no-scrollbar">
                {/* Title Block */}
                <div className="pb-4 border-b border-border-color">
                    <h3 className="text-lg font-bold text-text-strong">Assigned Task for Review</h3>
                    <p className="text-sm text-text-secondary mt-1">Assigned by <span className="font-bold text-text-primary">{assignedQuery.assignedBy}</span></p>
                </div>

                {/* KPI Card */}
                <div>
                    <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.15em] mb-3">Key Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 bg-surface-nested p-4 rounded-2xl border border-border-light shadow-inner">
                        <DetailItem label="Cost" value={`${assignedQuery.credits.toFixed(2)} cr`} />
                        <DetailItem label="Duration" value="00:02:30" />
                        <DetailItem label="Priority" value={<span className={`font-black ${assignedQuery.priority === 'High' ? 'text-status-error' : 'text-primary'}`}>{assignedQuery.priority}</span>} />
                    </div>
                </div>

                {/* AI Suggestions Block */}
                <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                        <IconLightbulb className="w-5 h-5" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">AI Optimization Suggestions</h4>
                    </div>
                    <ul className="space-y-3">
                        <li className="text-sm text-text-primary font-medium flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Push down the <strong>WHERE</strong> filters to reduce join data volume.</span>
                        </li>
                        <li className="text-sm text-text-primary font-medium flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Review clustering keys for the <strong>FACT_SALES</strong> table.</span>
                        </li>
                        <li className="text-sm text-text-primary font-medium flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Avoid using <strong>SELECT *</strong> in the final output.</span>
                        </li>
                    </ul>
                </div>
                
                {/* Admin's Note */}
                {assignedQuery.message && (
                    <div className="bg-surface-nested p-5 rounded-2xl border border-border-light italic">
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2 not-italic">FinOps Instructions</h4>
                        <p className="text-sm text-text-primary leading-relaxed">
                            "{assignedQuery.message}"
                        </p>
                    </div>
                )}

                {/* SQL Query Block */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">SQL Source</h4>
                         <button onClick={handleCopy} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-tighter transition-all">
                            {isCopied ? <IconCheck className="w-3 h-3 text-status-success"/> : <IconClipboardCopy className="w-3 h-3" />}
                            {isCopied ? 'COPIED' : 'COPY SQL'}
                        </button>
                    </div>
                    <div className="bg-[#0D1117] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                        <pre className="text-[12px] font-mono text-gray-300 leading-relaxed overflow-auto max-h-48 whitespace-pre p-6 custom-scrollbar">
                            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        </pre>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-[#F9F7FE] flex justify-end items-center gap-4 flex-shrink-0 border-t border-border-light">
                <button 
                    onClick={onViewTaskList}
                    className="px-6 py-2.5 text-sm font-bold text-text-secondary hover:text-text-strong transition-all"
                >
                    Go to task list
                </button>
                <button 
                    onClick={onGoToQueryDetails} 
                    className="bg-primary text-white font-black px-8 py-3 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-widest"
                >
                    Optimize Now
                    <IconChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AssignedQueryModalContent;
