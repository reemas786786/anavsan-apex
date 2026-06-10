import React, { useState, useMemo } from 'react';
import { QueryListItem, User, AssignmentPriority } from '../types';

interface AssignQueryFlowProps {
    query: QueryListItem;
    users: User[];
    onCancel: () => void;
    onAssign: (assignmentDetails: { assignee: string; priority: AssignmentPriority; message: string; }) => void;
}

const AssignQueryFlow: React.FC<AssignQueryFlowProps> = ({ query, users, onCancel, onAssign }) => {
    const engineers = users.filter(u => u.role === 'DataEngineer' || u.role === 'Admin');

    const [assigneeInput, setAssigneeInput] = useState('');
    const [priority, setPriority] = useState<AssignmentPriority>('Medium');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!assigneeInput) {
            alert("Please select or enter an engineer to assign the query to.");
            return;
        }
        const existingUser = users.find(u => u.email.toLowerCase() === assigneeInput.toLowerCase());
        const assigneePayload = existingUser ? existingUser.id : assigneeInput;
        onAssign({ assignee: assigneePayload, priority, message });
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans min-h-0 overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="p-8 space-y-10 flex-grow overflow-y-auto no-scrollbar">
                {/* Section: Assign Query */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-[13px] font-black text-[#5A5A72] uppercase tracking-[0.1em]">Assign Query</label>
                        <p className="text-[13px] text-text-muted font-medium">Request a Data Engineer to analyze and optimize this query.</p>
                    </div>
                    <div className="p-6 bg-white border border-border-light rounded-2xl shadow-sm">
                        <pre className="text-[13px] font-mono text-text-primary leading-relaxed whitespace-pre-wrap">
                            <code>{query.queryText}</code>
                        </pre>
                    </div>
                </div>

                {/* Section: Data Engineer */}
                <div className="space-y-3">
                    <label htmlFor="assignee-input" className="block text-[13px] font-black text-[#5A5A72] uppercase tracking-[0.1em]">
                        Data Engineer (Assignee)
                    </label>
                    <input
                        id="assignee-input"
                        type="email"
                        list="engineers-list"
                        value={assigneeInput}
                        onChange={(e) => setAssigneeInput(e.target.value)}
                        className="w-full border border-border-light rounded-[20px] px-6 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-white placeholder-[#9A9AB2] shadow-sm transition-all"
                        placeholder="Select engineer or enter email..."
                    />
                    <datalist id="engineers-list">
                        {engineers.map(user => (
                            <option key={user.id} value={user.email}>{user.name}</option>
                        ))}
                    </datalist>
                </div>

                {/* Section: Priority */}
                <fieldset className="space-y-4">
                    <legend className="block text-[13px] font-black text-[#5A5A72] uppercase tracking-[0.1em]">Assignment Priority</legend>
                    <div className="flex gap-10">
                        {(['Low', 'Medium', 'High'] as AssignmentPriority[]).map(p => (
                            <label key={p} className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={priority === p}
                                        onChange={() => setPriority(p)}
                                        className="h-6 w-6 text-primary border-gray-300 focus:ring-primary appearance-none rounded-full border-2 checked:border-primary transition-all"
                                    />
                                    {priority === p && (
                                        <div className="absolute w-3 h-3 bg-primary rounded-full shadow-sm" />
                                    )}
                                </div>
                                <span className="ml-3 text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{p}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
                
                {/* Section: Instructions */}
                <div className="space-y-3">
                     <label htmlFor="message" className="block text-[13px] font-black text-[#5A5A72] uppercase tracking-[0.1em]">Instructions / Context</label>
                     <textarea
                        id="message"
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-border-light rounded-[32px] px-6 py-6 text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-white placeholder-[#9A9AB2] shadow-sm transition-all resize-none leading-relaxed"
                        placeholder="e.g., This query is consuming significant credits. Please investigate partition pruning opportunities."
                     />
                </div>
            </div>

            {/* Pinned Footer */}
            <div className="p-8 bg-[#F9F7FE] border-t border-border-light flex justify-end items-center gap-8 flex-shrink-0">
                <button 
                    onClick={onCancel} 
                    className="text-sm font-bold text-text-secondary hover:text-text-strong transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="bg-primary hover:bg-primary-hover text-white font-black px-10 py-4 rounded-full shadow-xl shadow-primary/20 transition-all active:scale-95 text-sm uppercase tracking-widest"
                >
                    Assign to engineer
                </button>
            </div>
        </div>
    );
};

export default AssignQueryFlow;