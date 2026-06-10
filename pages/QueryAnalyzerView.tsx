
import React, { useState, useEffect } from 'react';
import { QueryListItem } from '../types';
import { IconChevronLeft, IconSave, IconClipboardCopy, IconRefresh, IconKey, IconSearch, IconDatabase, IconCheck, IconAdjustments, IconLayers, IconBeaker, IconTrendingUp, IconWand, IconSparkles, IconInfo } from '../constants';

interface AnalysisResult {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'core' | 'performance';
}

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

const mockAnalysisResults: AnalysisResult[] = [
    {
        id: 'rec1',
        title: 'Filter Pushdown Opportunity',
        description: "The filter `region = 'North America'` is applied in the final SELECT. Pushing this filter into the `regional_analysis` CTE would significantly reduce data processed by subsequent joins.",
        icon: IconAdjustments,
        category: 'core',
    },
    {
        id: 'rec2',
        title: 'Clustering Key Recommendation',
        description: 'Query plan shows a full table scan on `orders`. Clustering the `orders` table by `order_date` would improve performance of date-range filters and the `daily_sales` CTE.',
        icon: IconKey,
        category: 'core',
    },
    {
        id: 'rec3',
        title: 'CTE Optimization',
        description: 'The `customer_lifetime_value` CTE processes entire tables. Consider creating a materialized view or an aggregated summary table for this foundational business metric.',
        icon: IconLayers,
        category: 'core',
    },
    {
        id: 'rec4',
        title: 'Expensive Function Usage',
        description: "`COUNT(DISTINCT ...)` in `daily_sales` is computationally expensive. If an approximation is acceptable, consider using `APPROX_COUNT_DISTINCT` for faster results.",
        icon: IconBeaker,
        category: 'performance',
    },
    {
        id: 'rec5',
        title: 'Warehouse Sizing',
        description: "This query's complexity and data volume may benefit from a larger warehouse. The current plan shows some local disk spilling. Try running on a MEDIUM warehouse.",
        icon: IconDatabase,
        category: 'performance',
    },
    {
        id: 'rec6',
        title: 'Cost Impact Projection',
        description: 'Applying core recommendations could reduce query execution time by an estimated 40-60% and lower credit consumption by approximately 0.4 credits per run.',
        icon: IconTrendingUp,
        category: 'performance',
    },
];

const AnalysisResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const Icon = result.icon;
    return (
        <div className="bg-white p-6 rounded-[16px] flex items-start gap-6 border border-border-color">
            <div className="flex-shrink-0 pt-1">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h4 className="text-[16px] font-bold text-text-primary tracking-tight leading-none mb-2">{result.title}</h4>
                <p className="text-[14px] text-text-secondary leading-relaxed font-medium">{result.description}</p>
            </div>
        </div>
    );
};

