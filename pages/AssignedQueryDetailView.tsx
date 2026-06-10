
import React, { useState, useRef, useEffect } from 'react';
import { AssignedQuery, User, AssignmentStatus, AssignmentPriority, CollaborationEntry, Recommendation } from '../types';
import { IconChevronLeft, IconChevronRight, IconClipboardCopy, IconCheck, IconAIAgent, IconUser, IconClock, IconRefresh, IconArrowUp, IconExclamationTriangle, IconChevronDown, IconLightbulb, IconDatabase, IconWand, IconInfo, IconEdit, IconDelete, IconDotsVertical, IconPlay, IconClose, IconCheckCircle } from '../constants';
import { RecommendationDetailView, SeverityBadge } from '../components/RecommendationDetailView';

interface AssignedQueryDetailViewProps {
    assignment: AssignedQuery;
    onBack: () => void;
    currentUser: User | null;
    onUpdateStatus: (id: string, status: AssignmentStatus, comment?: string) => void;
    onUpdatePriority: (id: string, priority: AssignmentPriority) => void;
    onAddComment: (id: string, comment: string) => void;
    onResolve: (id: string) => void;
    onReassign: (queryId: string) => void;
    onNavigateToQuery?: (query: any) => void;
    onNavigateToWarehouse?: (warehouse: any) => void;
    recommendations?: Recommendation[];
}

