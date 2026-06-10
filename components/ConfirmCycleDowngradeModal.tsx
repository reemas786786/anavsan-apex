
import React from 'react';
import { IconInfo, IconArrowRight, IconClose } from '../constants';

interface ConfirmCycleDowngradeModalProps {
    onCancel: () => void;
    onConfirm: () => void;
    plan: string;
    monthlyPrice: number;
}

const ConfirmCycleDowngradeModal: React.FC<ConfirmCycleDowngradeModalProps> = ({ onCancel, onConfirm, plan, monthlyPrice }) => {
    // Dynamic dates for simulation
    const currentYear = new Date().getFullYear();
    const cycleEndDate = `December 31, ${currentYear}`;
    const effectiveDate = `January 01, ${currentYear + 1}`;

    return (
        <div className="bg-white overflow-hidden rounded-3xl border border-border-light shadow-2xl">
            {/* Blue Top Accent Bar */}
            <div className="h-1 w-full bg-[#0F62FE]"></div>

            <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-text-strong">Confirm Switch to Monthly Billing</h2>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Your billing cycle will change to monthly once your current annual term ends on <span className="font-bold text-text-strong">{cycleEndDate}</span>. You will continue to have full access until then, and no further annual charges will be made.
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Your first monthly charge of <span className="font-bold text-text-strong">${monthlyPrice.toFixed(2)}</span> will occur on <span className="font-bold text-text-strong">{effectiveDate}</span>.
                    </p>
                </div>

                {/* Status Box */}
                <div className="bg-[#F8F9FB] rounded-xl border-l-4 border-[#0F62FE] p-6 relative overflow-hidden">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Effective Date</p>
                            <p className="text-lg font-black text-[#0F62FE] mt-1">{effectiveDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Current Cycle Ends</p>
                            <p className="text-lg font-black text-text-strong mt-1">{cycleEndDate}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">New Monthly Rate</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-black text-text-strong">${monthlyPrice.toFixed(2)}</span>
                                <span className="text-xs font-bold text-text-muted">/mo</span>
                            </div>
                        </div>
                        <div className="bg-border-color px-2 py-1 rounded">
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Post-cycle change</span>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-3">
                    <div className="mt-0.5">
                        <IconInfo className="w-5 h-5 text-[#0F62FE]" />
                    </div>
                    <p className="text-xs text-[#0F62FE] font-medium leading-relaxed">
                        Note: No immediate refund or credit is provided for the remaining duration of your current annual term.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex h-16 border-t border-border-light">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-[#404040] hover:bg-[#333333] text-white font-bold text-sm transition-colors"
                >
                    Keep Yearly Plan
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-[#0F62FE] hover:bg-[#0052E0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <span>Switch to Monthly</span>
                    <IconArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ConfirmCycleDowngradeModal;
