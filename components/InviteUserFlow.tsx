import React, { useState } from 'react';

interface InviteUserFlowProps {
    onCancel: () => void;
    onAddUser: (data: { email: string; }) => void;
}

const InviteUserFlow: React.FC<InviteUserFlowProps> = ({ onCancel, onAddUser }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (!email.trim() || !email.includes('@')) {
            // Add more robust validation as needed
            return;
        }
        onAddUser({ email });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-4 flex-grow">
                <p className="text-sm text-text-secondary">
                    Enter the email address of the user you'd like to invite. They will receive an email with instructions to join.
                </p>
                
                <div>
                    <label htmlFor="email" className="sr-only">
                        Enter Mail ID
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="Enter Mail ID"
                        aria-required="true"
                    />
                </div>
            </div>

            <div className="p-6 flex justify-end items-center gap-3 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-sm font-semibold px-6 py-2.5 rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors"
                    aria-label="Cancel adding user"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-6 py-2.5 rounded-full shadow-sm"
                    aria-label="Send user invite"
                >
                    Send Invite
                </button>
            </div>
        </div>
    );
};

export default InviteUserFlow;