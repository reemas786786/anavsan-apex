import React from 'react';
import { SQLFile, SQLVersion } from '../types';
import { IconAdjustments, IconKey, IconLayers, IconBeaker, IconDatabase, IconTrendingUp, IconClipboardList } from '../constants';

interface AnalysisResult {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'core' | 'performance';
}

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
        description: 'This query\'s complexity and data volume may benefit from a larger warehouse. The current plan shows some local disk spilling. Try running on a MEDIUM warehouse.',
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
        <div className="bg-surface p-4 rounded-xl flex items-start gap-4 border border-border-color">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h4 className="font-semibold text-text-primary">{result.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{result.description}</p>
            </div>
        </div>
    );
};

interface RecommendationPreviewPanelProps {
    file: SQLFile;
    version: SQLVersion;
}

const RecommendationPreviewPanel: React.FC<RecommendationPreviewPanelProps> = ({ file, version }) => {
    const coreResults = mockAnalysisResults.filter(r => r.category === 'core');
    const performanceResults = mockAnalysisResults.filter(r => r.category === 'performance');

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary mb-1">Query File</h3>
                    <p className="text-base font-medium text-text-primary">{file.name} (v{version.version})</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary mb-1">Query Text</h3>
                    <pre className="bg-input-bg p-3 rounded-lg border border-border-color text-xs text-text-primary overflow-auto max-h-48 whitespace-pre-wrap">
                        <code>{version.sql || 'No SQL available for this version.'}</code>
                    </pre>
                </div>
                <div className="pt-2">
                    <h3 className="text-base font-semibold text-text-strong mb-4">Recommendations</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-text-secondary mb-2">Core Optimization</h4>
                            <div className="space-y-3">
                                {coreResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                            </div>
                        </div>
                        <div className="pt-2">
                            <h4 className="text-sm font-semibold text-text-secondary mb-2">Performance Insights</h4>
                            <div className="space-y-3">
                                {performanceResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPreviewPanel;