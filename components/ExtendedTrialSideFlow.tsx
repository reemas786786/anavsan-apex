
import React, { useState } from 'react';

interface ExtendedTrialSideFlowProps {
    onCancel: () => void;
    onApply: (data: any) => void;
}

const ExtendedTrialSideFlow: React.FC<ExtendedTrialSideFlowProps> = ({ onCancel, onApply }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        businessEmail: '',
        phoneNumber: '',
        certificationType: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApply(formData);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-8 flex-grow overflow-y-auto">
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <h1 className="text-6xl font-bold">
                            <span style={{fontFamily: 'serif', background: 'linear-gradient(to bottom right, #A78BFA, #6932D5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} className="text-7xl">
                                A
                            </span>
                        </h1>
                    </div>
                    <h2 className="text-3xl font-black text-sidebar-topbar tracking-tight">Get extended access</h2>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-sm mx-auto">
                        If you are a SnowPro certified professional looking to leverage Anavsan, signup here to get extended trial for additional 14 days.
                    </p>
                </div>

                <div className="space-y-4 max-w-sm mx-auto w-full">
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                            required
                            type="text" 
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder:text-text-muted"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Company</label>
                        <input 
                            required
                            type="text" 
                            name="companyName"
                            placeholder="Enter your company name"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder:text-text-muted"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
                        <input 
                            required
                            type="email" 
                            name="businessEmail"
                            placeholder="Enter your business email"
                            value={formData.businessEmail}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder:text-text-muted"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Phone</label>
                        <input 
                            required
                            type="tel" 
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder:text-text-muted"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Certification</label>
                        <textarea 
                            required
                            name="certificationType"
                            placeholder="Enter your SnowPro certification type"
                            value={formData.certificationType}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-5 py-4 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder:text-text-muted resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-background flex justify-between items-center flex-shrink-0 border-t border-border-color">
                <button onClick={onCancel} className="text-sm font-bold text-text-secondary hover:text-text-primary">Cancel</button>
                <button 
                    onClick={handleSubmit}
                    className="bg-sidebar-topbar text-white font-black px-10 py-3 rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 text-sm"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default ExtendedTrialSideFlow;
