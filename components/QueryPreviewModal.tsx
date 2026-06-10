import React, { useState } from 'react';
import { QueryListItem } from '../types';
import { IconBeaker, IconWand, IconSearch, IconClipboardCopy, IconCheck } from '../constants';

interface QueryPreviewContentProps {
  query: QueryListItem;
  onAnalyze: (query: QueryListItem) => void;
  onOptimize: (query: QueryListItem) => void;
  onSimulate: (query: QueryListItem) => void;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const longQueryText = `
WITH
  daily_sales AS (
    SELECT
      DATE(order_date) AS sale_date,
      SUM(oi.quantity * p.price) AS daily_revenue,
      COUNT(DISTINCT o.order_id) AS daily_orders
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.status NOT IN ('cancelled', 'returned')
    GROUP BY 1
  ),

  customer_lifetime_value AS (
    SELECT
      c.customer_id,
      c.first_name,
      c.last_name,
      MIN(o.order_date) AS first_order_date,
      MAX(o.order_date) AS last_order_date,
      COUNT(o.order_id) AS number_of_orders,
      SUM(oi.quantity * p.price) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  ),

  product_performance AS (
    SELECT
      p.product_id,
      p.name AS product_name,
      p.category,
      SUM(oi.quantity) AS units_sold,
      SUM(oi.quantity * p.price) AS product_revenue,
      AVG(oi.quantity * p.price) AS avg_order_value
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    GROUP BY 1, 2, 3
  ),

  regional_analysis AS (
    SELECT
      c.region,
      p.category,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue,
      COUNT(DISTINCT o.customer_id) AS unique_customers
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  ),

  user_sessions AS (
    SELECT
      user_id,
      session_id,
      MIN(event_timestamp) AS session_start,
      MAX(event_timestamp) AS session_end,
      COUNT(*) AS events_in_session
    FROM web_events
    WHERE event_timestamp >= DATEADD(day, -30, CURRENT_DATE())
    GROUP BY 1, 2
  ),
  
  marketing_attribution AS (
    SELECT
      o.order_id,
      c.customer_id,
      w.source AS first_touch_source,
      w_last.source AS last_touch_source
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN (
      SELECT
        user_id,
        source,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) as rn
      FROM web_events
      WHERE source IS NOT NULL
    ) w ON c.customer_id = w.user_id AND w.rn = 1
    JOIN (
      SELECT
        user_id,
        source,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_timestamp DESC) as rn
      FROM web_events
      WHERE source IS NOT NULL
    ) w_last ON c.customer_id = w_last.user_id AND w_last.rn = 1
  ),

  final_report AS (
    SELECT
      clv.customer_id,
      clv.first_name || ' ' || clv.last_name AS full_name,
      clv.total_spent,
      clv.number_of_orders,
      ra.region,
      ra.sales_month,
      ra.monthly_regional_revenue,
      pp.product_name,
      pp.units_sold,
      ma.first_touch_source,
      ma.last_touch_source,
      (clv.total_spent / clv.number_of_orders) AS avg_customer_order_value,
      LAG(ra.monthly_regional_revenue, 1, 0) OVER (PARTITION BY ra.region, pp.category ORDER BY ra.sales_month) AS prev_month_revenue,
      c.country,
      c.postal_code,
      p.supplier,
      oi.discount_amount,
      o.shipping_method,
      DATEDIFF(day, clv.first_order_date, clv.last_order_date) AS customer_lifespan_days
    FROM customer_lifetime_value clv
    JOIN regional_analysis ra ON clv.customer_id = ra.customer_id -- Simplified join for demo
    JOIN product_performance pp ON ra.product_category = pp.category -- Simplified join for demo
    LEFT JOIN marketing_attribution ma ON clv.customer_id = ma.customer_id
    LEFT JOIN customers c ON clv.customer_id = c.customer_id
    LEFT JOIN orders o ON ma.order_id = o.order_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
  )

-- Final selection from the comprehensive report
SELECT 
    full_name,
    total_spent,
    number_of_orders,
    avg_customer_order_value,
    customer_lifespan_days,
    region,
    sales_month,
    monthly_regional_revenue,
    (monthly_regional_revenue - prev_month_revenue) AS month_over_month_growth,
    product_name,
    units_sold,
    first_touch_source,
    last_touch_source,
    country,
    postal_code,
    supplier,
    discount_amount,
    shipping_method
FROM final_report
WHERE
  total_spent > 500
  AND region = 'North America'
  AND sales_month >= '2023-01-01'
  AND first_touch_source IN ('google', 'facebook', 'organic', 'email')
  AND last_touch_source NOT IN ('direct', 'internal')
  AND customer_lifespan_days > 15
ORDER BY
  sales_month DESC,
  total_spent DESC
LIMIT 500;

-- Note: This is a complex, long-form query created for demonstration purposes.
-- It is designed to test the UI's ability to display large blocks of code cleanly.
-- The logic and joins are illustrative and may not represent a perfectly optimized or runnable query without a corresponding schema.
-- The query showcases multiple Common Table Expressions (CTEs), window functions (LAG, ROW_NUMBER),
-- various JOIN types, and complex filtering to simulate a real-world analytical workload.
-- This level of complexity is common in data warehousing and business intelligence tasks.
-- The comments are also added to increase line count and mimic real developer code.
-- ...
-- ... further comments to extend the query length ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- End of demonstrative query.
`;

const QueryPreviewContent: React.FC<QueryPreviewContentProps> = ({ query, onAnalyze, onOptimize, onSimulate }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    if (!query) return null;

    const details = [
        { label: 'Duration', value: query.duration },
        { label: 'Warehouse', value: query.warehouse },
        { label: 'Bytes Scanned', value: formatBytes(query.bytesScanned) },
        { label: 'Bytes Written', value: formatBytes(query.bytesWritten) },
        { label: 'Start Time', value: new Date(query.timestamp).toLocaleString() },
        { label: 'Severity', value: query.severity },
    ];
    
    return (
        <div className="flex flex-col h-full">
            <div className="px-6 border-b border-border-color">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('Overview')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Overview' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
                        aria-current={activeTab === 'Overview' ? 'page' : undefined}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('Full Query')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Full Query' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
                        aria-current={activeTab === 'Full Query' ? 'page' : undefined}
                    >
                        Full Query
                    </button>
                </nav>
            </div>

            <div className="p-6 overflow-y-auto">
                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        {details.map(detail => (
                            <React.Fragment key={detail.label}>
                                <dt className="text-text-secondary">{detail.label}</dt>
                                <dd className="text-text-primary font-medium">{detail.value}</dd>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {activeTab === 'Full Query' && (
                    <div className="relative group">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(query.queryText || longQueryText);
                                const btn = document.getElementById('copy-btn-preview');
                                if (btn) btn.innerText = 'Copied!';
                                setTimeout(() => { if (btn) btn.innerText = 'Copy'; }, 2000);
                            }}
                            id="copy-btn-preview"
                            className="absolute top-4 right-4 px-3 py-1.5 bg-white border border-border-color rounded-lg text-xs font-bold text-text-secondary hover:text-primary transition-all shadow-sm z-10"
                        >
                            Copy
                        </button>
                        <div className="bg-input-bg rounded-lg border border-border-color overflow-hidden flex">
                            <div className="bg-slate-50 border-r border-border-color px-3 py-4 text-right select-none min-w-[40px]">
                                {(query.queryText || longQueryText).split('\n').map((_, i) => (
                                    <div key={i} className="text-[11px] font-mono text-text-muted leading-5">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 overflow-auto max-h-[60vh] flex-grow">
                                <pre className="text-[13px] font-mono text-text-primary leading-5 whitespace-pre">
                                    <code>{query.queryText || longQueryText}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-background mt-auto flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={() => onAnalyze(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open this query in Analyzer to inspect performance details."><IconSearch className="h-4 w-4" /> Analyze</button>
                <button onClick={() => onOptimize(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open in Optimizer to get AI-powered optimization suggestions."><IconWand className="h-4 w-4" /> Optimize</button>
                <button onClick={() => onSimulate(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open in Simulator to test cost and performance scenarios."><IconBeaker className="h-4 w-4" /> Simulate</button>
            </div>
        </div>
    );
};

export default QueryPreviewContent;