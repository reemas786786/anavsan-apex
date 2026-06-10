import React, { useState } from 'react';
import { 
    Slack, 
    Github, 
    MessageSquare, 
    Layers, 
    Network, 
    ExternalLink, 
    Check, 
    Settings, 
    ArrowUpRight, 
    X,
    Info,
    AlertCircle
} from 'lucide-react';
import SidePanel from '../../components/SidePanel';
import ConfigureGitHubPanel from '../../components/ConfigureGitHubPanel';

const IconExternalLink: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
        <path d="M9 6h.01" />
        <path d="M15 6h.01" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
    </svg>
);

const SlackLogo: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 127.2 127.2">
        <path d="M22.6 75.3a8.2 8.2 0 1 1-8.2-8.3h8.2v8.3zm4.1 0a8.2 8.2 0 0 1 8.2-8.3h16.5a8.2 8.2 0 1 1 0 16.5H35a8.2 8.2 0 0 1-8.3-8.2zm0-24.7a8.2 8.2 0 1 1 8.3-8.2v8.2H26.7zm0 4.1a8.2 8.2 0 0 1 8.3 8.2v16.5a8.2 8.2 0 1 1-16.5 0v-16.5a8.2 8.2 0 0 1 8.2-8.2z" fill="#36C5F0"/>
        <path d="M51.9 22.6a8.2 8.2 0 1 1 8.2-8.2v8.2H51.9zm0 4.1H68.4a8.2 8.2 0 1 1 0 16.5H51.9v-16.5zm24.7 0a8.2 8.2 0 1 1 8.2 8.3h-8.2V26.7zm-4.1 0a8.2 8.2 0 0 1-8.2 8.3H51.9a8.2 8.2 0 1 1 0-16.5h16.5a8.2 8.2 0 0 1 8.2 8.2z" fill="#2EB67D"/>
        <path d="M104.6 51.9a8.2 8.2 0 1 1 8.2 8.2H104.6v-8.2zm-4.1 0a8.2 8.2 0 0 1-8.2 8.2H75.8a8.2 8.2 0 1 1 0-16.5h16.5a8.2 8.2 0 0 1 8.2 8.3zm0 24.7a8.2 8.2 0 1 1-8.2 8.2v-8.2h8.2zm0-4.1a8.2 8.2 0 0 1-8.2-8.2V55.9a8.2 8.2 0 1 1 16.5 0v16.5a8.2 8.2 0 0 1-8.3 8.2z" fill="#ECB22E"/>
        <path d="M75.3 104.6a8.2 8.2 0 1 1-8.3 8.2v-8.2H75.3zm-4.1 0v-16.5a8.2 8.2 0 1 1 16.5 0v16.5H71.2zM46.5 100.5a8.2 8.2 0 1 1-8.2-8.2h8.2V100.5zm4.1 0a8.2 8.2 0 0 1 8.2 8.2H46.5a8.2 8.2 0 1 1 0-16.5h16.5a8.2 8.2 0 0 1-8.2 8.3z" fill="#E01E5A"/>
    </svg>
);

const TeamsLogo: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" fill="#5059C9" />
        <path d="M4 17a5 5 0 0 1 10 0v1H4v-1z" fill="#5059C9" />
        <circle cx="16" cy="10" r="2.5" fill="#7B83EB" />
        <path d="M12.5 17a4 4 0 0 1 7 0v1h-7v-1z" fill="#7B83EB" />
    </svg>
);

const GitHubLogo: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
);

const JiraLogo: React.FC = () => (
    <svg className="w-5 h-5 slide-in-top" viewBox="0 0 24 24" fill="none">
        <path d="M11.63 21.43a.5.5 0 0 1-.76 0L2.57 12.8a.5.5 0 0 1 0-.71l2.5-2.5a.5.5 0 0 1 .71 0l5.85 5.85 5.85-5.85a.5.5 0 0 1 .71 0l2.5 2.5a.5.5 0 0 1 0 .71l-8.3 8.63z" fill="#253858" />
        <path d="M11.63 13.93a.5.5 0 0 1-.76 0L5.37 8.4a.5.5 0 0 1 0-.71l2.5-2.5a.5.5 0 0 1 .71 0l3.05 3.05 3.05-3.05a.5.5 0 0 1 .71 0l2.5 2.5a.5.5 0 0 1 0 .71l-5.5 5.53z" fill="#0052CC" />
    </svg>
);

