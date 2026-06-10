import React from 'react';
import { IconInfo, IconArrowRight, IconClose, IconExclamationTriangle } from '../constants';

interface SwitchToIndividualModalProps {
    onCancel: () => void;
    onConfirm: () => void;
    adminEmail: string;
}

const SwitchToIndividualModal: React.FC<SwitchToIndividualModalProps> = ({ onCancel, onConfirm, adminEmail }) => {
    // Dynamic date: end of current simulation month in 2026
    const effectiveDate = "February 28, 2026";
    const currentMonthlyRate = 239.00;
    const newMonthlyRate = 49.00;

    return (
        <div className="bg-white text-text-strong font-sans">
            <div className="p-8 space-y-6">
                <p className="text-sm text-text-secondary">Workspace plan modification</p>
                
                {/* Info Box: Current access */}
                <div className="bg-[#EEF4FF] rounded-lg border-l-4 border-[#0F62FE] p-5 flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0F62FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconInfo className="w-4 h-4 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-strong">Current access remains active</h4>
                        <p className="text-xs text-[#0F62FE] leading-relaxed">
                            You retain all Team features and all 5 active seats until the end of the billing cycle.
                        </p>
                    </div>
                </div>

                {/* Warning Box: Member Transition (Improved Naming) */}
                <div className="bg-[#FFF1F1] rounded-lg border-l-4 border-status-error p-5 flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-status-error flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <IconExclamationTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-strong">Automated Member Transition</h4>
                        <p className="text-xs text-status-error-dark leading-relaxed">
                            On <span className="font-bold">{effectiveDate}</span>, your workspace will switch to Individual. All 4 other team members will be automatically removed.
                        </p>
                        {/* Survivor Note Improvement */}
                        <p className="text-[11px] text-status-error-dark font-medium mt-1">
                            You (<span className="underline italic">{adminEmail}</span>) will remain as the sole workspace member.
                        </p>
                    </div>
                </div>

                {/* Billing Summary */}
                <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-text-strong uppercase tracking-widest">Billing Summary</h4>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[11px] font-bold text-text-muted uppercase mb-1">Current monthly rate</p>
                            <p className="text-3xl font-black text-text-muted line-through opacity-50">${currentMonthlyRate.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-bold text-text-muted uppercase mb-1">New monthly rate</p>
                            <p className="text-3xl font-black text-text-strong">${newMonthlyRate.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Proration Note */}
                <div className="flex items-start gap-2 pt-4 border-t border-border-light">
                    <IconInfo className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                        No prorated credits are applied for the remainder of the month. Changes take effect next billing date.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-surface-nested flex justify-end items-center gap-4 border-t border-border-light">
                <button
                    onClick={onCancel}
                    className="text-sm font-bold text-primary hover:bg-primary/5 px-6 py-2.5 rounded-xl transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-[#6932D5] hover:bg-[#5A28BE] text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <span>Confirm schedule</span>
                    <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default SwitchToIndividualModal;
