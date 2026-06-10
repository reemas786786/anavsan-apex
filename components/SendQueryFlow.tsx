
import React, { useState } from 'react';

interface SendQueryFlowProps {
    onCancel: () => void;
    onSend: (data: any) => void;
}

const SendQueryFlow: React.FC<SendQueryFlowProps> = ({ onCancel, onSend }) => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(formData);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow overflow-y-auto">
                <div className="rounded-[24px] p-[2px] bg-gradient-to-tr from-[#ff3d77] via-[#ffb800] to-[#3de0ff]">
                    <div className="bg-white rounded-[22px] p-6 space-y-6 shadow-sm">
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Name</label>
                                <input 
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-2xl text-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Company Name</label>
                                <input 
                                    required
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Enter your company name"
                                    className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-2xl text-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Business Email</label>
                                <input 
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-2xl text-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Phone</label>
                                <input 
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your number"
                                    className="w-full px-5 py-3.5 bg-[#F2F2F2] border-none rounded-2xl text-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Message</label>
                                <textarea 
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Enter your message"
                                    rows={4}
                                    className="w-full px-5 py-4 bg-[#F2F2F2] border-none rounded-2xl text-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-center text-text-muted italic">Our team will get back to you within 24 hours.</p>
            </div>

            <div className="p-6 bg-background flex justify-between items-center flex-shrink-0 border-t border-border-color">
                <button onClick={onCancel} className="text-sm font-bold text-text-secondary hover:text-text-primary">Cancel</button>
                <button 
                    onClick={handleSubmit}
                    className="bg-sidebar-topbar text-white font-black px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm"
                >
                    Send Your Message
                </button>
            </div>
        </div>
    );
};

export default SendQueryFlow;