const StatusBadge: React.FC<{ status: AssignmentStatus }> = ({ status }) => {
    const colorClasses: Record<AssignmentStatus, string> = {
        'Assigned': 'bg-blue-100 text-blue-700 border-blue-200',
        'In progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Optimized': 'bg-status-success-light text-status-success-dark border-status-success/20',
        'Cannot be optimized': 'bg-status-error-light text-status-error-dark border-status-error/20',
        'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
     return <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-tight ${colorClasses[status]}`}>{status}</span>;
};

const UserAvatar: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'sm' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-10 h-10 text-xs';
    return (
        <div className={`${sizeClasses} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center flex-shrink-0 shadow-inner border border-white/50`}>
            {initials}
        </div>
    );
};

const AssignedQueryDetailView: React.FC<AssignedQueryDetailViewProps> = ({ 
    assignment, 
    onBack, 
    currentUser, 
    onUpdateStatus, 
    onUpdatePriority,
    onAddComment, 
    onResolve, 
    onReassign,
    onNavigateToQuery,
    onNavigateToWarehouse,
    recommendations = []
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<AssignmentStatus | null>(null);
    const [statusDescription, setStatusDescription] = useState('');
    
    // Cortex AI & Execution States
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [optimizationGoal, setOptimizationGoal] = useState<'balanced' | 'performance' | 'cost'>('balanced');
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [executionTime, setExecutionTime] = useState<string | null>(null);
    
    const actionsMenuRef = useRef<HTMLDivElement>(null);
    
    const isFinOps = currentUser?.role === 'FinOps' || currentUser?.role === 'Admin';
    const isEngineer = currentUser?.role === 'DataEngineer';

    const recommendation = recommendations.find(r => r.id === assignment.recommendationId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
                setIsActionsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(assignment.queryText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleStatusUpdateClick = (status?: AssignmentStatus) => {
        setPendingStatus(status || null);
        setShowStatusModal(true);
        setStatusDescription('');
    };

    const [isPromptCopied, setIsPromptCopied] = useState(false);

    const handleGenerateCode = () => {
        setIsGeneratingCode(true);
        // Simulate Cortex AI call
        setTimeout(() => {
            const goalLabel = optimizationGoal.charAt(0).toUpperCase() + optimizationGoal.slice(1);
            const code = `-- Optimized by Anavsan AI via Snowflake Cortex
-- Optimization Goal: ${goalLabel}
-- Execution Window: 09:00 - 11:00 UTC
-- anavsan

ALTER WAREHOUSE ${assignment.warehouse} SET WAREHOUSE_SIZE = 'LARGE';

-- Monitor query queuing and performance
SELECT * FROM TABLE(INFORMATION_SCHEMA.WAREHOUSE_LOAD_HISTORY(
    DATE_RANGE_START => DATEADD('hour', -1, CURRENT_TIMESTAMP()),
    WAREHOUSE_NAME => '${assignment.warehouse}'
));`;
            setGeneratedCode(code);
            setIsGeneratingCode(false);
        }, 2000);
    };

    const handleRunInSnowflake = () => {
        setShowConfirmation(false);
        setIsExecuting(true);
        setExecutionStatus('running');
        
        // Simulate Snowflake execution
        setTimeout(() => {
            setIsExecuting(false);
            setExecutionStatus('success');
            setExecutionTime(new Date().toLocaleString());
            // Update status to Optimized
            onUpdateStatus(assignment.id, 'Optimized', 'Executed optimized SQL via Snowflake Cortex');
        }, 2500);
    };

    const handleConfirmStatusUpdate = () => {
        if (pendingStatus) {
            onUpdateStatus(assignment.id, pendingStatus, statusDescription);
            setShowStatusModal(false);
            setPendingStatus(null);
            setStatusDescription('');
        }
    };

    const priorityColors = {
        Low: 'bg-status-info-light text-status-info-dark border-status-info/20',
        Medium: 'bg-status-warning-light text-status-warning-dark border-status-warning/20',
        High: 'bg-status-error-light text-status-error-dark border-status-error/20',
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 bg-background border-b border-border-light px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-surface-hover rounded-full transition-colors">
                        <IconChevronLeft className="h-6 w-6 text-text-secondary" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                             <h1 className="text-lg font-black text-text-primary">TASK-{assignment.queryId.substring(0,8).toUpperCase()}</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Engineer Specific Actions */}
                    {isEngineer && assignment.status !== 'Optimized' && (
                        <button 
                            onClick={() => handleStatusUpdateClick()}
                            className="bg-primary text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2"
                        >
                            <IconRefresh className="w-4 h-4" /> 
                            Start Optimization
                        </button>
                    )}
                    
                    {/* FinOps Specific Actions */}
                    {isFinOps && (
                        <div className="flex items-center gap-2">
                            {assignment.status === 'Optimized' && (
                                <button 
                                    onClick={() => onResolve(assignment.id)}
                                    className="bg-status-success text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-status-success-dark shadow-sm transition-all flex items-center gap-2"
                                >
                                    <IconCheck className="w-4 h-4" /> Resolve Task
                                </button>
                            )}
                            
                            <div className="relative" ref={actionsMenuRef}>
                                <button 
                                    onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                                    className="p-2 hover:bg-surface-hover rounded-full transition-colors text-text-secondary"
                                    title="More Actions"
                                >
                                    <IconEdit className="w-5 h-5" />
                                </button>
                                
                                {isActionsMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border-color py-2 z-30 animate-in fade-in slide-in-from-top-1">
                                        <div className="px-4 py-2 border-b border-border-light mb-1">
                                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Update Priority</span>
                                        </div>
                                        {(['Low', 'Medium', 'High'] as AssignmentPriority[]).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => { onUpdatePriority(assignment.id, p); setIsActionsMenuOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-surface-nested transition-colors flex items-center justify-between ${assignment.priority === p ? 'text-primary bg-primary/5' : 'text-text-secondary'}`}
                                            >
                                                {p}
                                                {assignment.priority === p && <IconCheck className="w-3 h-3" />}
                                            </button>
                                        ))}
                                        
                                        <div className="my-2 border-t border-border-light"></div>
                                        
                                        <button
                                            onClick={() => { onResolve(assignment.id); setIsActionsMenuOpen(false); }}
                                            className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-status-error hover:bg-status-error-light/10 transition-colors flex items-center gap-2"
                                        >
                                            <IconDelete className="w-4 h-4" />
                                            Remove Assignment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs removed as per request */}
            </header>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Main Content Area: Unified View */}
                <div className="flex-1 overflow-y-auto p-4 bg-surface-nested no-scrollbar">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
                        {/* Left Column: Story of the Fix (Unified Large Card) */}
                        <div className="xl:col-span-8">
                            <div className="bg-white rounded-[32px] border border-border-light shadow-sm overflow-hidden">
                                <div className="p-4 relative">
                                    {/* The vertical line */}
                                    <div className="absolute left-[47px] top-12 bottom-12 w-0.5 bg-border-color z-0" />
                                    
                                    <div className="flex flex-col gap-0">
                                        {/* Step 1: AI Detection */}
                                        {recommendation && (
                                            <div className="flex gap-6 relative pb-4">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                                                    <IconAIAgent className="w-4 h-4" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted">Step 1: Anavsan AI Detection</h4>
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                            {new Date(recommendation.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-purple-100 text-purple-700 border border-purple-200">
                                                                {recommendation.insightType}
                                                            </span>
                                                            <h5 className="text-sm font-black text-text-strong">AI Diagnostic</h5>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <p className="text-text-primary text-[15px] font-semibold leading-relaxed">
                                                                {recommendation.message}
                                                            </p>
                                                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                                                <p className="text-text-secondary text-[13px] font-medium leading-relaxed italic">
                                                                    <span className="text-primary font-black not-italic mr-1.5">Suggestion:</span>
                                                                    "{recommendation.suggestion || 'Implement recommended configuration changes to improve performance and reduce cost.'}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: FinOps Assignment */}
                                        {assignment.message && (
                                            <div className="flex gap-6 relative pb-8">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                                                    <IconUser className="w-4 h-4" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted">Step 2: FinOps Assignment</h4>
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                            {new Date(assignment.assignedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h5 className="text-sm font-black text-text-strong flex items-center gap-2">
                                                            Instructions from {assignment.assignedBy}
                                                        </h5>
                                                        <p className="text-text-primary text-[15px] font-medium leading-relaxed">
                                                            {assignment.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Data Engineer Optimization */}
                                        <div className="flex gap-6 relative pb-8">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                                                <IconWand className="w-4 h-4" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted">Step 3: Data Engineer Optimization</h4>
                                                    {executionStatus === 'success' && executionTime && (
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                            {executionTime}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-6">
                                                    {!generatedCode && !isGeneratingCode ? (
                                                        /* Image 2 Style Banner */
                                                        <div className="bg-white rounded-[24px] border border-border-light shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                        <IconWand className="w-5 h-5" />
                                                                    </div>
                                                                    <h4 className="text-[13px] font-black text-indigo-700 uppercase tracking-[0.15em]">Cortex AI Optimization</h4>
                                                                </div>
                                                                <button 
                                                                    onClick={handleGenerateCode}
                                                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95"
                                                                >
                                                                    <IconWand className="w-4 h-4" />
                                                                    Generate Code
                                                                </button>
                                                            </div>

                                                            {/* Optimization Strategy Selection */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Optimization Strategy</h4>
                                                                <div className="grid grid-cols-3 gap-3">
                                                                    {(['balanced', 'performance', 'cost'] as const).map((goal) => (
                                                                        <button
                                                                            key={goal}
                                                                            onClick={() => setOptimizationGoal(goal)}
                                                                            className={`py-3 px-4 rounded-2xl text-[12px] font-black uppercase tracking-tight border-2 transition-all ${
                                                                                optimizationGoal === goal
                                                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                                                                    : 'bg-white border-border-light text-indigo-400 hover:border-indigo-200'
                                                                            }`}
                                                                        >
                                                                            {goal}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <p className="text-[12px] text-indigo-400 font-medium italic animate-in fade-in duration-300">
                                                                    {optimizationGoal === 'balanced' && 'Optimizes for a mix of speed and resource efficiency.'}
                                                                    {optimizationGoal === 'performance' && 'Prioritizes execution speed, potentially using more compute resources.'}
                                                                    {optimizationGoal === 'cost' && 'Focuses on minimizing credit consumption and resource usage.'}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-start gap-3 text-[11px] text-indigo-500 font-bold uppercase tracking-wider leading-relaxed pt-2 border-t border-indigo-50">
                                                                <IconInfo className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                                <span>Use Cortex AI to automatically generate the necessary SQL to implement this recommendation.</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Code Generation & Execution Section */
                                                        <div className="space-y-6">
                                                            {isGeneratingCode && (
                                                                <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-[24px] border border-indigo-100 border-dashed shadow-sm">
                                                                    <IconRefresh className="w-10 h-10 text-indigo-500 animate-spin" />
                                                                    <p className="text-sm font-bold text-indigo-700">Cortex AI is generating optimized code...</p>
                                                                </div>
                                                            )}

                                                            {generatedCode && !isGeneratingCode && (
                                                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                                    <div className="bg-[#1E1E2D] rounded-[24px] border border-slate-800 overflow-hidden shadow-2xl">
                                                                        <div className="flex items-center justify-between px-6 py-3 bg-slate-800/50 border-b border-slate-700">
                                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Optimized Snowflake SQL</span>
                                                                            <button 
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(generatedCode);
                                                                                    setIsPromptCopied(true);
                                                                                    setTimeout(() => setIsPromptCopied(false), 2000);
                                                                                }}
                                                                                className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                                                                            >
                                                                                {isPromptCopied ? <IconCheck className="w-3 h-3" /> : <IconClipboardCopy className="w-3 h-3" />}
                                                                                {isPromptCopied ? 'Copied!' : 'Copy Code'}
                                                                            </button>
                                                                        </div>
                                                                        <div className="p-6">
                                                                            <textarea 
                                                                                value={generatedCode}
                                                                                onChange={(e) => setGeneratedCode(e.target.value)}
                                                                                className="w-full min-h-[250px] bg-transparent text-[14px] font-mono text-indigo-300 leading-relaxed whitespace-pre-wrap break-all outline-none resize-y border-none p-0 focus:ring-0 no-scrollbar"
                                                                                spellCheck={false}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <div className="flex items-center gap-2 text-[11px] text-indigo-500 font-bold uppercase tracking-wider">
                                                                            <IconInfo className="w-4 h-4" />
                                                                            Verify the generated code before running it in Snowflake.
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            {executionStatus === 'success' ? (
                                                                                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-sm font-bold animate-in zoom-in duration-300">
                                                                                    <IconCheckCircle className="w-5 h-5" />
                                                                                    Executed Successfully
                                                                                </div>
                                                                            ) : (
                                                                                <button 
                                                                                    onClick={() => setShowConfirmation(true)}
                                                                                    disabled={isExecuting}
                                                                                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                                                                >
                                                                                    {isExecuting ? (
                                                                                        <IconRefresh className="w-4 h-4 animate-spin" />
                                                                                    ) : (
                                                                                        <IconPlay className="w-4 h-4" />
                                                                                    )}
                                                                                    {isExecuting ? 'Running in Snowflake...' : 'Run in Snowflake'}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {executionStatus === 'success' && executionTime && (
                                            <div className="flex gap-6 relative animate-in fade-in slide-in-from-top-4 duration-700">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                                                    <IconCheckCircle className="w-4 h-4" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted">Step 4: Execution Audit</h4>
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                            {executionTime}
                                                        </span>
                                                    </div>
                                                    <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100 flex items-center justify-between shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                                <IconCheck className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">Executed Details</h4>
                                                                <p className="text-emerald-900 text-sm font-bold mt-1">
                                                                    Successfully implemented via Snowflake Cortex
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-1.5 bg-emerald-600 text-white text-[11px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100">
                                                            -anavsan
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!recommendation && !assignment.message && !assignment.engineerResponse && (
                                            <div className="py-8 text-center">
                                                <p className="text-text-muted font-medium">No activity history available for this task.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column: Metadata & Assignment Info */}
                        <div className="xl:col-span-4 space-y-6">
                            {/* Assignment Info Card */}
                            <div className="bg-white p-4 rounded-[24px] border border-border-light shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Assignment Info</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Assigned To
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">{assignment.assignedTo}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            <IconClock className="w-3 h-3" />
                                            Assigned On
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">
                                            {new Date(assignment.assignedOn).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Priority
                                        </span>
                                        <div className="mt-1.5">
                                            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-tight ${priorityColors[assignment.priority]}`}>
                                                {assignment.priority} Priority
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Status
                                        </span>
                                        <div className="mt-1.5 flex items-center justify-between">
                                            <StatusBadge status={assignment.status} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Current Spend
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">{assignment.credits.toFixed(2)} cr</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resource Metadata Card */}
                            <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm space-y-8">
                                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Resource Metadata</h4>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            <IconUser className="w-3 h-3" />
                                            User
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">{recommendation?.userName || 'mike_de'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Account
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">{recommendation?.accountName || 'Account B'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Resource Type
                                        </span>
                                        <span className="text-sm font-black text-text-primary mt-1.5 leading-tight">{recommendation?.resourceType || 'Query'}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Severity
                                        </span>
                                        <div className="mt-1.5">
                                            <SeverityBadge severity={recommendation?.severity || 'High'} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Resource Identifier
                                        </span>
                                        <button 
                                            onClick={() => onNavigateToQuery?.({ id: assignment.queryId })}
                                            className="text-sm font-black text-primary mt-1.5 leading-tight hover:underline text-left"
                                        >
                                            {assignment.queryId}
                                        </button>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            Warehouse
                                        </span>
                                        <button 
                                            onClick={() => onNavigateToWarehouse?.({ name: assignment.warehouse })}
                                            className="text-sm font-black text-primary mt-1.5 leading-tight hover:underline text-left"
                                        >
                                            {assignment.warehouse}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal Overlay */}
            {showConfirmation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-border-light w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <IconExclamationTriangle className="w-6 h-6" />
                                </div>
                                <button 
                                    onClick={() => setShowConfirmation(false)}
                                    className="text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <IconClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-text-strong tracking-tight">Confirm Execution</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    You are about to execute the generated SQL code directly in your Snowflake environment. This action may modify your warehouse configuration or data.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-border-light">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Target Warehouse</p>
                                <p className="text-sm font-bold text-text-primary">{assignment.warehouse || 'COMPUTE_WH'}</p>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button 
                                    onClick={handleRunInSnowflake}
                                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
                                >
                                    Yes, Run in Snowflake
                                </button>
                                <button 
                                    onClick={() => setShowConfirmation(false)}
                                    className="w-full py-4 bg-white text-text-secondary font-bold rounded-2xl border border-border-color hover:bg-slate-50 transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-border-light animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-text-strong tracking-tight mb-2">Update Task Status</h3>
                        <p className="text-sm text-text-secondary mb-6 font-medium">
                            Select the new status for this task and provide details if required.
                        </p>
                        
                        <div className="space-y-6">
                            {/* Status Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Select Status</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(['In progress', 'Optimized', 'Cannot be optimized'] as AssignmentStatus[]).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setPendingStatus(status)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                                                pendingStatus === status 
                                                ? 'border-primary bg-primary/5 text-primary' 
                                                : 'border-border-color bg-surface-nested text-text-secondary hover:border-border-strong'
                                            }`}
                                        >
                                            <span className="text-sm font-bold">{status}</span>
                                            {pendingStatus === status && <IconCheck className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Message Input */}
                            {(pendingStatus === 'Optimized' || pendingStatus === 'Cannot be optimized') && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block">Update Message (Required)</label>
                                    <textarea 
                                        value={statusDescription}
                                        onChange={(e) => setStatusDescription(e.target.value)}
                                        placeholder={pendingStatus === 'Optimized' ? "Describe the optimizations implemented..." : "Explain why this query cannot be optimized..."}
                                        className="w-full bg-surface-nested border border-border-color rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[120px] no-scrollbar"
                                    />
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-6 py-3 bg-white text-text-secondary border border-border-color font-bold text-sm rounded-full hover:bg-surface-hover transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmStatusUpdate}
                                    disabled={!pendingStatus || ((pendingStatus === 'Optimized' || pendingStatus === 'Cannot be optimized') && !statusDescription.trim())}
                                    className="flex-1 px-6 py-3 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    Confirm Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedQueryDetailView;
