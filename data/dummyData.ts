import { 
    Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, 
    SimilarQuery, QueryListItem, QueryStatus, QueryType, QuerySeverity, StorageBreakdownItem, 
    TopStorageConsumer, StorageGrowthPoint, UnusedTable, StorageActivityLogItem, StorageByTeamItem, 
    DuplicateDataPattern, StorageOptimizationOpportunity, DataAgeDistributionItem, StorageTierItem, 
    TieringOpportunityItem, TierForecastPoint, AnomalyAlertItem, SavingsProjection, Database, 
    DatabaseTable, StorageByTypeItem, AssignedQuery, PullRequest, Notification, ActivityLog, 
    SQLVersion, Recommendation, CollaborationEntry, Application, CortexModel,
    ResourceType, SeverityImpact, RecommendationStatus
} from '../types';

export const connectionsData: Account[] = [
    { id: 'acc-1', name: 'Finance Prod', identifier: 'acme.us-east-1', role: 'ACCOUNTADMIN', status: 'Connected', lastSynced: '2 mins ago', cost: 12500, tokens: 98000, warehousesCount: 12, usersCount: 8, storageGB: 45000, queriesCount: '12K', tablesCount: 120 },
    { id: 'acc-2', name: 'Account B', identifier: 'acme.us-east-2', role: 'SYSADMIN', status: 'Connected', lastSynced: '5 mins ago', cost: 8200, tokens: 85000, warehousesCount: 6, usersCount: 12, storageGB: 12400, queriesCount: '8K', tablesCount: 85 },
    { id: 'acc-3', name: 'Account C', identifier: 'acme.eu-west-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '10 mins ago', cost: 7100, tokens: 68000, warehousesCount: 4, usersCount: 5, storageGB: 8200, queriesCount: '6K', tablesCount: 45 },
];

export const usersData: User[] = [
    { id: 'u-1', name: 'FinOps Admin', email: 'finops@mail.com', role: 'FinOps', status: 'Active', dateAdded: '2023-01-01', cost: 1200, tokens: 5000, organization: 'Anavsan Global' },
    { id: 'u-2', name: 'Alex Johnson', email: 'dataengineer@mail.com', role: 'DataEngineer', status: 'Active', dateAdded: '2024-01-15', cost: 850, tokens: 4200, organization: 'Anavsan Global' }
];

export const demoUsers: Record<string, User> = {
    'finops@mail.com': usersData[0],
    'dataengineer@mail.com': usersData[1]
};

export const notificationsData: Notification[] = [
    {
        id: 'n-fin-1',
        insightTypeId: 'COST_SPIKE',
        insightTopic: 'COST_SPIKE',
        message: 'Critical credit spike detected in Finance Prod account. Usage up by 150% in 2 hours.',
        suggestions: 'Immediate review of COMPUTE_WH large query executions required.',
        timestamp: new Date().toISOString(),
        warehouseName: 'COMPUTE_WH',
        isRead: false,
        severity: 'Critical'
    },
    {
        id: 'n-fin-2',
        insightTypeId: 'BUDGET_WARNING',
        insightTopic: 'performance',
        message: 'Account B has reached 92% of its allocated monthly budget.',
        suggestions: 'Consider scaling down dev warehouses or increasing budget threshold.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        warehouseName: 'SYSTEM',
        isRead: false,
        severity: 'Warning'
    },
    {
        id: 'n-eng-1',
        insightTypeId: 'QUERY_FAILURE',
        insightTopic: 'query',
        message: 'Failed Production ETL Task: UPSERT into FACT_SALES_DAILY.',
        suggestions: 'SQL error detected: Numeric value out of range for column "AMOUNT".',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        warehouseName: 'ETL_WH',
        queryId: 'q-9482104',
        isRead: false,
        severity: 'Critical'
    },
    {
        id: 'n-eng-2',
        insightTypeId: 'SLOW_QUERY',
        insightTopic: 'performance',
        message: 'New slow query pattern detected on CUSTOMER_DIM table joins.',
        suggestions: 'Analyze partition pruning performance for the last 48 hours.',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        warehouseName: 'ANALYTICS_WH',
        queryId: 'q-9482112',
        isRead: false,
        severity: 'Warning'
    }
];

export const cortexModelsData: CortexModel[] = [
    { id: 'm-1', name: 'llama3-70b', inputTokens: '450K', outputTokens: '400K', tokens: '850K', credits: 1.2, insightCount: 5 },
    { id: 'm-2', name: 'mistral-large', inputTokens: '720K', outputTokens: '480K', tokens: '1.2M', credits: 1.9, insightCount: 2 },
];

export const workloadsData = [
    { id: 'wl-1', account: 'Finance Prod', workloads: 18, credits: 61400, queryCount: 88200, avgRuntime: '4.6s', idleTime: '17%' },
];

export const servicesData = [
    { id: 'svc-1', type: 'SEARCH_OPTIMIZATION', account: 'Finance Prod', credits: 1230, count: 6, queryCount: 18200, trend: '↑ 12%' },
];

export const queryListData: QueryListItem[] = [
    { 
        id: 'QID-98234', 
        status: 'Success', 
        costUSD: 3140.00, 
        costTokens: 1256, 
        costCredits: 1256, 
        computeCredits: 1256,
        qasCredits: 0,
        duration: '02:15:30', 
        durationSeconds: 8130,
        queryType: 'SELECT',
        warehouse: 'COMPUTE_WH', 
        estSavingsUSD: 450.00, 
        estSavingsPercent: 15, 
        queryText: 'SELECT /* Prod Analytics */ count(distinct user_id), sum(revenue) FROM analytics.prod.sales_fact WHERE transaction_date BETWEEN "2026-02-17" AND "2026-02-23" GROUP BY 1;', 
        timestamp: '2026-02-23T14:30:00Z', 
        startTime: '2026-02-23T14:30:00Z',
        endTime: '2026-02-23T16:45:30Z',
        type: ['SELECT'], 
        user: 'admin', 
        bytesScanned: 450000000000, 
        bytesWritten: 0, 
        severity: 'High' 
    },
    { 
        id: 'QID-12345', 
        status: 'Success', 
        costUSD: 3075.00, 
        costTokens: 1230, 
        costCredits: 1230, 
        computeCredits: 1230,
        qasCredits: 0,
        duration: '01:45:00', 
        durationSeconds: 6300,
        queryType: 'SELECT',
        warehouse: 'ANALYTICS_WH', 
        estSavingsUSD: 300.00, 
        estSavingsPercent: 10, 
        queryText: 'SELECT /* Database Spend Alert */ account_id, sum(credits_used) FROM snowflake.account_usage.metering_history WHERE start_time > current_date() - 30 GROUP BY 1 HAVING sum(credits_used) > 1000;', 
        timestamp: '2026-02-22T09:15:00Z', 
        startTime: '2026-02-22T09:15:00Z',
        endTime: '2026-02-22T11:00:00Z',
        type: ['SELECT'], 
        user: 'jane_doe', 
        bytesScanned: 120000000000000, 
        bytesWritten: 0, 
        severity: 'High' 
    },
    { 
        id: 'QID-67890', 
        status: 'Success', 
        costUSD: 2395.00, 
        costTokens: 958, 
        costCredits: 958, 
        computeCredits: 958,
        qasCredits: 0,
        duration: '00:55:20', 
        durationSeconds: 3320,
        queryType: 'SELECT',
        warehouse: 'SYSTEM_WH', 
        estSavingsUSD: 150.00, 
        estSavingsPercent: 6, 
        queryText: 'SELECT /* Database System */ * FROM snowflake.account_usage.query_history WHERE execution_status = "FAIL" AND start_time > current_timestamp() - interval "1 hour";', 
        timestamp: '2026-02-21T18:20:00Z', 
        startTime: '2026-02-21T18:20:00Z',
        endTime: '2026-02-21T19:15:20Z',
        type: ['SELECT'], 
        user: 'mike_de', 
        bytesScanned: 110000000000, 
        bytesWritten: 0, 
        severity: 'Medium' 
    },
    { 
        id: 'QID-24680', 
        status: 'Success', 
        costUSD: 1305.00, 
        costTokens: 522, 
        costCredits: 522, 
        computeCredits: 522,
        qasCredits: 0,
        duration: '00:32:15', 
        durationSeconds: 1935,
        queryType: 'SELECT',
        warehouse: 'OPTIMIZE_WH', 
        estSavingsUSD: 500.00, 
        estSavingsPercent: 38, 
        queryText: 'SELECT /* Database Query Optimization */ query_id, query_text, partitions_scanned, partitions_total FROM snowflake.account_usage.query_history WHERE partitions_scanned > 1000 AND partitions_scanned / nullif(partitions_total, 0) > 0.9;', 
        timestamp: '2026-02-20T11:45:00Z', 
        startTime: '2026-02-20T11:45:00Z',
        endTime: '2026-02-20T12:17:15Z',
        type: ['SELECT'], 
        user: 'admin', 
        bytesScanned: 95000000000, 
        bytesWritten: 0, 
        severity: 'Medium' 
    },
    { 
        id: 'QID-13579', 
        status: 'Success', 
        costUSD: 912.50, 
        costTokens: 365, 
        costCredits: 365, 
        computeCredits: 365,
        qasCredits: 0,
        duration: '00:12:45', 
        durationSeconds: 765,
        queryType: 'SELECT',
        warehouse: 'SECURITY_WH', 
        estSavingsUSD: 0, 
        estSavingsPercent: 0, 
        queryText: 'SELECT /* Database Security */ event_timestamp, user_name, client_ip, reported_client_type FROM snowflake.account_usage.login_history WHERE is_success = "NO" ORDER BY event_timestamp DESC;', 
        timestamp: '2026-02-19T22:10:00Z', 
        startTime: '2026-02-19T22:10:00Z',
        endTime: '2026-02-19T22:22:45Z',
        type: ['SELECT'], 
        user: 'sec_admin', 
        bytesScanned: 94000000, 
        bytesWritten: 0, 
        severity: 'Low' 
    },
    { 
        id: 'QID-11223', 
        status: 'Success', 
        costUSD: 645.00, 
        costTokens: 258, 
        costCredits: 258, 
        computeCredits: 258,
        qasCredits: 0,
        duration: '00:08:30', 
        durationSeconds: 510,
        queryType: 'SELECT',
        warehouse: 'INSIGHT_WH', 
        estSavingsUSD: 50.00, 
        estSavingsPercent: 8, 
        queryText: 'SELECT /* Database Insight */ table_name, sum(active_bytes) FROM snowflake.account_usage.table_storage_metrics GROUP BY 1 ORDER BY 2 DESC LIMIT 50;', 
        timestamp: '2026-02-18T15:00:00Z', 
        startTime: '2026-02-18T15:00:00Z',
        endTime: '2026-02-18T15:08:30Z',
        type: ['SELECT'], 
        user: 'jane_doe', 
        bytesScanned: 85000000000, 
        bytesWritten: 0, 
        severity: 'Low' 
    },
    // Repeated Queries Data (Adding duplicates to trigger grouping)
    { 
        id: 'QID-R1-1', 
        status: 'Success', 
        costUSD: 6.25,
        costTokens: 2.5,
        costCredits: 2.5, 
        computeCredits: 2.5,
        qasCredits: 0,
        duration: '00:00:15', 
        durationSeconds: 15,
        queryType: 'SELECT',
        warehouse: 'COMPUTE_WH', 
        estSavingsUSD: 0,
        estSavingsPercent: 0,
        queryText: 'SELECT /* Prod Analytics */ count(distinct user_id), sum(revenue) FROM analytics.prod.sales_fact WHERE transaction_date = CURRENT_DATE();', 
        timestamp: '2026-02-23T08:00:00Z', 
        startTime: '2026-02-23T08:00:00Z',
        endTime: '2026-02-23T08:00:15Z',
        user: 'admin', 
        bytesScanned: 1500000, 
        bytesWritten: 0,
        type: ['SELECT'],
        severity: 'Low'
    },
    { 
        id: 'QID-R1-2', 
        status: 'Success', 
        costUSD: 6.50,
        costTokens: 2.6,
        costCredits: 2.6, 
        computeCredits: 2.6,
        qasCredits: 0,
        duration: '00:00:16', 
        durationSeconds: 16,
        queryType: 'SELECT',
        warehouse: 'COMPUTE_WH', 
        estSavingsUSD: 0,
        estSavingsPercent: 0,
        queryText: 'SELECT /* Prod Analytics */ count(distinct user_id), sum(revenue) FROM analytics.prod.sales_fact WHERE transaction_date = CURRENT_DATE();', 
        timestamp: '2026-02-23T09:00:00Z', 
        startTime: '2026-02-23T09:00:00Z',
        endTime: '2026-02-23T09:00:16Z',
        user: 'admin', 
        bytesScanned: 1500000, 
        bytesWritten: 0,
        type: ['SELECT'],
        severity: 'Low'
    },
    { 
        id: 'QID-R2-1', 
        status: 'Success', 
        costUSD: 13.00,
        costTokens: 5.2,
        costCredits: 5.2, 
        computeCredits: 5.2,
        qasCredits: 0,
        duration: '00:00:45', 
        durationSeconds: 45,
        queryType: 'SELECT',
        warehouse: 'ANALYTICS_WH', 
        estSavingsUSD: 0,
        estSavingsPercent: 0,
        queryText: 'SELECT /* Database Spend Alert */ account_id, sum(credits_used) FROM snowflake.account_usage.metering_history WHERE start_time > current_date() - 1 GROUP BY 1;', 
        timestamp: '2026-02-23T10:00:00Z', 
        startTime: '2026-02-23T10:00:00Z',
        endTime: '2026-02-23T10:00:45Z',
        user: 'jane_doe', 
        bytesScanned: 45000000, 
        bytesWritten: 0,
        type: ['SELECT'],
        severity: 'Low'
    },
    { 
        id: 'QID-R2-2', 
        status: 'Success', 
        costUSD: 12.75,
        costTokens: 5.1,
        costCredits: 5.1, 
        computeCredits: 5.1,
        qasCredits: 0,
        duration: '00:00:44', 
        durationSeconds: 44,
        queryType: 'SELECT',
        warehouse: 'ANALYTICS_WH', 
        estSavingsUSD: 0,
        estSavingsPercent: 0,
        queryText: 'SELECT /* Database Spend Alert */ account_id, sum(credits_used) FROM snowflake.account_usage.metering_history WHERE start_time > current_date() - 1 GROUP BY 1;', 
        timestamp: '2026-02-23T11:00:00Z', 
        startTime: '2026-02-23T11:00:00Z',
        endTime: '2026-02-23T11:00:44Z',
        user: 'jane_doe', 
        bytesScanned: 44000000, 
        bytesWritten: 0,
        type: ['SELECT'],
        severity: 'Low'
    },
];

export const similarQueriesData: SimilarQuery[] = [
    { id: 'sim-1', name: 'SELECT * FROM FACT_SALES WHERE...', similarity: 98, executionTime: 150000, warehouse: 'COMPUTE_WH', cost: 12.50, tokens: 4.5, pattern: 'Scan-heavy' },
    { id: 'sim-2', name: 'SELECT customer_id, sum(total)...', similarity: 95, executionTime: 105000, warehouse: 'ANALYTICS_WH', cost: 8.20, tokens: 3.1, pattern: 'Aggregation-heavy' },
    { id: 'sim-3', name: 'SELECT t1.name, t2.total FROM...', similarity: 92, executionTime: 252000, warehouse: 'ANALYTICS_WH', cost: 15.20, tokens: 5.8, pattern: 'Join-heavy' },
];

export const warehousesData: Warehouse[] = [
    { id: 'wh-1', name: 'COMPUTE_WH', size: 'Medium', avgUtilization: 45, peakUtilization: 85, status: 'Active', cost: 4500, tokens: 1800, credits: 1800, queriesExecuted: 1250, lastActive: '2 mins ago', health: 'Optimized' },
    { id: 'wh-2', name: 'ETL_WH', size: 'Large', avgUtilization: 65, peakUtilization: 95, status: 'Running', cost: 9500, tokens: 3800, credits: 3800, queriesExecuted: 2800, lastActive: 'Just now', health: 'Optimized' },
    { id: 'wh-3', name: 'ANALYTICS_WH', size: 'Small', avgUtilization: 25, peakUtilization: 55, status: 'Idle', cost: 2200, tokens: 850, credits: 850, queriesExecuted: 450, lastActive: '15 mins ago', health: 'Under-utilized' },
    { id: 'wh-4', name: 'LOAD_WH', size: 'X-Small', avgUtilization: 85, peakUtilization: 100, status: 'Active', cost: 1500, tokens: 600, credits: 600, queriesExecuted: 3200, lastActive: '2 mins ago', health: 'Over-provisioned' },
];

export const databasesData: Database[] = [
    { id: 'db-1', name: 'PROD_ANALYTICS', sizeGB: 42000, cost: 12500, credits: 1250, tableCount: 1256, userCount: 45, users: [] },
    { id: 'db-2', name: 'DATABASE_SPEND_ALERT', sizeGB: 12000, cost: 3200, credits: 320, tableCount: 1230, userCount: 12, users: [] },
    { id: 'db-3', name: 'DATABASE_SYSTEM', sizeGB: 11000, cost: 2800, credits: 280, tableCount: 958, userCount: 8, users: [] },
    { id: 'db-4', name: 'DATABASE_QUERY_OPTIMIZATION', sizeGB: 9500, cost: 2100, credits: 210, tableCount: 522, userCount: 15, users: [] },
    { id: 'db-5', name: 'DATABASE_SECURITY', sizeGB: 9400, cost: 2000, credits: 200, tableCount: 365, userCount: 10, users: [] },
    { id: 'db-6', name: 'DATABASE_INSIGHT', sizeGB: 8500, cost: 1800, credits: 180, tableCount: 258, userCount: 22, users: [] },
];

export const spendTrendsData = (function() {
    const data = [];
    const now = new Date('2023-11-20');
    for (let i = 30; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const warehouse = 1100 + Math.random() * 400;
        const storage = 150 + Math.random() * 50;
        const cloud = 50 + Math.random() * 30;
        data.push({
            date: day,
            warehouse: Math.round(warehouse),
            storage: Math.round(warehouse * 0.15),
            cloud: Math.round(warehouse * 0.05),
            total: Math.round(warehouse * 1.2)
        });
    }
    return data;
})();

export const storageGrowthData: StorageGrowthPoint[] = (function() {
    const data = [];
    const now = new Date('2023-11-20');
    for (let i = 30; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data.push({
            date: day,
            'Active Storage (GB)': 42000 + (30 - i) * 100 + Math.random() * 200,
            'Time Travel (GB)': 1200 + Math.random() * 100
        });
    }
    return data;
})();

export const recommendationsData: Recommendation[] = (function() {
    const recs: Recommendation[] = [];
    const resourceTypes: ResourceType[] = ['Query', 'Warehouse', 'Storage', 'Database', 'User', 'Application', 'Account'];
    const accounts = ['Finance Prod', 'Account B', 'Account C'];
    const insightTypes = ['Scan Optimization', 'Rightsizing', 'Cleanup', 'Security'];
    const warehouses = ['COMPUTE_WH', 'ETL_WH', 'ANALYTICS_WH', 'LOAD_WH'];

    // 1. Specific High-Value Recommendations for COMPUTE_WH (fixes empty context state)
    recs.push({
        id: 'REC-SPEC-001',
        resourceType: 'Warehouse',
        affectedResource: 'COMPUTE_WH',
        severity: 'High',
        insightType: 'Rightsizing',
        message: 'COMPUTE_WH is frequently reaching 90%+ peak utilization. Performance is constrained during peak ETL hours.',
        detailedExplanation: 'Historical analysis over the last 14 days indicates that COMPUTE_WH is undersized for the current query volume. This results in significant queuing and degraded end-user experience during morning reporting windows.',
        timestamp: new Date().toISOString(),
        accountName: 'Finance Prod',
        status: 'New',
        warehouseName: 'COMPUTE_WH',
        suggestion: 'Upgrade warehouse size to LARGE during the 09:00 - 11:00 UTC window to eliminate query queuing.',
        metrics: { utilization: 92, creditsBefore: 1800, estimatedSavings: 0 }
    });

    recs.push({
        id: 'REC-SPEC-002',
        resourceType: 'Query',
        affectedResource: 'q-9482103',
        severity: 'High Cost',
        insightType: 'Scan Optimization',
        message: 'Query q-9482103 on COMPUTE_WH is performing full table scans on FACT_SALES.',
        detailedExplanation: 'This query scans 450GB of data per execution. Because FACT_SALES is not clustered by EVENT_DATE, the query engine cannot prune partitions, leading to 10x higher costs than necessary.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        accountName: 'Finance Prod',
        status: 'New',
        warehouseName: 'COMPUTE_WH',
        userName: 'jane_doe',
        suggestion: 'Apply a explicit filter on EVENT_DATE or implement a CLUSTERING KEY on (EVENT_DATE) for FACT_SALES.',
        metrics: { creditsBefore: 4.5, estimatedSavings: 3.6, queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01";' }
    });

    recs.push({
        id: 'REC-SPEC-003',
        resourceType: 'Warehouse',
        affectedResource: 'COMPUTE_WH',
        severity: 'Cost Saving',
        insightType: 'Cleanup',
        message: 'COMPUTE_WH idle time is 22%. Auto-suspend is currently set to 600 seconds.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        accountName: 'Finance Prod',
        status: 'In Progress',
        warehouseName: 'COMPUTE_WH',
        suggestion: 'Reduce AUTO_SUSPEND to 60 seconds. This is projected to save approximately 15% in monthly compute credits.',
        metrics: { creditsBefore: 1800, estimatedSavings: 270, suspensionTime: '600s' }
    });

    recs.push({
        id: 'REC-SPEC-005',
        resourceType: 'Query',
        affectedResource: 'q-9482115',
        severity: 'High',
        insightType: 'Scan Optimization',
        message: 'Query q-9482115 is scanning 1.2TB of data due to lack of pruning on large table.',
        detailedExplanation: 'The query filters on a non-indexed column, forcing a full scan of the CUSTOMER_ACTIVITY table. Implementing a search optimization service or clustering could reduce scan volume by 80%.',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        accountName: 'Account B',
        status: 'New',
        warehouseName: 'ANALYTICS_WH',
        userName: 'mike_de',
        suggestion: 'Add a filter on the clustering key or enable Search Optimization Service for the filtered columns.',
        metrics: { creditsBefore: 12.8, estimatedSavings: 10.2, queryText: 'SELECT * FROM CUSTOMER_ACTIVITY WHERE REGION = "NORTH_AMERICA" AND ACTIVITY_TYPE = "PURCHASE";' }
    });

    recs.push({
        id: 'REC-SPEC-006',
        resourceType: 'Storage',
        affectedResource: 'LOG_TABLE_OLD',
        severity: 'Cost Saving',
        insightType: 'Cleanup',
        message: 'Table LOG_TABLE_OLD has not been accessed in 180 days but occupies 2.4TB.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        accountName: 'Finance Prod',
        status: 'New',
        suggestion: 'Drop the table or move it to a lower-cost storage tier if the data is no longer needed for active analysis.',
        metrics: { creditsBefore: 450, estimatedSavings: 450 }
    });

    recs.push({
        id: 'REC-SPEC-007',
        resourceType: 'User',
        affectedResource: 'STALE_USER_01',
        severity: 'High',
        insightType: 'Security',
        message: 'User STALE_USER_01 has not logged in for 90 days but retains ACCOUNTADMIN privileges.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        accountName: 'Account C',
        status: 'New',
        suggestion: 'Revoke ACCOUNTADMIN privileges or disable the user account to follow the principle of least privilege.',
    });

    // 2. Recommendations for other warehouses to ensure they also have context
    recs.push({
        id: 'REC-SPEC-004',
        resourceType: 'Warehouse',
        affectedResource: 'LOAD_WH',
        severity: 'High',
        insightType: 'Rightsizing',
        message: 'LOAD_WH (X-Small) is consistently at 100% peak utilization.',
        timestamp: new Date().toISOString(),
        accountName: 'Finance Prod',
        status: 'New',
        warehouseName: 'LOAD_WH',
        suggestion: 'Consider scaling to SMALL to reduce ingestion latency for high-frequency streams.',
        metrics: { utilization: 100, creditsBefore: 600 }
    });

    // 3. Generate 46 generic recommendations with improved name matching
    for (let i = 1; i <= 46; i++) {
        const type = resourceTypes[i % resourceTypes.length];
        const warehouse = warehouses[i % warehouses.length];
        const account = accounts[i % accounts.length];
        const severity = i % 5 === 0 ? 'High' : i % 3 === 0 ? 'Cost Saving' : 'Medium';
        
        recs.push({
            id: `REC-${String(i).padStart(3, '0')}`,
            resourceType: type,
            affectedResource: type === 'Warehouse' ? warehouse : type === 'Query' ? `q-9482${100+i}` : `${type}_${i}`,
            severity: severity as SeverityImpact,
            insightType: insightTypes[i % insightTypes.length],
            message: `Identified potential ${insightTypes[i % insightTypes.length].toLowerCase()} for ${type} in ${account}.`,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            accountName: account,
            status: i % 5 === 0 ? 'In Progress' : i % 4 === 0 ? 'Resolved' : 'New',
            warehouseName: warehouse,
            userName: i % 2 === 0 ? 'jane_doe' : 'mike_de'
        });
    }
    return recs;
})();

export const storageByTypeData: StorageByTypeItem[] = [
    { type: 'Active', storageGB: 45000, cost: 12500, color: '#6932D5' },
    { type: 'Time Travel', storageGB: 15000, cost: 1500, color: '#A78BFA' },
    { type: 'Fail-safe', storageGB: 5600, cost: 1200, color: '#C4B5FD' },
];

export const accountCostBreakdown = [
    { name: 'Compute', cost: 10000, tokens: 80000, percentage: 80, color: '#6932D5' },
    { name: 'Storage', cost: 2500, tokens: 18000, percentage: 20, color: '#A78BFA' },
];

export const topQueriesData: TopQuery[] = [
    { id: 'q-1', queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01"', tokens: 4.5, cost: 12.50, user: 'jane_doe', duration: '02:30' },
];

export const storageSummaryData = { totalStorageGB: 65600, totalSpend: 15200, totalCredits: 30100 };
export const totalStorageMetrics = { totalSizeGB: 65600, totalCost: 15200 };
export const storageGrowthForecast = { nextMonthSizeGB: 68000, nextMonthCost: 16500 };
export const topStorageConsumersData: TopStorageConsumer[] = [];
export const databaseTablesData: DatabaseTable[] = [
    { 
        id: 't-1', 
        name: 'Data Analysis Overview', 
        databaseName: 'PROD_ANALYTICS',
        schemaName: 'Schema 145',
        activeSizeGB: 22000,
        timeTravelSizeGB: 2500,
        failSafeSizeGB: 500,
        totalSizeGB: 25000,
        retentionTimeDays: 7,
        rows: 12300000, 
        monthlyGrowth: 4.5,
        accountId: 'acc-1',
        accountName: 'Finance Prod',
        tableType: 'Permanent'
    },
    { 
        id: 't-2', 
        name: 'Cost Monitoring Notification', 
        databaseName: 'DATABASE_SPEND_ALERT',
        schemaName: 'Schema Cost Notification',
        activeSizeGB: 8000,
        timeTravelSizeGB: 1500,
        failSafeSizeGB: 500,
        totalSizeGB: 10000,
        retentionTimeDays: 90,
        rows: 11900000, 
        monthlyGrowth: 1.2,
        accountId: 'acc-1',
        accountName: 'Finance Prod',
        tableType: 'Transient'
    },
    { 
        id: 't-3', 
        name: 'Data Management Framework', 
        databaseName: 'DATABASE_SYSTEM',
        schemaName: 'Schema 145',
        activeSizeGB: 8000,
        timeTravelSizeGB: 1500,
        failSafeSizeGB: 500,
        totalSizeGB: 10000,
        retentionTimeDays: 12,
        rows: 10900000, 
        monthlyGrowth: 12.5,
        accountId: 'acc-1',
        accountName: 'Finance Prod',
        tableType: 'Temporary'
    },
    { 
        id: 't-4', 
        name: 'Query Performance Enhancement', 
        databaseName: 'DATABASE_SYSTEM',
        schemaName: 'Schema Cost Notification',
        activeSizeGB: 5000,
        timeTravelSizeGB: 1000,
        failSafeSizeGB: 200,
        totalSizeGB: 6200,
        retentionTimeDays: 7,
        rows: 9400000, 
        monthlyGrowth: 8.2,
        accountId: 'acc-2',
        accountName: 'Account B',
        tableType: 'Hybrid'
    },
    { 
        id: 't-5', 
        name: 'Data Protection Measures', 
        databaseName: 'DATABASE_SECURITY',
        schemaName: 'Schema Cost Notification',
        activeSizeGB: 5000,
        timeTravelSizeGB: 1000,
        failSafeSizeGB: 200,
        totalSizeGB: 6200,
        retentionTimeDays: 7,
        rows: 9300000, 
        monthlyGrowth: 5.5,
        accountId: 'acc-2',
        accountName: 'Account B',
        tableType: 'Dynamic'
    },
    { 
        id: 't-6', 
        name: 'Data Analysis Summary', 
        databaseName: 'DATABASE_SECURITY',
        schemaName: 'Schema Cost Notification',
        activeSizeGB: 3500,
        timeTravelSizeGB: 500,
        failSafeSizeGB: 100,
        totalSizeGB: 4100,
        retentionTimeDays: 7,
        rows: 8400000, 
        monthlyGrowth: 3.2,
        accountId: 'acc-3',
        accountName: 'Account C',
        tableType: 'Permanent'
    },
    { 
        id: 't-7', 
        name: 'Expenditure Alert Notification', 
        databaseName: 'DATABASE_SECURITY',
        schemaName: 'Schema Cost Notification',
        activeSizeGB: 3500,
        timeTravelSizeGB: 500,
        failSafeSizeGB: 100,
        totalSizeGB: 4100,
        retentionTimeDays: 14,
        rows: 8100000, 
        monthlyGrowth: 2.8,
        accountId: 'acc-3',
        accountName: 'Account C',
        tableType: 'Permanent'
    },
];

export const materializedViewsData = [
    { id: 'mv-1', name: 'MV_SALES_SUMMARY', databaseName: 'PROD_ANALYTICS', schemaName: 'PUBLIC', sizeGB: 120, credits: 45.5, lastRefreshed: '2023-11-20T10:00:00Z' },
    { id: 'mv-2', name: 'MV_CUSTOMER_METRICS', databaseName: 'PROD_ANALYTICS', schemaName: 'PUBLIC', sizeGB: 85, credits: 32.2, lastRefreshed: '2023-11-20T09:30:00Z' },
    { id: 'mv-3', name: 'MV_REGIONAL_TRENDS', databaseName: 'DATABASE_SYSTEM', schemaName: 'Schema 145', sizeGB: 45, credits: 12.8, lastRefreshed: '2023-11-20T08:00:00Z' },
];

export const tasksData = [
    { id: 'tsk-1', name: 'DAILY_ETL_LOAD', databaseName: 'PROD_ANALYTICS', schemaName: 'PUBLIC', credits: 125.5, status: 'SUCCEEDED', lastRun: '2023-11-20T06:00:00Z', schedule: 'USING CRON 0 6 * * * UTC' },
    { id: 'tsk-2', name: 'WEEKLY_BACKUP', databaseName: 'DATABASE_SYSTEM', schemaName: 'Schema 145', credits: 45.2, status: 'SUCCEEDED', lastRun: '2023-11-19T00:00:00Z', schedule: 'USING CRON 0 0 * * 0 UTC' },
    { id: 'tsk-3', name: 'HOURLY_AGGREGATION', databaseName: 'PROD_ANALYTICS', schemaName: 'PUBLIC', credits: 12.4, status: 'SUCCEEDED', lastRun: '2023-11-20T11:00:00Z', schedule: '60 MINUTE' },
];

export const unusedTablesData: UnusedTable[] = [
    { id: 'ut-1', name: 'Old Analysis Cache', sizeGB: 420, rows: 399, lastAccessed: '2025-10-01', unusedDays: 145, createdBy: 'mike_de', database: 'PROD_ANALYTICS', schema: 'Schema 145', potentialSavings: 25, accountId: 'acc-1', accountName: 'Finance Prod', tableType: 'Permanent' },
    { id: 'ut-2', name: 'Legacy Spend Logs', sizeGB: 120, rows: 119, lastAccessed: '2025-11-15', unusedDays: 90, createdBy: 'jane_doe', database: 'DATABASE_SPEND_ALERT', schema: 'Schema Cost Notification', potentialSavings: 15, accountId: 'acc-1', accountName: 'Finance Prod', tableType: 'Transient' },
    { id: 'ut-3', name: 'Framework Test Data', sizeGB: 110, rows: 109, lastAccessed: '2025-12-20', unusedDays: 65, createdBy: 'alex_analyst', database: 'DATABASE_SYSTEM', schema: 'Schema 145', potentialSavings: 8, accountId: 'acc-1', accountName: 'Finance Prod', tableType: 'Temporary' },
    { id: 'ut-4', name: 'Performance Temp', sizeGB: 95, rows: 94, lastAccessed: '2026-01-10', unusedDays: 45, createdBy: 'system_etl', database: 'DATABASE_SYSTEM', schema: 'Schema Cost Notification', potentialSavings: 85, accountId: 'acc-2', accountName: 'Account B', tableType: 'Hybrid' },
    { id: 'ut-5', name: 'Protection Backup', sizeGB: 94, rows: 93, lastAccessed: '2026-02-01', unusedDays: 24, createdBy: 'mike_de', database: 'DATABASE_SECURITY', schema: 'Schema Cost Notification', potentialSavings: 5, accountId: 'acc-2', accountName: 'Account B', tableType: 'Dynamic' },
];
export const dataAgeDistributionData: DataAgeDistributionItem[] = [];
export const storageByTierData = {
    current: [{ name: 'Hot', value: 80, color: '#DC2626' }],
    recommended: [{ name: 'Hot', value: 60, color: '#DC2626' }]
};
export const tieringOpportunitiesData: TieringOpportunityItem[] = [];
export const policyComplianceData = { compliancePercentage: 85 };
export const costSpendForecastData = [];
export const costForecastByTierData = [];
export const costAnomalyAlertsData: AnomalyAlertItem[] = [];
export const costSavingsProjectionData = { message: 'AI projects 15% savings', savingsPercentage: 15 };
export const availableWidgetsData: Omit<Widget, 'id' | 'dataSource'>[] = [
    { widgetId: 'total-spend', title: 'Total Spend', type: 'StatCard', description: 'Overall spend across accounts', layout: { w: 1, h: 1 }, tags: ['Cost'] },
    { widgetId: 'spend-breakdown', title: 'Spend Breakdown', type: 'DonutChart', description: 'Percentage of cost by resource', layout: { w: 1, h: 1 }, tags: ['Cost'] },
];
export const overviewMetrics = {
    cost: { current: 48500 },
    tokens: { current: 380000 }
};
export const costBreakdownData = [
    { name: 'Compute', cost: 40000, tokens: 320000, percentage: 82, color: '#6932D5' },
    { name: 'Storage', cost: 8500, tokens: 60000, percentage: 18, color: '#A78BFA' },
];
export const accountSpend = {
    cost: { monthly: 12500, forecasted: 15000 },
    tokens: { monthly: 98000, forecasted: 110000 }
};

export const sqlFilesData: SQLFile[] = [
    {
        id: 'file-1',
        name: 'monthly_spend_report.sql',
        accountId: 'acc-1',
        accountName: 'Finance Prod',
        createdDate: '2023-11-01T10:00:00Z',
        versions: [
            {
                id: 'v1-1',
                version: 1,
                date: '2023-11-01T10:00:00Z',
                description: 'Initial query for monthly spend.',
                user: 'FinOps Admin',
                tag: 'General',
                sql: 'SELECT * FROM spend_table;'
            }
        ]
    }
];

export const dashboardsData: DashboardItem[] = [
    {
        id: 'dash-1',
        title: 'Executive Overview',
        createdOn: '2023-10-15',
        description: 'High-level metrics for executive review.',
        widgets: [],
    }
];

export const assignedQueriesData: AssignedQuery[] = [
    {
        id: 'aq-1',
        queryId: 'q-9482103',
        queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01";',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Alex Johnson',
        priority: 'High',
        status: 'Assigned',
        message: 'High credit consumption detected. Please optimize.',
        assignedOn: '2023-11-19T14:00:00Z',
        cost: 12.50,
        tokens: 4.5,
        credits: 4.5,
        warehouse: 'COMPUTE_WH',
        recommendationId: 'REC-SPEC-002',
        history: []
    },
    {
        id: 'aq-2',
        queryId: 'q-9482115',
        queryText: 'SELECT * FROM CUSTOMER_ACTIVITY WHERE REGION = "NORTH_AMERICA" AND ACTIVITY_TYPE = "PURCHASE";',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Alex Johnson',
        priority: 'Medium',
        status: 'In progress',
        message: 'Query is scanning 1.2TB. Please check if clustering can be improved.',
        assignedOn: '2023-11-18T10:00:00Z',
        cost: 32.80,
        tokens: 12.8,
        credits: 12.8,
        warehouse: 'ANALYTICS_WH',
        recommendationId: 'REC-SPEC-005',
        engineerResponse: 'I have analyzed the query and found that adding a cluster key on ACTIVITY_TYPE will reduce scan size by 60%. Implementing now.',
        engineerResponseDate: '2023-11-19T09:30:00Z',
        history: [
            {
                id: 'h-1',
                type: 'system',
                author: 'Alex Johnson',
                timestamp: '2023-11-19T09:30:00Z',
                content: 'Status changed from Assigned to In progress',
                metadata: { oldStatus: 'Assigned', newStatus: 'In progress' }
            },
            {
                id: 'h-2',
                type: 'comment',
                author: 'Alex Johnson',
                timestamp: '2023-11-19T09:30:00Z',
                content: 'I have analyzed the query and found that adding a cluster key on ACTIVITY_TYPE will reduce scan size by 60%. Implementing now.'
            }
        ]
    }
];

export const pullRequestsData: PullRequest[] = [
    {
        id: 1,
        title: 'Optimize Sales Query',
        author: 'Alex Johnson',
        status: 'Open',
        sourceBranch: 'feature/optimize-sales',
        targetBranch: 'main',
        createdAt: '2023-11-20T09:00:00Z',
        performanceMetrics: [],
        automatedChecks: [],
        reviewers: [],
        oldCode: 'SELECT * FROM FACT_SALES;',
        newCode: 'SELECT ID, AMOUNT FROM FACT_SALES WHERE EVENT_DATE > CURRENT_DATE - 30;'
    }
];

export const activityLogsData: ActivityLog[] = [
    {
        id: 'log-1',
        user: 'FinOps Admin',
        action: 'Viewed Account Overview',
        timestamp: '2023-11-20T10:00:00Z',
        status: 'Success'
    }
];

export const accountApplicationsData: Application[] = [
    {
        id: 'app-1',
        name: 'Sales Dashboard',
        description: 'Internal sales reporting application.',
        totalCredits: 1200,
        warehouseCredits: 800,
        storageCredits: 300,
        otherCredits: 100,
        queryCount: 4500,
        lastActive: '2023-11-20T11:00:00Z',
        insightCount: 3
    }
];

export const usageCreditsData = spendTrendsData;
export const resourceSnapshotData = [
    { name: 'Compute', value: 44250 },
    { name: 'Storage', value: 2100 },
    { name: 'Services', value: 6800 },
];