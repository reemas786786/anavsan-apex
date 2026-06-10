
import React, { useState } from 'react';
import { Transaction, Page } from '../../types';
import { IconSearch, IconArrowDown, IconFileText } from '../../constants';

const transactions: Transaction[] = [
    { id: 'TX-9482', date: 'Jan 10, 2024', amount: 239.00, status: 'Paid', plan: 'Team (Trial Upgrade)', invoiceUrl: '#' },
    { id: 'TX-9201', date: 'Dec 10, 2023', amount: 0.00, status: 'Paid', plan: 'Team Trial', invoiceUrl: '#' },
];

interface BillingHistoryProps {
    onNavigate: (page: Page, subPage?: string) => void;
    onDownloadInvoice: () => void;
}

const KPILabel: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const BillingHistory: React.FC<BillingHistoryProps> = ({ onNavigate, onDownloadInvoice }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full overflow-y-auto p-4 pb-12 space-y-4 no-scrollbar bg-background">
            {/* Header Section */}
            <header className="flex-shrink-0 mb-4">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Billing history</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Review your past payments and download invoices.</p>
            </header>

            {/* KPI Section */}
            <div className="flex flex-wrap items-center gap-3">
                <KPILabel label="Total invoices" value={transactions.length} />
                <KPILabel label="Paid" value={transactions.filter(t => t.status === 'Paid').length} />
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col">
                {/* Search Bar Row */}
                <div className="px-6 py-4 flex justify-end items-center border-b border-border-light bg-white">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search invoices..."
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light">ID</th>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light">Date</th>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light">Plan</th>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light">Amount</th>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light">Status</th>
                                <th className="px-6 py-4 text-[11px] font-black text-text-strong uppercase tracking-widest border-b border-border-light text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-surface-nested transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-text-strong font-mono uppercase">{tx.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-text-secondary">{tx.date}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-text-primary">{tx.plan}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-text-strong">${tx.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                                                tx.status === 'Paid' 
                                                ? 'bg-status-success-light text-status-success-dark border-status-success/10' 
                                                : 'bg-status-error-light text-status-error-dark border-status-error/10'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={onDownloadInvoice}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-all group/btn"
                                            >
                                                <span>Download PDF</span>
                                                <IconArrowDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-surface-nested flex items-center justify-center">
                                                <IconFileText className="w-6 h-6 text-text-muted" />
                                            </div>
                                            <p className="text-sm font-bold text-text-secondary">No invoices found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Insight / Action Area */}
            <div className="p-6 bg-primary/5 rounded-[24px] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
                <div className="text-center md:text-left">
                    <h4 className="text-base font-bold text-primary">Need specialized taxation details?</h4>
                    <p className="text-sm text-text-secondary mt-1">Add your VAT or GST details to your profile to include them in future invoices.</p>
                </div>
                <button 
                    onClick={() => onNavigate('Profile', 'Billing Information')}
                    className="whitespace-nowrap bg-white text-primary font-black px-6 py-2.5 rounded-full border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    Update Billing Profile
                </button>
            </div>
        </div>
    );
};

export default BillingHistory;
