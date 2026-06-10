
import React, { useState, useEffect } from 'react';
import { QueryListItem } from '../types';
import { IconChevronLeft, IconSave, IconClipboardCopy, IconRefresh, IconExclamationTriangle, IconClipboardList, IconWand, IconInfo, IconSparkles } from '../constants';

const realWorldQuery = `
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

  regional_analysis AS (
    SELECT
      c.region,
      p.category,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  )

-- Final selection from the comprehensive report
SELECT 
    clv.first_name || ' ' || clv.last_name AS full_name,
    clv.total_spent,
    ra.region,
    ra.sales_month,
    ra.monthly_regional_revenue
FROM customer_lifetime_value clv
JOIN regional_analysis ra ON clv.customer_id = ra.customer_id -- Simplified join
WHERE
  clv.total_spent > 500
  AND ra.region = 'North America'
  AND ra.sales_month >= '2023-01-01'
ORDER BY
  ra.sales_month DESC,
  clv.total_spent DESC
LIMIT 500;
`;

const optimizedQueryBalanced = `
-- Optimized by Anavsan AI (Balanced)
WITH regional_analysis AS (
    SELECT
      c.region,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    -- Pushed filter down to reduce data before join
    WHERE c.region = 'North America'
      AND o.order_date >= '2023-01-01'
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2
)
SELECT 
    ra.region,
    ra.sales_month,
    ra.monthly_regional_revenue
FROM regional_analysis ra
-- Please replace [Column 1] with an actual column name.
WHERE [Column 1] IS NOT NULL
ORDER BY
  ra.sales_month DESC
LIMIT 500;
`;

const mockAnalysisChangesBalanced = [
    {
        title: 'Pushed Down Filters',
        description: 'Moved `region` and `sales_month` filters from the final `SELECT` into the `regional_analysis` CTE. This reduces the amount of data processed in the initial scan and join operations.'
    },
    {
        title: 'Removed Unused CTE',
        description: 'The `daily_sales` CTE was calculated but never used in the final query. Removing it prevents unnecessary computation and resource usage.'
    },
    {
        title: 'Simplified Group By',
        description: 'The `GROUP BY` clause was updated to only include necessary columns, which can sometimes allow the query planner to choose a more efficient aggregation strategy.'
    },
    {
        title: 'Added Placeholder',
        description: 'A placeholder `WHERE [Column 1] IS NOT NULL` was added as a template for further filtering. This is an example of when manual user input might be required.'
    },
];

const ChangeSummaryCard: React.FC<{ change: { title: string, description: string } }> = ({ change }) => (
    <div className="flex items-start gap-3 p-3 bg-surface-nested rounded-lg">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <IconClipboardList className="w-3 h-3 text-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-sm text-text-primary">{change.title}</h4>
            <p className="text-sm text-text-secondary">{change.description}</p>
        </div>
    </div>
);

