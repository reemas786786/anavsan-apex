
import React from 'react';
import { IconCalendar, IconInfo, IconCheckCircle, IconClose } from '../constants';

interface ConfirmSubscriptionChangeModalProps {
    onCancel: () => void;
    onConfirm: () => void;
    plan: string;
    billingCycle: 'monthly' | 'yearly';
}

const ConfirmSubscriptionChangeModal: React.FC<ConfirmSubscriptionChangeModalProps> = ({ onCancel, onConfirm, plan, billingCycle }) => {
    // Current date logic for billing cycle visualization
    const startDate = "Oct 24, 2025";
    const endDate = "Oct 23, 2026";
    
    // Pricing logic for Individual or Team upgrade
    const isIndividual = plan === 'Individual';
    const annualPlanAmount = isIndividual ? 468.00 : 2294.00;
    const proratedCredit = isIndividual ? 24.50 : 120.45;
    const totalDue = annualPlanAmount - proratedCredit;
    const savingsAmount = isIndividual ? 120 : 574;

    return (
        <div className="bg-white text-text-strong font-sans max-w-lg mx-auto overflow-hidden rounded-3xl">
            <div className="p-8 space-y-6">
                {/* Intro Section */}
                <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                        <IconCalendar className="w-6 h-6 text-[#0F62FE]" />
                    </div>
                    <div className="flex-grow pt-1">
                        <p className="text-[15px] text-text-secondary leading-relaxed">
                            You are switching to the <span className="font-bold text-text-strong">Yearly plan</span>. By opting for annual billing, you'll be billed for the next 12 months upfront, saving <span className="text-[#16A34A] font-bold">20% (${savingsAmount}/year)</span> compared to your current monthly billing.
                        </p>
                    </div>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-[#F8F9FB] rounded-[24px] border border-border-light p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted font-medium">New Billing Cycle</span>
                        <span className="text-text-strong font-bold">{startDate} - {endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted font-medium">Annual Plan Amount</span>
                        <span className="text-text-strong font-bold">${annualPlanAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1.5 text-text-muted font-medium">
                            <span>Prorated Credit</span>
                            <IconInfo className="w-3.5 h-3.5 text-text-muted cursor-help" />
                        </div>
                        <span className="text-[#16A34A] font-bold">-${proratedCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="pt-5 mt-2 border-t border-border-color flex justify-between items-end">
                        <p className="text-[17px] font-black text-text-strong mb-1">Total due today</p>
                        <div className="text-right">
                            <p className="text-[32px] font-black text-text-strong leading-none">${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-2">EXCL. APPLICABLE TAXES</p>
                        </div>
                    </div>
                </div>

                {/* Authorization Box */}
                <div className="bg-[#FFFBF0] rounded-2xl border border-[#FDE68A] p-4 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-[12px] text-[#92400E] font-medium leading-relaxed">
                        By clicking "Confirm & Pay", you authorize Anavsan to charge your payment method ending in <span className="font-bold">4242</span>. This change will take effect immediately.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white flex justify-end items-center gap-4 border-t border-border-light">
                <button
                    onClick={onCancel}
                    className="text-[14px] font-bold text-text-secondary hover:text-text-primary px-4 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold px-10 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] whitespace-nowrap text-[15px]"
                >
                    Confirm & Pay
                </button>
            </div>
        </div>
    );
};

export default ConfirmSubscriptionChangeModal;
