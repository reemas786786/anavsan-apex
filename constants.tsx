import React from 'react';
import { NavItem } from './types';
import {
    Check,
    LayoutGrid,
    BarChart3,
    Link2,
    FileText,
    BookOpen,
    Settings,
    MessageCircle,
    Terminal,
    ClipboardList,
    ShieldCheck,
    MessageSquare,
    ExternalLink,
    Pin,
    X,
    Plus,
    List,
    Eye,
    Edit3,
    Trash2,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    Clock,
    Copy,
    Flag,
    TrendingUp,
    Beaker,
    Wand2,
    Image,
    SlidersHorizontal,
    Database,
    CheckCircle2,
    AlertTriangle,
    Lock,
    CreditCard,
    Layers,
    Calendar,
    XCircle,
    GitBranch,
    GitPullRequest,
    Key,
    Bolt,
    Gift,
    Play,
    ArrowRight,
    Activity,
    Scale,
    Landmark,
    Users,
    User,
    Zap,
    Save,
    Box,
    Menu,
    MoreVertical,
    Search,
    Bell,
    HelpCircle,
    Code,
    ChevronLeft,
    ChevronRight,
    Share2,
    Info,
    Lightbulb
} from 'lucide-react';

// Core Utility Icons
export const IconCheck: React.FC<{ className?: string }> = ({ className }) => <Check className={className} />;

// Navigation Icons
export const IconDashboard: React.FC<{ className?: string }> = ({ className }) => <LayoutGrid className={className} />;
export const IconOverview: React.FC<{ className?: string }> = ({ className }) => <LayoutGrid className={className} />;
export const IconCloudOverview: React.FC<{ className?: string }> = ({ className }) => <BarChart3 className={className} />;
export const IconConnections: React.FC<{ className?: string }> = ({ className }) => <Link2 className={className} />;

export const IconAIAgent: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 507 507" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M506.288 253.144C273.144 253.144 263.222 83.3333 253.144 0C253.144 233.144 84.988 242.82 0 253.144C233.144 253.144 253.144 430 253.144 506.288C253.144 273.144 421.3 263.321 506.288 253.144Z" 
            fill="url(#anavsan_ai_agent_grad)"
        />
        <defs>
            <linearGradient id="anavsan_ai_agent_grad" x1="253.144" y1="0" x2="253.144" y2="506.288" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6CA7FF"/>
                <stop offset="0.783654" stopColor="#5A07FF"/>
            </linearGradient>
        </defs>
    </svg>
);

export const IconReports: React.FC<{ className?: string }> = ({ className }) => <FileText className={className} />;
export const IconDocs: React.FC<{ className?: string }> = ({ className }) => <BookOpen className={className} />;
export const IconSettings: React.FC<{ className?: string }> = ({ className }) => <Settings className={className} />;
export const IconSupport: React.FC<{ className?: string }> = ({ className }) => <MessageCircle className={className} />;
export const IconTerminal: React.FC<{ className?: string }> = ({ className }) => <Terminal className={className} />;
export const IconClipboardList: React.FC<{ className?: string }> = ({ className }) => <ClipboardList className={className} />;
export const IconShieldCheck: React.FC<{ className?: string }> = ({ className }) => <ShieldCheck className={className} />;
export const IconMessageSquare: React.FC<{ className?: string }> = ({ className }) => <MessageSquare className={className} />;
export const IconExternalLink: React.FC<{ className?: string }> = ({ className }) => <ExternalLink className={className} />;
export const IconPin: React.FC<{ className?: string }> = ({ className }) => <Pin className={className} />;

// Custom gradient sparkle matching the branding
export const IconSparkles: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 507 507" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M506.288 253.144C273.144 253.144 263.222 83.3333 253.144 0C253.144 233.144 84.988 242.82 0 253.144C233.144 253.144 253.144 430 253.144 506.288C253.144 273.144 421.3 263.321 506.288 253.144Z" 
            fill="url(#anavsan_ai_sparkles_grad)"
        />
        <defs>
            <linearGradient id="anavsan_ai_sparkles_grad" x1="253.144" y1="0" x2="253.144" y2="506.288" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6CA7FF"/>
                <stop offset="0.783654" stopColor="#5A07FF"/>
            </linearGradient>
        </defs>
    </svg>
);

