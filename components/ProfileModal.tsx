import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { IconEdit } from '../constants';
import Modal from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
  onLogout: () => void;
}

const ProfileCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-background p-6 rounded-3xl border border-border-color">
        <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>
        {children}
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave, onLogout }) => {
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: user.name, email: user.email, roleTitle: user.roleTitle || '' });
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Reset state if user prop changes (e.g. external update)
        if (user) {
            setUserInfo({ name: user.name, email: user.email, roleTitle: user.roleTitle || '' });
        }
    }, [user]);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSaveInfo = () => {
        onSave({ ...user, ...userInfo });
        setIsEditingInfo(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSavePassword = () => {
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 8) {
             alert("Password must be at least 8 characters long.");
            return;
        }
        // Mock save
        alert("Password changed successfully (mock).");
        setPasswords({ old: '', new: '', confirm: '' });
    };
    
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const InfoField: React.FC<{label: string, value: string, name: string, isEditing: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, value, name, isEditing, onChange}) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary">{label}</label>
            {isEditing ? (
                <input type="text" name={name} value={value} onChange={onChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
            ) : (
                <p className="mt-1 text-sm text-text-primary">{value}</p>
            )}
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Profile">
            <div className="p-8 space-y-6 bg-surface">
                <ProfileCard title="User Info">
                    <div className="space-y-4">
                        <InfoField label="Display Name" name="name" value={userInfo.name} isEditing={isEditingInfo} onChange={handleInfoChange} />
                        <InfoField label="Email" name="email" value={userInfo.email} isEditing={isEditingInfo} onChange={handleInfoChange} />
                        <InfoField label="Role Title" name="roleTitle" value={userInfo.roleTitle} isEditing={isEditingInfo} onChange={handleInfoChange} />
                    </div>
                    <div className="mt-4 text-right">
                        {isEditingInfo ? (
                             <button onClick={handleSaveInfo} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save</button>
                        ) : (
                            <button onClick={() => setIsEditingInfo(true)} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 flex items-center gap-2 ml-auto">
                                <IconEdit className="h-4 w-4" /> Edit
                            </button>
                        )}
                    </div>
                </ProfileCard>

                <ProfileCard title="Change Password">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Old Password</label>
                            <input type="password" name="old" value={passwords.old} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">New Password</label>
                            <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Confirm Password</label>
                            <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <button onClick={handleSavePassword} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save Changes</button>
                    </div>
                </ProfileCard>

                <ProfileCard title="Branding">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-border-color">
                            {logo ? <img src={logo} alt="Logo Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-text-muted">Logo</span>}
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary mb-2">Upload your company logo (PNG or SVG recommended).</p>
                             <input type="file" accept="image/png, image/svg+xml" onChange={handleLogoUpload} ref={fileInputRef} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">
                                {logo ? 'Replace Logo' : 'Upload Logo'}
                            </button>
                        </div>
                    </div>
                </ProfileCard>

                <div className="pt-6 border-t border-border-color">
                    <button onClick={onLogout} className="w-full text-sm font-semibold text-status-error bg-status-error/10 hover:bg-status-error/20 px-4 py-2 rounded-full">
                        Logout
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
