

import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface EditUserRoleFlowProps {
    user: User;
    onCancel: () => void;
    onSave: (userId: string, newRole: UserRole) => void;
}

const EditUserRoleFlow: React.FC<EditUserRoleFlowProps> = ({ user, onCancel, onSave }) => {
    const [role, setRole] = useState<UserRole>(user.role);

    const handleSubmit = () => {
        onSave(user.id, role);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <p className="text-sm text-text-secondary">
                    Update the role for <span className="font-semibold text-text-primary">{user.email}</span>.
                </p>
                
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                    >
                        <option>Admin</option>
                        <option>Analyst</option>
                        <option>Viewer</option>
                    </select>
                </div>
            </div>

            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditUserRoleFlow;