export const IconMenu: React.FC<{ className?: string }> = ({ className }) => <Menu className={className} />;
export const IconDotsVertical: React.FC<{ className?: string }> = ({ className }) => <MoreVertical className={className} />;
export const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => <ChevronDown className={className} />;
export const IconRefresh: React.FC<{ className?: string }> = ({ className }) => <RefreshCw className={className} />;
export const IconUser: React.FC<{ className?: string }> = ({ className }) => <User className={className} />;
export const IconSearch: React.FC<{ className?: string }> = ({ className }) => <Search className={className} />;
export const IconBell: React.FC<{ className?: string }> = ({ className }) => <Bell className={className} />;
export const IconHelpCircle: React.FC<{ className?: string }> = ({ className }) => <HelpCircle className={className} />;
export const IconCode: React.FC<{ className?: string }> = ({ className }) => <Code className={className} />;
export const IconFileText: React.FC<{ className?: string }> = ({ className }) => <FileText className={className} />;
export const IconLightbulb: React.FC<{ className?: string }> = ({ className }) => <Lightbulb className={className} />;
export const IconChevronLeft: React.FC<{ className?: string }> = ({ className }) => <ChevronLeft className={className} />;
export const IconChevronRight: React.FC<{ className?: string }> = ({ className }) => <ChevronRight className={className} />;
export const IconShare: React.FC<{ className?: string }> = ({ className }) => <Share2 className={className} />;
export const IconInfo: React.FC<{ className?: string }> = ({ className }) => <Info className={className} />;
export const IconClose: React.FC<{ className?: string }> = ({ className }) => <X className={className} />;
export const IconAdd: React.FC<{ className?: string }> = ({ className }) => <Plus className={className} />;
export const IconList: React.FC<{ className?: string }> = ({ className }) => <List className={className} />;
export const IconView: React.FC<{ className?: string }> = ({ className }) => <Eye className={className} />;
export const IconEdit: React.FC<{ className?: string }> = ({ className }) => <Edit3 className={className} />;
export const IconDelete: React.FC<{ className?: string }> = ({ className }) => <Trash2 className={className} />;
export const IconArrowUp: React.FC<{ className?: string }> = ({ className }) => <ChevronUp className={className} />;
export const IconArrowDown: React.FC<{ className?: string }> = ({ className }) => <ChevronDown className={className} />;
export const IconClock: React.FC<{ className?: string }> = ({ className }) => <Clock className={className} />;
export const IconClipboardCopy: React.FC<{ className?: string }> = ({ className }) => <Copy className={className} />;
export const IconFlag: React.FC<{ className?: string }> = ({ className }) => <Flag className={className} />;
export const IconTrendingUp: React.FC<{ className?: string }> = ({ className }) => <TrendingUp className={className} />;
export const IconBeaker: React.FC<{ className?: string }> = ({ className }) => <Beaker className={className} />;
export const IconWand: React.FC<{ className?: string }> = ({ className }) => <Wand2 className={className} />;
export const IconPhoto: React.FC<{ className?: string }> = ({ className }) => <Image className={className} />;
export const IconAdjustments: React.FC<{ className?: string }> = ({ className }) => <SlidersHorizontal className={className} />;
export const IconDatabase: React.FC<{ className?: string }> = ({ className }) => <Database className={className} />;
export const IconCheckCircle: React.FC<{ className?: string }> = ({ className }) => <CheckCircle2 className={className} />;
export const IconExclamationTriangle: React.FC<{ className?: string }> = ({ className }) => <AlertTriangle className={className} />;
export const IconLockClosed: React.FC<{ className?: string }> = ({ className }) => <Lock className={className} />;
export const IconCreditCard: React.FC<{ className?: string }> = ({ className }) => <CreditCard className={className} />;
export const IconLayers: React.FC<{ className?: string }> = ({ className }) => <Layers className={className} />;
export const IconCalendar: React.FC<{ className?: string }> = ({ className }) => <Calendar className={className} />;
export const IconXCircle: React.FC<{ className?: string }> = ({ className }) => <XCircle className={className} />;
export const IconPending: React.FC<{ className?: string }> = ({ className }) => <Clock className={className} />;
export const IconGitBranch: React.FC<{ className?: string }> = ({ className }) => <GitBranch className={className} />;
export const IconPullRequest: React.FC<{ className?: string }> = ({ className }) => <GitPullRequest className={className} />;
export const IconKey: React.FC<{ className?: string }> = ({ className }) => <Key className={className} />;
export const IconBolt: React.FC<{ className?: string }> = ({ className }) => <Bolt className={className} />;
export const IconGift: React.FC<{ className?: string }> = ({ className }) => <Gift className={className} />;
export const IconPlay: React.FC<{ className?: string }> = ({ className }) => <Play className={className} />;
export const IconArrowRight: React.FC<{ className?: string }> = ({ className }) => <ArrowRight className={className} />;
export const IconActivity: React.FC<{ className?: string }> = ({ className }) => <Activity className={className} />;
export const IconScale: React.FC<{ className?: string }> = ({ className }) => <Scale className={className} />;
export const IconBuildingBank: React.FC<{ className?: string }> = ({ className }) => <Landmark className={className} />;
export const IconUsers: React.FC<{ className?: string }> = ({ className }) => <Users className={className} />;
export const IconZap: React.FC<{ className?: string }> = ({ className }) => <Zap className={className} />;
export const IconSave: React.FC<{ className?: string }> = ({ className }) => <Save className={className} />;
export const IconCube: React.FC<{ className?: string }> = ({ className }) => <Box className={className} />;

