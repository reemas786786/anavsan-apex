
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DashboardItem, Widget, Account, WidgetType } from '../types';
import { availableWidgetsData, overviewMetrics, accountSpend, costBreakdownData, accountCostBreakdown } from '../data/dummyData';
import { IconAdd, IconSearch, IconClose, IconChevronDown, IconCheck } from '../constants';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

// --- ICONS ---
const IconBox = ({ className }: { className?: string }) => (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15L15 32.5V67.5L50 85L85 67.5V32.5L50 15Z" fill="#E2E2E2" />
        <path d="M50 15L15 32.5L50 50L85 32.5L50 15Z" fill="#D1D1D1" />
        <path d="M50 50V85L15 67.5V32.5L50 50Z" fill="#C4C4C4" />
        <path d="M65 32.5L65 47.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 32.5L35 47.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// --- DUMMY CHART PREVIEWS ---
const dummyLineData = [
    { name: '1', value: 40 }, { name: '2', value: 30 }, { name: '3', value: 60 }, { name: '4', value: 45 },
];

const DummyPreviewChart: React.FC<{ type: WidgetType }> = ({ type }) => {
    if (type === 'StatCard') {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-1">
                <div className="text-xl font-black text-text-strong">$12,500</div>
                <div className="w-16 h-1 bg-primary/20 rounded-full" />
                <div className="w-10 h-1 bg-primary/10 rounded-full" />
            </div>
        );
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyLineData}>
                <Bar dataKey="value" fill="#6932D5" opacity={0.3} radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

// --- RENDERERS ---
const RealTotalSpend: React.FC<{ dataSource: Widget['dataSource'] }> = ({ dataSource }) => {
    const isOverall = dataSource.type === 'overall';
    const value = isOverall ? overviewMetrics.cost.current : accountSpend.cost.monthly;
    return (
        <div className="p-4 h-full flex flex-col justify-center">
            <p className="text-text-secondary text-sm font-medium">{isOverall ? 'Total Organization Spend' : 'Account Current Spend'}</p>
            <div className="text-3xl font-black text-text-strong mt-1">${value.toLocaleString()}</div>
        </div>
    );
};

const RealSpendBreakdown: React.FC<{ dataSource: Widget['dataSource'] }> = ({ dataSource }) => {
    const data = dataSource.type === 'account' ? accountCostBreakdown : costBreakdownData;
    return (
        <div className="space-y-3 p-4 h-full flex flex-col justify-center">
            {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-bold text-text-secondary">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-text-strong">${item.cost.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

const DashboardWidgetRenderer: React.FC<{ widget: Widget }> = ({ widget }) => {
    switch (widget.widgetId) {
        case 'total-spend': return <RealTotalSpend dataSource={widget.dataSource} />;
        case 'spend-breakdown': return <RealSpendBreakdown dataSource={widget.dataSource} />;
        default: return <div className="h-full flex items-center justify-center p-8 opacity-20"><DummyPreviewChart type={widget.type} /></div>;
    }
};

// --- MAIN COMPONENT ---
interface DashboardEditorProps {
    dashboard: DashboardItem | null;
    accounts: Account[];
    onSave: (dashboard: DashboardItem) => void;
    onCancel: () => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ dashboard, accounts, onSave, onCancel }) => {
    const [editedDashboard, setEditedDashboard] = useState<DashboardItem>(
        dashboard || {
            id: `temp-${Date.now()}`,
            title: 'Untitled Dashboard',
            description: '',
            createdOn: new Date().toLocaleDateString(),
            widgets: [],
            dataSourceContext: { type: 'overall' },
        }
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [viewType, setViewType] = useState<'overall' | 'account'>('overall');
    const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
    const [sortBy, setSortBy] = useState('Recommended');
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const accountDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
                setIsAccountDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddWidget = (widgetTemplate: Omit<Widget, 'id' | 'dataSource'>) => {
        const newWidgetInstance: Widget = {
            ...widgetTemplate,
            id: `inst-${Date.now()}-${Math.random()}`,
            dataSource: viewType === 'overall' ? { type: 'overall' } : { type: 'account', accountId: selectedAccountId },
        };
        setEditedDashboard(prev => ({ ...prev, widgets: [...prev.widgets, newWidgetInstance] }));
    };

    const handleRemoveWidget = (widgetId: string) => {
        setEditedDashboard(prev => ({ ...prev, widgets: prev.widgets.filter(w => w.id !== widgetId) }));
    };

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newWidgets = [...editedDashboard.widgets];
        const draggedItemContent = newWidgets.splice(dragItem.current, 1)[0];
        newWidgets.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setEditedDashboard(prev => ({ ...prev, widgets: newWidgets }));
    };

    const filteredWidgets = useMemo(() => {
        return availableWidgetsData.filter(widget => 
            widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            widget.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const selectedAccountName = accounts.find(a => a.id === selectedAccountId)?.name || 'Select Account';

    return (
        <div className="flex flex-col bg-[#F4F1F9] h-full overflow-hidden">
            {/* 1. Header Area */}
            <header className="bg-white p-4 flex items-center justify-between border-b border-border-light flex-shrink-0 z-20">
                <div className="flex-grow max-w-xl">
                    <input
                        type="text"
                        value={editedDashboard.title}
                        onChange={(e) => setEditedDashboard({ ...editedDashboard, title: e.target.value })}
                        className="text-2xl font-black text-sidebar-topbar bg-transparent focus:outline-none w-full border-none p-0 tracking-tight"
                        placeholder="Untitled Dashboard"
                    />
                    <input
                        type="text"
                        value={editedDashboard.description || ''}
                        onChange={(e) => setEditedDashboard({ ...editedDashboard, description: e.target.value })}
                        className="text-sm text-text-muted w-full bg-transparent focus:outline-none border-none p-0 mt-0.5"
                        placeholder="Dashboard description (optional)"
                    />
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPreviewing(!isPreviewing)}
                            className={`${isPreviewing ? 'bg-status-success' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none`}
                        >
                            <span className={`${isPreviewing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm`} />
                        </button>
                        <span className="text-sm font-bold text-text-secondary">Preview</span>
                    </div>

                    <div className="h-6 w-px bg-border-light" />

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onSave(editedDashboard)}
                            className="px-8 py-2.5 bg-sidebar-topbar/5 text-text-muted font-bold text-sm rounded-xl border border-border-color shadow-sm hover:opacity-90 transition-all"
                        >
                            Save Dashboard
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className="flex-grow flex min-h-0">
                {/* Left Panel: Select views */}
                {!isPreviewing && (
                    <aside className="w-[360px] bg-white border-r border-border-light flex flex-col flex-shrink-0 shadow-sm">
                        <div className="p-4 space-y-4">
                            <h2 className="text-xl font-bold text-text-strong tracking-tight">Select views</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center bg-surface-nested p-1 rounded-full border border-border-light">
                                    <button
                                        onClick={() => setViewType('overall')}
                                        className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all ${viewType === 'overall' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                                    >
                                        Overall
                                    </button>
                                    <button
                                        onClick={() => setViewType('account')}
                                        className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all ${viewType === 'account' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                                    >
                                        Account
                                    </button>
                                </div>

                                {viewType === 'account' && (
                                    <div className="relative" ref={accountDropdownRef}>
                                        <button 
                                            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-border-light rounded-xl text-xs font-bold text-text-strong shadow-sm hover:border-primary/30 transition-all"
                                        >
                                            <span className="truncate">{selectedAccountName}</span>
                                            <IconChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isAccountDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border-color z-30 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-200">
                                                {accounts.map(acc => (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => { setSelectedAccountId(acc.id); setIsAccountDropdownOpen(false); }}
                                                        className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium hover:bg-primary/5 transition-colors ${selectedAccountId === acc.id ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary'}`}
                                                    >
                                                        <span className="truncate">{acc.name}</span>
                                                        {selectedAccountId === acc.id && <IconCheck className="w-3.5 h-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <div className="relative flex-grow">
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter views..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-surface-nested border border-border-light rounded-lg text-xs focus:ring-1 focus:ring-primary outline-none font-medium"
                                    />
                                </div>
                                <div className="relative">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-2 bg-surface-nested border border-border-light rounded-lg text-xs font-bold text-text-secondary focus:ring-1 focus:ring-primary outline-none"
                                    >
                                        <option>Sort by</option>
                                        <option>Newest</option>
                                        <option>Most Used</option>
                                    </select>
                                    <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto px-4 pb-4 flex flex-col gap-4 no-scrollbar">
                            {filteredWidgets.map(widget => (
                                <div key={widget.widgetId} className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:border-primary/30 transition-all group flex flex-col bg-[#F9F7FE]/50">
                                    <div className="p-4 relative">
                                        <button 
                                            onClick={() => handleAddWidget(widget as any)}
                                            className="absolute top-4 right-4 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <IconAdd className="w-5 h-5" />
                                        </button>
                                        <h4 className="text-[13px] font-bold text-text-strong pr-8">{widget.title}</h4>
                                        <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-medium line-clamp-2">
                                            {widget.description}
                                        </p>
                                    </div>
                                    <div className="h-28 bg-[#F9FAFB] border-t border-border-light p-4 relative">
                                        <div className="w-full h-full opacity-40">
                                            <DummyPreviewChart type={widget.type as WidgetType} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Right Area: Dashboard Canvas */}
                <main className="flex-1 overflow-y-auto bg-[#F4F1F9] p-4 no-scrollbar">
                    <div className={`h-full w-full rounded-[40px] border border-border-light flex flex-col ${editedDashboard.widgets.length === 0 ? 'items-center justify-center bg-white/50' : 'p-4'}`}>
                        {editedDashboard.widgets.length === 0 ? (
                            <div className="text-center p-8 animate-in fade-in duration-700">
                                <IconBox className="mb-6 mx-auto opacity-80" />
                                <h3 className="text-2xl font-black text-text-strong tracking-tight">Add views here</h3>
                                <p className="text-text-muted font-medium mt-2 max-w-sm mx-auto">
                                    Your dashboard is currently empty. Choose a view from the left panel to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                                {editedDashboard.widgets.map((widget, index) => (
                                    <div
                                        key={widget.id}
                                        draggable={!isPreviewing}
                                        onDragStart={() => (dragItem.current = index)}
                                        onDragEnter={() => (dragOverItem.current = index)}
                                        onDragEnd={handleDragSort}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`bg-white rounded-[32px] border border-border-light shadow-sm flex flex-col group relative overflow-hidden ${!isPreviewing ? 'cursor-move' : ''}`}
                                    >
                                        {!isPreviewing && (
                                            <button 
                                                onClick={() => handleRemoveWidget(widget.id)}
                                                className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full text-text-muted opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <IconClose className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="p-4 pb-2">
                                            <h4 className="text-base font-bold text-text-strong">{widget.title}</h4>
                                            <p className="text-[11px] text-text-muted font-medium mt-1">{widget.description}</p>
                                        </div>
                                        <div className="flex-grow min-h-[200px]">
                                            <DashboardWidgetRenderer widget={widget} />
                                        </div>
                                        <div className="px-4 py-4 bg-surface-nested border-t border-border-light flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${widget.dataSource.type === 'overall' ? 'bg-primary' : 'bg-status-success'}`} />
                                                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">
                                                    {widget.dataSource.type === 'overall' ? 'Organization Wide' : 'Account Specific'}
                                                </span>
                                            </div>
                                            {widget.dataSource.type === 'account' && (
                                                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                                    {accounts.find(a => a.id === (widget.dataSource as any).accountId)?.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardEditor;
