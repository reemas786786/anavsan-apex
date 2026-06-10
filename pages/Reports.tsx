import React from 'react';
import { 
    TrendingUp, 
    ShieldAlert, 
    Cpu, 
    Award, 
    ArrowUpRight, 
    CheckCircle, 
    Clock, 
    Download, 
    FileText,
    Brain,
    Lock
} from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border-light pb-4">
        <div>
          <h1 className="text-[28px] font-bold text-text-strong tracking-tight flex items-center gap-2">
            Reports <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/30 text-[#6A38EB] dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-900 shadow-sm">The Scorecard</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Historical Audit confirming system efficacy, active compliance scores, and financial wins reported directly to executives.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-5 py-2 text-xs font-bold rounded-full transition-all shadow-sm">
            <Download className="h-4 w-4" />
            Export PDF Scorecard
          </button>
        </div>
      </div>

      {/* Top Welcome Concept */}
      <div className="bg-gradient-to-r from-[#6A38EB]/5 to-slate-50 dark:from-[#6A38EB]/10 dark:to-slate-900 border border-purple-100/60 dark:border-slate-800 rounded-2xl p-5 flex gap-4 text-xs text-slate-600 dark:text-slate-300 items-start">
        <Award className="h-6 w-6 text-[#6A38EB] shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-slate-900 dark:text-white">Confirmatory Evidence Board</p>
          <p className="font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            While the other modules emphasize actionable optimization, the Scorecard compiles historical handovers to demonstrate active ROI. Use these metrics to confirm team efficiencies across accounts.
          </p>
        </div>
      </div>

      {/* Executive Quick KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: ROI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[14px] font-black text-slate-400 dark:text-slate-500 block">Credits saved (q2)</span>
              <span className="text-3xl font-black text-[#10B981] mt-2 block font-sans">$184,210</span>
              <span className="text-[10px] text-slate-405 font-semibold mt-1 block">Equivalent to 46,052 Snowflake Credits saved</span>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981] rounded-xl border border-emerald-100/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">MoM Growth Ratio:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
              +14.2% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* KPI 2: Compliance Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[14px] font-black text-slate-400 dark:text-slate-500 block">Compliance integrity</span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2 block font-sans">100%</span>
              <span className="text-[10px] text-slate-405 font-semibold mt-1 block">Zero PII / credentials exposed across catalogs</span>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100/30">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Active audits completed:</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">2,410 / wk</span>
          </div>
        </div>

        {/* KPI 3: Agent Efficiency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#6A38EB]/5 blur-2xl rounded-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[14px] font-black text-slate-400 dark:text-slate-500 block">Agent autopilot ratio</span>
              <span className="text-3xl font-black text-[#6A38EB] dark:text-purple-300 mt-2 block font-sans">74.5%</span>
              <span className="text-[10px] text-slate-405 font-semibold mt-1 block">Resolutions handled fully Autonomously</span>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-[#6A38EB]/10 text-[#6A38EB] dark:text-purple-300 rounded-xl border border-purple-100/30">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 mt-4 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">Autonomous vs. Guided:</span>
            <span className="font-extrabold text-[#6A38EB] dark:text-purple-300">956 Aut / 328 Gid</span>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left Side: Audit History Log */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[14px] font-black text-slate-800 dark:text-white-strong">Historical savings ledger</span>
            <span className="text-xs font-semibold text-[#6A38EB] dark:text-purple-400 font-sans">144 occurrences</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-sans space-y-3">
            {[
              { id: "A-928", rule: "Eliminate Vampire Burn (COMPUTE_DEV_WH)", savings: "$480", action: "Suspended 12 idle dev computes", date: "June 08, 2026", type: "Autonomous" },
              { id: "A-927", rule: "Bad Join Query Limit Rule (daily_scans)", savings: "$1,200", action: "Aborted cross-join anomaly", date: "June 08, 2026", type: "Autonomous" },
              { id: "A-921", rule: "Surgical Warehouse Rightsizing", savings: "$160", action: "Downsize DEV_ANALYTICS Large → Medium", date: "June 08, 2026", type: "Guided" },
              { id: "A-914", rule: "Storage Compression Release", savings: "$85", action: "Migrate stale staging backups to ice columns", date: "June 07, 2026", type: "Guided" },
              { id: "A-901", rule: "Cortex Spend Guardrail (campaign_copilots)", savings: "$940", action: "Throttled extreme adhoc ML queries", date: "June 05, 2026", type: "Guided" }
            ].map((audit) => (
              <div key={audit.id} className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-505 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {audit.id}
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-white">
                      {audit.rule}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${audit.type === 'Autonomous' ? 'bg-green-50 dark:bg-green-950/20 text-green-700' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700'}`}>
                      {audit.type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1 font-semibold">{audit.action}</p>
                </div>

                <div className="flex md:flex-col items-end justify-between border-t md:border-transparent pt-2 md:pt-0 border-dashed border-slate-100">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-sans text-sm">{audit.savings}/mo</span>
                  <span className="text-slate-400 text-[10px] font-semibold font-sans mt-0.5">{audit.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Compliance Score breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4">
          <span className="text-[14px] font-black text-slate-800 dark:text-white block border-b border-slate-100 dark:border-slate-800 pb-3">Compliance safeguards</span>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                <span>PII Leak Audit</span>
                <span className="text-[#10B981]">100% Passed</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#10B981] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                <span>Stale Credentials Expiry</span>
                <span className="text-[#10B981]">100% Passed</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#10B981] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                <span>Cross-Join Loop Safeguards</span>
                <span className="text-blue-500">92% Cover</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-11/12 bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-150 dark:border-slate-800 text-xs font-semibold text-slate-550 space-y-1">
              <p className="font-black text-slate-800 dark:text-slate-200">System State Verified</p>
              <p className="text-slate-500 font-medium leading-relaxed text-[11px]">
                Autonomous rules execute periodic checks every 15 minutes. Auditing confirms that 1,280 active credentials correctly respect current role-based column masking guidelines.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
