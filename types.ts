
import React from 'react';

export type Page = 
  | 'Intelligence overview'
  | 'Cost Intelligence'
  | 'Dashboards'
  | 'Accounts' 
  | 'Snowflake accounts'
  | 'Recommendations'
  | 'Enforcement Desk'
  | 'Operations'
  | 'Resource summary'
  | 'Query vault'
  | 'Assigned tasks'
  | 'Reports' 
  | 'AI agent' 
  | 'Ask Apex'
  | 'Activity logs'
  | 'System logs'
  | 'Query logs'
  | 'Integrations'
  | 'User management'
  | 'Budgets & alerts'
  | 'Active policies'
  | 'Trigger'
  | 'Management'
  | 'Alerts'
  | 'Book a demo'
  | 'Docs'
  | 'Settings' 
  | 'Support'
  | 'Profile'
  | 'Billing'
  | 'Your plan'
  | 'Change plan'
  | 'Payment methods'
  | 'Billing history'
  | 'Team consumption';

export interface NavSubItem {
    name: string;
    label?: string;
}

export interface NavItem {
    name: Page;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: NavSubItem[];
    label?: string;
}

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

export type ConnectionStatus = 'Connected' | 'Disconnected' | 'Syncing' | 'Error';

export interface Account {
  id: string;
  name: string;
  identifier: string;
  role: string;
  status: ConnectionStatus;
  lastSynced: string;
  cost: number;
  tokens: number;
  // Inventory metrics matching Resource widget
  warehousesCount: number;
  usersCount: number;
  storageGB: number;
  queriesCount: string;
  tablesCount: number;
}

export interface Application {
    id: string;
    name: string;
    description: string;
    totalCredits: number;
    warehouseCredits: number;
    storageCredits: number;
    otherCredits: number;
    queryCount: number;
    lastActive: string;
    insightCount: number;
}

export interface CortexModel {
    id: string;
    name: string;
    inputTokens: string;
    outputTokens: string;
    tokens: string; // This represents Total Tokens
    credits: number;
    insightCount: number;
}

export type WidgetType = 'StatCard' | 'LineChart' | 'BarChart' | 'Table' | 'DonutChart';

export interface Widget {
  id: string; 
  widgetId: string;
  title: string;
  type: WidgetType;
  description: string;
  dataSource: { type: 'overall' } | { type: 'account', accountId: string };
  imageUrl?: string;
  tags?: string[];
  layout: { w: number; h: number };
}

export interface DashboardItem {
  id:string;
  title: string;
  createdOn: string;
  description?: string;
  widgets: Widget[];
  dataSourceContext?: { type: 'overall' } | { type: 'account', accountId: string };
}

export interface SQLVersion {
  id: string;
  version: number;
  date: string;
  tag?: string;
  description: string;
  sql?: string;
  user: string;
}

export interface SQLFile {
  id: string;
  name: string;
  versions: SQLVersion[];
  createdDate: string;
  accountId: string;
  accountName: string;
}

export interface TopQuery {
    id: string;
    queryText: string;
    tokens: number;
    cost: number;
    user: string;
    duration: string;
}

export interface OptimizationOpportunity {
    id: string;
    queryText: string;
    potentialSavings: number; 
    potentialSavingsCost: number;
    recommendation: string;
}

export type WarehouseHealth = 'Optimized' | 'Under-utilized' | 'Over-provisioned';

export interface Warehouse {
    id: string;
    name: string;
    size: 'X-Small' | 'Small' | 'Medium' | 'Large' | 'X-Large';
    avgUtilization: number;
    peakUtilization: number;
    status: 'Active' | 'Idle' | 'Suspended' | 'Running';
    cost: number;
    tokens: number;
    credits: number; // For visualization consistency
    queriesExecuted: number;
    lastActive: string;
    health: WarehouseHealth;
    optimizationNote?: string;
}

export type UserRole = 'Admin' | 'Analyst' | 'Viewer' | 'FinOps' | 'DataEngineer';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    roleTitle?: string;
    status: UserStatus;
    dateAdded: string;
    avatarUrl?: string;
    message?: string;
    cost: number;
    tokens: number;
    usageTokens?: number; // Usage of NAVSAN tokens
    organization?: string; // Organization name for user information
}

export type BigScreenWidgetType = 'account' | 'user' | 'spend_breakdown' | 'top_spend_by_db' | 'storage_by_type' | 'storage_growth_trend';

export interface BigScreenWidget {
  type: BigScreenWidgetType;
  title: string;
}

