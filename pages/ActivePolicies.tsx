import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Bot, 
  User, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Database, 
  Zap, 
  CreditCard,
  AlertTriangle, 
  Trash2,
  Settings,
  Info,
  Clock,
  ArrowLeft,
  Sparkles,
  Calendar
} from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  targetScope: string;
  governanceMode: 'Autonomous' | 'Guided';
  lastExecution: string;
  status: 'Active' | 'Paused';
  // Relevant metrics requested by the user
  totalTriggersCount: number;
  creditsSaved: number;
  metricLabel: string;
  metricValue: string;
}

const mockPoliciesList: Policy[] = [
  {
    id: 'p1',
    name: 'Eliminate Vampire Burn (Idle Warehouse)',
    targetScope: 'Dev Warehouses',
    governanceMode: 'Autonomous',
    lastExecution: '2 mins ago',
    status: 'Active',
    totalTriggersCount: 142,
    creditsSaved: 485,
    metricLabel: 'Idle Suspend Rate',
    metricValue: '98.4%'
  },
  {
    id: 'p2',
    name: 'Prevent Million Dollar Query',
    targetScope: 'Analyst Role',
    governanceMode: 'Autonomous',
    lastExecution: '15 mins ago',
    status: 'Active',
    totalTriggersCount: 8,
    creditsSaved: 1200,
    metricLabel: 'Max Cost Limit',
    metricValue: '180 credits'
  },
  {
    id: 'p3',
    name: 'Surgical Rightsizing',
    targetScope: 'ETL Warehouses',
    governanceMode: 'Guided',
    lastExecution: '1 hour ago',
    status: 'Active',
    totalTriggersCount: 34,
    creditsSaved: 320,
    metricLabel: 'Avg Size Reduce',
    metricValue: '2.4x'
  },
  {
    id: 'p4',
    name: 'Storage Lifecycle Cleanup',
    targetScope: 'Staging Tables',
    governanceMode: 'Guided',
    lastExecution: 'Daily at 08:00',
    status: 'Active',
    totalTriggersCount: 91,
    creditsSaved: 154,
    metricLabel: 'Space Reclaimed',
    metricValue: '4.2 TB'
  },
  {
    id: 'p5',
    name: 'Cortex Spend Guardrail',
    targetScope: 'Marketing Account',
    governanceMode: 'Guided',
    lastExecution: '30 mins ago',
    status: 'Active',
    totalTriggersCount: 19,
    creditsSaved: 230,
    metricLabel: 'Spend Control cap',
    metricValue: '$1,200/mo'
  }
];

interface TriggerLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'Success' | 'Action Taken' | 'Pending Review' | 'Blocked';
  saving: string;
  details: string;
}