const AzureLogo: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="#0078D4" strokeWidth="2.5" />
        <line x1="6" y1="12" x2="18" y2="12" stroke="#0078D4" strokeWidth="2.5" strokeDasharray="2 2" />
        <circle cx="6" cy="12" r="2" fill="#50E4FF" />
        <circle cx="18" cy="12" r="2" fill="#50E4FF" />
    </svg>
);

interface IntegrationsPageProps {
    onDisconnect: (onConfirm: () => void) => void;
}

const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ onDisconnect }) => {
    // Integration Setup States
    const [githubState, setGithubState] = useState<{ isConnected: boolean; repoFullName: string | null; filePath: string | null }>({
        isConnected: false,
        repoFullName: null,
        filePath: null,
    });

    const [slackState, setSlackState] = useState({
        isConnected: false,
        webhookUrl: '',
        channel: '',
    });

    const [teamsState, setTeamsState] = useState({
        isConnected: false,
        webhookUrl: '',
        channel: '',
    });

    const [jiraState, setJiraState] = useState({
        isConnected: false,
        siteUrl: '',
        projectKey: '',
    });

    const [serviceBusState, setServiceBusState] = useState({
        isConnected: false,
        connectionString: '',
        queueName: '',
    });

    // Sidebar Config panel state
    const [activePanel, setActivePanel] = useState<'NONE' | 'GITHUB' | 'SLACK' | 'TEAMS' | 'JIRA' | 'SERVICE_BUS'>('NONE');

    // Temporal Input Form states for manual configurations
    const [slackForm, setSlackForm] = useState({ webhookUrl: '', channel: '' });
    const [teamsForm, setTeamsForm] = useState({ webhookUrl: '', channel: '' });
    const [jiraForm, setJiraForm] = useState({ siteUrl: '', projectKey: '' });
    const [serviceBusForm, setServiceBusForm] = useState({ connectionString: '', queueName: '' });

    // Toast Alert Notification simulation
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // GitHub Connection Actions
    const handleSaveGitHub = (repoFullName: string, filePath: string | null) => {
        setGithubState({ isConnected: true, repoFullName, filePath });
        setActivePanel('NONE');
        showToast(`Successfully connected to repository ${repoFullName}!`);
    };

    const handleDisconnectGitHub = () => {
        onDisconnect(() => {
            setGithubState({ isConnected: false, repoFullName: null, filePath: null });
            showToast('GitHub integration has been disconnected.');
        });
    };

    // Slack Connection Actions
    const handleSaveSlack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!slackForm.webhookUrl || !slackForm.channel) return;
        setSlackState({
            isConnected: true,
            webhookUrl: slackForm.webhookUrl,
            channel: slackForm.channel
        });
        setActivePanel('NONE');
        showToast(`Slack notifications configured successfully on ${slackForm.channel}!`);
    };

    const handleDisconnectSlack = () => {
        onDisconnect(() => {
            setSlackState({ isConnected: false, webhookUrl: '', channel: '' });
            setSlackForm({ webhookUrl: '', channel: '' });
            showToast('Slack integration disconnected.');
        });
    };

    // MS Teams Connection Actions
    const handleSaveTeams = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamsForm.webhookUrl || !teamsForm.channel) return;
        setTeamsState({
            isConnected: true,
            webhookUrl: teamsForm.webhookUrl,
            channel: teamsForm.channel
        });
        setActivePanel('NONE');
        showToast(`MS Teams workflow configured successfully on channel ${teamsForm.channel}!`);
    };

    const handleDisconnectTeams = () => {
        onDisconnect(() => {
            setTeamsState({ isConnected: false, webhookUrl: '', channel: '' });
            setTeamsForm({ webhookUrl: '', channel: '' });
            showToast('MS Teams integration disconnected.');
        });
    };

    // Jira Connection Actions
    const handleSaveJira = (e: React.FormEvent) => {
        e.preventDefault();
        if (!jiraForm.siteUrl || !jiraForm.projectKey) return;
        setJiraState({
            isConnected: true,
            siteUrl: jiraForm.siteUrl,
            projectKey: jiraForm.projectKey
        });
        setActivePanel('NONE');
        showToast(`Jira integration connected to project key '${jiraForm.projectKey.toUpperCase()}'!`);
    };

    const handleDisconnectJira = () => {
        onDisconnect(() => {
            setJiraState({ isConnected: false, siteUrl: '', projectKey: '' });
            setJiraForm({ siteUrl: '', projectKey: '' });
            showToast('Jira project connection disconnected.');
        });
    };

    // Azure Service Bus Connection Actions
    const handleSaveServiceBus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceBusForm.connectionString || !serviceBusForm.queueName) return;
        setServiceBusState({
            isConnected: true,
            connectionString: serviceBusForm.connectionString,
            queueName: serviceBusForm.queueName
        });
        setActivePanel('NONE');
        showToast(`Azure Service Bus stream configured on queue '${serviceBusForm.queueName}'!`);
    };

    const handleDisconnectServiceBus = () => {
        onDisconnect(() => {
            setServiceBusState({ isConnected: false, connectionString: '', queueName: '' });
            setServiceBusForm({ connectionString: '', queueName: '' });
            showToast('Azure Service Bus integration disconnected.');
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
            {/* TOAST ALERTS */}
            {toastMessage && (
                <div id="integrations-toast" className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-fade-in duration-300">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* INTEGRATIONS CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                
                {/* 1. SLACK */}
                <div className={`hive-card bg-white dark:bg-slate-900 p-6 rounded-2xl border ${slackState.isConnected ? 'border-[#10B981]/40 shadow-sm' : 'border-slate-200/60 dark:border-slate-800 shadow-xs'} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between min-h-[230px]`}>
                    <div>
                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                                    <SlackLogo />
                                </div>
                                <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    Slack
                                </span>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                                <BuildingIcon className="w-2.5 h-2.5 text-slate-400" />
                                Org
                            </span>
                        </div>
                        
                        <p className="mt-3.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[40px]">
                            Receive real-time AI insights and system alerts in your Slack channels.
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {slackState.isConnected ? (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2.5 py-0.5 rounded-md">
                                        Channel: {slackState.channel}
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Webhook Configured
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        No Webhook
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Workspace Alerts
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
                        {slackState.isConnected ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black tracking-wider text-[#10B981] uppercase">CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => {
                                            setSlackForm({ webhookUrl: slackState.webhookUrl, channel: slackState.channel });
                                            setActivePanel('SLACK');
                                        }}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-[#5829D6] dark:text-[#A78BFA] hover:bg-[#5829D6]/5 dark:hover:bg-[#A78BFA]/5 border border-[#5829D6]/20 dark:border-[#A78BFA]/30 rounded-md transition-all uppercase"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={handleDisconnectSlack}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-red-500 dark:text-red-400 hover:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 rounded-md transition-all uppercase"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500">NOT CONNECTED</span>
                                <button 
                                    onClick={() => setActivePanel('SLACK')}
                                    className="bg-[#5829D6] dark:bg-[#6D28D9] hover:bg-[#4F46E5] dark:hover:bg-[#5B21B6] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all uppercase shadow-xs"
                                >
                                    Connect
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. MS TEAMS */}
                <div className={`hive-card bg-white dark:bg-slate-900 p-6 rounded-2xl border ${teamsState.isConnected ? 'border-[#10B981]/40 shadow-sm' : 'border-slate-200/60 dark:border-slate-800 shadow-xs'} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between min-h-[230px]`}>
                    <div>
                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                                    <TeamsLogo />
                                </div>
                                <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    MS Teams
                                </span>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                                <BuildingIcon className="w-2.5 h-2.5 text-slate-400" />
                                Org
                            </span>
                        </div>
                        
                        <p className="mt-3.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[40px]">
                            Collaborate on data reports and trigger automated workflows within Teams.
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {teamsState.isConnected ? (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2.5 py-0.5 rounded-md">
                                        Channel: {teamsState.channel}
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Workflow Automation
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Channel Offline
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Teams Alerts
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
                        {teamsState.isConnected ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black tracking-wider text-[#10B981] uppercase">CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => {
                                            setTeamsForm({ webhookUrl: teamsState.webhookUrl, channel: teamsState.channel });
                                            setActivePanel('TEAMS');
                                        }}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-[#5829D6] dark:text-[#A78BFA] hover:bg-[#5829D6]/5 dark:hover:bg-[#A78BFA]/5 border border-[#5829D6]/20 dark:border-[#A78BFA]/30 rounded-md transition-all uppercase"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={handleDisconnectTeams}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-red-500 dark:text-red-400 hover:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 rounded-md transition-all uppercase"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500">NOT CONNECTED</span>
                                <button 
                                    onClick={() => setActivePanel('TEAMS')}
                                    className="bg-[#5829D6] dark:bg-[#6D28D9] hover:bg-[#4F46E5] dark:hover:bg-[#5B21B6] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all uppercase shadow-xs"
                                >
                                    Connect
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. JIRA */}
                <div className={`hive-card bg-white dark:bg-slate-900 p-6 rounded-2xl border ${jiraState.isConnected ? 'border-[#10B981]/40 shadow-sm' : 'border-slate-200/60 dark:border-slate-800 shadow-xs'} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between min-h-[230px]`}>
                    <div>
                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                                    <JiraLogo />
                                </div>
                                <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    Jira
                                </span>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                                <BuildingIcon className="w-2.5 h-2.5 text-slate-400" />
                                Org
                            </span>
                        </div>
                        
                        <p className="mt-3.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[40px]">
                            Automatically create Jira tickets from 'Enforcement Desk' violations.
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {jiraState.isConnected ? (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2.5 py-0.5 rounded-md">
                                        Project: {jiraState.projectKey.toUpperCase()}
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Ticket Dispatch Active
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        No Project Linked
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Auto-ticketing
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
                        {jiraState.isConnected ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black tracking-wider text-[#10B981] uppercase">CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => {
                                            setJiraForm({ siteUrl: jiraState.siteUrl, projectKey: jiraState.projectKey });
                                            setActivePanel('JIRA');
                                        }}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-[#5829D6] dark:text-[#A78BFA] hover:bg-[#5829D6]/5 dark:hover:bg-[#A78BFA]/5 border border-[#5829D6]/20 dark:border-[#A78BFA]/30 rounded-md transition-all uppercase"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={handleDisconnectJira}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-red-500 dark:text-red-400 hover:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 rounded-md transition-all uppercase"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500">NOT CONNECTED</span>
                                <button 
                                    onClick={() => setActivePanel('JIRA')}
                                    className="bg-[#5829D6] dark:bg-[#6D28D9] hover:bg-[#4F46E5] dark:hover:bg-[#5B21B6] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all uppercase shadow-xs"
                                >
                                    Connect
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 4. AZURE SERVICE BUS */}
                <div className={`hive-card bg-white dark:bg-slate-900 p-6 rounded-2xl border ${serviceBusState.isConnected ? 'border-[#10B981]/40 shadow-sm' : 'border-slate-200/60 dark:border-slate-800 shadow-xs'} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between min-h-[230px]`}>
                    <div>
                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                                    <AzureLogo />
                                </div>
                                <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    Azure Service Bus
                                </span>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                                <BuildingIcon className="w-2.5 h-2.5 text-slate-400" />
                                Org
                            </span>
                        </div>
                        
                        <p className="mt-3.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[40px]">
                            Connect your Azure messaging queue to ingest enterprise data streams.
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {serviceBusState.isConnected ? (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2.5 py-0.5 rounded-md">
                                        Queue: {serviceBusState.queueName}
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Active AMQP Stream
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Queue Offline
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        Data Streams
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
                        {serviceBusState.isConnected ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black tracking-wider text-[#10B981] uppercase">CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => {
                                            setServiceBusForm({ connectionString: serviceBusState.connectionString, queueName: serviceBusState.queueName });
                                            setActivePanel('SERVICE_BUS');
                                        }}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-[#5829D6] dark:text-[#A78BFA] hover:bg-[#5829D6]/5 dark:hover:bg-[#A78BFA]/5 border border-[#5829D6]/20 dark:border-[#A78BFA]/30 rounded-md transition-all uppercase"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={handleDisconnectServiceBus}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-red-500 dark:text-red-400 hover:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 rounded-md transition-all uppercase"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500">NOT CONNECTED</span>
                                <button 
                                    onClick={() => setActivePanel('SERVICE_BUS')}
                                    className="bg-[#5829D6] dark:bg-[#6D28D9] hover:bg-[#4F46E5] dark:hover:bg-[#5B21B6] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all uppercase shadow-xs"
                                >
                                    Connect
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 5. GITHUB */}
                <div className={`hive-card bg-white dark:bg-slate-900 p-6 rounded-2xl border ${githubState.isConnected ? 'border-[#10B981]/40 shadow-sm' : 'border-slate-200/60 dark:border-slate-800 shadow-xs'} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between min-h-[230px]`}>
                    <div>
                        <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                                    <GitHubLogo />
                                </div>
                                <span className="font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
                                    GitHub
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5A5F] bg-[#FF5A5F]/5 border border-[#FF5A5F]/15 px-2 py-0.5 rounded-lg">
                                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    Built-in
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                                    <BuildingIcon className="w-2.5 h-2.5 text-slate-400" />
                                    Org
                                </span>
                            </div>
                        </div>
                        
                        <p className="mt-3.5 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[40px]">
                            Sync queries, automate code-based workflows, and enhance collaboration.
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {githubState.isConnected ? (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/10 px-2.5 py-0.5 rounded-md min-w-0 truncate max-w-[170px]">
                                        Repo: {githubState.repoFullName}
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/50 px-2.5 py-0.5 rounded-md">
                                        SQL Sync Active
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-[#94A3B8]/10 px-2.5 py-0.5 rounded-md">
                                        No Repository
                                    </span>
                                    <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border border-[#94A3B8]/10 px-2.5 py-0.5 rounded-md">
                                        DevOps Workflows
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
                        {githubState.isConnected ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black tracking-wider text-[#10B981] uppercase">CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => setActivePanel('GITHUB')}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-[#5829D6] dark:text-[#A78BFA] hover:bg-[#5829D6]/5 dark:hover:bg-[#A78BFA]/5 border border-[#5829D6]/20 dark:border-[#A78BFA]/30 rounded-md transition-all uppercase"
                                    >
                                        Configure
                                    </button>
                                    <button 
                                        onClick={handleDisconnectGitHub}
                                        className="px-2.5 py-1 text-[10px] font-black tracking-wider text-red-500 dark:text-red-400 hover:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 rounded-md transition-all uppercase"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500">NOT CONNECTED</span>
                                <button 
                                    onClick={() => setActivePanel('GITHUB')}
                                    className="bg-[#5829D6] dark:bg-[#6D28D9] hover:bg-[#4F46E5] dark:hover:bg-[#5B21B6] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all uppercase shadow-xs"
                                >
                                    Connect
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* --- CONFIGURATION SLIDE PANELS --- */}

            {/* GITHUB PANEL */}
            <SidePanel
                isOpen={activePanel === 'GITHUB'}
                onClose={() => setActivePanel('NONE')}
                title="Configure GitHub Integration"
                description="Securely bind an active repository organization to sync version-controlled SQL queries."
            >
                <ConfigureGitHubPanel
                    onCancel={() => setActivePanel('NONE')}
                    onSave={handleSaveGitHub}
                    connectedRepo={githubState.repoFullName}
                    connectedFilePath={githubState.filePath}
                />
            </SidePanel>

            {/* SLACK PANEL */}
            <SidePanel
                isOpen={activePanel === 'SLACK'}
                onClose={() => setActivePanel('NONE')}
                title="Configure Slack Integration"
                description="Set up system metrics subscription alerts and anomaly dispatch triggers to Slack."
            >
                <form onSubmit={handleSaveSlack} className="flex flex-col h-full justify-between">
                    <div className="p-8 space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Slack Incoming Webhook URL
                            </label>
                            <input 
                                type="url"
                                required
                                value={slackForm.webhookUrl}
                                onChange={e => setSlackForm({ ...slackForm, webhookUrl: e.target.value })}
                                placeholder="https://hooks.slack.com/services/T000/B000/XXXX"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none"
                            />
                            <p className="mt-1.5 text-[11px] text-text-muted leading-normal">
                                Create an incoming webhook in your Slack workspace App panel and paste the URL here.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Default Alerts Channel
                            </label>
                            <input 
                                type="text"
                                required
                                value={slackForm.channel}
                                onChange={e => setSlackForm({ ...slackForm, channel: e.target.value })}
                                placeholder="#snowflake-alerts"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none font-mono"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-[#5829D6] shrink-0 mt-0.5" />
                            <div className="text-xs text-text-secondary leading-normal">
                                <strong>Tip:</strong> You can set critical priority alerts to override do-not-disturb settings using slack workspace notification overrides.
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 flex justify-end items-center gap-3 flex-shrink-0 border-t border-slate-100">
                        <button type="button" onClick={() => setActivePanel('NONE')} className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-slate-200 text-text-secondary hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" className="text-sm font-semibold text-white bg-[#5829D6] hover:bg-[#4F46E5] px-6 py-2.5 rounded-lg shadow-sm">
                            Save Workspace
                        </button>
                    </div>
                </form>
            </SidePanel>

            {/* TEAMS PANEL */}
            <SidePanel
                isOpen={activePanel === 'TEAMS'}
                onClose={() => setActivePanel('NONE')}
                title="Configure Microsoft Teams"
                description="Stream interactive query reports and schedule cost forecasts directly in Teams."
            >
                <form onSubmit={handleSaveTeams} className="flex flex-col h-full justify-between">
                    <div className="p-8 space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Connector Webhook URL
                            </label>
                            <input 
                                type="url"
                                required
                                value={teamsForm.webhookUrl}
                                onChange={e => setTeamsForm({ ...teamsForm, webhookUrl: e.target.value })}
                                placeholder="https://outlook.office.com/webhook/xxxx"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Target Channel Name
                            </label>
                            <input 
                                type="text"
                                required
                                value={teamsForm.channel}
                                onChange={e => setTeamsForm({ ...teamsForm, channel: e.target.value })}
                                placeholder="FinOps Reports"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none"
                            />
                        </div>

                        <div className="bg-[#4B53BC]/5 p-4 rounded-xl border border-[#4B53BC]/10 flex items-start gap-2 text-xs text-[#4B53BC]">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Teams incoming Webhooks must be created using of Office 365 connector cards protocol.</span>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 flex justify-end items-center gap-3 flex-shrink-0 border-t border-slate-100">
                        <button type="button" onClick={() => setActivePanel('NONE')} className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-slate-200 text-text-secondary hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" className="text-sm font-semibold text-white bg-[#5829D6] hover:bg-[#4F46E5] px-6 py-2.5 rounded-lg shadow-sm">
                            Connect Teams
                        </button>
                    </div>
                </form>
            </SidePanel>

            {/* JIRA PANEL */}
            <SidePanel
                isOpen={activePanel === 'JIRA'}
                onClose={() => setActivePanel('NONE')}
                title="Configure Jira Integration"
                description="Link your Atlassian Jira site to file tickets automatically from resources violation."
            >
                <form onSubmit={handleSaveJira} className="flex flex-col h-full justify-between">
                    <div className="p-8 space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Atlassian Jira Site URL
                            </label>
                            <input 
                                type="url"
                                required
                                value={jiraForm.siteUrl}
                                onChange={e => setJiraForm({ ...jiraForm, siteUrl: e.target.value })}
                                placeholder="https://company.atlassian.net"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Default Project Key
                            </label>
                            <input 
                                type="text"
                                required
                                value={jiraForm.projectKey}
                                onChange={e => setJiraForm({ ...jiraForm, projectKey: e.target.value })}
                                placeholder="DAT"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none uppercase font-black tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 flex justify-end items-center gap-3 flex-shrink-0 border-t border-slate-100">
                        <button type="button" onClick={() => setActivePanel('NONE')} className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-slate-200 text-text-secondary hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" className="text-sm font-semibold text-white bg-[#5829D6] hover:bg-[#4F46E5] px-6 py-2.5 rounded-lg shadow-sm">
                            Authorize Jira
                        </button>
                    </div>
                </form>
            </SidePanel>

            {/* SERVICE BUS PANEL */}
            <SidePanel
                isOpen={activePanel === 'SERVICE_BUS'}
                onClose={() => setActivePanel('NONE')}
                title="Configure Azure Service Bus"
                description="Securely bind a service-to-service messaging pipeline output stream."
            >
                <form onSubmit={handleSaveServiceBus} className="flex flex-col h-full justify-between">
                    <div className="p-8 space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Azure Namespace Connection String
                            </label>
                            <input 
                                type="password"
                                required
                                value={serviceBusForm.connectionString}
                                onChange={e => setServiceBusForm({ ...serviceBusForm, connectionString: e.target.value })}
                                placeholder="Endpoint=sb://xxxx.servicebus.windows.net/;SharedAccessKeyName=..."
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none font-mono text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Queue or Topic Name
                            </label>
                            <input 
                                type="text"
                                required
                                value={serviceBusForm.queueName}
                                onChange={e => setServiceBusForm({ ...serviceBusForm, queueName: e.target.value })}
                                placeholder="anomaly-events"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-[#5829D6] rounded-xl px-4 py-3 text-sm focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 flex justify-end items-center gap-3 flex-shrink-0 border-t border-slate-100">
                        <button type="button" onClick={() => setActivePanel('NONE')} className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-slate-200 text-text-secondary hover:bg-slate-100 transition-colors">Cancel</button>
                        <button type="submit" className="text-sm font-semibold text-white bg-[#5829D6] hover:bg-[#4F46E5] px-6 py-2.5 rounded-lg shadow-sm">
                            Connect Queue
                        </button>
                    </div>
                </form>
            </SidePanel>

        </div>
    );
};

export default IntegrationsPage;
