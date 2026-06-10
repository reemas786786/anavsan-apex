
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { IconCheck, IconChevronRight, IconSparkles, IconUser, IconLayers, IconInfo, IconExclamationTriangle } from '../../constants';
import { Subscription } from '../../types';

const teamConsumptionData = [
    { date: 'Jan 1', credits: 45 },
    { date: 'Jan 5', credits: 52 },
    { date: 'Jan 10', credits: 48 },
    { date: 'Jan 15', credits: 70 },
    { date: 'Jan 20', credits: 65 },
    { date: 'Jan 25', credits: 82 },
    { date: 'Jan 30', credits: 95 },
];

const featureUsageData = [
    { name: 'Query Optimizer', credits: 450, color: '#6932D5' },
    { name: 'Query Analyzer', credits: 320, color: '#A78BFA' },
    { name: 'Warehouse Monitor', credits: 180, color: '#C4B5FD' },
    { name: 'Simulator', credits: 90, color: '#DDD6FE' },
];

interface YourPlanProps {
    onNavigate: (page: any, subPage?: string) => void;
    subscription: Subscription;
}

const YourPlan: React.FC<YourPlanProps> = ({ onNavigate, subscription }) => {
    const isTrial = subscription.plan === 'Trial' && subscription.status === 'trialing';
    const isTeam = subscription.plan === 'Team';
    const hasPendingPlan = !!subscription.pendingPlan;
    
    const trialDaysRemaining = 12;
    const trialTotalDays = 14;
    const progress = ((trialTotalDays - trialDaysRemaining) / trialTotalDays) * 100;

    const planInclusions = {
        Individual: [
            "Instant query optimization rewritten by AI",
            "Full query simulation with warehouse sizing",
            "Personal Query Vault (up to 1000 versions)",
            "Standard Cloud Overview & Dashboards",
            "1 User seat included"
        ],
        Team: [
            "Everything in Individual",
            "Query assignment & Engineering collaboration",
            "Up to 5 team members included in base price",
            "Collaborative Query Vault (unlimited versions)",
            "Automated storage savings alerts",
            "Customizable shared team dashboards"
        ],
        Trial: [
            "Access to all Team-tier features",
            "Query optimizer & Analyzer usage",
            "Simulator with cost projections",
            "Standard Snowflake account connection"
        ]
    };

    const currentInclusions = planInclusions[subscription.plan as keyof typeof planInclusions] || [];

    return (
        <div className="h-full overflow-y-auto space-y-6 p-4 md:p-6 pb-20">
            <header>
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Your Plan</h1>
                <p className="text-sm text-text-secondary mt-1">Manage your subscription, seats, and billing cycle policies.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Plan Status & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Plan Status Card */}
                    <div className="bg-white rounded-[32px] p-8 border border-border-light shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                        {isTeam && !hasPendingPlan && (
                            <div className="absolute top-4 right-4 bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                                Best for ROI
                            </div>
                        )}
                        
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            {isTrial ? <IconSparkles className="w-7 h-7 text-primary" /> : <IconLayers className="w-7 h-7 text-primary" />}
                        </div>
                        
                        {isTrial ? (
                            <>
                                <h2 className="text-2xl font-black text-text-strong">14-day Free Trial</h2>
                                <p className="text-text-secondary text-base mt-2 max-w-lg">
                                    You are exploring all <span className="text-text-strong font-bold">Team features</span>.
                                </p>
                                <div className="mt-6 w-full max-w-xs">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Progress</span>
                                        <span className="text-sm font-black text-primary">{trialDaysRemaining} Days left</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-nested rounded-full overflow-hidden border border-border-light">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${100 - progress}%` }}></div>
                                    </div>
                                </div>
                                <button onClick={() => onNavigate('Billing', 'Change Plan')} className="mt-8 bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                                    Choose Premium Plan
                                    <IconChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-black text-text-strong">Active {subscription.plan} Plan</h2>
                                {hasPendingPlan ? (
                                    <div className="mt-2 p-3 bg-violet-50 rounded-2xl border border-violet-100 max-w-md">
                                         <p className="text-sm font-bold text-primary">Next Plan: {subscription.pendingPlan} (Scheduled)</p>
                                         <p className="text-xs text-text-secondary mt-0.5">Switching on {subscription.pendingPlanEffectiveDate}</p>
                                    </div>
                                ) : (
                                    <p className="text-text-secondary text-base mt-1">
                                        Renewing on <span className="font-bold text-text-strong">Feb 28, 2026</span> for <span className="font-bold text-text-strong">${subscription.plan === 'Individual' ? '49' : '239'}</span>.
                                    </p>
                                )}
                                
                                {isTeam && (
                                     <div className="mt-6 flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-2 bg-surface-nested px-4 py-2 rounded-full border border-border-light">
                                            <IconUser className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold text-text-primary">{subscription.seats} / 5 included seats used</span>
                                        </div>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                                            Additional seats: $49/member/month
                                        </p>
                                     </div>
                                )}

                                <button onClick={() => onNavigate('Billing', 'Change Plan')} className="mt-8 bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white font-bold px-8 py-2.5 rounded-2xl transition-all flex items-center gap-2">
                                    {hasPendingPlan ? 'Manage Scheduled Change' : 'Update Subscription'}
                                    <IconChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* What can I get in current plan? */}
                    <div className="bg-white rounded-[32px] p-8 border border-border-light shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-lg font-black text-sidebar-topbar uppercase tracking-tight">What's in your current plan?</h3>
                            <IconCheck className="w-5 h-5 text-status-success" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentInclusions.map((feature, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-4 bg-surface-nested rounded-2xl border border-border-light group hover:border-primary/20 transition-colors">
                                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <IconCheck className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-sm text-text-primary font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Policies & Stats */}
                <div className="space-y-6">
                    {/* Important Notices Card */}
                    <div className="bg-orange-50 rounded-[32px] p-6 border border-orange-100 space-y-4">
                        <div className="flex items-center gap-2 text-orange-700">
                            <IconInfo className="w-5 h-5" />
                            <h4 className="text-sm font-black uppercase tracking-wider">Plan Policies</h4>
                        </div>
                        
                        <div className="space-y-3">
                            {isTeam && (
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-orange-900">Seat Scaling</p>
                                    <p className="text-[11px] text-orange-800 leading-relaxed">
                                        Your Team plan includes 5 seats. FinOps can add up to 5 users. Beyond that, additional members are charged at $49/mo.
                                    </p>
                                </div>
                            )}
                            
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-orange-900">Downgrade & Refunds</p>
                                <p className="text-[11px] text-orange-800 leading-relaxed">
                                    Downgrades are non-refundable. If you switch from Team to Individual, you will keep all Team features until the end of your current billing cycle. The change takes effect on your next invoice.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-[32px] p-6 border border-border-light shadow-sm">
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary font-medium">Billing Period</span>
                                <span className="text-text-primary font-bold">Monthly</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary font-medium">Payment Status</span>
                                <span className="text-status-success-dark font-bold">Up-to-date</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary font-medium">Active Integrations</span>
                                <span className="text-text-primary font-bold">3/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consumption Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Platform Consumption</h3>
                        <div className="text-[10px] font-bold text-text-muted bg-surface-nested px-2 py-1 rounded">LAST 30 DAYS</div>
                    </div>
                    <div style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={teamConsumptionData}>
                                <defs>
                                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#usageGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm">
                    <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Top Resource Usage</h3>
                    <div className="space-y-4">
                        {featureUsageData.map((feature) => (
                            <div key={feature.name} className="flex items-center justify-between p-4 bg-surface-nested rounded-2xl border border-border-light group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: feature.color }}></div>
                                    <span className="text-sm font-bold text-text-primary">{feature.name}</span>
                                </div>
                                <span className="text-sm font-black text-text-strong">{feature.credits} cr</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YourPlan;
