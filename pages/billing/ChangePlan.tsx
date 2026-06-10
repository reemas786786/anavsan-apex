
import React, { useState } from 'react';
// Added IconUser to imports
import { IconCheck, IconChevronRight, IconInfo, IconGift, IconSparkles, IconClock, IconXCircle, IconExclamationTriangle, IconUser } from '../../constants';
import { SubscriptionPlan, BillingCycle, Subscription, User } from '../../types';
import PaymentFlowModal from '../../components/PaymentFlowModal';

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
        <IconCheck className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: text }}></span>
    </div>
);

interface ChangePlanProps {
    users: User[];
    currentUser: User | null;
    onSubscriptionSuccess: (plan: SubscriptionPlan, cycle: BillingCycle) => void;
    currentPlan: SubscriptionPlan;
    subscription: Subscription;
    onApplyExtendedTrial?: () => void;
    onContactEnterprise?: () => void;
    onShowDowngradeConfirm?: () => void;
    onShowCycleConfirm?: (data: { plan: SubscriptionPlan, billingCycle: BillingCycle }) => void;
    onCancelDowngrade?: () => void;
}

const ChangePlan: React.FC<ChangePlanProps> = ({ users, currentUser, onSubscriptionSuccess, currentPlan, subscription, onApplyExtendedTrial, onContactEnterprise, onShowDowngradeConfirm, onShowCycleConfirm, onCancelDowngrade }) => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle || 'monthly');
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);

    const pricing = {
        Basic: billingCycle === 'monthly' ? 49 : 39,
        Pro: billingCycle === 'monthly' ? 239 : 199,
        Enterprise: 'Custom',
    };

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (plan === 'Enterprise') {
            onContactEnterprise?.();
            return;
        }

        // Intercept downgrade from Team to Individual
        if (currentPlan === 'Team' && plan === 'Individual') {
            onShowDowngradeConfirm?.();
            return;
        }

        // Cycle Change Logic
        const isCurrentlyMonthly = subscription.billingCycle === 'monthly' || !subscription.billingCycle;
        const isCurrentlyYearly = subscription.billingCycle === 'yearly';

        const isSwitchingToYearly = billingCycle === 'yearly' && isCurrentlyMonthly;
        const isSwitchingToMonthly = billingCycle === 'monthly' && isCurrentlyYearly;

        if (currentPlan === plan) {
            if (isSwitchingToYearly) {
                onShowCycleConfirm?.({ plan, billingCycle: 'yearly' });
                return;
            }
            if (isSwitchingToMonthly) {
                onShowCycleConfirm?.({ plan, billingCycle: 'monthly' });
                return;
            }
        }

        setSelectedPlanForPayment(plan);
    };

    const isExactlyActive = (planName: SubscriptionPlan) => 
        currentPlan === planName && (subscription.billingCycle === billingCycle || (!subscription.billingCycle && billingCycle === 'monthly'));
    
    const isPlanPending = (planName: SubscriptionPlan) => subscription.pendingPlan === planName;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-10 bg-[#FDFCFE] text-text-strong space-y-12 pb-32">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Pricing & Plans Header */}
                <header className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex px-4 py-1 rounded-full bg-white border border-border-light text-xs font-bold text-text-secondary shadow-sm uppercase tracking-widest">
                        Pricing & Plans
                    </div>
                    <h1 className="text-5xl font-black text-sidebar-topbar tracking-tight">Affordable Pricing Plans</h1>
                    <p className="text-text-secondary font-medium text-lg leading-relaxed">
                        Access the advanced tools and instant recommendations needed to maximize ROI and achieve streamlined optimization workflows.
                    </p>
                </header>

                {/* Billing Cycle Toggle */}
                <div className="mt-16 flex items-center justify-center gap-6">
                    <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-sidebar-topbar' : 'text-text-muted'}`}>Billed Monthly</span>
                    <button 
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-14 h-7 bg-sidebar-topbar rounded-full p-1 relative transition-all group"
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-sidebar-topbar' : 'text-text-muted'}`}>Billed yearly</span>
                        <span className="bg-status-success-light text-status-success-dark text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-status-success/10">
                            Save 20%
                        </span>
                    </div>
                </div>

                {/* Plan Cards Grid */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full">
                    
                    {/* Individual Card */}
                    <div className={`bg-white rounded-[40px] p-8 border-2 ${subscription.pendingPlan === 'Individual' ? 'border-[#6366F1] ring-4 ring-indigo-50 shadow-xl' : currentPlan === 'Individual' ? 'border-primary' : 'border-border-light'} flex flex-col transition-all hover:shadow-xl relative`}>
                        {currentPlan === 'Individual' && !subscription.isDowngradePending && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Active Plan</div>
                        )}
                        {subscription.pendingPlan === 'Individual' && (
                            <div className="absolute -top-4 right-8 px-4 py-1 bg-[#6366F1] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Target Plan</div>
                        )}
                        
                        <div className="w-12 h-12 bg-pink-100 rounded-2xl mb-6 flex items-center justify-center">
                            <div className="w-6 h-6 bg-pink-500 rounded-lg rotate-45"></div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                             <IconUser className="w-4 h-4 text-text-muted" />
                             <h3 className="text-xl font-bold text-sidebar-topbar">Individual</h3>
                        </div>

                        {subscription.pendingPlan === 'Individual' && (
                            <div className="bg-[#EEF4FF] rounded-xl px-4 py-2 flex items-center gap-2 mb-4 animate-pulse">
                                <IconClock className="w-3.5 h-3.5 text-[#0F62FE]" />
                                <span className="text-[11px] font-bold text-[#0F62FE] italic">Activating on {subscription.pendingPlanEffectiveDate}</span>
                            </div>
                        )}

                        <p className="text-sm text-text-secondary mt-1">Perfect for data engineers.</p>
                        
                        <div className="my-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-text-strong">${pricing.Basic}</span>
                                <span className="text-sm font-bold text-text-muted ml-2">/mo per user</span>
                            </div>
                        </div>

                        <button 
                            disabled={subscription.pendingPlan === 'Individual' || isExactlyActive('Individual')}
                            onClick={() => handleSelectPlan('Individual')}
                            className={`w-full py-4 font-black rounded-2xl transition-all active:scale-95 shadow-sm border ${
                                subscription.pendingPlan === 'Individual'
                                ? 'bg-surface-nested text-text-muted border-border-color cursor-default opacity-60'
                                : isExactlyActive('Individual')
                                ? 'bg-surface-nested text-text-muted border-border-color cursor-default opacity-60' 
                                : 'bg-sidebar-topbar text-white hover:opacity-90'
                            }`}
                        >
                            {subscription.pendingPlan === 'Individual' ? 'Scheduled' : isExactlyActive('Individual') ? 'Current Plan' : (currentPlan === 'Individual' && billingCycle === 'yearly') ? 'Switch to Yearly' : 'Select Individual'}
                        </button>

                        <div className="mt-12 space-y-4 pt-8 border-t border-border-light">
                            <FeatureItem text="1 seat only" />
                            <FeatureItem text="Standard performance monitoring" />
                            <FeatureItem text="Limited optimization alerts" />
                        </div>
                    </div>

                    {/* Team Card (Popular) */}
                    <div className={`bg-white rounded-[40px] p-8 border-2 ${currentPlan === 'Team' ? 'border-primary ring-4 ring-primary/5' : 'border-border-light'} flex flex-col transition-all hover:shadow-2xl relative shadow-xl shadow-primary/5 scale-105 z-10`}>
                        {currentPlan === 'Team' && (
                            <div className="absolute -top-4 right-8 px-4 py-1 bg-[#F1F3F5] text-text-muted text-[10px] font-black rounded-full uppercase tracking-widest border border-border-light">Current</div>
                        )}
                        
                        <div className="w-12 h-14 bg-orange-100 rounded-2xl mb-6 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                             <div className="flex -space-x-1">
                                <div className="w-4 h-4 bg-text-muted rounded-full border border-white"></div>
                                <div className="w-4 h-4 bg-text-muted rounded-full border border-white"></div>
                             </div>
                             <h3 className="text-xl font-bold text-sidebar-topbar">Team</h3>
                        </div>

                        {subscription.isDowngradePending && (
                            <div className="bg-[#FFF1F1] rounded-2xl p-4 border border-status-error/10 mb-6 space-y-1">
                                <div className="flex items-center gap-2 text-status-error">
                                    <IconExclamationTriangle className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Downgrade Scheduled</span>
                                </div>
                                <p className="text-[11px] text-status-error-dark font-medium leading-tight">
                                    Your workspace will transition to Individual Mode on {subscription.pendingPlanEffectiveDate}.
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-text-secondary mt-1">Ideal for FinOps and DataOps team.</p>

                        <div className="my-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-text-strong">${pricing.Pro}</span>
                                <span className="text-sm font-bold text-text-muted ml-2">/mo per seat</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => subscription.isDowngradePending ? onCancelDowngrade?.() : !isExactlyActive('Team') && handleSelectPlan('Team')}
                            className={`w-full py-4 font-black rounded-2xl shadow-xl transition-all active:scale-95 border flex items-center justify-center gap-2 ${
                                subscription.isDowngradePending
                                ? 'bg-white text-primary border-primary hover:bg-primary/5'
                                : isExactlyActive('Team')
                                ? 'bg-surface-nested text-text-muted border-border-color cursor-default opacity-60'
                                : 'bg-sidebar-topbar text-white hover:opacity-90 shadow-primary/20'
                            }`}
                        >
                            {subscription.isDowngradePending ? (
                                <>
                                    <IconXCircle className="w-4 h-4" />
                                    <span>Cancel Downgrade</span>
                                </>
                            ) : isExactlyActive('Team') ? 'Current Plan' : (currentPlan === 'Team' && billingCycle === 'yearly') ? 'Switch to Yearly' : 'Select Team'}
                        </button>

                        <div className="mt-12 space-y-4 pt-8 border-t border-border-light">
                            <FeatureItem text="Unlimited optimization" />
                            <FeatureItem text="Advanced cost analytics" />
                            <FeatureItem text="Team management tools" />
                            <FeatureItem text="Shared dashboards" />
                        </div>
                    </div>

                    {/* Enterprise Card */}
                    <div className={`bg-white rounded-[40px] p-8 border ${currentPlan === 'Enterprise' ? 'border-primary ring-4 ring-primary/5' : 'border-border-light'} flex flex-col transition-all hover:shadow-xl relative`}>
                        {currentPlan === 'Enterprise' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Active Plan</div>
                        )}
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl mb-6 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-purple-500 rounded-full border-t-transparent animate-spin-slow"></div>
                        </div>
                        <h3 className="text-xl font-bold text-sidebar-topbar">Enterprise</h3>
                        <p className="text-sm text-text-secondary mt-1">Built for large organizations needs.</p>

                        <div className="my-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-text-strong">Custom</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => currentPlan !== 'Enterprise' && handleSelectPlan('Enterprise')}
                            className="w-full py-4 font-black rounded-2xl transition-all active:scale-95 shadow-sm bg-sidebar-topbar text-white hover:opacity-90"
                        >
                            Contact Sales
                        </button>

                        <div className="mt-12 space-y-4 pt-8 border-t border-border-light">
                            <FeatureItem text="Dedicated account manager" />
                            <FeatureItem text="Custom data retention" />
                            <FeatureItem text="SSO & Advanced Security" />
                            <FeatureItem text="24/7 Priority Support" />
                        </div>
                    </div>
                </div>

                {/* Quick Policy Note Banner (Bottom) */}
                {subscription.isDowngradePending && (
                    <div className="mt-20 bg-white rounded-3xl p-8 w-full border border-border-light shadow-sm flex gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-12 h-12 rounded-full bg-status-warning/10 flex items-center justify-center flex-shrink-0">
                            <IconInfo className="w-6 h-6 text-status-warning" />
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-lg font-bold text-text-strong">Quick Policy Note (Downgrade Scheduled)</h4>
                             <p className="text-sm text-text-secondary leading-relaxed max-w-4xl">
                                Your Team plan currently includes 5 seats with unlimited optimization. On <span className="font-bold text-text-strong">{subscription.pendingPlanEffectiveDate}</span>, this workspace will downgrade to the Individual plan (1 seat only). Your team members will automatically be removed and will <span className="font-bold text-text-strong">no longer have access</span> to this portal. Any unsaved work for secondary members should be backed up before the transition date.
                             </p>
                             <p className="text-xs text-text-muted pt-2">
                                Need more seats after {subscription.pendingPlanEffectiveDate}? You will need to upgrade back to a Team plan at $49/mo per seat.
                             </p>
                        </div>
                    </div>
                )}

                {/* Extended Trial Footer */}
                {!subscription.isDowngradePending && (
                    <div className="mt-20 bg-gray-100 rounded-3xl p-8 w-full flex flex-col md:flex-row items-center justify-between gap-6 border border-border-light">
                        <div className="text-lg font-medium text-text-primary text-center md:text-left">
                            SnowPro certified professionals can opt for extended trial <span className="text-status-error font-bold">Get 14 more days</span>
                        </div>
                        <button 
                            onClick={onApplyExtendedTrial}
                            className="px-8 py-3 bg-white hover:bg-gray-50 text-sidebar-topbar font-black rounded-xl border border-border-light transition-all shadow-sm whitespace-nowrap"
                        >
                            Apply Now
                        </button>
                    </div>
                )}
            </div>

            <PaymentFlowModal 
                isOpen={!!selectedPlanForPayment}
                onClose={() => setSelectedPlanForPayment(null)}
                plan={selectedPlanForPayment || 'Trial'}
                billingCycle={billingCycle}
                onSuccess={(p, c) => onSubscriptionSuccess(p, c)}
                isDowngrade={currentPlan === 'Team' && selectedPlanForPayment === 'Individual'}
                survivorName={currentUser?.name || 'Admin'}
                survivorEmail={currentUser?.email || ''}
            />
        </div>
    );
};

export default ChangePlan;
