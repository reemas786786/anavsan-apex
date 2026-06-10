
import React, { useState } from 'react';
import { IconArrowUp, IconInfo } from '../constants';

interface AddSeatsModalProps {
    onCancel: () => void;
    onProceed: () => void;
}

const AddSeatsModal: React.FC<AddSeatsModalProps> = ({ onCancel, onProceed }) => {
    const [seatsToAdd, setSeatsToAdd] = useState(1);
    const pricePerSeat = 49.00;
    const prorationMultiplier = 14 / 30; // remaining 14 days of current cycle
    const prorationTotal = seatsToAdd * pricePerSeat * prorationMultiplier;

    return (
        <div className="flex flex-col h-full bg-white text-text-strong font-sans">
            <div className="p-8 space-y-8 flex-grow">
                {/* Intro Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                    Adding new member seats will expand your team's capacity and update your subscription. Your current plan rate is <span className="font-bold text-text-strong">$49.00 / seat.</span>
                </p>

                {/* Seat Counter */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-text-strong">Number of seats to add</label>
                    <div className="flex items-center">
                        <div className="flex border border-border-color rounded-lg overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setSeatsToAdd(prev => Math.max(1, prev - 1))}
                                className="w-12 h-12 flex items-center justify-center bg-white hover:bg-surface-nested transition-colors text-xl font-medium border-r border-border-color"
                            >
                                −
                            </button>
                            <div className="w-20 h-12 flex items-center justify-center bg-white text-base font-semibold">
                                {seatsToAdd}
                            </div>
                            <button 
                                onClick={() => setSeatsToAdd(prev => prev + 1)}
                                className="w-12 h-12 flex items-center justify-center bg-white hover:bg-surface-nested transition-colors text-xl font-medium border-l border-border-color"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Billing Details Notice */}
                <div className="bg-[#EEF4FF] rounded-lg border-l-4 border-[#0F62FE] p-5 flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0F62FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconInfo className="w-4 h-4 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-text-strong">Billing details</h4>
                        <div className="space-y-1 text-xs text-[#0F62FE]">
                            <p><span className="font-bold">Current Billing Cycle:</span> Nov 1, 2025 - Nov 30, 2025</p>
                            <p><span className="font-bold">Next Billing Date:</span> Dec 1, 2025</p>
                        </div>
                        <p className="text-xs text-[#0F62FE] pt-1">
                            New seats are prorated for the remaining 14 days of your current cycle.
                        </p>
                    </div>
                </div>

                {/* Plan Comparison Table */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-text-strong">Plan Comparison</h4>
                    <div className="border border-border-light rounded-xl overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-border-light">
                            <span className="text-sm text-text-secondary font-medium">Price per seat</span>
                            <span className="text-sm font-bold text-text-strong">$49.00 / mo</span>
                        </div>
                        <div className="flex justify-between items-center px-6 py-4 border-b border-border-light">
                            <span className="text-sm text-text-secondary font-medium">Total increase per month</span>
                            <span className="text-sm font-bold text-text-strong">${(seatsToAdd * pricePerSeat).toFixed(2)} / mo</span>
                        </div>
                        <div className="bg-[#FAFAFA] flex justify-between items-center px-6 py-6">
                            <div>
                                <p className="text-sm font-bold text-text-strong">Prorated amount due now</p>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Cycle adjustment fee</p>
                            </div>
                            <span className="text-3xl font-black text-status-success-dark">
                                ${prorationTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white border-t border-border-light flex justify-end items-center gap-4 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-sm font-bold text-text-secondary hover:text-text-primary px-6 py-3"
                >
                    Cancel
                </button>
                <button
                    onClick={onProceed}
                    className="bg-[#6932D5] hover:bg-[#5A28BE] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <span>Proceed to payment</span>
                    <div className="group-hover:translate-x-1 transition-transform rotate-90">
                         <IconArrowUp className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default AddSeatsModal;