export interface SimilarQuery {
  id: string;
  name: string; 
  similarity: number; 
  executionTime: number; 
  warehouse: string;
  cost: number;
  tokens: number;
  pattern?: 'Join-heavy' | 'Aggregation-heavy' | 'Scan-heavy';
}

export type QueryStatus = 'Success' | 'Failed';
export type QueryType = 'SELECT' | 'WHERE' | 'JOIN' | 'Aggregation' | 'INSERT' | 'UPDATE' | 'DELETE';
// Added 'Critical' to QuerySeverity to match usage in dummy data.
export type QuerySeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface QueryListItem {
  id: string;
  status: QueryStatus;
  costUSD: number;
  costTokens: number;
  costCredits: number; // Total credits
  computeCredits?: number;
  qasCredits?: number;
  duration: string; 
  durationSeconds?: number;
  queryType?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'MERGE' | 'CREATE' | 'DROP' | 'OTHER';
  warehouse: string;
  estSavingsUSD: number;
  estSavingsPercent: number;
  queryText: string;
  timestamp: string; 
  startTime?: string;
  endTime?: string;
  type: QueryType[];
  user: string;
  bytesScanned: number;
  bytesWritten: number;
  queryTag?: string;
  severity: QuerySeverity;
}

export interface QueryListFilters {
    search: string;
    dateFilter: string | { start: string; end: string };
    userFilter: string[];
    statusFilter: string[];
    warehouseFilter: string[];
    queryTypeFilter: string[];
    durationFilter: { min: number | null; max: number | null };
    currentPage: number;
    itemsPerPage: number;
    visibleColumns: string[];
}

export interface SlowQueryFilters {
    search: string;
    dateFilter: string | { start: string; end: string };
    warehouseFilter: string[];
    severityFilter: string[];
}

export interface StorageBreakdownItem {
  name: string;
  value: number; 
  color: string;
}

export interface TopStorageConsumer {
  name: string;
  size: number; 
  monthlyGrowth: number; 
  rows?: number;
  lastUpdated?: string;
}

export interface StorageGrowthPoint {
  date: string;
  'Active Storage (GB)': number;
  'Time Travel (GB)': number;
}

export type TableType = 'Permanent' | 'Transient' | 'Temporary' | 'Hybrid' | 'Dynamic';

export interface UnusedTable {
    id: string;
    name: string;
    sizeGB: number;
    rows: number;
    lastAccessed: string;
    unusedDays: number;
    createdBy: string;
    database: string;
    schema: string;
    potentialSavings: number; 
    accountId?: string;
    accountName?: string;
    tableType?: TableType;
}

export interface DuplicateDataPattern {
    id: string;
    datasets: string[]; 
    size: string;
    potentialSavings: number; 
}

export interface StorageOptimizationOpportunity {
    id: string;
    type: 'Compression' | 'Partitioning';
    tableName: string;
    recommendation: string;
    potentialSavings: number; 
}