const QueryOptimizerView: React.FC<{
    query: QueryListItem | null;
    onBack: () => void;
    onSaveClick: (tag: string) => void;
    onSimulateQuery: (query: QueryListItem | null) => void;
}> = ({ query, onBack, onSaveClick, onSimulateQuery }) => {
    const originalQuery = query ? realWorldQuery : '';
    const [editedQuery, setEditedQuery] = useState(originalQuery);
    const [optimizationGoal, setOptimizationGoal] = useState<'balanced' | 'performance' | 'cost'>('balanced');
    const [optimizedQuery, setOptimizedQuery] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisChanges, setAnalysisChanges] = useState<(typeof mockAnalysisChangesBalanced)>([]);
    const [hasPlaceholders, setHasPlaceholders] = useState(false);

    const isDirty = editedQuery !== originalQuery;

    useEffect(() => {
        const initial = query ? realWorldQuery : '';
        setEditedQuery(initial);
        setOptimizedQuery(null);
        setAnalysisChanges([]);
        setHasPlaceholders(false);
    }, [query]);

    const runOptimization = () => {
        setIsLoading(true);
        setOptimizedQuery(null);
        setAnalysisChanges([]);
        setHasPlaceholders(false);

        setTimeout(() => {
            const goalPrefix = optimizationGoal.charAt(0).toUpperCase() + optimizationGoal.slice(1);
            setOptimizedQuery(`-- Optimized by Anavsan AI (${goalPrefix})\n` + optimizedQueryBalanced.split('\n').slice(2).join('\n'));
            setAnalysisChanges(mockAnalysisChangesBalanced);
            setHasPlaceholders(true);
            setIsLoading(false);
        }, 2000);
    };
    
    const handleReset = () => {
        setEditedQuery(originalQuery);
    };
    
    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
             {query && (
                <div className="flex-shrink-0 mb-4">
                    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                        <IconChevronLeft className="h-4 w-4" /> Back to All Queries
                    </button>
                </div>
            )}

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
                {/* Left Panel: Original Query */}
                <div className="w-full flex flex-col bg-surface p-4 rounded-xl border border-border-color">
                    <h3 className="text-base font-semibold text-text-strong mb-2">Your Query</h3>
                    <textarea
                        value={editedQuery}
                        onChange={(e) => setEditedQuery(e.target.value)}
                        className="w-full flex-grow bg-input-bg font-mono text-sm p-4 rounded-lg border border-border-color focus:ring-primary focus:border-primary resize-none"
                        aria-label="Your SQL Query"
                        placeholder="Paste or write a query to optimize."
                    />

                    {/* Cortex AI Optimization Banner (Trigger) */}
                    <div className="bg-[#F5F7FF] p-6 rounded-[24px] border border-[#E0E7FF] shadow-sm space-y-6 mt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[#E0E7FF] rounded-full">
                                    <IconSparkles className="w-5 h-5 text-[#4F46E5]" />
                                </div>
                                <h4 className="text-[13px] font-black text-[#4F46E5] uppercase tracking-wider">Cortex AI Optimization</h4>
                            </div>
                            <button
                                onClick={runOptimization}
                                disabled={!editedQuery.trim() || isLoading}
                                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-[#4F46E5]/20 transition-all flex items-center gap-2 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <IconSparkles className="h-4 w-4" />
                                )}
                                {isLoading ? 'Generating...' : 'Generate Code'}
                            </button>
                        </div>

                        {/* Optimization Strategy Selection */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-[#4F46E5] uppercase tracking-widest">Optimization Strategy</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {(['balanced', 'performance', 'cost'] as const).map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setOptimizationGoal(goal)}
                                        className={`py-3 px-4 rounded-2xl text-[12px] font-black uppercase tracking-tight border-2 transition-all ${
                                            optimizationGoal === goal
                                                ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-lg shadow-indigo-100'
                                                : 'bg-white border-[#E0E7FF] text-indigo-400 hover:border-indigo-200'
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[12px] text-indigo-400 font-medium italic animate-in fade-in duration-300">
                                {optimizationGoal === 'balanced' && 'Optimizes for a mix of speed and resource efficiency.'}
                                {optimizationGoal === 'performance' && 'Prioritizes execution speed, potentially using more compute resources.'}
                                {optimizationGoal === 'cost' && 'Focuses on minimizing credit consumption and resource usage.'}
                            </p>
                        </div>

                        <div className="flex items-start gap-2 text-[#4F46E5]/70 pt-2 border-t border-indigo-100">
                            <IconInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] font-bold uppercase tracking-tight leading-tight">
                                USE CORTEX AI TO AUTOMATICALLY GENERATE THE NECESSARY SQL TO IMPLEMENT THIS RECOMMENDATION.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 mt-auto">
                        <button className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Copy</button>
                        {isDirty && (
                            <button onClick={handleReset} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Reset</button>
                        )}
                    </div>
                </div>

                {/* Right Panel: Optimized Query */}
                <div className="w-full flex flex-col bg-surface p-4 rounded-xl border border-border-color">
                    <h3 className="text-base font-semibold text-text-strong mb-2">Optimized by AI</h3>
                    {isLoading ? (
                         <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            <p className="mt-4 text-sm text-text-secondary max-w-sm">
                                Anavsan AI is analyzing your query structure, identifying inefficiencies, and rewriting it for optimal performance...
                            </p>
                        </div>
                    ) : optimizedQuery ? (
                        <div className="flex-grow flex flex-col overflow-hidden">
                             <textarea
                                value={optimizedQuery}
                                readOnly
                                className="w-full flex-grow bg-input-bg font-mono text-sm p-4 rounded-lg border border-border-color focus:ring-primary focus:border-primary resize-none"
                                aria-label="Optimized SQL Query"
                            />
                            {hasPlaceholders && (
                                <div className="mt-2 p-3 bg-status-warning-light text-status-warning-dark text-sm rounded-lg flex items-start gap-2">
                                    <IconExclamationTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <span><b>Manual Input Required:</b> this query includes placeholder fields (e.g., `[Column 1]`). Please replace them with actual column names before running the simulation.</span>
                                </div>
                            )}
                             <div className="flex items-center gap-2 pt-4 mt-auto">
                                <button onClick={() => onSimulateQuery(query)} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Simulate</button>
                                <button onClick={() => onSaveClick('Optimized')} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Save</button>
                                <button className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary">Copy</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border-color rounded-lg">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <IconWand className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-text-primary">Optimized query will appear here</h3>
                            <p className="text-sm text-text-secondary mt-1">Click "Optimize with AI" to generate a new version.</p>
                        </div>
                    )}
                </div>
            </main>
            {analysisChanges.length > 0 && (
                 <section className="flex-shrink-0 bg-surface p-4 rounded-xl border border-border-color mt-4">
                    <h3 className="text-base font-semibold text-text-strong mb-2">Summary of Changes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisChanges.map(change => <ChangeSummaryCard key={change.title} change={change} />)}
                    </div>
                 </section>
            )}
        </div>
    );
};

export default QueryOptimizerView;
