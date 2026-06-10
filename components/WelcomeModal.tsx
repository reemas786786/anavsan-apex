import React, { useState } from 'react';
import { IconClose } from '../constants';

interface ConfigureWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: { orgName: string; plan: 'Individual' | 'Team' }) => void;
}

const IconArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ConfigureWorkspaceModal: React.FC<ConfigureWorkspaceModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [orgName, setOrgName] = useState('');
    const [selectedMode, setSelectedMode] = useState<'Individual' | 'Team'>('Individual');

    if (!isOpen) return null;

    const handleInitialize = () => {
        if (!orgName.trim()) return;
        onComplete({ orgName, plan: selectedMode });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-lg w-full max-w-[840px] shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 flex flex-col my-auto border border-border-light overflow-hidden">
                
                {/* Header */}
                <div className="px-10 pt-10 pb-6 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 p-1 hover:bg-surface-nested rounded-lg text-text-muted transition-colors"
                    >
                        <IconClose className="w-6 h-6" />
                    </button>
                    <h2 className="text-[32px] font-bold text-text-strong tracking-tight">Configure your Workspace</h2>
                    <p className="text-base text-text-secondary mt-1">Provide your organization details and select a trial plan to begin.</p>
                </div>

                {/* Content */}
                <div className="px-10 py-4 space-y-10">
                    {/* Organization Name Input */}
                    <div className="space-y-3">
                        <label htmlFor="orgName" className="block text-sm font-semibold text-text-secondary">Organization Name</label>
                        <input 
                            autoFocus
                            id="orgName"
                            type="text" 
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="e.g., Global Data Corp"
                            className="w-full px-5 py-4 bg-[#F5F5F5] border-b-2 border-transparent focus:border-primary rounded-t-lg text-base outline-none transition-all placeholder:text-text-muted/60 text-text-strong font-medium"
                        />
                        <p className="text-sm text-text-muted">This will be used as the primary identifier for your workspace.</p>
                    </div>

                    {/* Management Scope Selection */}
                    <div className="space-y-6">
                        <label className="block text-sm font-semibold text-text-secondary">Select Management Scope & Trial Plan</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Individual Mode */}
                            <button 
                                onClick={() => setSelectedMode('Individual')}
                                className={`text-left p-6 rounded-lg border-2 transition-all flex flex-col h-full ${
                                    selectedMode === 'Individual' 
                                    ? 'bg-white border-primary ring-1 ring-primary' 
                                    : 'bg-white border-border-color hover:border-primary/50 group'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-text-strong">Individual mode</h3>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedMode === 'Individual' ? 'border-primary' : 'border-border-color group-hover:border-primary/50'
                                    }`}>
                                        {selectedMode === 'Individual' && <div className="w-3 h-3 bg-primary rounded-full shadow-sm" />}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-primary mb-3">Includes 14-day Individual Trial</p>
                                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                    Optimized for a single data engineer. Focuses on personal query simulation and private cost tracking.
                                </p>
                            </button>

                            {/* Team Mode */}
                            <button 
                                onClick={() => setSelectedMode('Team')}
                                className={`text-left p-6 rounded-lg border-2 transition-all flex flex-col h-full ${
                                    selectedMode === 'Team' 
                                    ? 'bg-white border-primary ring-1 ring-primary' 
                                    : 'bg-white border-border-color hover:border-primary/50 group'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-text-strong">Team mode</h3>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedMode === 'Team' ? 'border-primary' : 'border-border-color group-hover:border-primary/50'
                                    }`}>
                                        {selectedMode === 'Team' && <div className="w-3 h-3 bg-primary rounded-full shadow-sm" />}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-primary mb-3">Includes 14-day Team Trial</p>
                                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                    Designed for multi-user collaboration. Includes centralized billing and shared organizational dashboards.
                                </p>
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-sm text-text-secondary font-medium">
                        No credit card required. You can change your plan at any time after the trial period.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t border-border-light flex justify-end bg-[#FDFCFE]">
                    <button 
                        onClick={handleInitialize}
                        disabled={!orgName.trim()}
                        className="bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-text-muted text-white font-bold py-5 px-12 flex items-center gap-4 transition-all text-base min-w-[280px] justify-center"
                    >
                        Initialize Workspace
                        <IconArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigureWorkspaceModal;