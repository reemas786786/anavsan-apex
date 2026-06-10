
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
  MoreVertical,
  Mail,
  Slack,
  FileText,
  Upload,
  Sparkles,
  Info as IconInfo,
  Search as IconSearch
} from 'lucide-react';

import MultiSelectDropdown from '../components/MultiSelectDropdown';
import ConfirmationModal from '../components/ConfirmationModal';

const SummaryPill: React.FC<{ 
  label: string; 
  value: string; 
  dotColor?: string;
  icon?: React.ReactNode;
}> = ({ label, value, dotColor, icon }) => (
  <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30 group">
      {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
      {icon && <div className="text-primary">{icon}</div>}
      <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
      <span className="text-[13px] font-black whitespace-nowrap text-text-strong">{value}</span>
  </div>
);

const data = [
  { name: 'Mar 1', actual: 400, predicted: 400 },
  { name: 'Mar 5', actual: 1200, predicted: 1200 },
  { name: 'Mar 10', actual: 2800, predicted: 2800 },
  { name: 'Mar 15', actual: 4500, predicted: 4500 },
  { name: 'Mar 20', actual: 6200, predicted: 6200 },
  { name: 'Mar 25', actual: 8240, predicted: 8240 },
  { name: 'Mar 30', actual: null, predicted: 11800 },
];

const globalData = [
  { name: 'Mar 1', actual: 2000, predicted: 2000 },
  { name: 'Mar 5', actual: 8000, predicted: 8000 },
  { name: 'Mar 10', actual: 15000, predicted: 15000 },
  { name: 'Mar 15', actual: 22000, predicted: 22000 },
  { name: 'Mar 20', actual: 31000, predicted: 31000 },
  { name: 'Mar 25', actual: 41000, predicted: 41000 },
  { name: 'Mar 30', actual: null, predicted: 52000 },
];

const budgets = [
  {
    id: 1,
    name: "Production ETL budget",
    description: "Monitoring compute spend for the core production data pipelines.",
    scope: "Account",
    scopeName: "Finance-Prod",
    period: "Monthly",
    duration: "Mar 1 - Mar 31",
    progress: 65,
    status: "Notify at 50%, 80%, 100%",
    color: "amber",
    budget: 10000,
    current: 8240,
    projected: 11800,
    forecast: "Within limit",
    notifications: ['slack', 'email'],
    hasOptimization: true
  },
  {
    id: 2,
    name: "Global monthly budget",
    description: "Overall organization-wide Snowflake credit consumption limit.",
    scope: "Global",
    scopeName: "Organization",
    period: "Monthly",
    duration: "Mar 1 - Mar 31",
    progress: 82,
    status: "Critical: Approaching 100%",
    color: "red",
    budget: 50000,
    current: 41000,
    projected: 52000,
    forecast: "Exceeds on Mar 28",
    notifications: ['slack', 'email'],
    hasOptimization: true
  },
  {
    id: 3,
    name: "Marketing analytics cap",
    description: "Budget for the marketing business intelligence dashboards.",
    scope: "App",
    scopeName: "Marketing-BI",
    period: "Monthly",
    duration: "Mar 1 - Mar 31",
    progress: 24,
    status: "Healthy",
    color: "green",
    budget: 5000,
    current: 1200,
    projected: 4800,
    forecast: "Within limit",
    notifications: ['email'],
    hasOptimization: false
  }
];

const recentAlerts = [
  {
    id: 1,
    timestamp: "2026-03-25 09:12",
    level: "Critical",
    scope: "Finance-Prod",
    fix: "Optimize ETL query #442"
  },
  {
    id: 2,
    timestamp: "2026-03-24 18:45",
    level: "Warning",
    scope: "Marketing-BI",
    fix: "Resize warehouse WH_SMALL"
  },
  {
    id: 3,
    timestamp: "2026-03-24 14:20",
    level: "Warning",
    scope: "Global",
    fix: "Review unused tables"
  }
];

interface BudgetsAndAlertsProps {
  onSetNewBudget: () => void;
  onImportBudget: () => void;
  onEditBudget: (budget: any) => void;
  selectedBudget: typeof budgets[0] | null;
  onSelectBudget: (budget: typeof budgets[0] | null) => void;
  onNavigate: (page: any, subPage?: string, additionalState?: any) => void;
}

const BudgetsAndAlerts: React.FC<BudgetsAndAlertsProps> = ({ onSetNewBudget, onImportBudget, onEditBudget, selectedBudget, onSelectBudget, onNavigate }) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [scopeFilter, setScopeFilter] = useState<string[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Breakdown filters
  const [breakdownSearch, setBreakdownSearch] = useState('');
  const [breakdownTypeFilter, setBreakdownTypeFilter] = useState<string[]>([]);
  const [breakdownAccountFilter, setBreakdownAccountFilter] = useState<string[]>([]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                           g.scopeName.toLowerCase().includes(search.toLowerCase());
      const matchesScope = scopeFilter.length === 0 || scopeFilter.includes(g.scope);
      const matchesPeriod = periodFilter.length === 0 || periodFilter.includes(g.period);
      const matchesStatus = statusFilter.length === 0 || (
        statusFilter.includes('Healthy') && g.color === 'green' ||
        statusFilter.includes('At Risk') && g.color !== 'green'
      );

      return matchesSearch && matchesScope && matchesPeriod && matchesStatus;
    });
  }, [search, scopeFilter, periodFilter, statusFilter]);

  if (selectedBudget) {
    return (
      <div className="p-4 max-w-7xl mx-auto space-y-4 animate-in slide-in-from-right-4 duration-500">
        {/* Detail Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">{selectedBudget.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedBudget.color === 'green' ? 'bg-green-50 text-green-700' :
                  selectedBudget.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {selectedBudget.status}
                </span>
              </div>
              <p className="text-text-secondary mt-1 text-lg">
                Monitoring scope: <span className="font-bold text-text-primary">{selectedBudget.scope}: {selectedBudget.scopeName}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-border-light font-bold text-sm hover:bg-surface-hover transition-colors">
                Edit budget
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors shadow-sm">
                Optimize now
              </button>
            </div>
          </div>
        </div>

        {/* Budget Specific Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border-light p-4 rounded-xl shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total monthly budget</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary">
                {typeof selectedBudget.budget === 'number' ? `$${selectedBudget.budget.toLocaleString()}` : selectedBudget.budget}
              </span>
            </div>
            <div className="mt-3 h-1 w-full bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full opacity-20" />
            </div>
          </div>

          <div className="bg-surface border border-border-light p-4 rounded-xl shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Current spend</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary">${selectedBudget.current.toLocaleString()}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                selectedBudget.progress > 80 ? 'bg-red-50 text-red-600' : 
                selectedBudget.progress > 50 ? 'bg-amber-50 text-amber-600' : 
                'bg-green-50 text-green-600'
              }`}>
                {selectedBudget.progress}%
              </span>
            </div>
            <div className="mt-3 h-1 w-full bg-surface-hover rounded-full overflow-hidden">
              <div className={`h-full ${
                selectedBudget.progress > 80 ? 'bg-red-500' : 
                selectedBudget.progress > 50 ? 'bg-amber-500' : 
                'bg-green-500'
              }`} style={{ width: `${selectedBudget.progress}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-border-light p-4 rounded-xl shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Projected spend (AI)</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary">${selectedBudget.projected.toLocaleString()}</span>
              <span className={`text-[10px] font-black flex items-center gap-0.5 ${
                selectedBudget.projected > selectedBudget.budget ? 'text-red-600' : 'text-green-600'
              }`}>
                {selectedBudget.projected > selectedBudget.budget ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {selectedBudget.projected > selectedBudget.budget ? 'Over' : 'Within'}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-text-secondary font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>AI Forecasted</span>
            </div>
          </div>

          <div className="bg-surface border border-border-light p-4 rounded-xl shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Balance credits</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-text-primary">12,450</span>
              <span className="text-[10px] font-black text-text-muted uppercase">Credits</span>
            </div>
            <div className="mt-3 h-1 w-full bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4" />
            </div>
          </div>
        </div>

        {/* Burn Velocity Chart */}
        <div className="bg-surface border border-border-light p-8 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Burn velocity</h2>
              <p className="text-sm text-text-secondary">Actual vs. Predicted spend for this budget</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-primary/20">
              <Zap className="w-4 h-4" />
              AI Insight: {selectedBudget.progress > 80 ? 'High velocity detected. Recommend resizing WH_PROD.' : 'Spend is stable and following historical patterns.'}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <ReferenceLine 
                  y={typeof selectedBudget.budget === 'number' ? selectedBudget.budget : parseInt(selectedBudget.budget.toString().replace(/[$,]/g, ''))} 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  label={{ 
                    value: `Budget: ${selectedBudget.budget}`, 
                    position: 'right', 
                    fill: '#EF4444', 
                    fontSize: 10, 
                    fontWeight: 'bold',
                    dy: -10
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  connectNulls
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorPredicted)" 
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm font-medium text-text-secondary">Actual spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-dashed border-primary" />
              <span className="text-sm font-medium text-text-secondary">AI predicted spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0 border-t-2 border-dashed border-red-500" />
              <span className="text-sm font-medium text-text-secondary">Budget</span>
            </div>
          </div>
        </div>

        {/* Consumption Breakdown Table */}
        <div className="bg-surface border border-border-light rounded-2xl shadow-sm overflow-hidden">
          {/* Breakdown Toolbar */}
          <div className="px-8 py-4 border-b border-border-light flex items-center justify-between bg-surface-nested/30">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Type:</span>
                <MultiSelectDropdown 
                  label="All" 
                  options={['Warehouse', 'Service', 'Data Ingestion', 'Storage']} 
                  selectedOptions={breakdownTypeFilter} 
                  onChange={setBreakdownTypeFilter} 
                  selectionMode="single"
                  layout="inline"
                />
              </div>
              <div className="w-px h-3 bg-border-color"></div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Account:</span>
                <MultiSelectDropdown 
                  label="All" 
                  options={['Finance-Prod', 'Marketing-BI', 'Data-Eng']} 
                  selectedOptions={breakdownAccountFilter} 
                  onChange={setBreakdownAccountFilter} 
                  selectionMode="single"
                  layout="inline"
                />
              </div>
            </div>
            <div className="relative w-64">
              <IconSearch className="h-3.5 w-3.5 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="search" 
                value={breakdownSearch}
                onChange={e => setBreakdownSearch(e.target.value)}
                placeholder="Filter resources..." 
                className="w-full bg-white border border-border-light rounded-lg py-1.5 pl-3 pr-9 text-xs font-medium focus:ring-1 focus:ring-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface-nested border-b border-border-light">
                <tr>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px]">Resource / Service</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px]">Type</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px]">Account</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px]">Usage</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px]">Cost</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px] text-right">Budget %</th>
                  <th className="px-8 py-4 font-bold text-text-strong uppercase tracking-wider text-[11px] text-right">Insights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {[
                  { name: 'WH_PROD_LARGE', type: 'Warehouse', account: 'Finance-Prod', usage: '1,240 Credits', cost: 4960, trend: 'up', percent: 45, insight: 'Resize recommended' },
                  { name: 'Cloud Services', type: 'Service', account: 'Finance-Prod', usage: '450 Credits', cost: 1800, trend: 'down', percent: 16, insight: 'Optimal' },
                  { name: 'WH_ANALYTICS', type: 'Warehouse', account: 'Marketing-BI', usage: '320 Credits', cost: 1280, trend: 'up', percent: 12, insight: 'High spillover' },
                  { name: 'Snowpipe', type: 'Data Ingestion', account: 'Data-Eng', usage: '180 Credits', cost: 720, trend: 'stable', percent: 7, insight: 'Optimal' },
                  { name: 'Materialized Views', type: 'Storage', account: 'Finance-Prod', usage: '120 Credits', cost: 480, trend: 'up', percent: 4, insight: 'Review frequency' },
                ].filter(item => {
                  if (breakdownSearch && !item.name.toLowerCase().includes(breakdownSearch.toLowerCase())) return false;
                  if (breakdownTypeFilter.length > 0 && !breakdownTypeFilter.includes(item.type)) return false;
                  if (breakdownAccountFilter.length > 0 && !breakdownAccountFilter.includes(item.account)) return false;
                  return true;
                }).map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-nested transition-colors">
                    <td className="px-8 py-4 font-bold text-text-primary">{item.name}</td>
                    <td className="px-8 py-4 text-text-secondary font-medium">{item.type}</td>
                    <td className="px-8 py-4 text-text-secondary font-medium">{item.account}</td>
                    <td className="px-8 py-4 text-text-secondary font-medium">{item.usage}</td>
                    <td className="px-8 py-4 font-black text-text-strong">${item.cost.toLocaleString()}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-bold text-text-primary">{item.percent}%</span>
                        <div className="w-24 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                          <div className={`h-full ${
                            item.percent > 80 ? 'bg-red-500' : 
                            item.percent > 50 ? 'bg-amber-500' : 
                            'bg-primary'
                          }`} style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end">
                        {item.insight !== 'Optimal' ? (
                          <button 
                            onClick={() => onNavigate('Recommendations', undefined, { filters: { search: item.name } })}
                            className="inline-flex items-center gap-1.5 bg-[#6A38EB] text-white px-3 py-1.5 rounded-full hover:bg-[#5829D6] transition-all shadow-md active:scale-95 group/insight"
                          >
                            <span className="text-[12px] font-black">2</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Insights</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600 font-bold text-[11px] uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Optimal</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Budgets & alerts</h1>
          <div className="flex items-center gap-2 mt-1 text-text-secondary">
            <span className="text-lg">Last update: Mar 25, 08:00 AM</span>
            <div className="group relative">
              <IconInfo className="w-4 h-4 text-text-muted cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-text-primary text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed">
                Data is synchronized with Snowflake every 6 hours. Last fetch completed at Mar 25, 08:00 AM.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Summary Pills - Resource Summary Style */}
      <div className="flex flex-wrap items-center gap-3 mb-2 overflow-x-auto no-scrollbar flex-shrink-0">
        <SummaryPill 
          label="Total Budgets" 
          value={budgets.length.toString()} 
        />
        <SummaryPill 
          label="Healthy" 
          value={budgets.filter(g => g.color === 'green').length.toString()} 
          dotColor="bg-green-500"
        />
        <SummaryPill 
          label="At Risk" 
          value={budgets.filter(g => g.color !== 'green').length.toString()} 
          dotColor="bg-amber-500"
        />
        <div className="ml-auto flex items-center gap-3">
          <SummaryPill 
            label="AI Optimizations" 
            value={budgets.filter(g => g.hasOptimization).length.toString()} 
            icon={<Sparkles className="w-3.5 h-3.5" />}
          />
          <SummaryPill 
            label="Balance Credits" 
            value="12,450" 
            icon={<Zap className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Active Budgets Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border-light flex flex-col min-h-0">
        {/* Filter Bar */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border-light bg-white relative z-20">
          <div className="flex items-center gap-6 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="text-text-muted font-medium">Scope:</span>
              <MultiSelectDropdown 
                label="All" 
                options={['Global', 'Account', 'App']} 
                selectedOptions={scopeFilter} 
                onChange={setScopeFilter} 
                selectionMode="single"
                layout="inline"
              />
            </div>

            <div className="w-px h-3 bg-border-color hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-text-muted font-medium">Period:</span>
              <MultiSelectDropdown 
                label="All" 
                options={['Monthly', 'Quarterly', 'Yearly']} 
                selectedOptions={periodFilter} 
                onChange={setPeriodFilter} 
                selectionMode="single"
                layout="inline"
              />
            </div>

            <div className="w-px h-3 bg-border-color hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-text-muted font-medium">Status:</span>
              <MultiSelectDropdown 
                label="All" 
                options={['Healthy', 'At Risk']} 
                selectedOptions={statusFilter} 
                onChange={setStatusFilter} 
                selectionMode="single"
                layout="inline"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-grow max-w-xs">
              <IconSearch className="h-4 w-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="search" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search budgets..." 
                className="w-full bg-[#F2F4F7] border-none rounded-lg py-2 pl-4 pr-10 text-[13px] font-medium focus:ring-1 focus:ring-primary placeholder:text-text-muted"
              />
            </div>
            <button 
              onClick={onImportBudget}
              className="px-4 py-2 rounded-lg border border-border-light font-bold text-[13px] text-text-primary hover:bg-surface-hover transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button 
              onClick={onSetNewBudget}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-all shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Set new budget
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-[13px] text-left border-separate border-spacing-0">
            <thead className="bg-[#E0E2E5] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Name</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Scope</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Period</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Duration</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Budget status</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Notifications</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredBudgets.length > 0 ? filteredBudgets.map((rule) => (
                <tr 
                  key={rule.id} 
                  onClick={() => onSelectBudget(rule)}
                  className="hover:bg-surface-nested transition-colors cursor-pointer group border-b border-border-light"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{rule.name}</span>
                      <div className="group/note relative">
                        <FileText className="w-3.5 h-3.5 text-text-muted hover:text-primary transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-text-primary text-white text-[10px] rounded shadow-xl opacity-0 group-hover/note:opacity-100 pointer-events-none transition-opacity z-10">
                          {rule.description}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-text-primary" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rule.scope === 'Global' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      rule.scope === 'Account' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {rule.scope}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium text-text-secondary">
                    {rule.period}
                  </td>
                  <td className="px-6 py-5 font-medium text-text-secondary">
                    {rule.duration}
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-40 space-y-1.5">
                      <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            rule.color === 'green' ? 'bg-green-500' :
                            rule.color === 'amber' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${rule.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-text-muted">{rule.progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {rule.notifications.includes('slack') && <Slack className="w-4 h-4 text-text-muted" />}
                      {rule.notifications.includes('email') && <Mail className="w-4 h-4 text-text-muted" />}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {rule.hasOptimization && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle optimization
                          }}
                          className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded transition-all border border-primary/10"
                        >
                          <Sparkles className="w-3 h-3" />
                          OPTIMIZE
                        </button>
                      )}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === rule.id ? null : rule.id);
                          }}
                          className="p-1 hover:bg-surface-hover rounded transition-colors text-text-muted"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuId === rule.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-border-light z-40 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditBudget(rule);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-[13px] font-bold text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBudgetToDelete(rule);
                                  setIsDeleteModalOpen(true);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-4 border border-border-light">
                        <IconSearch className="w-8 h-8 text-text-muted" />
                      </div>
                      <h3 className="text-base font-bold text-text-strong">No budgets found</h3>
                      <p className="text-sm text-text-secondary mt-1 max-w-sm">Try adjusting your filters or search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border-light flex flex-col min-h-0">
        <div className="p-6 border-b border-border-light flex justify-between items-center bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-text-primary">Recent alerts feed</h2>
          <button className="text-sm font-bold text-primary hover:underline">View all alerts</button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-[13px] text-left border-separate border-spacing-0">
            <thead className="bg-[#E0E2E5] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Timestamp</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Alert level</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">Scope</th>
                <th className="px-6 py-4 font-bold text-text-strong tracking-tight uppercase text-[11px]">The Anavsan fix</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {recentAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-surface-nested transition-colors border-b border-border-light">
                  <td className="px-6 py-5 text-text-secondary font-medium">{alert.timestamp}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      alert.level === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {alert.level}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-semibold text-text-primary">{alert.scope}</td>
                  <td className="px-6 py-5">
                    <button className="text-sm font-bold text-primary flex items-center gap-1 group">
                      <Zap className="w-4 h-4" />
                      {alert.fix}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBudgetToDelete(null);
        }}
        onConfirm={() => {
          console.log('Deleting budget:', budgetToDelete?.id);
          setIsDeleteModalOpen(false);
          setBudgetToDelete(null);
          // In a real app, we would call a delete API here
        }}
        title="Delete budget"
        message={
          <span>
            Are you sure you want to delete <span className="font-bold text-text-primary">{budgetToDelete?.name}</span>? 
            This action cannot be undone and will stop all monitoring for this scope.
          </span>
        }
        confirmText="Delete budget"
        confirmVariant="danger"
      />
    </div>
  );
};

export default BudgetsAndAlerts;
