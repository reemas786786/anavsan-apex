import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus,
  Trash2, 
  Bell, 
  Zap, 
  TrendingUp,
  ChevronDown,
  Search,
  Info,
  Layers,
  Layout,
  CloudDownload,
  Settings,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Database,
  Cpu,
  Globe,
  Check,
  Activity,
  Mail
} from 'lucide-react';
import { Account, Application } from '../types';

interface SetBudgetFlowProps {
  accounts: Account[];
  applications: Application[];
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialData?: any; // For "Edit" mode
}

const SetBudgetFlow: React.FC<SetBudgetFlowProps> = ({ accounts, applications, onClose, onSuccess, initialData }) => {
  const isEdit = !!initialData;
  
  const [name, setName] = useState(initialData?.name || '');
  const [scope, setScope] = useState(initialData?.scope || 'Organization');
  const [period, setPeriod] = useState(initialData?.period || 'Monthly');
  const [limit, setLimit] = useState(initialData?.budget?.toString().replace(/[$,]/g, '') || '');
  
  const [triggerPercentage, setTriggerPercentage] = useState(initialData?.progress || 50);
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>(initialData?.emails || ['admin@company.com']);
  const [notifySlack, setNotifySlack] = useState(initialData?.notifySlack || false);

  const handleAddEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      name,
      scope,
      period,
      budget: `$${limit}`,
      progress: triggerPercentage,
      emails,
      notifySlack
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Budget name</label>
          <input 
            type="text" 
            placeholder="e.g., Production ETL budget"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted/50"
          />
        </div>

        {/* Scope & Period */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Scope</label>
            <div className="relative">
              <select 
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 text-sm font-medium text-text-primary appearance-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option>Organization</option>
                <option>Account</option>
                <option>Application</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Period</label>
            <div className="relative">
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 text-sm font-medium text-text-primary appearance-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Budget Limit */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Budget limit (Credits)</label>
          <input 
            type="text" 
            placeholder="e.g., 200"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted/50"
          />
        </div>

        {/* Alert Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-text-primary">Alert</h3>
          
          <div className="bg-[#F8F9FA] rounded-3xl p-6 space-y-6">
            {/* Trigger Percentage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Trigger At (%)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white rounded-2xl border border-border-light/50 px-6 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-text-primary">{triggerPercentage}</span>
                  <div className="flex items-center gap-3 border-l border-border-light/50 pl-4">
                    <button 
                      onClick={() => setTriggerPercentage(Math.max(0, triggerPercentage - 5))}
                      className="p-1 hover:bg-surface-nested rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4 text-text-muted" />
                    </button>
                    <div className="w-px h-4 bg-border-light/50" />
                    <button 
                      onClick={() => setTriggerPercentage(Math.min(100, triggerPercentage + 5))}
                      className="p-1 hover:bg-surface-nested rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mail */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-muted tracking-wider uppercase">Mail</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="e.g., jane.doe@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                  className="w-full bg-white border border-border-light/50 rounded-2xl pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted/50"
                />
                <button 
                  onClick={handleAddEmail}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#333333] hover:bg-black text-white rounded-full flex items-center justify-center transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {emails.map(email => (
                  <div key={email} className="flex items-center gap-2 bg-[#E9F2FF] text-[#4285F4] px-3 py-1.5 rounded-full text-xs font-bold border border-[#4285F4]/10">
                    {email}
                    <button onClick={() => removeEmail(email)} className="hover:text-[#1A73E8]">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Slack Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox"
                  checked={notifySlack}
                  onChange={(e) => setNotifySlack(e.target.checked)}
                  className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
              <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">Notify via Slack</span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-border-light flex items-center justify-end gap-4 bg-white">
        <button 
          onClick={onClose}
          className="px-8 py-4 text-sm font-bold text-[#6A38EB] hover:bg-[#6A38EB]/5 rounded-full transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="px-8 py-4 bg-[#6A38EB] hover:bg-[#5A2ED1] text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20"
        >
          {isEdit ? 'Update budget' : 'Set new budget'}
        </button>
      </div>
    </div>
  );
};

export default SetBudgetFlow;
