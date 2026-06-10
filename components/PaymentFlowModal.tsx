
import React, { useState, useEffect } from 'react';
import { IconLockClosed, IconCreditCard, IconChevronRight, IconCheck, IconClose, IconChevronLeft, IconCheckCircle, IconArrowRight, IconFileText, IconRefresh } from '../constants';
import { SubscriptionPlan, BillingCycle } from '../types';

interface PaymentFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    onSuccess: (plan: SubscriptionPlan, cycle: BillingCycle) => void;
    isDowngrade?: boolean;
    survivorName?: string;
    survivorEmail?: string;
}

const IconLink = () => (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
        <path d="M12.445 6.002h2.51l-4.108 8.002h-2.51l4.108-8.002zM15 10a5 5 0 11-10 0 5 5 0 0110 0z" />
    </svg>
);

const IconExpand = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
);

const IconMinimize = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
    </svg>
);

const PaymentFlowModal: React.FC<PaymentFlowModalProps> = ({ isOpen, onClose, plan, billingCycle, onSuccess, isDowngrade = false, survivorName = 'Admin', survivorEmail = '' }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'checkout' | 'success' | 'receipt'>('checkout');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cashapp'>('card');
    const [isFullScreenReceipt, setIsFullScreenReceipt] = useState(false);

    const pricing = {
        Individual: billingCycle === 'monthly' ? 49 : 39,
        Team: billingCycle === 'monthly' ? 239 : 199,
        Enterprise: 0,
        Trial: 0
    };

    const price = pricing[plan as keyof typeof pricing];
    const tax = price * 0.08;
    const total = billingCycle === 'yearly' ? (price + tax) * 12 : (price + tax);

    useEffect(() => {
        if (!isOpen) {
            setStep('checkout');
            setIsProcessing(false);
            setIsFullScreenReceipt(false);
        }
    }, [isOpen]);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 2000);
    };

    const handleDone = () => {
        onSuccess(plan, billingCycle);
        onClose();
    };

    if (!isOpen) return null;

    const isTeamPlan = plan === 'Team';
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const isReceiptStep = step === 'receipt';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-sidebar-topbar/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className={`relative bg-white w-full transition-all duration-300 animate-in fade-in zoom-in flex flex-col shadow-2xl overflow-hidden
                ${isFullScreenReceipt && isReceiptStep 
                    ? 'inset-0 max-w-full max-h-full rounded-none h-full' 
                    : `${step === 'checkout' ? 'max-w-6xl' : step === 'success' ? 'max-w-xl' : 'max-w-5xl'} max-h-[90vh] rounded-[24px]`
                }
            `}>
                {step === 'checkout' ? (
                    <div className="flex flex-col md:flex-row h-full overflow-hidden">
                        {/* LEFT COLUMN: Order Summary */}
                        <div className="w-full md:w-[45%] bg-[#F7F8F9] p-8 md:p-12 flex flex-col overflow-y-auto no-scrollbar">
                            <button onClick={onClose} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-12">
                                <IconChevronLeft className="w-4 h-4" />
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white border border-border-color rounded flex items-center justify-center">
                                        <div className="w-3 h-3 bg-sidebar-topbar rounded-sm"></div>
                                    </div>
                                    <span className="text-sm font-bold">anavsan-dev</span>
                                    <span className="bg-[#1D3944] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight">Sandbox</span>
                                </div>
                            </button>

                            <div className="space-y-1">
                                <p className="text-text-secondary text-sm font-medium">Subscribe to {plan} - {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-text-strong">${total.toFixed(2)}</span>
                                    <span className="text-text-secondary text-lg">per {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                                </div>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="flex justify-between items-start text-sm">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-strong">{plan} - {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                                        <p className="text-text-secondary text-xs">Qty {plan === 'Team' ? '5' : '1'}, Billed {billingCycle}</p>
                                    </div>
                                    <span className="font-bold text-text-strong">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 flex items-center justify-between text-xs text-text-muted">
                                <div className="flex items-center gap-1">
                                    <span>Powered by</span>
                                    <span className="font-bold text-text-secondary">stripe</span>
                                </div>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:underline">Terms</a>
                                    <a href="#" className="hover:underline">Privacy</a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Payment Form */}
                        <div className="w-full md:w-[55%] bg-white p-8 md:p-12 overflow-y-auto no-scrollbar">
                            {/* Express Checkout */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#00D66F] text-white font-bold text-sm hover:opacity-90 transition-opacity">
                                    <span>Pay with</span>
                                    <IconLink />
                                    <span className="font-black italic">link</span>
                                </button>
                                <button className="flex flex-col items-center justify-center py-1.5 rounded-md bg-[#FFD814] text-[#111] font-bold text-sm hover:opacity-90 transition-opacity">
                                    <div className="flex items-center gap-1.5">
                                        <span>Pay with</span>
                                        <span className="text-lg">amazon</span>
                                    </div>
                                    <span className="text-[10px] -mt-1 font-medium">Pay now or later</span>
                                </button>
                            </div>

                            <div className="relative flex items-center justify-center my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light"></div></div>
                                <span className="relative bg-white px-4 text-xs text-text-muted font-bold tracking-widest uppercase">Or</span>
                            </div>

                            <div className="space-y-6">
                                {/* Contact Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-text-strong mb-3">Contact information</h4>
                                    <div className="bg-[#F6F9FC] rounded-md border border-border-color p-4 flex flex-col">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email</label>
                                        <input 
                                            type="email" 
                                            defaultValue={survivorEmail || "rengalakshmanan@anavsan.com"} 
                                            className="bg-transparent border-none p-0 text-sm font-medium text-text-primary focus:ring-0 mt-0.5" 
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h4 className="text-sm font-bold text-text-strong mb-3">Payment method</h4>
                                    <div className="border border-border-color rounded-md overflow-hidden">
                                        <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-[#F6F9FC]' : 'hover:bg-gray-50'}`}>
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                checked={paymentMethod === 'card'} 
                                                onChange={() => setPaymentMethod('card')}
                                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                            />
                                            <IconCreditCard className="w-5 h-5 text-text-strong" />
                                            <span className="text-sm font-medium text-text-strong flex-grow">Card</span>
                                            <div className="flex gap-1.5 items-center grayscale opacity-60 scale-75">
                                                <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                                <div className="w-6 h-4 bg-orange-600 rounded-sm"></div>
                                                <div className="w-6 h-4 bg-blue-400 rounded-sm"></div>
                                                <div className="w-6 h-4 bg-gray-400 rounded-sm"></div>
                                            </div>
                                        </label>
                                        <div className="border-t border-border-color"></div>
                                        <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === 'cashapp' ? 'bg-[#F6F9FC]' : 'hover:bg-gray-50'}`}>
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                checked={paymentMethod === 'cashapp'} 
                                                onChange={() => setPaymentMethod('cashapp')}
                                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                            />
                                            <div className="w-5 h-5 bg-[#00D632] rounded flex items-center justify-center">
                                                <span className="text-white font-bold text-[10px]">$</span>
                                            </div>
                                            <span className="text-sm font-medium text-text-strong">Cash App Pay</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Save Info Checkbox */}
                                <div className="bg-[#F6F9FC] rounded-md border border-border-color p-4 flex items-start gap-3">
                                    <div className="mt-1">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-text-strong">Save my information for faster checkout</p>
                                        <p className="text-[11px] text-text-secondary leading-relaxed">
                                            Pay securely at anavsan-dev and everywhere <span className="text-link underline underline-offset-2">Link</span> is accepted.
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePay}
                                    disabled={isProcessing}
                                    className="w-full bg-[#0070BA] text-white font-bold py-3 rounded-md shadow-lg hover:bg-[#005ea6] transition-all disabled:bg-gray-300 relative"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : 'Subscribe'}
                                </button>

                                <p className="text-[10px] text-center text-text-muted leading-relaxed px-4">
                                    By subscribing, you authorize anavsan-dev to charge you according to the terms until you cancel.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : step === 'success' ? (
                    <div className="flex-1 flex flex-col p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
                        <div className="flex items-center gap-3">
                            <IconCheckCircle className="w-10 h-10 text-status-success" />
                            <h2 className="text-2xl font-black text-text-strong">Payment successful</h2>
                        </div>
                        
                        <p className="text-base text-text-secondary mt-4 leading-relaxed">
                            Your payment has been successfully processed. Your <span className="font-bold text-text-strong">{isTeamPlan ? 'Team plan' : 'Individual plan'}</span> is now active.
                        </p>

                        <p className="text-sm text-text-primary mt-6">
                            <span className="font-bold">Transaction ID:</span> <span className="text-text-secondary font-mono bg-surface-nested px-2 py-0.5 rounded border border-border-color">txn_1A2B3C4D5E6F7G8H</span>
                        </p>

                        <div className="mt-8 bg-status-success-light border-l-4 border-status-success p-6 rounded-r-2xl">
                            <h4 className="text-sm font-black text-text-strong uppercase tracking-widest">What's next</h4>
                            <ul className="mt-4 space-y-3">
                                {isTeamPlan ? (
                                    <>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>Your team plan is now active with immediate access.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>All 5 workspace seats are ready for your team members.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>A billing receipt has been sent to your primary email address.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>Auto-renews monthly at <span className="font-bold text-text-strong">$239/month</span></span>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>Your Individual plan is now active.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>1 seat (single user) — only you can access.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>Check your email for billing receipt.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-text-secondary">
                                            <IconCheck className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
                                            <span>Auto-renews monthly at <span className="font-bold text-text-strong">$49/month</span></span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="mt-8 border-t border-border-light pt-8">
                            <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Billing Summary</h4>
                            <div className="mt-6 grid grid-cols-2 gap-y-4">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">Plan</p>
                                    <p className="text-sm font-bold text-text-primary">{plan} {isTeamPlan ? '' : 'plan'}</p>
                                </div>
                                <div className="space-y-0.5 text-right">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">Method</p>
                                    <p className="text-sm font-bold text-text-primary">•••• 4242</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">Billing Date</p>
                                    <p className="text-sm font-bold text-text-primary">{currentDate}</p>
                                </div>
                                <div className="space-y-0.5 text-right">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">Cycle</p>
                                    <p className="text-sm font-bold text-text-primary">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between items-center bg-surface-nested p-4 rounded-2xl border border-border-color">
                                <h3 className="text-base font-bold text-text-strong">Total charged</h3>
                                <span className="text-2xl font-black text-status-success-dark">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-end gap-4">
                            <button 
                                onClick={() => setStep('receipt')}
                                className="px-8 py-3.5 bg-button-secondary-bg text-primary text-sm font-bold rounded-xl hover:bg-border-light transition-all flex items-center gap-2"
                            >
                                <IconFileText className="w-4 h-4" />
                                View receipt
                            </button>
                            <button 
                                onClick={handleDone}
                                className="px-8 py-3.5 bg-sidebar-topbar text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-sidebar-topbar/20"
                            >
                                <span>Return to dashboard</span>
                                <IconArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col bg-[#F6F8FA] overflow-hidden h-full">
                        {/* Receipt Control Header */}
                        <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-border-color z-10">
                            <button onClick={() => setStep('success')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold text-xs uppercase tracking-widest transition-colors">
                                <IconChevronLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsFullScreenReceipt(!isFullScreenReceipt)} 
                                    className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
                                    title={isFullScreenReceipt ? "Exit Full Screen" : "Full Screen"}
                                >
                                    {isFullScreenReceipt ? <IconMinimize className="w-5 h-5" /> : <IconExpand className="w-5 h-5" />}
                                </button>
                                <button onClick={() => window.print()} className="px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-all uppercase tracking-widest">
                                    Print
                                </button>
                                <button className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-lg hover:opacity-90 transition-all shadow-md uppercase tracking-widest">
                                    Download PDF
                                </button>
                                <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
                                    <IconClose className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Receipt Area */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth bg-[#F6F8FA] no-scrollbar">
                            <div className={`bg-white w-full max-w-4xl mx-auto rounded-sm shadow-xl p-12 md:p-20 relative text-text-strong border border-border-color min-h-[1056px] transition-all duration-300 ${isFullScreenReceipt ? 'my-4' : ''}`}>
                                
                                {/* Document Header */}
                                <div className="flex flex-col md:flex-row justify-between gap-12 border-b-4 border-sidebar-topbar pb-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                             <div className="w-12 h-12 bg-sidebar-topbar rounded-xl flex items-center justify-center">
                                                <span style={{fontFamily: 'serif'}} className="text-4xl text-white">A</span>
                                            </div>
                                            <h1 className="text-3xl font-black tracking-tight text-sidebar-topbar uppercase">Anavsan Inc.</h1>
                                        </div>
                                        <div className="text-sm text-text-secondary leading-relaxed font-medium">
                                            <p>123 Business Way, Tech City</p>
                                            <p>ST 54321, United States</p>
                                            <p>VAT: US987654321</p>
                                            <p className="mt-2 text-primary font-bold underline">billing@anavsan.com</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <h2 className="text-7xl font-extralight tracking-[0.2em] text-text-muted/30 uppercase leading-none">Invoice</h2>
                                        <div className="space-y-1.5 text-sm pt-6">
                                            <div className="flex justify-end gap-8">
                                                <span className="text-text-muted font-bold uppercase text-[10px] tracking-widest">Invoice Number</span>
                                                <span className="font-black">#INV-2023-001</span>
                                            </div>
                                            <div className="flex justify-end gap-8">
                                                <span className="text-text-muted font-bold uppercase text-[10px] tracking-widest">Issue Date</span>
                                                <span className="font-black">{currentDate}</span>
                                            </div>
                                            <div className="flex justify-end gap-8">
                                                <span className="text-text-muted font-bold uppercase text-[10px] tracking-widest">Due Date</span>
                                                <span className="font-black">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Entities Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-16 border-b border-border-light">
                                    <div>
                                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 border-b border-border-light pb-2">Bill To</h4>
                                        <div className="text-sm space-y-2">
                                            <p className="font-black text-xl text-sidebar-topbar">Acme Corp</p>
                                            <div className="text-text-secondary font-medium space-y-1">
                                                <p>456 Enterprise Dr, Innovation Park</p>
                                                <p>San Francisco, CA 94107</p>
                                                <p>United States</p>
                                                <p className="pt-4 font-bold italic text-text-muted">procurement@acme.co</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 border-b border-border-light pb-2">Payment Details</h4>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-surface-nested rounded-lg border border-border-color flex items-center justify-center text-text-muted">
                                                <IconCreditCard className="w-6 h-6" />
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-black text-sidebar-topbar">Visa ending in 4242</p>
                                                <p className="text-text-secondary font-medium">Authorization: #882190</p>
                                                <p className="text-status-success font-black text-[10px] uppercase tracking-tighter mt-2">Charged on {currentDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="mt-12 overflow-hidden">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead className="bg-surface-nested text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-y border-border-light">
                                            <tr>
                                                <th className="px-6 py-5">Description</th>
                                                <th className="px-6 py-5 text-center">Quantity</th>
                                                <th className="px-6 py-5 text-right">Unit Price</th>
                                                <th className="px-6 py-5 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-light">
                                            <tr className="bg-white">
                                                <td className="px-6 py-8">
                                                    <p className="font-black text-sidebar-topbar text-base">{plan} Plan Subscription ({billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})</p>
                                                    <p className="text-xs text-text-muted font-bold mt-1 uppercase tracking-tight opacity-70">Billing cycle: Oct 01 - Oct 31, 2023</p>
                                                </td>
                                                <td className="px-6 py-8 text-center font-bold">1</td>
                                                <td className="px-6 py-8 text-right font-bold">${price.toFixed(2)}</td>
                                                <td className="px-6 py-8 text-right font-black text-lg text-sidebar-topbar">${price.toFixed(2)}</td>
                                            </tr>
                                            {isTeamPlan && (
                                                 <tr className="bg-white">
                                                    <td className="px-6 py-8">
                                                        <p className="font-black text-sidebar-topbar text-base">Additional Member Seats</p>
                                                        <p className="text-xs text-text-muted font-bold mt-1 uppercase tracking-tight opacity-70">x2 Seats - Professional Tier</p>
                                                    </td>
                                                    <td className="px-6 py-8 text-center font-bold">2</td>
                                                    <td className="px-6 py-8 text-right font-bold">$20.00</td>
                                                    <td className="px-6 py-8 text-right font-black text-lg text-sidebar-topbar">$40.00</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Calculation Footer */}
                                <div className="mt-12 flex justify-end">
                                    <div className="w-full max-w-sm space-y-4">
                                        <div className="flex justify-between items-center text-sm px-6">
                                            <span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                            <span className="font-black text-sidebar-topbar">${price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm px-6">
                                            <span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Tax (8%)</span>
                                            <span className="font-black text-sidebar-topbar">${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="bg-sidebar-topbar text-white p-8 rounded-2xl flex justify-between items-center shadow-2xl shadow-sidebar-topbar/20 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            <span className="text-xs font-black uppercase tracking-[0.25em] opacity-80 z-10">Total Amount</span>
                                            <span className="text-4xl font-black z-10">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms & Notes */}
                                <div className="mt-24 border-t-2 border-border-light pt-10 flex flex-col md:flex-row justify-between gap-12 items-end">
                                    <div className="space-y-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-status-success-light text-status-success-dark rounded-full text-[11px] font-black uppercase tracking-widest border border-status-success/10">
                                            <IconCheck className="w-3.5 h-3.5" /> 
                                            <span>Paid in Full</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Terms & Notes</h4>
                                            <p className="text-xs text-text-secondary leading-relaxed max-w-sm font-medium">
                                                Subscription auto-renews on Feb 23, 2026. For performance metrics or Snowflake consumption inquiries, visit the Anavsan console. Thank you for using our platform.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2 pb-1">
                                        <p className="text-xs font-black text-sidebar-topbar uppercase tracking-[0.2em]">Anavsan Support</p>
                                        <p className="text-xs text-text-secondary font-bold">support@anavsan.com</p>
                                        <p className="text-xs text-text-secondary font-bold underline underline-offset-4 decoration-primary/30">www.anavsan.com/help</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Bottom Feedback */}
                        <div className="bg-white border-t border-border-color px-10 py-6 flex items-center gap-4 flex-shrink-0">
                             <div className="w-10 h-10 rounded-full border-2 border-status-success flex items-center justify-center text-status-success">
                                <IconCheck className="w-5 h-5" />
                             </div>
                             <p className="text-sm text-text-secondary font-medium">
                                <span className="font-black text-text-strong">Payment successful.</span> This invoice was fully paid on {currentDate}.
                             </p>
                             <div className="ml-auto flex items-center gap-4">
                                <button onClick={() => setStep('success')} className="text-sm font-black text-primary hover:underline">
                                    Back to dashboard
                                </button>
                                <button onClick={onClose} className="px-6 py-2 bg-sidebar-topbar text-white text-xs font-black rounded-lg uppercase tracking-widest shadow-lg">
                                    Finish
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentFlowModal;