export interface StorageActivityLogItem {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface StorageActivityLogItem {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface StorageByTeamItem {
    team: string;
    storageGB: number;
}

export interface DataAgeDistributionItem {
    ageBucket: string;
    sizeGB: number;
}

export interface StorageTierItem {
    name: string;
    value: number; 
    color: string;
}

// Added TieringOpportunityItem to fix the error in dummyData.ts
export interface TieringOpportunityItem {
    id: string;
    tableName: string;
    size: string;
    currentTier: string;
    recommendedTier: string;
    potentialSavings: number;
}

export interface TierForecastPoint {
    month: string;
    Hot: number;
    Warm: number;
    Cold: number;
}

export interface AnomalyAlertItem {
    id: string;
    tableName: string;
    projection: string;
}

export interface SavingsProjection {
    message: string;
    savingsPercentage: number;
}

export interface Database {
    id: string;
    name: string;
    sizeGB: number;
    cost: number;
    // Added credits to solve missing property error in DatabasesView.tsx and dummyData.ts
    credits: number;
    tableCount: number;
    userCount: number;
    users: { id: string, name: string }[];
}

export interface DatabaseTable {
    id: string;
    name: string;
    databaseName?: string;
    schemaName: string;
    activeSizeGB: number;
    timeTravelSizeGB: number;
    failSafeSizeGB: number;
    totalSizeGB: number;
    retentionTimeDays: number;
    rows: number;
    monthlyGrowth: number;
    accountId?: string;
    accountName?: string;
    tableType?: TableType;
}

export interface StorageByTypeItem {
  type: string;
  storageGB: number;
  cost: number;
  color: string;
}

export type AssignmentPriority = 'Low' | 'Medium' | 'High';
export type AssignmentStatus = 'Assigned' | 'In progress' | 'Optimized' | 'Cannot be optimized' | 'Resolved';

export interface CollaborationEntry {
    id: string;
    type: 'system' | 'comment';
    author: string;
    timestamp: string;
    content: string;
    metadata?: {
        oldStatus?: AssignmentStatus;
        newStatus?: AssignmentStatus;
    }
}

export interface AssignedQuery {
    id: string;
    queryId: string;
    queryText: string;
    assignedBy: string; 
    assignedTo: string; 
    priority: AssignmentPriority;
    status: AssignmentStatus;
    message: string;
    assignedOn: string; 
    cost: number;
    tokens: number;
    credits: number;
    warehouse: string;
    recommendationId?: string;
    engineerResponse?: string;
    engineerResponseDate?: string;
    history: CollaborationEntry[];
}

export type PullRequestStatus = 'Open' | 'Merged' | 'Closed' | 'Draft';
export type AutomatedCheckStatus = 'Passed' | 'Failed' | 'Pending';

export interface PerformanceMetric {
    metric: string;
    before: string;
    after: string;
    delta: string;
}

export interface AutomatedCheck {
    name: string;
    status: AutomatedCheckStatus;
    description: string;
}

export interface Reviewer {
    id: string;
    name: string;
    role: string;
    approved: boolean;
}

export interface PullRequest {
    id: number;
    title: string;
    author: string;
    status: PullRequestStatus;
    sourceBranch: string;
    targetBranch: string;
    createdAt: string; 
    performanceMetrics: PerformanceMetric[];
    automatedChecks: AutomatedCheck[];
    reviewers: Reviewer[];
    oldCode: string;
    newCode: string;
}

export type NotificationType = 'performance' | 'latency' | 'storage' | 'query' | 'load' | 'TABLE_SCAN' | 'JOIN_INEFFICIENCY' | 'WAREHOUSE_IDLE' | 'COST_SPIKE' | 'QUERY_ASSIGNED' | 'ASSIGNMENT_UPDATED';
export type NotificationSeverity = 'Info' | 'Warning' | 'Critical';

export interface Notification {
    id: string;
    insightTypeId: string;
    insightTopic: NotificationType;
    message: string;
    suggestions: string;
    timestamp: string; 
    warehouseName: string;
    queryId?: string;
    isRead: boolean;
    severity: NotificationSeverity;
}

export type ActivityLogStatus = 'Success' | 'Failed' | 'In Progress';

export interface ActivityLog {
  id: string;
  user: string; 
  action: string;
  timestamp: string; 
  details?: string;
  module?: string;
  status?: ActivityLogStatus;
}

// Fixed: Added 'Account' and 'Application' to ResourceType to match dummy data usage
export type ResourceType = 'Query' | 'Warehouse' | 'Storage' | 'Database' | 'User' | 'All' | 'Account' | 'Application';
export type SeverityImpact = 'High' | 'Medium' | 'Low' | 'Cost Saving' | 'Performance Boost' | 'High Cost';
export type RecommendationStatus = 'New' | 'Read' | 'In Progress' | 'Resolved' | 'Archived' | 'Acknowledged';

export interface Recommendation {
    id: string;
    resourceType: ResourceType;
    affectedResource: string;
    severity: SeverityImpact;
    insightType: string;
    message: string;
    detailedExplanation?: string;
    timestamp: string;
    accountName: string;
    status: RecommendationStatus;
    userName?: string;
    warehouseName?: string;
    suggestion?: string;
    metrics?: {
        executionTime?: string;
        creditsBefore?: number;
        estimatedSavings?: number;
        utilization?: number;
        suspensionTime?: string;
        sizeGB?: number;
        lastAccessed?: string;
        queryText?: string;
        suggestedQueryText?: string;
    }
}

// --- BILLING TYPES ---
export interface Transaction {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Failed';
    plan: string;
    invoiceUrl: string;
}

export type SubscriptionPlan = 'Trial' | 'Individual' | 'Team' | 'Enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
    plan: SubscriptionPlan;
    status: 'active' | 'past_due' | 'canceled' | 'trialing';
    billingCycle?: BillingCycle;
    trialEndsAt?: string;
    nextBillingDate?: string;
    seats?: number;
    pendingPlan?: SubscriptionPlan;
    pendingPlanEffectiveDate?: string;
    isDowngradePending?: boolean;
}

export interface Plan {
    id: string;
    name: 'Individual' | 'Team' | 'Enterprise';
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isTrial?: boolean;
    trialEndsAt?: string;
}

export interface FeatureUsage {
    name: string;
    tokens: number;
    color: string;
}
