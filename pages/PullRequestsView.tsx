import React from 'react';
import { PullRequest, PullRequestStatus } from '../types';
import { IconPullRequest, IconCheckCircle } from '../constants';

interface PullRequestsViewProps {
    pullRequests: PullRequest[];
    onSelectPullRequest: (pr: PullRequest) => void;
}

const StatusBadge: React.FC<{ status: PullRequestStatus }> = ({ status }) => {
    const colorClasses: Record<PullRequestStatus, string> = {
        Open: 'bg-status-success-light text-status-success-dark',
        Merged: 'bg-primary/10 text-primary',
        Closed: 'bg-status-error-light text-status-error-dark',
        Draft: 'bg-gray-200 text-gray-800',
    };

     const Icon: React.FC = () => {
        switch(status) {
            case 'Open': return <IconCheckCircle className="h-4 w-4" />;
            case 'Merged': return <IconPullRequest className="h-4 w-4" />;
            default: return <IconPullRequest className="h-4 w-4" />;
        }
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <Icon />
            {status}
        </span>
    );
}

const PullRequestsView: React.FC<PullRequestsViewProps> = ({ pullRequests, onSelectPullRequest }) => {
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Pull Requests</h1>
                <p className="mt-1 text-text-secondary">Review and manage proposed query changes before merging them.</p>
            </div>
            <div className="bg-surface rounded-xl border border-border-color">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Title</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Author</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {pullRequests.map(pr => (
                                <tr key={pr.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" onClick={() => onSelectPullRequest(pr)}>
                                    <td className="px-6 py-3 font-medium text-text-primary whitespace-nowrap">
                                        #{pr.id} {pr.title}
                                    </td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={pr.status} />
                                    </td>
                                    <td className="px-6 py-3">{pr.author}</td>
                                    <td className="px-6 py-3">{formatDate(pr.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PullRequestsView;