const mockTriggerLogs: Record<string, TriggerLog[]> = {
  p1: [
    {
      id: 'log-11',
      timestamp: 'June 08, 10:51 AM',
      action: 'Auto Suspended DEV_ANALYTICS_WH',
      status: 'Success',
      saving: '1.2 Credits/hr saved',
      details: 'Detected 10 minutes of complete inactivity. Automatically suspended compute node to stop idle burn.'
    },
    {
      id: 'log-12',
      timestamp: 'June 08, 09:14 AM',
      action: 'Auto Suspended COMPUTE_WH_DEV',
      status: 'Success',
      saving: '2.4 Credits/hr saved',
      details: 'Inactivity trigger threshold met (60s). Secondary developer warehouse has been auto-terminated.'
    },
    {
      id: 'log-13',
      timestamp: 'June 07, 04:30 PM',
      action: 'Auto Suspended SANDBOX_ENGINE_WH',
      status: 'Success',
      saving: '4.0 Credits/hr saved',
      details: 'No active connections/queries detected on Sandbox platform for over 15 minutes.'
    }
  ],
  p2: [
    {
      id: 'log-21',
      timestamp: 'June 08, 10:38 AM',
      action: 'Throttled Bad Join Query from Analyst',
      status: 'Blocked',
      saving: '120.5 Credits prevented',
      details: 'Query ID: sf-92a0d1b breached threshold cost rules. Terminated cross-join query automatically.'
    },
    {
      id: 'log-22',
      timestamp: 'June 05, 02:22 PM',
      action: 'Killed Infinite Loop Query on BI_WH',
      status: 'Blocked',
      saving: '45.0 Credits prevented',
      details: 'Query ID: sf-098c114 exceeded time-bound credit budget. Aborted to avoid severe cost overrun.'
    }
  ],
  p3: [
    {
      id: 'log-31',
      timestamp: 'June 08, 09:50 AM',
      action: 'Downsize Proposal: DAILY_LOAD_WH',
      status: 'Pending Review',
      saving: '16.0 Credits/day potential',
      details: 'CPU utilization averages under 4.2% for the past 7 daily load cycles. Recommending downsize Large → Medium.'
    },
    {
      id: 'log-32',
      timestamp: 'June 06, 11:00 AM',
      action: 'Downsize Approved: REPORTING_BIG_WH',
      status: 'Action Taken',
      saving: '8.0 Credits/hr saved',
      details: 'Admin user approved downsize request. Reconfigured reporting cluster size successfully.'
    }
  ],
  p4: [
    {
      id: 'log-41',
      timestamp: 'June 08, 08:00 AM',
      action: 'Archived Staging Tables under db_dev',
      status: 'Action Taken',
      saving: '1.2 TB storage optimized',
      details: 'Found 14 staging tables untouched for 120 days. Moved contents securely to cold archives.'
    },
    {
      id: 'log-42',
      timestamp: 'June 01, 08:00 AM',
      action: 'Cleanup Alert: db_staging_raw',
      status: 'Success',
      saving: '3.0 TB storage optimized',
      details: 'Completed scheduled monthly storage purge. Deleted transient schema backups active since Q3.'
    }
  ],
  p5: [
    {
      id: 'log-51',
      timestamp: 'June 08, 10:23 AM',
      action: 'Enforced Marketing Cap Guardrail',
      status: 'Action Taken',
      saving: '15.0 Credits throttled',
      details: 'Marketing campaign simulation warehouse reached its soft monthly cap of $1,200. Guided alert deployed.'
    },
    {
      id: 'log-52',
      timestamp: 'June 04, 05:10 PM',
      action: 'Throttled Adhoc Cortex ML Cluster',
      status: 'Blocked',
      saving: '60.0 Credits prevented',
      details: 'Terminated non-scheduled GPU-supported text-generation job on Snowflake. Breached marketing project allocations.'
    }
  ]
};

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);// --- COMPONENT: SPOTLIGHT POLICY CARD (ENFORCEMENT DESK DESIGN) ---
const PolicyCard: React.FC<{
  policy: Policy;
  isSelected?: boolean;
  onSettings: (policy: Policy) => void;
  onDelete: (id: string) => void;
}> = ({ policy, isSelected, onSettings, onDelete }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isAutonomous = policy.governanceMode === 'Autonomous';
  const hoverGlowColor = 'rgba(106, 56, 235, 0.08)';
  const activeHoverBorderClass = isSelected 
    ? 'border-[#6A38EB] shadow-[0_8px_30px_rgba(106,56,235,0.06)]' 
    : 'hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(106,56,235,0.06)]';

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.15 }}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all text-left h-full flex flex-col justify-between overflow-hidden ${
        isSelected ? 'border-[#6A38EB] ring-2 ring-[#6A38EB]/10' : 'border-slate-200 dark:border-slate-800'
      } ${activeHoverBorderClass}`}
    >
      {/* Enterprise Spotlight Cursor Tracker Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${hoverGlowColor}, transparent 80%)`,
        }}
      />

      <div className="p-4 pb-3 relative z-10 flex-grow">
        {/* Top Metadata */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-full bg-[#6A38EB]/10 border border-[#6A38EB]/20 flex items-center justify-center shadow-xs text-[#6A38EB] shrink-0">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold text-slate-400">Target scope</span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight mt-0.5">
                {policy.targetScope}
              </span>
            </div>
          </div>
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider ${
            policy.status === 'Active' 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' 
              : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${policy.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {policy.status}
          </span>
        </div>

        {/* Title and details */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
            {policy.name}
          </h3>

          {/* Relevant Metrics Grid Requested by User */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150/45 dark:border-slate-800/60 rounded-xl">
            <div className="flex flex-col justify-center">
              <span className="text-[14px] font-black text-slate-400">Occurrences</span>
              <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 mt-0.5">{policy.totalTriggersCount} runs</span>
            </div>
            <div className="flex flex-col justify-center border-l border-slate-150 dark:border-slate-800/70 pl-2">
              <span className="text-[14px] font-black text-slate-400">{policy.metricLabel ? (policy.metricLabel.charAt(0).toUpperCase() + policy.metricLabel.slice(1).toLowerCase()) : 'Kpi'}</span>
              <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-250 mt-0.5">{policy.metricValue}</span>
            </div>
            <div className="flex flex-col justify-center border-l border-slate-150 dark:border-slate-800/70 pl-2">
              <span className="text-[14px] font-black text-slate-400">Saved</span>
              <span className="text-[11.5px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{policy.creditsSaved} Cr.</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            {/* Governance Mode Card Detail */}
            {isAutonomous ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-bold rounded border uppercase tracking-wider bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30">
                <Bot className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Autonomous
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-bold rounded border uppercase tracking-wider bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-405 border-blue-200 dark:border-blue-900/30">
                <User className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                Guided
              </span>
            )}

            {/* Last Execution Card Detail */}
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-500">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last: {policy.lastExecution}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Block with Actions */}
      <div className="px-4 py-2.5 bg-slate-50/45 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between relative z-10">
        <span className="text-[14px] font-extrabold text-slate-450 leading-none">
          Enforcement desk
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSettings(policy);
            }}
            className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-[#6A38EB]/5 dark:hover:bg-slate-700/50 transition-all shadow-xs"
            title="Configure policy settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(policy.id);
            }}
            className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-rose-50 dark:hover:bg-rose-955 hover:border-rose-205 transition-all shadow-xs"
            title="Delete custom trigger"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};const ActivePolicies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPoliciesList);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('p1');
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wizardStep, setWizardStep] = useState<'gallery' | 'config'>('gallery');
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);
  const [governanceMode, setGovernanceMode] = useState<'Autonomous' | 'Guided'>('Autonomous');

  const blueprints = [
    {
      id: 'idle-guard',
      name: 'Warehouse Idle-Guard',
      description: 'Automatically suspend warehouses when they are not in use.',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      roi: 'High',
      roiColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'cost-cap',
      name: 'Query Cost Cap',
      description: 'Kill queries that exceed a specific credit threshold.',
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      roi: 'Medium',
      roiColor: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'janitor',
      name: 'Stale Data Janitor',
      description: 'Identify and archive tables that haven\'t been queried in 90 days.',
      icon: <Trash2 className="w-6 h-6 text-rose-500" />,
      roi: 'High',
      roiColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'custom',
      name: 'Custom Policy',
      description: 'Build your own logic from scratch using the condition builder.',
      icon: <Settings className="w-6 h-6 text-text-muted" />,
      roi: 'Variable',
      roiColor: 'text-text-muted bg-surface-subtle'
    }
  ];

  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.targetScope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenSidePanel = () => {
    setWizardStep('gallery');
    setSelectedBlueprint(null);
    setIsSidePanelOpen(true);
  };

  const handleSelectBlueprint = (id: string) => {
    setSelectedBlueprint(id);
    setWizardStep('config');
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (selectedPolicyId === id && filtered.length > 0) {
        setSelectedPolicyId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleActivateSkill = () => {
    if (!selectedBlueprint) return;
    const bp = blueprints.find(b => b.id === selectedBlueprint);
    if (!bp) return;

    const newPolId = `p-${Date.now()}`;
    const newPol: Policy = {
      id: newPolId,
      name: bp.name,
      targetScope: selectedBlueprint === 'idle-guard' ? 'COMPUTE_WH' : 'All warehouses',
      governanceMode: governanceMode,
      lastExecution: 'Just now',
      status: 'Active',
      totalTriggersCount: 0,
      creditsSaved: 0,
      metricLabel: selectedBlueprint === 'idle-guard' ? 'Idle Suspend Rate' : selectedBlueprint === 'cost-cap' ? 'Max Cost Limit' : selectedBlueprint === 'janitor' ? 'Space Reclaimed' : 'Impact',
      metricValue: selectedBlueprint === 'idle-guard' ? '100.0%' : selectedBlueprint === 'cost-cap' ? '0.0 credits' : selectedBlueprint === 'janitor' ? '0.0 TB' : 'N/A'
    };

    setPolicies([newPol, ...policies]);
    setSelectedPolicyId(newPolId); // Auto-focus on log list for newly created policy trigger
    setIsSidePanelOpen(false);
  };

  const renderLogContent = () => {
    const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
    if (!selectedPolicy) {
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[24px] p-8 text-center text-slate-400 dark:text-slate-500">
          <Info className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <p className="text-xs font-semibold leading-relaxed">Select a trigger from the left to view its execution occurrences audit logs.</p>
        </div>
      );
    }

    const logs = mockTriggerLogs[selectedPolicy.id] || [];

    return (
      <div className="space-y-4">
        {/* Event Meta Header (desktop only) */}
        <div className="hidden lg:flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-black text-[#6A38EB] dark:text-purple-400 bg-[#6A38EB]/5 dark:bg-[#6A38EB]/10 px-2.5 py-1 rounded-md">
              Trigger logs & audit
            </span>
            <span className="text-xs font-black text-slate-500">
              {logs.length} Events Recorded
            </span>
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 leading-tight">
            {selectedPolicy.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-500">
              Target Scope: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedPolicy.targetScope}</span>
            </span>
            <span className="text-slate-350 dark:text-slate-600">•</span>
            <span className="text-[11px] font-bold text-[#6A38EB] dark:text-purple-400 uppercase tracking-wide">
              {selectedPolicy.governanceMode} Mode
            </span>
          </div>
        </div>

        {/* Brand / Meta Subheader inside mobile Drawer Header displaying context */}
        <div className="lg:hidden">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
            {selectedPolicy.name}
          </h3>
          <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-500 font-medium pb-4 border-b border-slate-100 dark:border-slate-800">
            <span>Scope: <b className="text-slate-700 dark:text-slate-300">{selectedPolicy.targetScope}</b></span>
            <span>•</span>
            <span className="uppercase text-[#6A38EB] dark:text-purple-400 font-bold">{selectedPolicy.governanceMode} Mode</span>
          </div>
        </div>

        {/* Occurrence events log list */}
        <div className="space-y-3 max-h-[420px] lg:max-h-[500px] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No executions caught yet for this trigger.
            </div>
          ) : (
            logs.map((log) => {
              // Color schemes depending on status
              let statusBadgeClass = '';
              if (log.status === 'Success' || log.status === 'Action Taken') {
                statusBadgeClass = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
              } else if (log.status === 'Blocked') {
                statusBadgeClass = 'bg-rose-50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-450 border-rose-100 dark:border-rose-900/30';
              } else {
                statusBadgeClass = 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-[#E2B93B] border-amber-100 dark:border-amber-900/30';
              }

              return (
                <div 
                  key={log.id} 
                  className="group/log border border-slate-100 dark:border-slate-800/85 rounded-2xl p-4 bg-slate-50/25 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-205 dark:hover:border-slate-800 transition-all duration-200 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${statusBadgeClass}`}>
                      {log.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2 hover:text-[#6A38EB] dark:hover:text-purple-400 transition-colors leading-snug">
                    {log.action}
                  </h4>

                  <div className="bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-150 dark:border-slate-800 mt-2 text-[10px] font-black text-emerald-650 dark:text-emerald-400 inline-block">
                    {log.saving}
                  </div>

                  <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 mt-2.5 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100/50 dark:border-slate-850">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-bold text-text-strong tracking-tight flex items-center gap-2">
            Triggers <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/30 text-[#6A38EB] dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-900 shadow-sm">The Brain</span>
          </h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">
            Configure the logic engine to define what Snowflake efficiency violations look like.
          </p>
        </div>
        <button 
          onClick={handleOpenSidePanel}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6A38EB] hover:bg-[#582ed1] text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Create trigger</span>
        </button>
      </div>

      {/* Conceptual Explanation banner */}
      <div className="bg-gradient-to-r from-[#6A38EB]/5 to-[#5829D6]/5 dark:from-[#6A38EB]/10 dark:to-slate-900 border border-purple-100/80 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div className="space-y-1.5 md:border-r border-slate-200/60 dark:border-slate-800/80 md:pr-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-[#6A38EB]/10 text-[#6A38EB] text-[10px] font-black uppercase">Configuration</span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">The Logic Engine</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Define what a <b>violation</b> looks like. For example: <i>"If a warehouse sits idle for more than 5 minutes with zero connections, classify as a Vampire Burn."</i>
          </p>
        </div>

        <div className="space-y-1.5 md:border-r border-slate-200/60 dark:border-slate-800/80 md:pr-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase">Autonomous</span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Self-Healing Execution</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            If a violation triggers under <b>Autonomous Mode</b>, Anavsan immediately runs the corrective routine to fix it without requiring human validation.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">Guided</span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Human-In-The-Loop</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Under <b>Guided Mode</b>, violations generate smart insights and are dispatched to the <b>Enforcement Desk</b> for quick 1-click approvals.
          </p>
        </div>
      </div>

      {/* Top Pills */}
      <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
        <KPILabel label="Total Triggers" value={`${policies.length}`} />
        <KPILabel label="Autonomous" value={`${policies.filter(p => p.governanceMode === 'Autonomous').length}`} />
        <KPILabel label="Guided" value={`${policies.filter(p => p.governanceMode === 'Guided').length}`} />
        <KPILabel label="Total Actions Taken" value="1,284" />
      </div>

      {/* Search Bar header */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-xl border border-border-light shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <span className="text-[14px] font-bold text-text-muted">Active trigger rules</span>
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 cursor-text" />
          <input 
            type="text"
            placeholder="Search triggers..."
            className="pl-9 pr-4 py-2 border border-border-light rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder:text-text-muted w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all text-left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section with custom Trigger Occurrences Side Logs Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left pane: policy trigger grid list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPolicies.map((policy) => (
              <div 
                key={policy.id} 
                onClick={() => {
                  setSelectedPolicyId(policy.id);
                  setIsLogDrawerOpen(true);
                }}
                className="cursor-pointer font-sans"
              >
                <PolicyCard 
                  policy={policy} 
                  isSelected={selectedPolicyId === policy.id}
                  onSettings={(p) => {
                    setSelectedBlueprint(p.id);
                    setGovernanceMode(p.governanceMode);
                    setWizardStep('config');
                    setIsSidePanelOpen(true);
                  }}
                  onDelete={handleDeletePolicy}
                />
              </div>
            ))}
          </div>
          {filteredPolicies.length === 0 && (
            <div className="py-16 text-center text-text-muted text-sm font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-border-light dark:border-slate-850 shadow-sm">
              No policies found matching your search.
            </div>
          )}
        </div>

        {/* Right pane: list when the trigger happened with relevant details for log (Hidden on small screens, shown inline on desktop) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-5 shadow-sm space-y-4 sticky top-16">
            {renderLogContent()}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Bottom slide-up sheet drawer for logs */}
      <AnimatePresence>
        {isLogDrawerOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[48] lg:hidden"
            />
            {/* Drawer sheet layer */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-[32px] border-t border-slate-200 dark:border-slate-800 z-[49] lg:hidden flex flex-col overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6"
            >
              {/* Top Drag Handle Indicator */}
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5 shrink-0" />

              {/* Responsive Drawer Header */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <span className="text-[14px] font-black text-[#6A38EB] dark:text-purple-400 bg-[#6A38EB]/5 dark:bg-[#6A38EB]/10 px-2.5 py-1 rounded-md">
                  Active trigger logs
                </span>
                <button 
                  onClick={() => setIsLogDrawerOpen(false)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-black rounded-full transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Scrollable content of occurrences */}
              <div className="flex-1 overflow-y-auto pr-1">
                {renderLogContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Policy Sidepanel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidePanelOpen(false)}
              className="fixed top-12 left-0 right-0 bottom-0 bg-slate-900/40 backdrop-blur-sm z-[44]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-12 right-0 bottom-0 w-[550px] bg-white dark:bg-slate-950 shadow-[-16px_0_40px_rgba(0,0,0,0.06)] z-[45] flex flex-col border-l border-slate-100 dark:border-slate-900 rounded-l-[24px]"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 rounded-tl-[24px]">
                <div className="flex items-center gap-3">
                  {wizardStep === 'config' && (
                    <button 
                      onClick={() => setWizardStep('gallery')}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-[#6A38EB]" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {wizardStep === 'gallery' ? 'Select a blueprint' : 'Configure trigger'}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {wizardStep === 'gallery' ? 'Choose a template to get started quickly.' : 'Refine the logic for your new trigger.'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wizardStep === 'gallery' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {blueprints.map((bp) => (
                      <button
                        key={bp.id}
                        onClick={() => handleSelectBlueprint(bp.id)}
                        className="flex flex-col text-left p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-[#6A38EB]/50 hover:shadow-[0_8px_30px_rgba(106,56,235,0.05)] transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 bg-[#6A38EB]/5 dark:bg-[#6A38EB]/10 rounded-xl group-hover:bg-[#6A38EB]/10 transition-colors">
                            {bp.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${bp.roiColor} border`}>
                            ROI: {bp.roi}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-[14px] text-slate-900 dark:text-white mb-1 group-hover:text-[#6A38EB] transition-colors">{bp.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{bp.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Step 1: Logic */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">1</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Trigger Logic</h3>
                      </div>
                      <div className="pl-11 space-y-4">
                        <div className="p-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-5">
                          <div className="flex items-center gap-2 text-[14px] font-black text-[#6A38EB]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ai suggested logic</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 leading-loose">
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">IF</span>
                            <span className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-extrabold shadow-sm">
                              {selectedBlueprint === 'idle-guard' ? 'Inactivity' : 
                               selectedBlueprint === 'cost-cap' ? 'Query Cost' : 
                               selectedBlueprint === 'janitor' ? 'Last Accessed' : 'Condition'}
                            </span>
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">IS GREATER THAN</span>
                            <div className="relative inline-block">
                              <input 
                                type="text" 
                                defaultValue={selectedBlueprint === 'idle-guard' ? '60 seconds' : 
                                             selectedBlueprint === 'cost-cap' ? '$100' : 
                                             selectedBlueprint === 'janitor' ? '90 days' : ''}
                                className="w-28 px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-[#6A38EB]/30 focus:border-[#6A38EB] rounded-xl text-center font-black text-[#6A38EB] dark:text-purple-400 focus:ring-2 focus:ring-[#6A38EB]/15 outline-none shadow-sm transition-all text-xs"
                              />
                            </div>
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">THEN</span>
                            <span className="px-2.5 py-1.5 bg-[#6A38EB]/10 text-[#6A38EB] dark:text-purple-300 border border-[#6A38EB]/20 rounded-xl font-extrabold shadow-sm">
                              {selectedBlueprint === 'idle-guard' ? 'Execute Suspend' : 
                               selectedBlueprint === 'cost-cap' ? 'Abort Query' : 
                               selectedBlueprint === 'janitor' ? 'Archive Table' : 'Action'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Scope */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">2</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Target Scope</h3>
                      </div>
                      <div className="pl-11 space-y-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select which resources this trigger applies to.</p>
                        <div className="relative">
                          <select className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6A38EB]/15 focus:border-[#6A38EB]/60 transition-all">
                            <option>All warehouses</option>
                            <option>Smart group: Development</option>
                            <option>Smart group: Production</option>
                            <option>Specific warehouse: COMPUTE_WH</option>
                            <option>Specific warehouse: ANALYST_WH</option>
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Governance Mode */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">3</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Governance Mode</h3>
                      </div>
                      <div className="pl-11 space-y-4">
                        <div className="flex p-1 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-2xl">
                          <button 
                            onClick={() => setGovernanceMode('Autonomous')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-extrabold text-xs transition-all ${
                              governanceMode === 'Autonomous' 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-[#6A38EB] dark:text-purple-400 border border-slate-200/60 dark:border-slate-700 font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            <Bot className={`w-3.5 h-3.5 ${governanceMode === 'Autonomous' ? 'text-[#6A38EB] dark:text-purple-400' : ''}`} />
                            <span>Autonomous</span>
                          </button>
                          <button 
                            onClick={() => setGovernanceMode('Guided')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-extrabold text-xs transition-all ${
                              governanceMode === 'Guided' 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-[#6A38EB] dark:text-purple-400 border border-slate-200/60 dark:border-slate-700 font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            <User className={`w-3.5 h-3.5 ${governanceMode === 'Guided' ? 'text-[#6A38EB] dark:text-purple-400' : ''}`} />
                            <span>Guided</span>
                          </button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={governanceMode}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`p-4 rounded-2xl flex gap-3 border ${
                              governanceMode === 'Autonomous' 
                                ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30' 
                                : 'bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30'
                            }`}
                          >
                            {governanceMode === 'Autonomous' ? (
                              <>
                                <Bot className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                                  <span className="font-extrabold">Autonomous mode:</span> Anavsan will execute the SQL command automatically in Snowflake. Recommended for low-risk guardrails like auto-suspending idle dev warehouses.
                                </p>
                              </>
                            ) : (
                              <>
                                <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-semibold">
                                  <span className="font-extrabold">Guided mode:</span> Anavsan will create a task for an engineer to review and approve before any action is taken. Recommended for production-critical changes.
                                </p>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 flex gap-3 rounded-bl-[24px]">
                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={wizardStep === 'gallery'}
                  onClick={handleActivateSkill}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    wizardStep === 'gallery' 
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                      : 'bg-[#6A38EB] hover:bg-[#582ed1] text-white shadow-lg shadow-purple-500/10 active:scale-[0.98]'
                  }`}
                >
                  <span>Activate trigger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivePolicies;