// --- Navigation Data ---
export const accountNavItems = [
    {
        name: 'Account overview',
        label: 'Consumption',
        icon: IconOverview,
        children: []
    },
    {
        name: 'Enforcement Desk',
        icon: IconLightbulb,
        children: []
    },
    {
        name: 'Compute',
        icon: IconActivity,
        children: []
    },
    {
        name: 'Storage',
        icon: IconCube,
        children: []
    },
    {
        name: 'Credit trend',
        label: 'Data transfer',
        icon: IconTrendingUp,
        children: []
    },
    {
        name: 'Applications',
        icon: IconLockClosed,
        children: []
    },
    {
        name: 'Users',
        icon: IconUser,
        children: []
    },
    {
        name: 'Reports',
        icon: IconReports,
        children: []
    },
    {
        name: 'Query pattern',
        icon: IconList,
        children: []
    },
    {
        name: 'Optimization',
        icon: IconSparkles,
        children: [
            { name: 'Query analyzer', label: 'Overview' },
            { name: 'Query optimizer', label: 'Optimizer' },
            { name: 'Query simulator', label: 'Simulator' },
            { name: 'Query prompt generator', label: 'Prompt generator' }
        ]
    },
    {
        name: 'Ask Apex',
        icon: IconMessageSquare,
        label: 'Ask APEX',
        children: []
    }
];

export const NAV_ITEMS_TOP: NavItem[] = [
    { name: 'Ask Apex', icon: IconMessageSquare, label: 'Ask APEX' },
    { name: 'AI data cloud overview', icon: IconDashboard },
    { name: 'Dashboards', icon: IconCloudOverview },
    { name: 'Enforcement Desk', icon: IconLightbulb },
    { name: 'Operations', icon: IconBeaker },
    { name: 'Trigger', icon: IconBolt },
    { name: 'Integrations', icon: IconAdjustments, label: 'Tools' },
    { name: 'Reports', icon: IconReports }
];

export const NAV_ITEMS_BOTTOM: NavItem[] = [
    { name: 'Accounts', icon: IconUser },
    { name: 'Budgets & alerts', icon: IconBell },
    {
        name: 'Activity logs',
        icon: IconFileText,
        subItems: [
            { name: 'Query logs' },
            { name: 'System logs' },
            { name: 'Query vault' }
        ]
    }
];
