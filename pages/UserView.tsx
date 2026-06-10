

import React from 'react';
import { User } from '../types';

interface UserViewProps {
    user: User;
    onBack: () => void;
}

const UserView: React.FC<UserViewProps> = ({ user, onBack }) => {
    return (
        <div className="flex flex-col h-full bg-background">
            <main className="flex-1 overflow-y-auto p-4">
                <div className="bg-surface p-4 rounded-3xl">
                    <h1 className="text-2xl font-bold text-text-primary">{user.name}'s Overview</h1>
                    <p className="mt-2 text-text-secondary">Detailed metrics for this user, such as queries run, spend history, and optimization opportunities, will be displayed here.</p>
                </div>
            </main>
        </div>
    );
};

export default UserView;