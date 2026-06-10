
import React from 'react';
import { PullRequest, Reviewer, User } from '../types';
import { IconGitBranch, IconPullRequest, IconCheckCircle } from '../constants';
import PerformanceSummary from '../components/PerformanceSummary';
import AutomatedChecks from '../components/AutomatedChecks';
import CodeDiffViewer from '../components/CodeDiffViewer';

interface PullRequestDetailViewProps {
    pullRequest: PullRequest;
    onBack: () => void;
    users: User[];
}

const UserAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    return (
        <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0" title={name}>
            {initials}
        </div>
    );
};

const PullRequestDetailView: React.FC<PullRequestDetailViewProps> = ({ pullRequest, onBack, users }) => {
    const author = users.find(u => u.name === pullRequest.author);

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            {/* Header */}
            <div>
                <button onClick={onBack} className="text-sm font-semibold text-link hover:underline mb-2">
                    &larr; Back to Pull Requests
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-text-primary">{pullRequest.title}</span>
                    <span className="text-3xl font-light text-text-muted">#{pullRequest.id}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-status-success-light text-status-success-dark font-medium">
                        <IconCheckCircle className="h-4 w-4" /> {pullRequest.status}
                    </span>
                    <div className="flex items-center gap-1">
                        {author && <UserAvatar name={author.name} />}
                        <span className="font-semibold text-text-primary">{pullRequest.author}</span>
                        wants to merge into
                        <span className="inline-flex items-center gap-1 font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            <IconGitBranch className="h-4 w-4" /> {pullRequest.targetBranch}
                        </span>
                        from
                        <span className="inline-flex items-center gap-1 font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                           <IconGitBranch className="h-4 w-4" /> {pullRequest.sourceBranch}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface rounded-2xl border border-border-color">
                        <h3 className="text-base font-semibold text-text-strong p-4 border-b border-border-color">Performance Summary</h3>
                        <div className="p-4">
                            <PerformanceSummary metrics={pullRequest.performanceMetrics} />
                        </div>
                    </div>
                     <div className="bg-surface rounded-2xl border border-border-color">
                        <h3 className="text-base font-semibold text-text-strong p-4 border-b border-border-color">SQL Diff</h3>
                        <div className="p-4">
                           {/* Fix: Added missing required props for CodeDiffViewer */}
                           <CodeDiffViewer 
                                oldCode={pullRequest.oldCode} 
                                newCode={pullRequest.newCode} 
                                originalTitle="Base Code"
                                optimizedTitle="New Changes"
                                originalTooltip="Original source query before optimization"
                                optimizedTooltip="The rewritten query proposed in this pull request"
                           />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-surface rounded-2xl border border-border-color p-4">
                        <AutomatedChecks checks={pullRequest.automatedChecks} />
                    </div>
                    <div className="bg-surface rounded-2xl border border-border-color p-4">
                        <h3 className="text-sm font-semibold text-text-strong mb-2">Reviewers</h3>
                        {pullRequest.reviewers.map(reviewer => (
                            <div key={reviewer.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserAvatar name={reviewer.name} />
                                    <div>
                                        <p className="font-semibold text-text-primary text-sm">{reviewer.name}</p>
                                        <p className="text-xs text-text-secondary">{reviewer.role}</p>
                                    </div>
                                </div>
                                {reviewer.approved 
                                    ? <IconCheckCircle className="h-5 w-5 text-status-success" />
                                    : <span className="text-xs font-semibold text-status-warning-dark">Pending</span>
                                }
                            </div>
                        ))}
                    </div>
                     <div className="bg-surface rounded-2xl border border-border-color p-4 space-y-3">
                        <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-hover transition-colors">Approve & Merge</button>
                        <button className="w-full bg-button-secondary-bg text-text-primary font-semibold py-2 rounded-lg hover:bg-button-secondary-bg-hover transition-colors">Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PullRequestDetailView;
