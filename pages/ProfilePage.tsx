import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User } from '../types';
import { IconUser, IconLockClosed, IconBell, IconPhoto, IconEdit, IconChevronLeft, IconChevronRight, IconAdjustments, IconCreditCard, IconCheck, IconCheckCircle } from '../constants';

const IconEye: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconEyeOff: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const PasswordInput: React.FC<{ label: string, id: string, value: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, id, value, name, onChange, placeholder }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder-text-muted/50 shadow-sm"
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-text-muted hover:text-text-primary"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                >
                    {isVisible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
};

const UserInformationSection: React.FC<{ user: User }> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        organization: user.organization || '',
        email: user.email
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
        }, 800);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm">
                <div className="flex justify-end items-start mb-8">
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5"
                        >
                            <IconEdit className="h-3.5 w-3.5" />
                            Edit details
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">First name</label>
                        {isEditing ? (
                            <input 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-primary"
                            />
                        ) : (
                            <p className="text-sm text-text-primary font-bold px-1">{formData.firstName}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Last name</label>
                        {isEditing ? (
                            <input 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-primary"
                            />
                        ) : (
                            <p className="text-sm text-text-primary font-bold px-1">{formData.lastName}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Organization</label>
                        {isEditing ? (
                            <input 
                                value={formData.organization}
                                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                                className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-primary"
                            />
                        ) : (
                            <p className="text-sm text-text-primary font-bold px-1">{formData.organization || 'Not set'}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
                        {isEditing ? (
                            <input 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-primary"
                            />
                        ) : (
                            <p className="text-sm text-text-primary font-bold px-1">{formData.email}</p>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-12 pt-8 border-t border-border-light flex justify-end gap-4">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="text-xs font-black text-text-secondary uppercase tracking-widest px-6 py-3 hover:text-text-strong transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-primary text-white font-black px-10 py-3 rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const BillingInformationSection: React.FC = () => {
    const [billingInfo, setBillingInfo] = useState({
        companyName: 'Anavsan Inc.',
        vatId: 'VAT-9482103',
        address: '123 Optimization Way',
        city: 'Cloud City',
        postalCode: '10101',
        country: 'United States'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm">
                <p className="text-sm text-text-secondary mb-8">These details will be used for all future invoices and tax compliance.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                        <input name="companyName" value={billingInfo.companyName} onChange={handleInfoChange} className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3.5 text-sm focus:ring-1 focus:ring-primary shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5 ml-1">VAT / Tax ID</label>
                        <input name="vatId" value={billingInfo.vatId} onChange={handleInfoChange} className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3.5 text-sm focus:ring-1 focus:ring-primary shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5 ml-1">Country</label>
                        <input name="country" value={billingInfo.country} onChange={handleInfoChange} className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3.5 text-sm focus:ring-1 focus:ring-primary shadow-sm" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5 ml-1">Billing Address</label>
                        <input name="address" value={billingInfo.address} onChange={handleInfoChange} className="w-full bg-surface-nested border border-border-light rounded-2xl px-5 py-3.5 text-sm focus:ring-1 focus:ring-primary shadow-sm" />
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border-light flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`font-black px-10 py-3 rounded-full transition-all shadow-lg text-xs uppercase tracking-widest flex items-center gap-2 ${
                            showSaved ? 'bg-status-success text-white' : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20'
                        }`}
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : showSaved ? <><IconCheckCircle className="h-4 w-4" /> Saved</> : 'Save Billing Details'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChangePasswordSection: React.FC = () => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) return;
        if (passwords.new !== passwords.confirm) {
            alert("Passwords don't match");
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setStatus('success');
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setStatus('idle'), 4000);
        }, 1200);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm">
                <div className="max-w-md space-y-6">
                    <PasswordInput
                        id="current-password"
                        name="current"
                        label="Current password"
                        value={passwords.current}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />
                    <div className="h-px bg-border-light my-2"></div>
                    <PasswordInput
                        id="new-password"
                        name="new"
                        label="New password"
                        value={passwords.new}
                        onChange={handleChange}
                        placeholder="Enter new password"
                    />
                    <PasswordInput
                        id="confirm-new-password"
                        name="confirm"
                        label="Confirm new password"
                        value={passwords.confirm}
                        onChange={handleChange}
                        placeholder="Repeat new password"
                    />
                </div>
                <div className="mt-12 pt-8 border-t border-border-light flex justify-end items-center gap-6">
                    {status === 'success' && (
                        <p className="text-sm font-bold text-status-success-dark flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                            <IconCheckCircle className="h-4 w-4" />
                            Password updated successfully
                        </p>
                    )}
                    <button 
                        onClick={handleUpdate}
                        disabled={isSaving || !passwords.current}
                        className="bg-primary text-white font-black px-10 py-3 rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                    >
                         {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const BrandSettingsSection: React.FC = () => {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [brandColor, setBrandColor] = useState('#6932D5');
    const [isSaving, setIsSaving] = useState(false);
    const [showApplied, setShowApplied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApply = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowApplied(true);
            setTimeout(() => setShowApplied(false), 2500);
        }, 900);
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm">
                <div className="space-y-12">
                    {/* Logo Section */}
                    <div>
                        <h3 className="text-base font-bold text-text-strong">Company Logo</h3>
                        <p className="text-sm text-text-secondary mt-1 font-medium">This logo will be displayed in the header for all users. SVG, PNG, or JPG recommended.</p>
                        <div className="mt-6 flex items-center gap-8">
                            <div className="w-56 h-20 bg-surface-nested rounded-2xl flex items-center justify-center border border-border-light shadow-inner">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="max-w-[80%] max-h-[80%] object-contain" />
                                ) : (
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Logo preview</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white border border-border-color text-text-strong font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-surface-nested transition-all shadow-sm"
                                >
                                    Upload logo
                                </button>
                                {logoPreview && (
                                     <button
                                        onClick={() => setLogoPreview(null)}
                                        className="text-text-muted font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:text-status-error transition-all"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Brand Color Section */}
                    <div>
                         <h3 className="text-base font-bold text-text-strong">Brand Identity Color</h3>
                        <p className="text-sm text-text-secondary mt-1 font-medium">Choose a primary color for your workspace theme components.</p>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="relative w-14 h-14 group">
                                <div
                                    className="absolute inset-0 rounded-2xl border-4 border-white shadow-lg pointer-events-none z-10 group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: brandColor }}
                                ></div>
                                 <input
                                    type="color"
                                    value={brandColor}
                                    onChange={(e) => setBrandColor(e.target.value)}
                                    className="w-full h-full p-0 border-none rounded-2xl cursor-pointer appearance-none bg-transparent opacity-0"
                                    title="Select brand color"
                                />
                            </div>
                            <input
                                type="text"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="w-44 border border-border-light rounded-full px-5 py-3 text-sm font-mono focus:ring-1 focus:ring-primary shadow-inner bg-surface-nested text-text-strong font-bold"
                                placeholder="#6932D5"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border-light flex justify-end">
                    <button 
                        onClick={handleApply}
                        disabled={isSaving}
                        className={`font-black px-10 py-3 rounded-full transition-all shadow-lg text-xs uppercase tracking-widest flex items-center gap-2 ${
                            showApplied ? 'bg-status-success text-white' : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20'
                        }`}
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : showApplied ? <><IconCheckCircle className="h-4 w-4" /> Applied</> : 'Apply Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const NotificationPreferencesSection: React.FC = () => {
    const [preferences, setPreferences] = useState({
        emailActivity: true,
        emailWeeklyDigest: false,
        slackAlerts: true,
        highCostSpikes: true,
        unassignedTasks: false,
    });

    const handleToggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm space-y-6">
                <div>
                    <h3 className="text-base font-bold text-text-strong">Notification preferences</h3>
                    <p className="text-sm text-text-secondary mt-1 font-medium">Configure where you receive optimization reports and automated action alerts.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-nested rounded-2xl border border-border-light">
                        <div>
                            <p className="text-sm font-bold text-text-strong">Email daily alert logs</p>
                            <p className="text-xs text-text-muted mt-0.5">Receive immediate notification of anomalous cost spikes in your connected accounts.</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleToggle('emailActivity')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.emailActivity ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.emailActivity ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-nested rounded-2xl border border-border-light">
                        <div>
                            <p className="text-sm font-bold text-text-strong">Weekly cost digest</p>
                            <p className="text-xs text-text-muted mt-0.5">Receive a summary report showing your total savings and query optimizations every Monday.</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleToggle('emailWeeklyDigest')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.emailWeeklyDigest ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.emailWeeklyDigest ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-nested rounded-2xl border border-border-light">
                        <div>
                            <p className="text-sm font-bold text-text-strong">Slack workspace integration</p>
                            <p className="text-xs text-text-muted mt-0.5">Push critical recommendation updates directly into your #finops Slack channel.</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleToggle('slackAlerts')}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.slackAlerts ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.slackAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SystemUnitPreferencesCard: React.FC<{
    displayMode?: 'cost' | 'credits';
    onDisplayModeChange?: (mode: 'cost' | 'credits') => void;
}> = ({ displayMode = 'credits', onDisplayModeChange }) => {
    return (
        <div id="portal-display-unit-settings-card" className="bg-surface p-8 rounded-[24px] border border-border-light shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-base font-bold text-text-strong mb-2">Portal Display Unit</h3>
            <p className="text-sm text-text-secondary mb-6 font-medium">Choose whether Snowflake data cloud consumption is calculated in Snowflake credits or in USD currency equivalent across all dashboards.</p>
            
            <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-surface-nested p-1.5 rounded-2xl flex border border-border-light shadow-sm">
                    <button
                        id="display-unit-toggle-credits"
                        onClick={() => onDisplayModeChange?.('credits')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            displayMode === 'credits'
                                ? 'bg-primary text-white shadow-md shadow-primary/10'
                                : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        Snowflake Credits (cr)
                    </button>
                    <button
                        id="display-unit-toggle-usd"
                        onClick={() => onDisplayModeChange?.('cost')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            displayMode === 'cost'
                                ? 'bg-primary text-white shadow-md shadow-primary/10'
                                : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        USD Currency ($)
                    </button>
                </div>
                
                <div className="text-xs font-semibold text-text-muted bg-surface-nested/45 px-4 py-3 rounded-2xl border border-border-light/40">
                    Currently: <span className="text-primary font-black uppercase">{displayMode === 'cost' ? 'USD Equivalent ($3.00/cr)' : 'Credits'}</span>
                </div>
            </div>
        </div>
    );
};

interface ProfilePageProps {
    user: User;
    onBack: () => void;
    theme: string;
    onThemeChange: (theme: string) => void;
    initialSection?: string;
    displayMode?: 'cost' | 'credits';
    onDisplayModeChange?: (mode: 'cost' | 'credits') => void;
}


const ProfilePage: React.FC<ProfilePageProps> = ({ user, initialSection, displayMode, onDisplayModeChange }) => {
    const [activeSection, setActiveSection] = useState(initialSection || 'User information');

    useEffect(() => {
        if (initialSection) {
            setActiveSection(initialSection);
        }
    }, [initialSection]);

    const navItems = [
        { name: 'User information', icon: IconUser },
        { name: 'Notification preferences', icon: IconBell },
        { name: 'Billing & plans', icon: IconCreditCard },
        { name: 'Change password', icon: IconLockClosed },
        { name: 'Brand settings', icon: IconPhoto },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'User information': 
                return (
                    <div className="space-y-6">
                        <UserInformationSection user={user} />
                        <SystemUnitPreferencesCard displayMode={displayMode} onDisplayModeChange={onDisplayModeChange} />
                    </div>
                );
            case 'Notification preferences': return <NotificationPreferencesSection />;
            case 'Billing & plans': return <BillingInformationSection />;
            case 'Change password': return <ChangePasswordSection />;
            case 'Brand settings': return <BrandSettingsSection />;
            default: return <UserInformationSection user={user} />;
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 overflow-y-auto no-scrollbar">
            <div className="max-w-6xl mx-auto w-full space-y-8">
                {/* Unified Header */}
                <header className="flex-shrink-0">
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Profile</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">Manage your identity, billing preferences, and workspace branding.</p>
                </header>

                {/* Horizontal Tab Navigation */}
                <div className="flex border-b border-border-light overflow-x-auto no-scrollbar gap-8">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => setActiveSection(item.name)}
                            className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-2.5 ${
                                activeSection === item.name 
                                ? 'text-primary font-black' 
                                : 'text-text-muted hover:text-text-secondary'
                            }`}
                        >
                            <item.icon className={`h-4 w-4 ${activeSection === item.name ? 'text-primary' : 'text-text-muted'}`} />
                            {item.name}
                            {activeSection === item.name && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <main className="min-h-0 pt-4">
                    <div className="max-w-4xl">
                        {renderSection()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;