const QueryAnalyzerView: React.FC<{
    query: QueryListItem | null;
    onBack: () => void;
    onSaveClick: (tag: string) => void;
    onBrowseQueries: () => void;
    onOptimizeQuery: (query: QueryListItem) => void;
}> = ({ query, onBack, onSaveClick, onBrowseQueries, onOptimizeQuery }) => {
    const originalQuery = query ? realWorldQuery : '';
    const [editedQuery, setEditedQuery] = useState(originalQuery);
    const [optimizationGoal, setOptimizationGoal] = useState<'balanced' | 'performance' | 'cost'>('balanced');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    
    const isDirty = editedQuery !== originalQuery;

    useEffect(() => {
        setEditedQuery(query ? realWorldQuery : '');
        setAnalysisResults([]);
    }, [query]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setAnalysisResults([]);
        setTimeout(() => {
            setAnalysisResults(mockAnalysisResults);
            setIsAnalyzing(false);
        }, 2500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(editedQuery);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReset = () => {
        setEditedQuery(originalQuery);
    };
    
    const coreResults = analysisResults.filter(r => r.category === 'core');
    const performanceResults = analysisResults.filter(r => r.category === 'performance');
    
    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            {query && (
                <div className="flex-shrink-0 mb-4">
                    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                        <IconChevronLeft className="h-4 w-4" /> Back to All Queries
                    </button>
                </div>
            )}

            <main className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
                {/* Editor Panel */}
                <div className="w-full md:w-3/5 flex flex-col">
                     <div className="flex-grow bg-surface p-4 rounded-xl border border-border-color flex flex-col shadow-sm">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h3 className="text-[14px] font-bold text-text-strong uppercase tracking-wider">SQL editor</h3>
                            <button
                                onClick={handleCopy}
                                className="text-[11px] font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                {isCopied ? <IconCheck className="w-3.5 h-3.5" /> : <IconClipboardCopy className="w-3.5 h-3.5" />}
                                {isCopied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <textarea
                            value={editedQuery}
                            onChange={(e) => setEditedQuery(e.target.value)}
                            className="w-full flex-grow bg-surface-nested font-mono text-[13px] p-6 rounded-xl border border-border-light focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all resize-none shadow-inner"
                            aria-label="SQL Query Editor"
                            placeholder="Paste or write a query to start analysis."
                        />
                        <div className="flex items-center gap-3 pt-6 mt-auto">
                            <button
                                onClick={handleAnalyze}
                                disabled={!editedQuery.trim() || isAnalyzing}
                                className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <IconSearch className="w-4 h-4" />}
                                <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
                            </button>
                            
                            <button
                                onClick={() => onSaveClick('Analyzed')}
                                disabled={analysisResults.length === 0}
                                className="px-6 py-3 border border-border-color bg-white text-text-primary font-bold rounded-full hover:bg-surface-nested transition-all disabled:opacity-40"
                            >
                                Save Query
                            </button>
                            
                            {isDirty && (
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 text-text-secondary font-bold hover:text-text-strong transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Panel - Redesigned as per user image */}
                <div className="w-full md:w-2/5 flex flex-col bg-white rounded-[24px] border border-border-color shadow-sm overflow-hidden">
                    <header className="px-8 py-6 border-b border-border-light bg-white flex-shrink-0">
                         <h3 className="text-[18px] font-black text-text-strong tracking-tight">Analysis Results</h3>
                    </header>

                    <div className="flex-grow overflow-y-auto p-8 no-scrollbar bg-[#F9F7FE]/30">
                        {isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <div className="loader h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <div className="mt-8 space-y-2">
                                    <p className="text-[16px] font-bold text-text-strong">Generating insights...</p>
                                    <p className="text-[13px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                                        Evaluating execution plans and identifying potential performance bottlenecks.
                                    </p>
                                </div>
                            </div>
                        ) : analysisResults.length > 0 ? (
                            <div className="space-y-10">
                                {/* Core Optimization Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-black text-text-muted uppercase tracking-[0.2em]">Core Optimization</h4>
                                        <div className="flex-grow h-px bg-border-light"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {coreResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                                    </div>
                                </div>

                                {/* Performance Insights Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-black text-text-muted uppercase tracking-[0.2em]">Performance Insights</h4>
                                        <div className="flex-grow h-px bg-border-light"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {performanceResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                                    </div>
                                </div>

                                {/* Cortex AI Optimization Banner */}
                                <div className="bg-[#F5F7FF] p-6 rounded-[24px] border border-[#E0E7FF] shadow-sm space-y-6 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-[#E0E7FF] rounded-full">
                                                <IconSparkles className="w-5 h-5 text-[#4F46E5]" />
                                            </div>
                                            <h4 className="text-[13px] font-black text-[#4F46E5] uppercase tracking-wider">Cortex AI Optimization</h4>
                                        </div>
                                        <button
                                            onClick={() => query && onOptimizeQuery(query)}
                                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-black px-6 py-3 rounded-2xl shadow-lg shadow-[#4F46E5]/20 transition-all flex items-center gap-2 active:scale-95"
                                        >
                                            <IconSparkles className="h-4 w-4" />
                                            <span>Generate Code</span>
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
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                                <div className="w-20 h-20 bg-surface-nested rounded-3xl flex items-center justify-center mb-6 border border-border-light">
                                    <IconBeaker className="w-10 h-10 text-text-muted" />
                                </div>
                                <h3 className="text-lg font-bold text-text-strong">Ready for Analysis</h3>
                                <p className="text-sm text-text-secondary mt-2 max-w-xs mx-auto">Click "Run Analysis" to scan your SQL and see optimization recommendations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QueryAnalyzerView;
